let crypto = require('crypto');
var ValidatorHandler = function ValidatorHandler(){

  var self = this;

  this.calculateHash = calculateHash;
  this.generateProof = generateProof;

  function calculateHash(block) {
    const data = JSON.stringify({
      index: block.index,
      timestamp: block.timestamp,
      transaction: block.transaction,
      previousHash: block.previousHash,
    });

    const hash = crypto.createHash('sha256').update(data).digest('hex');

    return hash;
  }


  function generateProof(transaction){
    if(!transaction || transaction.sender === undefined || transaction.receiver === undefined || transaction.amount === undefined){
      return false;
    }
    if(transaction.sender === 0){
      return generateIntegerFromAddress(transaction.receiver) * parseFloat(transaction.amount);
    }
    return Math.abs(generateIntegerFromAddress(transaction.sender) - generateIntegerFromAddress(transaction.receiver)) * parseFloat(transaction.amount);
  }

  function generateHashFromString(string){
    var hex, i;
    var result = "";
    for (i=0; i<string.length; i++) {
      hex = string.charCodeAt(i).toString(16);
      result += ("0"+hex).slice(-4);
    }
    return result;
  }

  function generateIntegerFromAddress(address){
    return parseInt(address.match(/[0-9]+/g).join(""));
  }

  if(ValidatorHandler.caller != ValidatorHandler.getInstance){
    throw new Error("This object cannot be instanciated");
  }

};


ValidatorHandler.instance = null;
ValidatorHandler.getInstance = function(){
  if(this.instance === null){
    this.instance = new ValidatorHandler();
  }
  return this.instance;
};

module.exports = ValidatorHandler.getInstance();
