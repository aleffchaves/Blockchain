// importando a classe da carteira 
const Wallet = require('./wallet');

class Validators {
     // o construtor recebe como argumentos o números de nós presentes na rede 
     constructor(numberOfValidators){
        this.list = this.generateAddresses(numberOfValidators);
    }

    //essa função gera as carteiras e as chaves públicas 
    //A chave secreta é conhecida para fins de menonstração
    // Secreta será passada da linha de comando para gerar a mesma carteira novamente 
    //como resultado a mesma chave pública será gerada 
    
    generateAddresses(numberOfValidators) {
        let list = [];
        for(let i = 0; i < numberOfValidators; i++) {
            list.push(new Wallet('NODE' + i).getPublicKey());
        }
        return list;
    }

    //essa função será responsável por verificar a chave pública passada é conhecida pelo validador ou não
    isValidValidator(validator) {
        return this.list.includes(validator);
    }
}

module.exports = Validators;

   


