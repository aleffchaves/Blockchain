// este é o primeiro módulo desenvolvido
// é utilizado as bibliotecas elliptic, uuid, crypto-js
// usadas para criar par de chaves usadas para assinar transações
// gerar hash de dados e verificar assinaturas

/*###############################################################*/
//                INPORTAÇÃO DE BIBLIOTECAS 
/*###############################################################*/

//EDDSA fornece conjunto de algoritmos criptograficos 
const EDDSA = require('elliptic').eddsa;

//utilizar ed25519 permite criar par de chave secreta
const eddsa = new EDDSA('ed25519');

// utilização da uuidV1 para criar os ids 
const uuidV1 = require("uuid/dist/v1");

// utilização da biblioteca crypto-js para gerar hash  de 256 bits 
const SHA256 = require('crypto-js/sha256');


/*###############################################################*/
//                INPORTAÇÃO DE CLASSE CHAIN UTIL
/*###############################################################*/

class ChainUtil {
    // método estático gera par de chave utilizando uma frase secreta como entrada.
    static genKeyPair(secret) {
        return eddsa.keyFromSecret(secret);
    }

    //método retorna Ids usados em transações
    static id() {
        return uuidV1;
    }

    //método usado para gerar hash de qualquer dado
    static hash(data) {
        return SHA256(JSON.stringify(data).toString());
    }

    //método usado para verificar a assinatura 
    static verifySignature(publicKey, signature, dataHash) {
        return eddsa.keyFromPublic(publicKey).verify(signature, dataHash);
    }

}

// exporta módulo ChainUtil
module.exports = ChainUtil;


