const { assert } = require('chai');

const Token = artifacts.require('./Token');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract ('Token', (accounts) => {
    let token;
    const name = 'Gv Token';
    const symbol = 'GV';
    const decimals = 18;
    const totalsupply = 1000000 * (10 ** decimals);

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
    })
});