// importando o módulo WS ele nos permite trabalhar com sockets mais fácilmente 
const WebSocket = require("ws");

// importa a constante minima utilziada para contabilizar o número minima de aprovação
const { MIN_APROVALS }  = require("./config");
const { Socket } = require("dgram");

// declara uma porta para nosso servidor p2p ficar escutando
const P2P_PORT = process.env.P2P_PORT || 5001;

// os endereços de soket dos vizinhos serão passados por linha de comando 
// esse statement os divide em uma matriz 
const peers = process.env.PEERS ? process.env.PEERS.split(",") :  [];

// message types usados para evitar a digitação de mensgaens  também usados na instrução switch
const MESSAGE_TYPE = {
    transaction: "TRANSACTION",
    prepare: "PREPARE",
    pre_prepare: "PRE-PREPARE",
    commit: "COMMIT",   
    round_change: " ROUND_CHANGE"
}

class P2pserver {
    constructor (
        blockchain, 
        transactionPool,
        wallet,
        blockPool,
        preparePool,
        commitPool,
        messagePool,
        validators
    ) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.blockPool = blockPool;
        this.preparePool = preparePool;
        this.commitPool = commitPool;
        this.messagePool = messagePool;
        this.validators = validators;
    }

    // cria um servidor em uma determinada porta 
    listen () {
        const server = new WebSocket.Server({port: P2P_PORT});
        server.on("connection", socket => {
            console.log("New connection");
            this.connectSocket(socket);
        });
        this.connectToPeers();
        console.log(`Listen for peer connection port : ${P2P_PORT}`);
    }

    // conecta a socket e registra o manipulador de mensagens nele 
    connectSocket (socket) {
        this.sockets.push(socket);
        console.log("Socket Connected");
        this.messageHandler(socket);
    }

    // conecta os peers passado via linha de comando
    connectToPeers () {
        peers.forEach(peer => {
            const socket = new WebSocket(peer);
            socket.on("open", () => this.connectSocket(socket));
        });
    }

    // broadcast transactions 
    broadcastTransaction (transaction) {
        this.sockets.forEach(socket => {
            this.sendTransaction(socket, transaction);
        });
    }

    // envia transações para uma conexão socket particular
    sendTransaction (socket, transaction) {
        socket.send(
            JSON.stringify({
                type: MESSAGE_TYPE.transaction, 
                transaction: transaction
            })
        );
    }

    // broadcast pre-prepare 
    broadcastPrePrepare (block) {
        this.sockets.forEach(socket => {
            this.sendPrePrepare(socket, block);
        });
    }

    // envia pre-prepare  para uma conexão socket particular 
    sendPrePrepare (socket, block) {
        socket.send(
            JSON.stringify({
                type: MESSAGE_TYPE.pre_prepare,
                block: block 
            })
        );
    }

    // broadcast prepare 
    broadcastPrepare (prepare) {
        this.sockets.forEach(socket => {
            this.sendPrepare(socket, prepare);
        });
    }

    // envia prepare para uma conexão socket particular
    sendPrepare (socket, prepare) {
        socket.send(
            JSON.stringify({
                type: MESSAGE_TYPE.prepare,
                prepare: prepare
            })
        );
    }

    // broadCast commit
    broadcastCommit (commit) {
        this.sockets.forEach(socket => {
            this.sendCommit(socket, commit);
        });
    }

    // envia commit para uma conxeão socket particular
    sendCommit (socket, commit) {
        socket.send(
            JSON.stringify({
                type: MESSAGE_TYPE.commit,
                commit: commit
            })
        );
    }

    //broadcast round change
    broadcastRoundChange (message) {
        this.sockets.forEach(socket => {
            this.sendRoundChange(socket, message);
        });
    }

    // envia uma mensagem de round change para uma conexão socket particular
    sendRoundChange (socket, message) {
        socket.send(
            JSON.stringify({
                type: MESSAGE_TYPE.message,
                message: message
            })
        );
    }

    //lida com qualquer mensagem enviada ao nó atual
    messageHandler (socket) {
        // registra o manipulador messagens 
        socket.on("message", message => {
            const data = JSON.parse(message);

            console.log("RECEIVED", data.type);

            // select a particular message handler
            switch (data.type) {
                case MESSAGE_TYPE.transaction:
                //checa se a mensagem é valida
                if (
                    !this.transactionPool.transactionExists(data.transaction) &&
                    this.transactionPool.verifyTransaction(data.transaction) &&
                    this.validators.isValidValidator(data.transaction.from)
                ) {
                    let thresholdReached = this.transactionPool.addTransaction(
                        data.transaction
                    );

                    // send transactions to other nodes 
                    this.broadcastTransaction(data.transaction);

                    // check if limit reached
                    if (thresholdReached) {
                        console.log("THRESHOLD REACHED");

                        // chek the current node is the proposer 
                        if (this.blockchain.getProposer() == this.wallet.getPublickey()) {
                            console.log("PROPOSING BLOCK");
                            // if the node is the proposer, create a block and broadcast it
                            let block = this.blockchain.createBlock(
                                this.transactionPool.transactions, 
                                this.wallet
                            );
                            console.log("CREATED BLOCK", block);
                            this.broadcastPrePrepare(block);
                        }
                        } else {
                            console.log("Transaction Added");
                        }
                    }
                    break;
                    
                case MESSAGE_TYPE.pre_prepare:
                    // check if block is valid 
                    if (
                        !this.blockPool.existingBlock(data.block) &&
                        this.blockchain.isValidBlock(data.block)
                    ) {
                        // add block to pool 
                        this.blockPool.addBlock(data.block);

                        // send to other nodes
                        this.broadcastPrePrepare(data.block);

                        // create and broadcast a prepare message
                        let prepare = this.preparePool.prepare(data.block, this.wallet);
                        this.broadcastPrepare(prepare);
                    }
                    break;
                case MESSAGE_TYPE.prepare:
                    // check of the prepare message is valid 
                    if (
                        !this.preparePool.existingPrepare(data.prepare) &&
                        this.preparePool.isValidPrepare(data.prepare, this.wallet) &&
                        this.validators.isValidValidator(data.prepare.getPublickey)
                    ) {
                        // add prepare message to the pool
                        this.preparePool.addPrepare(data.prepare);

                        // send to other nodes 
                        this.broadcastPrepare(data.prepare);

                        // if no of prepare messages reaches minimum required
                        // send commit message
                        if (
                            this.preparePool.list[data.prepare.blockHash].length >= MIN_APROVALS
                        ) {
                            let commit = this.commitPool.commit(data.prepare, this.wallet);
                            this.broadcastCommit(commit);
                        }
                    }  
                    break;

                case MESSAGE_TYPE.commit:
                    // check the validity commit messages
                    if (
                        !this.commitPool.existingCommit(data.commit) &&
                        this.commitPool.isValidCommit(data.commit) &&
                        this.validators.isValidValidator(data.commit.publickey)
                    ) {
                        // add to pool
                        this.commitPool.addCommit(data.commit);

                        //send to other nodes
                        this.broadcastCommit(data.commit);

                        // if no of commit messages reaches minimum required
                        //add updated block to chain
                        if (
                            this.commitPool[data.commit.blockHash].length >=
                            MIN_APROVALS
                        ) {
                            this.blockchain.addUpdateBlock(
                                data.commit.blockHash,
                                this.blockPool,
                                this.preparePool,
                                this.commitPool
                            );
                        }
                                
                        //send a round change message to NodeList
                        let message = this.messagePool.createMessage(
                            this.blockchain.chain[this.blockchain.chain.length -1].hash,
                            this.wallet
                        );
                        this.broadcastRoundChange(message);
                        }
                        break;

                case MESSAGE_TYPE.round_change:
                    // check the validity of the round change message
                    if (
                        !this.messagePool.existingMessage(data.message) &&
                        this.messagePool.isValidMessage(data,message) &&
                        this.validators.isValidValidator(data.message.publickey)
                    ) {
                        // add to pool
                        this.messagePool.addMessage(data.message);

                        // send to other nodes
                        this.broadcastRoundChange(message);

                        // if enough messgaes are received, clear the pools
                        if (
                            this.messagePool.list[data.message.blockHash].length >=
                            MIN_APROVALS
                        ) {
                            this.transactionPool.clear();
                        }
                    }
                    break;
            }
        });
    }
}

module.exports = P2pserver;



































































    






















