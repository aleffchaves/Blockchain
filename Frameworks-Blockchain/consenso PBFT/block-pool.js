const Block = require('./block');

class BlockPool {
    constructor () {
        this.list = [];
    }

    // checa de o bloco existe 
    existingBlock (block) {
        let exists = this.list.find(b => b.hash === block.hash);
        return exists;
    }

    // add um bloco a corrente 
    addBlock(block) {
        this.list.push(block);
        console.log('Added Block to pool');
    }

    // retorna o bloco para o hash informado 
    getBlock(hash) {
        let exists = this.list.find(b => b.hash  === block.hash);

        return exists;
    }
}


module.exports = BlockPool;





