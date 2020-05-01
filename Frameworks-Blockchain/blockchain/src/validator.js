/* VALIDADOR :  responsável por conhecer todos os nós da nossa blockchain*/

//####################### IMPORTA WALLET #######################
const Wallet = require('./wallet');

//##################  CLASSE VALIDADOR #########################
class Validators {
    // o construtor recebe como parametro o número de nós presentes na rede 
    constructor(numberOfValidators) {
        this.list = this.generateAddresses(numberOfValidators);
    }

    // função gera carteiras e chaves públicas
    // chave secreta é conhecida para fins de demonstração
    // a frase secreta será passa via linha de comando para gerar carteiras iguais
    // como resultado a mesma chave pública será gerada

    // método gerador de endereços
    generateAddresses(numberOfValidators) {
        let list = [];
        for(let i = 0; i < numberOfValidators; i++) {
            list.push(new Wallet('NODE' + i).getPublicKey());
        }
        return list;
    }

    //método para verificar se validador reconhece a chave pública
    isValidValidator(validator) {
        return this.list.includes(validator);
    }
}

module.exports = Validator;


