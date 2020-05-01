//  Armazenar as mensagens de prepare enviadas pelos nós de consenso; 

const ChainUtil = require('./chain-util');


class PreparePool {
    // o objeto list é onde fazemos o mapeamento que contêm uma lista de mensagens PREPARE para um hash de um bloco
    constructor () {
        this.list = [];
    }

    // a função prepare inicializa uma lista de mensagens PREPARE de um bloco
    // e add a mensage PREPARE DO NÓ ATUAL e a retorna 
    prepare(block, wallet) {
        let prepare = this.createPrepare(block, wallet);
        this.list[block.hash] = [];
        this.list[block.hash].push(prepare);
        return prepare;
    }

    // cria a mensagem prepare para o bloco;
    createPrepare(block, wallet) {//
        let prepare = {
            blockHash: block.hash,
            publicKey: wallet.getPublicKey(),
            signature: wallet.sign(block.hash),
        };
        return prepare;
    }

    // add a mensagem prepare a lista 
    addPrepare(prepare) {
        this.list[prepare.blockHash].push(prepare);
    }

    // checa se a mensagem prepare já existe 
    existingPrepare (prepare) {
        let exists = this.list[prepare.blockHash].find(p => p.publicKey === prepare.publicKey);

        return exists;
    }

    // checa se a mensagem prepare é válida ou não
    isValidPrepare(prepare) {
        return ChainUtil.verifySignature(
            prepare.publicKey,
            prepare.signature,
            prepare.blockHash,
        );
    }
}

module.exports = PreparePool;