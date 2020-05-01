/**
1.timestamp — the time at which the block was made
2.lastHash — hash value of the last block
3.hash — hash value of the current block
4.data — the transactions that the block holds
5.proposer — the public key of the creator of the block
6.signature — the signed hash of the block
7.sequenceNo — the sequence number of block */

// importar SHA256 usado para gerar o hash e por ChainUtil para verificar a validade da assinatura
const SHA256 = require('crypto-js/sha256');
const ChainUtil = require('./chain-util');

class Block{
    constructor(timestamp, lastHash, hash, data, proposer, signature, sequenceNo){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.data = data;
        this.proposer = proposer;
        this.signature = signature;
        this.sequenceNo = sequenceNo;
    }


    //funcção para imprimir o bloco 
    toString() {
        return `BLOCK: 
            Timestamp:    ${this.timestamp},
            Last Hash:    ${this.lastHash},
            Data:         ${this.data},
            Propose:      ${this.proposer},
            Signature:    ${this.signature},
            Sequence No:  ${this.sequenceNo},`
    };


    // O primeiro bloco criado é o bloco genesis 
    // esta função gera o bloco genesis com valores randomicos 
    static genesis() {
        return new this('genesis time', '----', 'genesis Hash', [], 'p4@p@53R', 'SIGN', 0);
    };


    // Criando um bloco considerando o ultimo bloco , transações e uma instancia da carteira
    static  createBlock(lastBlock, data, wallet) {
        let hash;
        let timestamp = Date.now();
        hash = Block.hash(timestamp, lastHash, data);
        let proposer = wallet.getPublicKey();
        let proposer= wallet.signBlockHash(hash, wallet);
        return new this(
            timestamp, lastHash, hash, data, proposer, signature, 1 + lastBlock.sequenceNo
        );
    }

    //hashes de valores passados 
    static hash(timestamp,  lastHash, data){
        return SHA256(JSON.stringify(`${timestamp}${lastHash}${data}`)).toString();
    }
    
    // retorna o hash de um bloco
    static blockHash(block) {
        const {timestamp, lastHash, data} = block;
        return Block.hash(timestamp, lastHash, data);
    }

    //assina o bloco usando a instancia da carteira
    static signBlockHash(hash, wallet){
        return wallet.sign(hash);
    }
    
    //checa se o bloco é válido
    static verifyBlock(block){
        return ChainUtil.verifySignature(
            block.proposer,
            block.signature,
            Block.hash(hash.timestamp, block.lastHash, block.data)
        );
    }

    //verifica o bloco proposto com a chave pública passada
    static verifyProposer(block, proposer) {
        return block.proposer == proposer ? true : false;   
    }
    
}

module.extends = Block;