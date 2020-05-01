/**
 * armazena os blocos temporariamente 
 * Para armazenar blocos temporariamente, também criaremos um pool de blocos.
 *  Crie um arquivo block-pool.js no qual a classe BlockPool retenha 
 * os blocos até que seja adicionado à cadeia.
 *  Um bloco é adicionado ao pool de blocos quando uma mensagem PRE-PREPARE é recebida
 */

//###################### IMPORTAÇÃO DE MÓDULO ######################
const Block = require('./block');

class BlockPool{
    constructor() {
        this.list = [];
    }

    //método verifica se bloco existe
    existingBlock(block) {
        let exists = this.list.find(b => b.hash === block.hash);
        return exists;
    };

    //método add um novo bloco a lista ao receber mensagem pre-prepare
    addBlock(block) {
        this.list.push(block);
        console.log('Added Block to pool');
    };

    // método retorna o bloco para o hash informado
    getBlock(hash) {
        let exists = this.list.find(b => b.hash === hash);
        return exists;
    };
}

module.exports = BlockPool;



