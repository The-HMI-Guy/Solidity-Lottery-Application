const path = require("path");//Path module allows for cross-platform compatibility.
const fs = require("fs");
const solc = require("solc"); //Specify the Solidity compiler.


const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");//Generate the path that points to our .sol file.
const source = fs.readFileSync(lotteryPath, "utf8");

//Only compiling one contract but could compile many using a path instead of the direct source.
module.exports = solc.compile(source, 1).contracts[":Lottery"]; 
