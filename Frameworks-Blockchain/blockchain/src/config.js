/* 
arquivo de configuração de rede 
*/

// Número de transações que podem estar presentes em um bloco e conjunto de transações
const TRANSACTION_THRESHOLD = 5;

// Número total de nós presentes na rede;
const NUMBER_OF_NODES = 3;

// Número minimo de votos positivos em uma rede para que uma mensagem seja válida
const MIN_APROVALS = 2 * (NUMBER_OF_NODES / 3) + 1 ;


// exporta módulo de configurações
module.exports = {
    TRANSACTION_THRESHOLD,
    NUMBER_OF_NODES,
    MIN_APROVALS
};

