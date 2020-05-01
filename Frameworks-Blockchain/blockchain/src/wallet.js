//############## IMPORTAÇÃO DE MÓDULOS ######################
// ChainUtil para gerar hash e validar.  Transaction para criar transações
const ChainUtil   =   require('./chain_util');
const Transaction =   require('./transaction');


//######################### CLASSE WALLET ########################
class Wallet {
    // par de chave secreto serar gerado a partir de uma frase secreta
    // frase é passada por paremetro
    constructor(secret) {
        this.keyPar = ChainUtil.genKeyPair(secret);
        this.publicKey = this.keyPar.getPublic('hex');
    }

    //método imprimi detalhes da carteira 
    toString() {
        return `Wallet
                publicKey: ${this.publicKey.toString()}`;
    }

    //método usado para criar e retornar transações
    createTransaction(data) {
        return new Transaction(data, this);
    }

    //Retorna chave pública
    getPublicKey() {
        return this.publicKey;
    }
}

module.exports = Wallet;
