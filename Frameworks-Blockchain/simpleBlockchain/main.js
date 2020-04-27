const sha = require('sha256');
const { getPriority } = require('os');

//create the Block class to represent a block in blockchain


class Block {
    constructor (index, data, prevHash) {
        this.index =  index;
        this.timestamp = Math.floor(Date.now() / 100);
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.getHash();
    }

    // create the getHash Method to calculate the  blockchain Hash
    getHash () {
        return sha(JSON.stringify(this.data) + this.prevHash + this.index + this.timestamp);
    }
}

// create the blockchain class , to represent our blockchain
class Blockchain {
    constructor () {
        this.chain = [];
    }

    // create the addBlock method to add a new block in blockchain
    addBlock (data) {
        let index = this.chain.length;
        let prevHash = this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0;
        let block = new Block(index, data, prevHash);
        
        this.chain.push(block);
    }

    //  create the method to verify if the chain is valid 
    // in this method we need verify if the validity hash, comparing the stored hash with a new calculate hash
    // and verify if the previousHash is equals of the hash stored in the last block

    chainIsValid () {
        for (var i = 0; i < this.chain.length; i++) {
            
            if (this.chain[i].hash !== this.chain[i].getHash()) {
                return false;
            }

            if (i > 0 && this.chain[i].prevHash !== this.chain[i-1].hash) {
                return false;
            } 
        }
        return true;
    }

}


// instance a new blockchain to test

const  gaudiCoin = new Blockchain();

gaudiCoin.addBlock({sender: "Alef", receiver: "Pamela", ammount: 1200})
gaudiCoin.addBlock({sender: "LAzaro", receiver: "Mario", ammount: 60})
gaudiCoin.addBlock({sender: "Tony", receiver: "Ned", ammount: 62 })


console.log(JSON.stringify(gaudiCoin, null,  100))


// test if the block is valid 
console.log("Validity: ", gaudiCoin.chainIsValid());
gaudiCoin.chain[0].data.receiver = 'Joker';
console.log("Validity: ", gaudiCoin.chainIsValid())










