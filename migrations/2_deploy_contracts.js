const ARGToken = artifacts.require("ARGToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function (deployer, network, accounts){
  // Deploy DaiToken contract
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();
  // Deploy ARGToken contract
  await deployer.deploy(ARGToken);
  const argToken = await ARGToken.deployed();
  // Deploy TokenFarm contract by passing constructor addresses of ARGToken and DaiToken
  await deployer.deploy(TokenFarm, argToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();
  // Transfer all argTokens to tokenFarm as liquidity pool
  await argToken.transfer(tokenFarm.address, '1000000000000000000');
  // Transfer daiToken to investor #1 to enable transact
  await daiToken.transfer(accounts[1], '100000000000000');
  
};


