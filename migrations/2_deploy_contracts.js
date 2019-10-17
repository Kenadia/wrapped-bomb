const BombToken = artifacts.require('./BOMBv3.sol');

module.exports = function(deployer, network, addresses) {
  deployer.then(async () => {
    await deployer.deploy(BombToken);
  });
};
