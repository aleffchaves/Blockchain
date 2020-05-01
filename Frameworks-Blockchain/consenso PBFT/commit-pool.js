const ChainUtil = require('./chain-util');

class CommitPool {
    // o objeto retornado contem uma lista de mensagens de confirmação para um hash de um bloco;
    constructor () {
        this.list = [];
    }

    // funcção commit inicializa uma lista de mensagens de confirmação de uma mensagem prepare 
    // add uma mensagem de confirmação para o nó atual e a retorna 
    commit (prepare, wallet) {
        let commit = this.createCommit(prepare, wallet);
        this.list[prepare.blockHash] = [];
        this.list[prepare.blockHash].push(commit);

        return commit;
    }


    


}