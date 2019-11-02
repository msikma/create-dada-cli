#!/usr/bin/env node

// create-dada-cli - Quickly scaffold CLI utilities <https://github.com/msikma/create-dada-cli>
// © MIT license

const { makeArgParser } = require('dada-cli-tools/argparse')
const { ensurePeriod } = require('dada-cli-tools/util/text')
const { readJSONSync } = require('dada-cli-tools/util/read')
const { createApp$ } = require('../src/index')

const pkgData = readJSONSync(`${__dirname}/../package.json`)
const parser = makeArgParser({
  version: pkgData.version,
  addHelp: true,
  description: ensurePeriod(pkgData.description)
})

parser.addArgument(['name'], { help: 'Name for the new project.' })
parser.addArgument(['-t', '--type'], { help: 'Template to use for scaffolding this project:', metavar: 'TYPE', choices: ['cli-monorepo'], _choicesHelp: ['CLI binary and library as separate monorepo packages'], defaultValue: 'cli-monorepo' })

createApp$({ ...parser.parseArgs() }, { pkgData, cwd: process.cwd() })
