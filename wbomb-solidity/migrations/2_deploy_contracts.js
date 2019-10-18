const BombToken = artifacts.require('./BOMBv3.sol');
const WrappedBombToken = artifacts.require('./WBOMB.sol')

const BOMB_TOKEN_MAINNET = '0x1C95b093d6C236d3EF7c796fE33f9CC6b8606714'

module.exports = function(deployer, network, addresses) {
  deployer.then(async () => {
    let bombTokenAddress = BOMB_TOKEN_MAINNET
    if (network !== 'main') {
      await deployer.deploy(BombToken);
      const bombToken = await BombToken.deployed()
      bombTokenAddress = bombToken.address
    }
    await deployer.deploy(WrappedBombToken, bombTokenAddress);
  });
};
