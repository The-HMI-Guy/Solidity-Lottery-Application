pragma solidity ^0.4.17;

contract Lottery {
    //Manager is the address of the person who created the contract
    //Players array will contain the addresses of the players who have entered the lottery
        //Address array is dynamic 
    address public manager;
    address[] public players;
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    //Players must enter a minimum of .01 ETH
    //If address meets this requirement, the address is added to the players array
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
    //Solidity does not have a random generator
    //Pseudo randon number generator was used, which COULD be calculated by a player
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }
    
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}   