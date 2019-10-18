function expectBNEqual(a, b, message) {
  let pass
  if (typeof b === 'number') {
    pass = a.toNumber() === b
  } else if (typeof b === 'string') {
    pass = a.toString() === b
  } else {
    pass = a.eq(b)
  }
  message = message || `expected ${a} to equal ${b}`
  expect(pass, message).to.be.true
}

/**
 * Adapted from:
 * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/test/helpers/expectThrow.js
 */
async function expectThrow(promise, expectedMessage) {
  try {
    await promise
  } catch (error) {
    const invalidOpcode = error.message.search('invalid opcode') >= 0
    const outOfGas = error.message.search('out of gas') >= 0
    const revert = error.message.search('revert') >= 0
    assert(
      invalidOpcode || outOfGas || revert,
      `Expected throw, got '${error}' instead.`,
    )
    if (typeof(expectedMessage) === 'undefined') {
      assert.fail(
        'Please pass expectedMessage to expectThrow(). ' +
        `The error was ${error.message}.`
      )
    }
    assert(
      error.message.search(expectedMessage) >= 0,
      `Throw message '${error.message}' did not contain the expected string '${expectedMessage}'.`
    )
    return
  }
  assert.fail('Expected the call to throw, but it did not.')
}

module.exports = {
  expectBNEqual,
  expectThrow,
}
