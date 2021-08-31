#!/usr/bin/env node

// {{name}} <{{homepage}}>
// © {{license}} license

const { resolve } = require('path')
const { makeArgParser } = require('dada-cli-tools/argparse')
const { ensurePeriod } = require('dada-cli-tools/util/text')
const { readJSONSync } = require('dada-cli-tools/util/fs')

const pkgPath = resolve(__dirname)
const pkgData = readJSONSync(`${pkgPath}/package.json`)

const parser = makeArgParser({
  version: pkgData.version,
  addHelp: true,
  longHelp: (
    `Example long help.`
  ),
  description: ensurePeriod(pkgData.description),
  epilog: 'Example epilog.'
})

parser.addArgument('--arg', { help: 'Example argument.', metavar: 'PATH', dest: 'exampleArgument', defaultValue: `hello` })
parser.addArgument('--arg-two', { help: 'Example boolean argument.', action: 'storeTrue', dest: 'exampleTwo' })

// Parse input. If usage is incorrect, the program will exit and display an error here.
const parsed = { ...parser.parseArgs() }

// Run the main program.
require('./main')(parsed, { pkgData, baseDir: pkgPath })
