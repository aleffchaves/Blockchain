'use strict';



( async () => {
    
    //importa criptoJs, biblioteca ajuda na utilizazação de funções hash
    const SHA256 = require("crypto-js/sha256");

    // função nos permite elaborar um código mais limpo 
    function getSHA256HexString(input) {
        return SHA256(input).toString();
    }

    // função para concatenar as informações do nosso bloco e retornar uma representação via hash
    function calculateHash (block) {
        let blockDetails = {
            preveiouBlockHash: block.preveiouBlockHash,
            data: block.data,
            blockIndex: block.blockIndex,
            timestamp: block.timestamp,
            nonce: block.nonce
        }
        return getSHA256HexString(JSON.stringify(blockDetails, Object.keys(blockDetails).sort()));
    }

    // exportando modulos
    module.exports = {
    getSHA256HexString,
    calculateHash
    };    


})();

