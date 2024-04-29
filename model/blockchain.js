var addressUtilities = require('../utils/address');
var arrayUtilities = require('../utils/array');
var validator = require('../utils/validator');

var blockchain = function blockchain(){

  var self = this;

  this.init = init;
  this.newBlock = newBlock;
  this.newTransaction = newTransaction;
  this.getChain = getChain;
  this.checkChain = checkChain;
  this.mine = mine;

  this.chain;
  this.currentTransactions;

  function init(){
    /*
    *  initialize the blockchain, creating a new empty chain,
    *  an empty transactions list and creating the first block
    */
    self.chain = [];
    self.currentTransactions = [];
    self.newBlock(100, 1);
  }

  function getChain(){
    /*
    *  returns the chain
    */
    return self.chain;
  }

  function mine(miner){
    /*
    *  implements the mining function. simple as is, it just
    *  creates a new transaction with "sender" 0 to show that
    *  this is a mined block.
    */

    var lastBlock = self.chain[self.chain.length-1];
    var transaction = newTransaction(0,miner,1);
    var proof = validator.generateProof(transaction);
    var previousHash = validator.calculateHash(lastBlock);
    return newBlock(proof, previousHash);
  }

  function newBlock(proof, previousHash){
    /*
    *  Generate a new blocks and adds it to the chain
    */
    var block = {
      "index": self.chain.length+1,
      "timestamp": new Date().getTime(),
      "transaction": self.currentTransactions,
      "proof": proof,
      "previousHash": previousHash
    }
    self.currentTransactions = [];
    self.chain.push(block);
    return block;
  }

  function newTransaction(sender, receiver, amount){
    /*
    *  Generate a new transaction
    */
    var transaction = {
      sender: sender,
      receiver: receiver,
      amount: amount
    };
    self.currentTransactions.push(transaction);
    return transaction;
  }

  function isValidChain(chain) {

    /**
     * Check if the blockchain is valid
     */
    if (chain.length === 0) return false;

    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      if (currentBlock.previousHash !== validator.calculateHash(previousBlock)) return false;
      if (validator.generateProof(currentBlock) !== currentBlock.proof) return false;
    }
    return true;
  }

  function checkChain(){
    return isValidChain(self.chain) ? self.chain : []
  }


  if(blockchain.caller != blockchain.getInstance){
    throw new Error("This object cannot be instanciated");
  }

};


blockchain.instance = null;
blockchain.getInstance = function(){
	if(this.instance === null){
		this.instance = new blockchain();
	}
	return this.instance;
};

module.exports = blockchain.getInstance();
