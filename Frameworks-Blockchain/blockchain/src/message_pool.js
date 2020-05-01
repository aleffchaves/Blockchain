/**
 * Recebe um pool de mensagens como nos outros modulos de pool 
 * a unica diferença é que carrega uma mensagem a mais 
 */

//#################### IMPORTAÇÃO DE MÓDULO ####################
const ChainUtil = require('./chain_util');


//################## CLASSE MESSAGEPOOL #####################
class MessagePool {
    constructor() {
        this.list = {};
        this.message = 'INITIATE NEW ROUND';
    }

    //cria uma mensagem de alteração do round para o hash do bloco atual
    createMessage(blockHash, wallet) {
        let roundChange = {
            publicKey: wallet.getPublicKey(),
            message: this.message,
            signature: wallet.sign(ChainUtil.hash(this.message + blockHash))
        };
        this.list[blockHash] = [roundChange];
        return roundChange;
    };

    // checa se menssagem já existe 
    existingMessage(message) {
        if (this.list[message.blockHash]) {
            let exists = this.list[message.blockHash].find(
                p => p.publicKey === message.publicKey
            );
            return exists;
        } else {
            return false;
        }   
    };

    // checa se a mensagem é valida ou não
    isVlaidMessage(message) {
        console.log('in valid here');
        return ChainUtil.verifySignature(
            message.publicKey,
            message.signature,
            ChainUtil.hash(message.message + message.blockHash)
        );
    };

    // add mensagem dentro do pool 
    addMessage(message) {
        this.list[message.blockHash].push(message);
    }
}

module.exports = MessagePool;