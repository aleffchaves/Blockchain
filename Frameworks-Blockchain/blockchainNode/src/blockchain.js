'use strict';


(async () => {
    // imprtamos os modulos consensus e Util que utilizaremos neste modulo
    const Consensus = require('./consensus');
    const parse = require('url-parse'); 
    const Utils = require('./utils');


    //declaramos a nossa classe blockchain

    class Blockchain {
        constructor (consensus, blocks) {
            this.blocks = [];  

            if (blocks) {
                this.blocks =  blocks;
            }

            this.consensus = consensus;

            // criando bloco genesis
            this.newBlock('I am genesis!')
        }
    }

    // add um novo bloco a nossa blockchain 
    Blockchain.prototype.newBlock = function(data) {
        let previousBlockHash = "";
        let newBlockIndex = 0;
        
        // aqui se a genete não estiver add um bloco genesis o comprimento da nossa matriz sera maior que 0
        // então definimos o previousHash e um novo indice para a matriz de blocos
        if (this.blocks.length > 0) {
            previousBlockHash = this.blocks[this.blocks.length - 1].hash;
            newBlockIndex = this.blocks.length;
        }
        
        // como já temos os dados para minerar um novo bloco ,  index, dados e previousHash
        let block = this.consensus.mineBlock(newBlockIndex, data, previousBlockHash);
        
        //após extração do bloco add o mesmo a nossa matriz de blocos 
        this.blocks.push(block);
        return block;
    }

    Blockchain.prototype.isValid = function() {
        let currentBlockIndex = 1;  // inicia após o bloco genesis com index = 0

        while(currentBlockIndex < this.blocks.length)  {
            const currentBlock = this.blocks[currentBlockIndex];
            const previousBlock = this.blocks[currentBlockIndex - 1];

            // verifica se o bloco em questão está referenciando o hash do bloco anterior 
            if (currentBlock.previousBlockHash !== previousBlock.hash) {
                return false;
            }

            //checa se o  hash dos dados no bloco atual é igual ao seu hash do bloco 
            if (currentBlock.hash !== Utils.calculateHash(currentBlock)) {
                return false;
            }

            //verifica o nonce satisfaz o proof of Work
            if (!this.consensus.validHash(currentBlock.hash)) {
                return false;
            }
            currentBlockIndex++;
        }

        return true;
    }

    module.exports = Blockchain;
}) ();