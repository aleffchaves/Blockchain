/* 

Este é o primeiro módulo desenvolvido da nossa blockchain !

Esse arquivo será usado para criar um par de chaves para assinar dados, gerar IDs de transações hash de dados e verificações 
de assinaturas, precisamos de três módulos para estanciar essas funções , vamos instalalos usando o seguinte comando 
 npm i --save elliptic uuid crypto-js
*/



//EDDSA NOS PERMITE CRIAR PAR DE CHAVES é uma coleção de algoritmos criptográficos usados para criar chaves 
const EDDSA = require('elliptic').eddsa;

// ed25519 nos permite criar um par de chaves secretas
const eddsa = new EDDSA('ed25519');

// cria ids dependentes de data e hora 
const uuidV1 = require('uuid/v1');

// usado para transformar uma string em um hash de 256bits
const SHA256 = require("crypto-js/sha256");



class ChainUtil {
    //metodo usado para gerar um par de chaves usando a frase secreta
    static genKeyPair(secret) {
        return eddsa.keyFromSecret(secret);
    }

    //metodo usado para retornar o ids usados na transação
    static id() {
        return uuidV1;
    }

    //hash para qualquer dado usando SHA256
    static hash(data) {
        return SHA256(JSON.stringify(data).toString());
    }

    //verifica o hash assinado descriptografando e combinando-o com o hash, ou seja verifica se assinatura é valida
    static verifySignature(publicKey, signature, dataHash) {
        return eddsa.keyFromPublic(publicKey).verify(dataHash, signature);
    }

}

module.exports = ChainUtil;



























