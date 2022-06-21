import { invalid } from 'moment';
import { tokens, EVM_REVERT } from './helpers'

const { assert } = require('chai');

const Token = artifacts.require('./Token');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract ('Token', ([deployer, receiver, exchange]) => {
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

        describe('success', () => {
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

            it('emits a transfer event', async() => {
                const log = result.logs[0];
                assert.equal(log.event, 'Transfer');
                const event = log.args;
                assert.equal(event.from.toString(), deployer.toString());
                assert.equal(event.to.toString(), receiver.toString());
                assert.equal(event.value.toString(), amount.toString());
            })
        })

        describe('failure', () => {
            it('rejects insufficient balances', async() => {
                let invalidAmount = tokens(10000000) //10 million > 1 milllion
                await token.transfer(receiver, invalidAmount, { from : deployer}).should.be.rejectedWith(EVM_REVERT);
        
                invalidAmount = tokens(100);
                await token.transfer(deployer, invalidAmount, { from : receiver}).should.be.rejectedWith(EVM_REVERT);
            })

            it('rejects invalid receiver', async() => {
                await token.transfer(0x0, amount, { from : deployer}).should.be.rejected;
            })
        })
    })

    describe('approving tokens', () => {
        let result;
        let amount;

        beforeEach(async() => {
            amount = tokens(100);
        })

        describe('success', () => {
            beforeEach(async() => {
                result = await token.approve(exchange, amount, { from : deployer });
            })

            it('allocates an allowance for delegated token spending on exchange', async() => {
                const allowance = await token.allowance(deployer, exchange);
                assert.equal(amount.toString(), allowance.toString());
            })

            it('emits a approval event', async() => {
                const log = result.logs[0];
                assert.equal(log.event, 'Approval');
                const event = log.args;
                assert.equal(event.owner.toString(), deployer.toString());
                assert.equal(event.spender.toString(), exchange.toString());
                assert.equal(event.value.toString(), amount.toString());
            })
        })

        describe('failure', () => {
            it('rejects invalid spender', async() => {
                await token.approve(0x0, amount, { from : deployer }).should.be.rejected;
            })
        })
    })

    describe('sending tokens through exchange or delegated token transfers', () => {
        let result;
        let amount;

        beforeEach(async () => {
            amount = tokens(100);
            await token.approve(exchange, amount, { from : deployer });
        })

        describe('success', () => {
            beforeEach(async () => {
                result = await token.transferFrom(deployer, receiver, amount, { from : exchange });
            })
    
            it('transfers token balances', async() => {
                let balance = await token.balanceOf(deployer);
                assert.equal(balance.toString(), tokens(999900).toString());
                balance = await token.balanceOf(receiver);
                assert.equal(balance.toString(), tokens(100).toString());
            })

            it('resets the allowance', async() => {
                let allowance = await token.allowance(deployer, exchange);
                assert.equal(allowance,0);
            })

            it('emits a transfer event', async() => {
                const log = result.logs[0];
                assert.equal(log.event, 'Transfer');
                const event = log.args;
                assert.equal(event.from.toString(), deployer.toString());
                assert.equal(event.to.toString(), receiver.toString());
                assert.equal(event.value.toString(), amount.toString());
            })
        })

        describe('failure', () => {
            it('rejects insufficient amounts', async() => {
                let invalidAmount = tokens(10000000) //10 million > 1 milllion
                await token.transferFrom(deployer, receiver, invalidAmount, { from : exchange}).should.be.rejectedWith(EVM_REVERT);        
            })

            it('rejects invalid receiver', async() => {
                await token.transferFrom(deployer, 0x0, amount, { from : exchange}).should.be.rejected;
            })
        })
    })
})