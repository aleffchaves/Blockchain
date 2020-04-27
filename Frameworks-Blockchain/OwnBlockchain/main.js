// Primeiro importamos os modulos para  atribuir para construir a parte de segurança da nossa blockchain
const sha256 = require('crypto-js/sha256');
const { time } = require('console');


// CRIAMOS A CLASSE BLOCK COM OS SEGUINTES ATRIBUTOS

// index: representa a posição em que o bloco está inserido na cadeia de blocos
// timestamp: representa o tempo exato em que a transação foi completada
// data: informações da transação como valores ou ativos trocados 
// previousHash: representa o hash do bloco anterior usado  no processo de encadeamento dos blocos 
// hash: é são funções criptograficas usadas para atribuir segurança ao bloco;
// nonce: é um valor aleatório usado para criar a dificuldade de obtenção dos hashes 


class Block {
    constructor (index, timesTamp, data, previousHash ='') {
        this.index = index;
        this.previousHash = previousHash;
        this.timesTamp = timesTamp;
        this.data = data;
        this.hash = this.computerHash();
        this.nonce = 0; 
    }

    // aqui criamos nosso método para calcular o hash da aplicação, usamos a função sha256 importada do módulo cripto-js
    computerHash() {
        return sha256(this.index + this.timesTamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
    }

    // aqui add uma função de mineração do nosso bloco
    mineBlock (complexity) {
        while (this.hash.substring(0, complexity) !== Array(complexity + 1).join("0")) {
            this.nonce++

            this.hash = this.computerHash();
        }
        console.log("Bloco Sendo Minerado: " + this.hash); 
        console.log('Hash bloco anterior: ' + this.previousHash);
    }
}

// AGORA CRIAMOS A NOSSA CLASSE BLOCKCHAIN PARA CRIAR NOSSA CADEIA DE BLOCOS ENCADEADOS

class Blockchain {
    //o contrutor é inicializado usando o bloco genesis e 
    constructor () {
        this.chain = [this.buildGenesisBlock()];
        this.complexity = 5;
    }

    // criação do método responsável por criar o bloco genesis o primeiro bloco da nossa cdeia 
    buildGenesisBlock () {
        return new Block(0, "17/04/2020", "Genesis Block", "0");
    }

    // criação do método para obter o ultimo bloco da nossa blockchain
    latestBlock () {
        return  this.chain[this.chain.length - 1];
    }

    // agora criamos o método responsável por add um novo bloco a nossa blockchain
    addBlock (newBlock) {
        newBlock.previousHash = this.latestBlock().hash;  
        newBlock.mineBlock(this.complexity);

        // da um push, pegando o bloco e add na cadeia
        this.chain.push(newBlock);
    }

    // criação do método para verificar a validade do nosso bloco, basicamente testamos duas coisas 
    isValidity () {
        for (let i = 0; i < this.chain.length; i++) {

            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            // se o hash do bloco atual corresponde ao hash computado pro bloco atual
            if (this.currentBlock.hash !== this.currentBlock.computerHash()) {
                return false;
            }

            // se o previous hash do bloco anterior armazenado no bloco atual correspondem
            if (this.currentBlock.previousHash !== this.currentBlock.hash) {
                return false;
            }

        }
        return true;
    } 
}
// testando a nossa blockchain

let gaudiCoin = new Blockchain();
console.log('Bloco 1 Minerado:')

gaudiCoin.addBlock(new Block(1, "27/07/2020", {quantidade: 467}))

console.log('Bloco 2 Minerado');
gaudiCoin.addBlock(new Block(2,"27/07/2020", {quantidade: 100}))

console.log('Bloco 3 Minerado');
















