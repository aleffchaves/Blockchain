/**
 * classe blockchain 
 */

//#######################   IMPORTA MÓDULOS #######################
const { NUMBERS_OF_NODES} = require('./config');


class Blockchain {
    // o construtor recebe um obj de validadores usados para criar uma lista de validadores
    constructor(validators) {
        this.validatorsList = validators.generateAddresses(NUMBERS_OF_NODES);
        this.chain = [Block.genesis()];
    };

    // add os blocos confirmados para dentro da cadeia de blocos 
    addBlock(block) {
        this.chain.push(block);
        console.log('New Block added to chain');
        return block;
    };

    //método para criar blocos
    createBlock(transaction, wallet) {
        const block = block.createBlock(this.chain[this.chain.length - 1], transaction, wallet);

        return block;
    };

    // calculates the next propsers by calculating a random index of the validators list
    // index is calculated using the hash of the latest block
    getProposer () {
        let index = this.chain[this.chain.length - 1 ].hash[0].charCodeAt(0) %  NUMBERS_OF_NODES;

        return this.validatorsList[index];
    };

    //checa se o bloco recebido é valido
    isValidBlock(block) {
        const lastBlock = this.chain[this.chain.length - 1];

        if(lastBlock.index + 1 == block.index && 
            block.lastHash === lastBlock.hash &&
            block.hash === Block.blockHash(block) &&
            Block.verifyBlock(block) &&
            Block.verifyproposer(block, this.getProposer())
        ) {
            console.log('BLOCK INVALID!');
        } else {
            console.log('BLOCK INVALID!');
            return false;
        }
    };

    // atualiza o bloco add as menssagens de prepare e commit  ao bloco 
    addUpdateBlock(hash, blockPool, preparePool, commitPool) {
        let block = blockPool.getBlock(hash);
        block.prepareMessages = preparePool.list[hash];
        block.commitPool = commitPool.list[hash];
        block.addBlock(block);
    };
}

module.exports = Blockchain;