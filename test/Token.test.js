import { tokens } from './helpers'

const { assert } = require('chai');

const Token = artifacts.require('./Token');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract ('Token', ([deployer, receiver]) => {
    let token;
    const name = 'Gv Token';
    const symbol = 'GV';
    const decimals = 18;
    const totalsupply = tokens(1000000).toString();

    beforeEach(async() => {
        token = await Token.new();
    })

    describe('deployment', () => {
        it('tracks the name', async() => {
            const result = await token.name();
            assert.equal(result, name); 
        })

        it('tracks the symbol', async() => {
            const result = await token.symbol();
            assert.equal(result, symbol); 
        })

        it('tracks the decimals', async() => {
            const result = await token.decimals();
            assert.equal(result, decimals); 
        })

        it('tracks the total supply', async() => {
            const result = await token.totalsupply();
            assert.equal(result, totalsupply); 
        })

        it('assignes the total supply to the deployer', async() => {
            const result = await token.balanceOf(deployer);
            assert.equal(result, totalsupply); 
        })

    })

    describe('sending tokens', () => {
        let result;
        let amount;

        beforeEach(async () => {
            amount = tokens(100);
            result = await token.transfer(receiver, amount, { from : deployer });
        })

        it('transfers token balances', async() => {
            let balance = await token.balanceOf(deployer);
            assert.equal(balance.toString(), tokens(999900).toString());
            balance = await token.balanceOf(receiver);
            assert.equal(balance.toString(), tokens(100).toString());
        })
    })
});