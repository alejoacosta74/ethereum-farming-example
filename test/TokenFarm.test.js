const { assert } = require('chai')

const DaiToken = artifacts.require('DaiToken')
const ARGToken = artifacts.require('ARGToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
.use(require('chai-as-promised'))
.should()

function tokens(n){
    return web3.utils.toWei(n, 'ether')
}

contract ('TokenFarm', ([owner, investor]) => {
    let daiToken, argToken, tokenFarm
    before (async () => {
        //load contracts
        daiToken = await DaiToken.new()
        argToken = await ARGToken.new()
        tokenFarm = await TokenFarm.new(argToken.address, daiToken.address)

        //transfer all 1 million argTokens to farm
        await argToken.transfer(tokenFarm.address, tokens('1000000'))

        //send 100 daiToken to investor
        await daiToken.transfer(investor, tokens('100'))
    })

    // check DaiToken name is as expected    

    describe('Mock DAI deployment', async () => {
        it('has a name', async () => {
          const name = await daiToken.name()
          assert.equal(name, 'Mock DAI Token')
        })
    })
    
    describe('ARG Token deployment', async () => {
        it('has a name', async () => {
          const name = await argToken.name()
          assert.equal(name, 'ARG Token')
        })
    })
    
    describe('Token Farm deployment', async () => {
        it('has a name', async () => {
          const name = await tokenFarm.name()
          assert.equal(name, 'ARG Token Farm')
        })
    
        it('contract has tokens', async () => {
          let balance = await argToken.balanceOf(tokenFarm.address)
          assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('farming token', async () => {
      it('rewards investors for staking mDai tokens', async () => {
        let result
  
        // Check investor balance before staking
        result = await daiToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')
  
        // Stake Mock DAI Tokens
        await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
        await tokenFarm.stakeTokens(tokens('100'), { from: investor })
  
        // Check staking result
        result = await daiToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')
  
        result = await daiToken.balanceOf(tokenFarm.address)
        assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')
  
        result = await tokenFarm.stakingBalance(investor)
        assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')
  
        result = await tokenFarm.isStaking(investor)
        assert.equal(result.toString(), 'true', 'investor staking status correct after staking')
  
        // Issue Tokens
        await tokenFarm.issueTokens({ from: owner })
  
        // Check balances after issuance
        result = await argToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('100'), 'investor ARG Token wallet balance correct affter issuance')
  
        // Ensure that only onwer can issue tokens
        await tokenFarm.issueTokens({ from: investor }).should.be.rejected;
  
        // Unstake tokens
        await tokenFarm.unstakeTokens({ from: investor })
  
        // Check results after unstaking
        result = await daiToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')
  
        result = await daiToken.balanceOf(tokenFarm.address)
        assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')
  
        result = await tokenFarm.stakingBalance(investor)
        assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')
  
        result = await tokenFarm.isStaking(investor)
        assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
      })
    })
})
