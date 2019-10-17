const BombToken = artifacts.require('./BOMBv3.sol');
const WrappedBombToken = artifacts.require('./WBOMB.sol')

module.exports = function(deployer, network, addresses) {
  deployer.then(async () => {
    await deployer.deploy(BombToken);
    const bombToken = await BombToken.deployed()
    await deployer.deploy(WrappedBombToken, bombToken.address);
  });
};
