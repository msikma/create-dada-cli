#!/usr/bin/env node

// create-dada-cli - Quickly scaffold CLI utilities <https://github.com/msikma/create-dada-cli>
// © MIT license

const makeArgParser = require('dada-cli-tools/argparse').default
const { ensurePeriod } = require('dada-cli-tools/util/text')
const { createProject } = require('../create')

const packageData = require('../../package.json')
const parser = makeArgParser({
  addHelp: true,
  description: ensurePeriod(packageData.description),
  version: packageData.version
})

parser.addArgument(['name'], { help: 'Name of new project to generate.' })

const main = () => {
  const { name } = parser.parseArgs()
  const cwd = '.';

  if (name) {
    createProject(name, { cwd })
  }
}

main()
