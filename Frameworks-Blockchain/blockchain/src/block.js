/**  ############################ CLASSE BLOCK ########################
 * --PROPRIEDADES--
 * 1.timestamp: carimbo de tempo de criação do bloco
 * 2.lastHash: valor hash do ultimo blovo
 * 3.hash: valor hash do bloco corrente 
 * 4.data: transações que o bloco mantém
 * 5.proposer: chave pública do criador do bloco 
 * 6.signature: assinatura hash 
 * 7.index:  index do bloco
 * 
 */

 //###################### IMPORTAR MÓDULOS ###########################
 const SHA256     =  require('crypto-js/sha256');
 const ChainUtil  =  require('./chain_util');
const Wallet = require('./wallet');


 //###################### CLASSE BLOCK ###############################
class Block {
    constructor(timestamp, lastHash, hash, data, proposer, signature, index) {
        this.timestamp  =  timestamp;
        this.lastHash   =  lastHash;
        this.hash       =  hash;
        this.data       =  data;
        this.proposer   =  proposer;
        this.signature  =  signature;
        this.index      =  index;
    };

    //método para imprimir o bloco 
    toString() {
        return `BLOCK:
        Timestamp: ${this.timestamp},
        Last Hash: ${this.lastHash},
        Data:      ${this.data},
        Propose:   ${this.proposer},
        Signature: ${this.signature},
        Index:     ${this.index}`
    };

    //método para criar o bloco genesis
    static genesis() {
        return new this('Genesis Time', '----', 'Genesis Hash', [], 'p4@p@53R', 'SIGN', 0 );
    };

    // método para criar um bloco, recebe como parametros o ultimo bloco mais transações e carteira
    static createBlock(lastBlock, data, wallet) {
        let hash;
        let timestamp = Date.now();
        hash = Block.hash(timestamp, lastHash, data);
        let proposer = Wallet.getPublicKey();
        let signature = Block.signBlockHash(hash, wallet);

        return new this(timestamp, lastHash, hash, data, proposer, signature, 1 + lastBlock.index);
    };

    //método retorna o hash dos valores passados como parametro pro método createBlock
    static hash(timestamp, lastHash, data) {
        return SHA256(JSON.stringify(`${timestamp}${lastHash}${data}`)).toString();
    };

    //método retorna hash de um bloco 
    static blockHash(block) {
        const {timestamp, lastHash, data} = block;
        return Block.hash(timestamp, lastHash, data);
    };

    //método assina o bloco usando instancia da carteira 
    static signBlockHash(hash, wallet) {
        return wallet.sign(hash);
    };

    // método verifica validade do bloco 
    static verifyBlock(block) {
        return ChainUtil.verifySignature(
            block.proposer,
            block,signature,
            Block.hash(block.timestamp, block.lastHash, block.data)
        );
    };
}

module.exports = Block;
