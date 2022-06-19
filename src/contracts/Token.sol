// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

contract Token{
    string public name = "Gv Token";
    string public symbol = 'GV';
    uint256 public decimals = 18;
    uint256 public totalsupply;

    constructor() public {
        totalsupply = 1000000 * (10 ** decimals);
    }
}