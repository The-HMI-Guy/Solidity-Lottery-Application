const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Portal to the Etherum network (retrieve and make changes).
const web3 = new Web3(ganache.provider()); //Ganache is the host network. Send and deploy contracts to the Ganache network. 

//Interface = ABI. Translation layer that communication data from the network to JS.
//Bytecode = Compiled contract.
const { interface, bytecode } = require('../compile'); 

let lottery;
let accounts;

//This block of code is executed before each test.
//Each test will start with a new contract.
beforeEach(async () => {
    
    accounts = await web3.eth.getAccounts();//Get a list of all accounts

    //Use one of those accounts to deploy the contract.
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000'});
});

//.methods allows us to access the functions created in the contract.
//.call() = read-only. Instantaneous.
//.send() = change to the data in the contract. Not instantaneous.
describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });
    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length)
    });
    it('allows multiple account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length)
    });

    it('requires a minimum amount of ether', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
        });
        assert(false);
    } catch (err) {
        assert.ok(err);
        }
    });

    it('only manager can call pickWinner', async () => {
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({ from: accounts[0]});

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8', 'ether'));
    });
});