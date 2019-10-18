const util = require('./util')

const BOMBv3 = artifacts.require('BOMBv3')
const WBOMB = artifacts.require('WBOMB')

describe('Wrapped BOMB', () => {
  let root, alice, bob, charlie
  let baseToken, wrappedToken

  /**
   * Convert an integer number of bombs to wrapped units by adding 30 decimal places.
   */
  function toWrappedUnits(numBombs) {
    numBombs = numBombs.toString()
    if (numBombs === '0') {
      return '0'
    }
    return numBombs + '0'.repeat(30)
  }

  /**
   * Verify that the contract can pay back all bombs and that total balance is as expected.
   */
  async function verifyContractIsSolvent(wrappedBombs) {
    util.expectBNEqual(await baseToken.balanceOf(wrappedToken.address), wrappedBombs)
    util.expectBNEqual(await wrappedToken.totalSupply(), toWrappedUnits(wrappedBombs))
  }

  before(async () => {
    const accounts = await web3.eth.getAccounts()
    ;([root, alice, bob, charlie] = accounts)
    baseToken = await BOMBv3.deployed()
    wrappedToken = await WBOMB.deployed()
  })

  beforeEach(async () => {
    // Give alice and bob each 1000 bombs.
    // 1% (rounded-up) will be burned upon transfer.
    await baseToken.transfer(alice, 1011, { from: root })
    await baseToken.transfer(bob, 1011, { from: root })
  })

  contract('WBOMB', async () => {
    it('has zero initial supply', async () => {
      util.expectBNEqual(await wrappedToken.totalSupply(), 0)

      // Verify that the contract is solvent.
      await verifyContractIsSolvent(0)
    })
  })

  contract('WBOMB', async () => {
    it('cannot wrap without allowance', async () => {
      await util.expectThrow(
        wrappedToken.wrap(100, { from: alice }),
        'revert',
      )
    })
  })

  contract('WBOMB', async () => {
    it('cannot unwrap when WBOMB balance is zero', async () => {
      baseToken.approve(wrappedToken.address, 100, { from: alice })
      await util.expectThrow(
        wrappedToken.unwrap(100, { from: alice }),
        'revert',
      )
    })
  })

  contract('WBOMB', async () => {
    it('wraps bombs', async () => {
      await baseToken.approve(wrappedToken.address, 200, { from: alice })
      await wrappedToken.wrap(100, { from: alice })
      await wrappedToken.wrap(100, { from: alice })
      await baseToken.approve(wrappedToken.address, 200, { from: bob })
      await wrappedToken.wrap(100, { from: bob })
      await wrappedToken.wrap(100, { from: bob })

      // Verify that the balances are as expected.
      util.expectBNEqual(await baseToken.balanceOf(alice), 800)
      util.expectBNEqual(await baseToken.balanceOf(bob), 800)
      util.expectBNEqual(await wrappedToken.balanceOf(alice), toWrappedUnits(198))
      util.expectBNEqual(await wrappedToken.balanceOf(bob), toWrappedUnits(198))

      // Verify that the contract is solvent.
      await verifyContractIsSolvent(396)
    })
  })

  contract('wraps and unwraps bombs', async () => {
    it('', async () => {
      await baseToken.approve(wrappedToken.address, 200, { from: alice })
      await wrappedToken.wrap(100, { from: alice })
      await wrappedToken.unwrap(99, { from: alice })
      await wrappedToken.wrap(100, { from: alice })
      await wrappedToken.unwrap(50, { from: alice })
      await wrappedToken.unwrap(40, { from: alice })
      await wrappedToken.unwrap(7, { from: alice })
      await wrappedToken.unwrap(2, { from: alice })

      // Verify that the balances are as expected.
      // Exploded 1 bomb for each wrap and each unwrap, total of 7.
      util.expectBNEqual(await baseToken.balanceOf(alice), 993)
      util.expectBNEqual(await wrappedToken.balanceOf(alice), toWrappedUnits(0))

      // Verify that the contract is solvent.
      await verifyContractIsSolvent(0)
    })
  })

  contract('WBOMB', async () => {
    it('transfers wrapped bombs without exploding them', async () => {
      await baseToken.approve(wrappedToken.address, 100, { from: alice })
      await wrappedToken.wrap(100, { from: alice })

      await wrappedToken.transfer(bob, toWrappedUnits(99), { from: alice })
      await wrappedToken.transfer(charlie, toWrappedUnits(99), { from: bob })
      await wrappedToken.transfer(alice, toWrappedUnits(99), { from: charlie })

      await wrappedToken.transfer(charlie, toWrappedUnits(1), { from: alice })

      // Verify that the balances are as expected.
      util.expectBNEqual(await baseToken.balanceOf(alice), 900)
      util.expectBNEqual(await baseToken.balanceOf(bob), 1000)
      util.expectBNEqual(await wrappedToken.balanceOf(alice), toWrappedUnits(98))
      util.expectBNEqual(await wrappedToken.balanceOf(bob), toWrappedUnits(0))
      util.expectBNEqual(await wrappedToken.balanceOf(charlie), toWrappedUnits(1))

      // Verify that the contract is solvent.
      await verifyContractIsSolvent(99)
    })
  })

  contract('WBOMB', async () => {
    it('allows transfer of fractional bombs', async () => {
      await baseToken.approve(wrappedToken.address, 100, { from: alice })
      await wrappedToken.wrap(100, { from: alice })

      await wrappedToken.transfer(bob, 1000000000, { from: alice })
      await wrappedToken.transfer(charlie, 1000, { from: bob })
      await wrappedToken.transfer(alice, 1, { from: charlie })

      // Verify that the balances are as expected.
      util.expectBNEqual(await baseToken.balanceOf(alice), 900)
      util.expectBNEqual(await baseToken.balanceOf(bob), 1000)
      util.expectBNEqual(await wrappedToken.balanceOf(alice), '98999999999999999999999000000001')
      util.expectBNEqual(await wrappedToken.balanceOf(bob), '999999000')
      util.expectBNEqual(await wrappedToken.balanceOf(charlie), '999')

      // Verify that the contract is solvent.
      await verifyContractIsSolvent(99)
    })
  })

  contract('WBOMB', async () => {
    it('handles edge cases appropriately and remains solvent', async () => {
      await baseToken.approve(wrappedToken.address, 1000, { from: alice })

      await wrappedToken.wrap(199, { from: alice })
      await verifyContractIsSolvent(197)
      await wrappedToken.wrap(200, { from: alice })
      await verifyContractIsSolvent(197 + 198)
      await wrappedToken.wrap(201, { from: alice })
      await verifyContractIsSolvent(197 + 198 + 198)
      await wrappedToken.wrap(1, { from: alice })
      await verifyContractIsSolvent(197 + 198 + 198)
      await wrappedToken.wrap(0, { from: alice })
      await verifyContractIsSolvent(197 + 198 + 198)

      await wrappedToken.unwrap(0, { from: alice })
      await verifyContractIsSolvent(197 + 198 + 198)
      await wrappedToken.unwrap(1, { from: alice })
      await verifyContractIsSolvent(197 + 198 + 198 - 1)
    })
  })
})
