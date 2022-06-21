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
    mapping(address => mapping(address => uint256)) public allowance;
    //events
    event Transfer (address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() public {
        totalsupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalsupply;
    }

    function transfer(address _to, uint256 _value) public returns(bool success) {
        require(_value <= balanceOf[msg.sender]);
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != address(0));
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);    
        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }
}