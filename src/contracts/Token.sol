import "openzeppelin-solidity/contracts/math/SafeMath.sol";
// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

contract Token{
    using SafeMath for uint;
    string public name = "Gv Token";
    string public symbol = 'GV';
    uint256 public decimals = 18;
    uint256 public totalsupply;

    mapping(address => uint256) public balanceOf;

    constructor() public {
        totalsupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalsupply;
    }

    function transfer(address _to, uint256 _value) public returns(bool success) {
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);    
        return true;
    }
}