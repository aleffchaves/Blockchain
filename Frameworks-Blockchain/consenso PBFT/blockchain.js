// importar o número total de nós usados paracriar a lista de validadores;

const { NUMBERS_OF_NODES, NUMBER_OF_NODES }  = require('./config');
const Block = require('./block');

class Blockchain {
    // o construtor recebe um obj validades e usa para criar uma lista de validaroes 
    constructor (validators) {
        this.validatorsList = validators.generateAddress(NUMBER_OF_NODES);
        this.chain = [Block.genesis()];
    }

    // add os blocos confirmados para dentro da cadeia de blocos 
    addBlock (block) {
        this.chain.push(block);
        console.log('NEW BLOCK ADDED TO CHAIN');
        return block;
    }   

    // funcção para criar blocos 
    createBlock (transaction, wallet) {
        const block = Block.createBlock(this.chain[this.chain.length - 1 ],transaction, wallet);

        return block;
    }

    // calculates the next propsers by calculating a random index of the validators list
    // index is calculated using the hash of the latest block
    getProposer () {
        let index = this.chain[this.chain.length - 1 ].hash[0].charCodeAt(0) %  NUMBERS_OF_NODES;

        return this.validatorsList[index];
    }


    //checa se o bloco recebido é válido
    isValidBlock (block) {
        const lastBlock = this.chain[this.chain.length - 1];

        if (lastBlock.sequenceNo + 1  == block.sequenceNo &&
            block.hash === Block.blockHash(block) && 
            Block.verifyBlock(block)  && 
            Block.verifyProposer(block, this.getProposer())) {
                console.log('BLOCK VALID!');
            } else {
                console.log('BLOCK INVALID!');
                return fasle;
            }
    }

    //atualiza o bloco add as mesnagens de prepare e commit ao bloco
    addUpdatedBlock (hash, blockPool, preparePool, commiPool) {
        let block = blockPool.getBlock(hash);

        block.prepareMessages = preparePool.list[hash];
        block.commitMessages = commitPool.list[hash];
        block.addBlock(block);
    }
}

module.exposrts = Blockchain;