#!/usr/bin/env node

// {{name}} <{{homepage}}>
// © {{license}} license

const { resolve } = require('path')
const { makeArgParser } = require('dada-cli-tools/argparse')
const { getDataDescriptions, dataDefaultType } = require('dada-cli-tools/util/output')
const { logLevels, logDefaultLevel, setVerbosity } = require('dada-cli-tools/log')
const { ensurePeriod } = require('dada-cli-tools/util/text')
const { resolveTilde, readJSONSync } = require('dada-cli-tools/util/fs')

// Path to the application code, i.e. where the top level package.json resides. No trailing slash.
const pkgPath = resolve(`${__dirname}/../../`)
const pkgData = readJSONSync(`${pkgPath}/package.json`)

const parser = makeArgParser({
  version: pkgData.version,
  addHelp: true,
  longHelp: `Long help example.`,
  description: ensurePeriod(pkgData.description),
  epilog: 'Epilog example.'
})

// Default paths for the config and cache files.
const exampleDir = resolveTilde('~/.config/callisto')
const outputFormats = getDataDescriptions()

parser.addArgument('--file-path', { help: 'Path to an example file.', metavar: 'PATH', dest: 'filePath', defaultValue: `${exampleDir}/file.js` })
parser.addArgument('--check-file', { action: 'storeTrue', help: 'Example of a subtask.', dest: 'checkFile' })
parser.addArgument('--check-cache', { action: 'storeTrue', help: 'Another example of a subtask.', dest: 'checkCache' })
parser.addArgument('--output', { help: 'Result output format.', choices: Object.keys(outputFormats), _choicesHelp: Object.values(outputFormats), metavar: 'TYPE', defaultValue: dataDefaultType })
parser.addArgument('--log', { help: `Sets console logging level ("${logDefaultLevel}" by default). Choices: {${logLevels.join(',')}}.`, dest: 'logLevel', choices: logLevels, metavar: 'LEVEL', defaultValue: 'info' })

const parsed = { ...parser.parseArgs() }

// Set logging verbosity (for either the main program or a requested task).
setVerbosity(parsed.logLevel)

// Runs the main program with parsed command line arguments.
require('./main.js').main(parsed, { pkgData, baseDir: pkgPath })
