// {{name}} <{{homepage}}>
// © {{license}} license

const { log } = require('dada-cli-tools/log')
const { outputCallback } = require('dada-cli-tools/util/output')

/** Example function. */
const runProgram = (args) => {
  return {
    args
  }
}

/** Main program. */
const main = (args, { pkgData, baseDir }) => {
  log('Main function')
  log(args)
  log({ pkgData, baseDir })
  log('----')
  // Runs a given function and outputs its return value per command line arguments.
  outputCallback(runProgram, args)
}

module.exports = {
  main
}
