/**
 * Armazenar mensagem prepare recebidas por outros nós do consenso
 */

//########################## IMPORTAÇÃO DE MÓDULO ####################
const ChainUtil = require('./chain_util');

//######################### CLASSE PREPAPREPOOL ######################
class PreparePool {
    // o array list sera usado para armazenar a lista de mensagens prepare dos demais nós
    // e add menssagem prepare do nó atual e a retornar 
    constructor() {
        this.list = {};
    };

    prepare(block, wallet) {
        let prepare = this.createPrepare(block, wallet);
        this.list[block.hash] = [];
        this.list[block.hash].push(prepare);
        return prepare;
    };

    // cria mensagem prepare para o bloco corrente
    createPrepare(block, wallet) {
        let prepare = {
            blockHash: block.hash,
            publickey: wallet.getPublicKey(),
            signature: wallet.sign(block.hash),
        };
        return prepare;
    };

    // add mensagem prepare a lista
    addPrepare(prepare) {
        this.list[prepare.blockHash].push(prepare);
    };

    //checa se mensagem prepare já existe
    existingPrepare(prepare) {
        let exists = this.list[prepare.blockHash].find(p => p.publickey === prepare.publickey);
        return exists;
    };

    // checa se a mensagem prepare é valida ou não
    isValidPrepare(prepare) {
        return ChainUtil.verifySignature(
            prepare.publickey,
            prepare.signature,
            prepare.blockHash
        );
    };
}

module.exports = PreparePool;