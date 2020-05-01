const ChainUtil = require('./chain-util');

class MessagePool {
    constructor () {
        this.list = {};
        this.message =  'INITIATE NEW ROUND';
    }

    //cria uma mensagem de alteração do round para o hash do bloco atual
    createMessage (blockHash, wallet) {
        let roundChange = {
            publicKey: wallet.getPublicKey(),
            message: this.message,
            signature: wallet.sign(ChainUtil.hash(this.message + blockHash));
        };

        this.list[blockHash] = [roundChange];
        return  roundChange;
    
    }

    // checa se a mensagem já existe 
    existingMessage (message) {
        if (this.list[message.blockHash]) {
            let exists = this.list[message.blockHash].find(
                p => p.publicKey === message.publicKey
            );
            return exists;
        } else {
            return false;
        }
    }


    // Checa se a menssage é válida ou não 
    isValidMessage (message) {
        console.log("in valid Here");
        return ChainUtil.verifySignature(
            message.publicKey,
            message.signature,
            ChainUtil.hash(message.message + message.blockHash)
        );
    }

    // add  a message dentro da lista 
    addMessage (message) {
        this.list[message.blockHash].push(message);
    }
}

module.exports = MessagePool;