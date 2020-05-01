// importando classe usada para verificação
const Transaction = require('./transaction');

//  O limite de transações é o limite da capacidade dos nós 
// quando isso acontece um novo bloco é gerado 

const { TRANSACTION_THRESHOLD} = require("./config");

class TransactionPool {
    constructor () {
        this.transaction = [];
    }

//  puxa as transações na lista 
// retorna true se estiver completa 
// se não retorna false
    addTransactions(transaction) {
        this.transactions.push(transaction);
        if (this.transaction.length > TRANSACTION_THRESHOLD) {
            return true;
        } else {
            return false;
        }
    }

    // função para verificar as transações 
    verifyTransaction(transaction) {
        return Transaction.verifyTransaction(transaction);
    }

    // checar se transação existe ou não 
    transactionExist(transaction) {
        let exists = this.transaction.find(t => t.id === transaction.id);
        return exists;
    }


    // esvazia a lista 
    clear() {
        console.log("TRANSACTIONS POOL CLEARED");
        this.transactions = [];
    }
}


module.exports = TransactionPool;
