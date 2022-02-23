const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

//Connect to a target network (Rinkeby) and unlock an account to use on that network.
//Account was unlocked by providing the mnemonic phrase below.
//Unlocking the account gives access to the public key, private key, and address. 
const provider = new HDWalletProvider(
    //Metamask account for this project is for development purposes only.
    //Replace mnemonic phrase below with your personal phrase.
    'air praise perfect woman noise zoo nominee explain radar add globe act',
    'https://rinkeby.infura.io/v3/2cf2bbd4068f45c08aeb064ce51468ed' //Specify the node to use.

);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log(interface);
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
