const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
.use(require('chai-as-promised'))
.should()

function tokens(n){
    return web3.utils.toWei(n, 'ether')
}

contract ('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm
    before (async () => {
        //load contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        //transfer all 1 million dappTokens to farm
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))

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
    
    describe('Dapp Token deployment', async () => {
        it('has a name', async () => {
          const name = await dappToken.name()
          assert.equal(name, 'DApp Token')
        })
    })
    
    describe('Token Farm deployment', async () => {
        it('has a name', async () => {
          const name = await tokenFarm.name()
          assert.equal(name, 'Dapp Token Farm')
        })
    
        it('contract has tokens', async () => {
          let balance = await dappToken.balanceOf(tokenFarm.address)
          assert.equal(balance.toString(), tokens('1000000'))
        })
    })
})
