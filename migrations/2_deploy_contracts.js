const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function (deployer, network, accounts){
  // Deploy DaiToken contract
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();
  // Deploy DappToken contract
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();
  // Deploy TokenFarm contract by passing constructor addresses of DappToken and DaiToken
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();
  // Transfer all dappTokens to tokenFarm as liquidity pool
  await dappToken.transfer(tokenFarm.address, '1000000000000000000');
  // Transfer daiToken to investor #1 to enable transact
  await daiToken.transfer(accounts[1], '100000000000000');
  
};


