pragma solidity ^0.4.17;

contract Lottery {
    //Manager is the address of the person who created the contract.
    //Players array will contain the addresses of the players who have entered the lottery.
    address public manager;
    address[] public players;

    //First address creating the lottery will become the manager.
    //The manager will have admin abilities, which outlined below.
    function Lottery() public {
        manager = msg.sender;
    }

    //Players must enter a minimum of .01 ETH.
    //If address meets this requirement, the address is added to the players array.
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    //Solidity does not have a random generator.
    //Pseudo random number generator was used, which COULD be calculated by a player.
    function random() private view returns (uint256) {
        return uint256(keccak256(block.difficulty, now, players));
    }

    //This function will only run if the "manager" calls it.
    //Store the index of the winner using the function random.
    //Use the player's hash to access the transfer function, which will transfer the lottery's balance
    //to the winner's address.
    //Reset players array and create new dynamic array.
    function pickWinner() public restricted {
        uint256 index = random() % players.length;
        players[index].transfer(this.balance);
        lastWinner = players[index];
        players = new address[](0);
    }

    //Check to see if the address is the manager.
    //Modifier function reduces the amount of code needed in a contract.
    modifier restricted() {
        require(msg.sender == manager);
        _; //Solidity places the code block here that is calling the function.
    }

    //Returns the list off players who have entered the active lottery.
    //View keyword indicates the function will not change any data.
    function getPlayers() public view returns (address[]) {
        return players;
    }
}
