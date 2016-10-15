const co = require('co')

const jasmineIt = it
const jasmineFit = fit
const jasmineBeforeAll = beforeAll
const jasmineAfterAll = afterAll

function runVerified(generator) {
  return done => co(function * () {
    try {
      yield generator()
      done()
    }
    catch (error) {
      console.log(error)
      done.fail()
    }
  })
}

function isGenerator(fn) {
  return fn.constructor.name === 'GeneratorFunction'
}

function dispatch(method) {
  let args = [].slice.call(arguments, 1)
  const value = args.pop()
  if (isGenerator(value)) {
    args = args.concat(runVerified(value))
  }
  else {
    args = args.concat(value)
  }
  method.apply(null, args)
}

function promiseIt(description, functionOrGenerator) {
  dispatch(jasmineIt, description, functionOrGenerator)
}

function fpromiseIt(description, functionOrGenerator) {
  dispatch(jasmineFit, description, functionOrGenerator)
}

function promiseBeforeAll(functionOrGenerator) {
  dispatch(jasmineBeforeAll, functionOrGenerator)
}

function promiseAfterAll(functionOrGenerator) {
  dispatch(jasmineAfterAll, functionOrGenerator)
}

global.it = promiseIt
global.fit = fpromiseIt
global.beforeAll = promiseBeforeAll
global.afterAll = promiseAfterAll

