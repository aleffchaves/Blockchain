// import all required modules 

const express = require("express");
const Wallet = require('./wallet');
const bodyParser = require("body-parser");
const TransactionPool = require('./transaction-pool');
const P2pServer = require('./p2p-server');
const Validators = require('./validators');
const Blockchain = require('./blockchain');
const BlockPool = require('./block-pool');
const CommitPool = require('./commit-pool');
const PreparePool = require('./prepare-Pool');
const MessagePool = require('./message-pool');
const { NUMBER_OF_NODES } = require('./config');
const P2pserver = require("./p2p-server");
const HTTP_PORT = process.env.HTTP_PORT || 3001;

//instance all objects
const app = express();
app.use(bodyParser.json());

const wallet = new Wallet(process.env.SECRET);
const transactionpool = new TransactionPool();
const validator = new Validators(NUMBER_OF_NODES);
const blockchain = new Blockchain(validators);
const blockPool = new BlockPool();
const preparePool = new PreparePool();
const commitPool = new CommitPool();
const messagePool = new MessagePool();
const p2pServer = new P2pserver(
    blockchain, 
    transactionpool,
    wallet, 
    blockPool,
    preparePool,
    commitPool,
    messagePool,
    validator 
);

//  send all transactions in the transaction pool to the user 
app.get('/transactions', (req, res) => {
    res.json(transactionpool.transactions);
});


// sends the entire chain to user
app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});


// create transactions for sent data
app.post('/transact', (req, res) => {
    const { data } =  req.body;
    const transaction = wallet.createTraction(data);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('./transactions');
})


//start the app 
app.listen(HTTP_PORT, () => {
    console.log(`Listen on port ${HTTP_PORT}`);
});


// start the p2p server 
p2pServer.listen();












