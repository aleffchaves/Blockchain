// Nesta classe é modelado nossa classe Transação

/*
#########################PROPRIEDADES#####################
1.id:         identificação
2.from:       endereço do remetente 
3.input:      objeto que armazena informações sobre informações e timestamp
4.hash:       hash da entrada
5.sifnature:  assinatura do remetente
*/

// importa módulo ChainUtil usado para gerar chaves, hash e verificações
const ChainUtil = require('./chain_util');

// modelagem da nossa classe Transação
class Trasaction {
    // construtor recebe instancia de carteira e dados que serão armazenados
    constructor(data, wallet) {
        this.id = ChainUtil.id();
        this.from = wallet.publicKey;
        this.input = {data: data, timestamp: Data.now()};
        this.hash = ChainUtil.hash(this.input);
        this.signature = wallet.sing(this.input);
    }

    // método verifica se transação é válida
    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.from,
            transaction.signature,
            ChainUtil.hash(transaction.input),
        );
    }
}

module.exports = Trasaction;
