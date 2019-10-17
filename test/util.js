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

module.exports = {
  expectBNEqual,
}
