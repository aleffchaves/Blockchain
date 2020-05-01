// Número de transações  que podem estar presentes em um bloco e  conjunto de transações 
const TRANSACTION_THRESHOLD = 5;


// NÚMERO TOTAL DE NÓS NA REDE;
const NUMBER_OF_NODES = 3;

//NÚMERO  MINIMO DE VOTOS POSITIVOS EM UAM REDE PARA QUE UMA MENSAGEM/BLOCO SEJA VÁLIDA
const MIN_APROVALS = 2 * (NUMBER_OF_NODES / 3 ) + 1 ;



module.exports = {
    TRANSACTION_THRESHOLD,
    NUMBER_OF_NODES,
    MIN_APROVALS
};