'use strict';

(async () => {

    const Consensus = require('./consensus');
    const parse = require('url-parse');
    const Utils = require('./utils');


    // criando o objeto que representa o bloco da nossa blockchain
    // nosso contrutor traz os seguintes atributos 
    //index: numeor do bloco
    //data: os dados contidos neste bloco
    //nonce: um número aleatorio usado para satisfazer o hash
    //timestamp: o carimbo do momento em que o bloco foi criado
    //hash: o hash deste bloco
    //previousHash: o hash do bloco anterior 

    class Block {
        constructor(blockIndex, data, nonce, previousBlockHash) {
            this.blockIndex = blockIndex;
            this.data = data;
            this.nonce = nonce;
            this.previousHash = previousBlockHash;
            this.timesTamp = Date.now();
            this.hash = "";
        }
    }

    // método apontado para o prototype de Block para incrementar a dificuldade do nonce e recalcular o hash 
    Block.prototype.incrementNonce = function () {
        this.nonce++;
        this.hash = Utils.calculateHash(this);
    }

    // Método add ao prototype da classe Block para ajudar nos testes 
    Block.prototype.toString = function () {
        let blockDetails = {
            previousBlockHash: this.previousBlockHash,
            data: this.data,
            blockIndex: this.blockIndex,
            timesTamp: this.timesTamp,
            nonce: this.nonce,
            blockHash: this.blockHash
        }
        return JSON.stringify(blockDetails, Object.keys(blockDetails).sort());
    }



    module.exports = Block; 


}) ();

