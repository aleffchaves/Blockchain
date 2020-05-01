/**
 * mensagens de commit serão add ao pool de commit após 
 * 2f + 1 mensagens prepare serem recebidas
 */

//############### IMPORTA MÓDULO ############
const ChainUtil = require('./chain_util');

//############### CLASSE COMMITPOOL ################
class CommitPool {
    constructor() {
        this.list = {};
    };

    //método commit inicializa uma lista de confirmação com mensagens prepare
    //add uma mensagem de commit para o nó atual e retorna
    commit(prepare, wallet) {
        let commit = this.createCommit(prepare, wallet);
        this.list[prepare.blockHash] = [];
        this.list[prepare.blockHash].push(commit);

        return commit;
    };

    //cria uma mensagem de commit para uma mensagem prepare recebida
    createCommit(prepare, wallet) {
        let commit = [];
        commit.blockHash = prepare.blockHash;
        commit.publicKey = wallet.getPublicKey();
        commit.signature = wallet.sign(prepare.blockHash);
        
        return commit;
    };

    //checa se mensagem commit já exist
    existingCommit(commit) {
        let exists = this.list[commit.blockHash].find(p => p.publicKey === commit.publicKey);
        return exists;
    }

    //checa se mensagem de commit é valida ou não 
    isValidCommit(commit) {
        return ChainUtil.verifySignature(
            commit.publicKey,
            commit.signature,
            commit.blockHash
        );
    };

    // add uma menssagem de commit para um hash de uma mensagem dentro de um bloco 
    addCommit(commit) {
        return this.list[commit.blockHash].push(commit);
    }
}   

module.exports = CommitPool;

