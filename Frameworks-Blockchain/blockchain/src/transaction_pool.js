/**
 * POOL DE TRANSAÇÕES PARA ARMAZENAR CONJUNTO DE TRANSAÇÕES VINDOS DE OUTROS NÓS 
 * limite de transações é o limite da capacidade dos nós; 
 * quando acontece um novo bloco é gerado;
 */

//###################### IMPORTAÇÃO DE MÓDULO ###################
const Transaction = require('./transaction');
const { TRANSACTION_THRESHOLD} = require('./config');

//###################### CLASSE POOL TRANSACTION ################
class TransactionPool {
    constructor() {
        this.Transaction = [];
    }

    //método addTransactions 
    // puxa transações na lista e retorna true se estiver completa
    addTransactions(transaction) {
        this.transactions.push(transaction);

        if(this.transaction.length > TRANSACTION_THRESHOLD) {
            return true;
        } else {
            return false;
        }
    };

    // método que verifica a trasações
    verifyTransaction(transaction) {
        return Transaction.verifyTransaction(transaction);
    };

    //método verifica se a transação existe ou não
    transactionExist(transaction) {
        let exists = this.transaction.find(t => t.id === transaction.id);
        return exists; 
    };

    //método que esvazia a lista 
    clear() {
        console.log('Trasactions pool cleared');
        this.transactions = [];
    };
}

module.exports = TransactionPool;
