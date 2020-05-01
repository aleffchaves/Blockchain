/* 

Properities

1.Id — for identification
2.from — the senders address
3.input — an object that further contains data to be stored and timestamp
4.hash — the SHA256 of input
5.signature — the hash signed by the sender
*/ 

// Importando a classe ChainUtil usada para gerar o hash e realizar a verificação
const ChainUtil = require('./chain-util');

class Transaction{
    //a instancia de uma carteira sera passada como parametro para um construtor
    // junto com os dados que serão armazenados 

    constructor(data, wallet) {
        this.id = ChainUtil.id();
        this.from = wallet.publicKey;
        this.input = { data: data, timestamp: Data.now() };
        this.hash = ChainUtil.hash(this.input);
        this.signature = wallet.sing(this.input);
    }

    //esse método verifica se   o times da transação é valido.
    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.from,
            transaction.signature,
            ChainUtil.hash(transaction.input),
        );
    }

}

module.exports = Transaction;








