'use strict';

//imprtamos os módulos block e utils
const Block = require('./block');
const Utils = require('./utils');

( async () => {

    // ajuste de dificuldade e configuramos nosso teste via regex
    class Consensus {
        constructor () {
            this.difficulty = 0;
            this.difficultyRegex = new RegExp( '0 {' + this.difficulty +'}');
        }
    }

    // função de mineração 
    // inicamos o nonce com zero 
    Consensus.prototype.mineBlock = function(blockIndex, data, previousBlockHash) {
        let block = new Block(blockIndex, data, 0, previousBlockHash);  

        // enquanto não obtivermos o número correto de zeros a esquerda, continua incrementando o nonce
        while(!this.validHash(block.hash)) {
            block.incrementNonce();
        }

        console.log("Mined new block: "+block.toString());
        return block;
    }

    // método para validar o hash recem calculado usamos o difficultRegex
    Consensus.prototype.validHash = function(hash) {
        return this.difficultyRegex.test(hash);
    }

    //exporta o módulo de consensu
    module.exports = Consensus;

}) ();
