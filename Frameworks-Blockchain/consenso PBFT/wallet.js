/* A carteira contém a chave pública e o par de chaves.
 Também é responsável por assinar hashes de dados e criar transações assinadas. */

 // Importação da classe ChainUtil responsável pelo hashe e validação
 const ChainUtil = require('./chain-util');

 // Importação da classe Transaction responsável pela criação de transações;
 const Transaction = require('./transaction');


 class Wallet{
     // Uma frase secreta é passada como argumento para nossa carteira
     // o par de cheve secreta gerado para uma frase secreta é sempre o mesmo 
   constructor(secret){
        this.keyPar = ChainUtil.genKeyPair(secret);
        this.publicKey = this.keyPar.getPublic('hex');
   }

   //método usado para imprimir os detalhes da certeira
   toString() {
        return `Wallet
                publicKey: ${this.publicKey.toString()}`;
   }

   //método usado para assinar o hashes de dados 
   sign(dataHash) {
       return this.keyPar.sign(dataHash).toHex();
   }

   //método usado para criar e retornar transações 
   createTraction(data) {
       return new Transaction(data, this);
   }


   //Retorna a chave pública
   getPublicKey() {
       return this.publicKey;
   }
 }

module.exports = Wallet;







 
 