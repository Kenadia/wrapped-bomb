const util = require('./util')

const WBOMB = artifacts.require('WBOMB')

contract('WBOMB', function(accounts) {

  beforeEach(async () => {
    this.contract = await WBOMB.deployed()
  })

  it('has the correct initial supply', async () => {
    util.expectBNEqual(await contract.totalSupply(), 0)
  })
})
