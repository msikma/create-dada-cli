// create-dada-cli - Quickly scaffold CLI utilities <https://github.com/msikma/create-dada-cli>
// © MIT license

const chalk = require('chalk')
const { log, die, logErrorFatal } = require('dada-cli-tools/log')
const { canAccess, ensureDir } = require('dada-cli-tools/util/fs')

const { printTable } = require('./util')
const { addDefaultVars, checkTemplate, copyTemplate, copyCommon, templateDir, copyLicense } = require('./templates')

// Default replacement values to use when copying over templates.
const tplDefaults = {
  name: 'project',
  description: 'Project created using create-dada-cli',
  username: 'msikma',
  author: 'Michiel Sikma <michiel@sikma.org>',
  license: 'MIT'
}

/**
 * Runs the project creation script. If something goes wrong, the script will terminate.
 *
 * Progress is logged to the console. This is meant to be run from the CLI.
 */
const createApp$ = async (cliArgs, envInfo) => {
  const { name, type } = cliArgs
  const { cwd } = envInfo // no trailing slash
  const target = `${cwd}/${name}`

  log(
    `create-dada-cli@${envInfo.pkgData.version}: Creating new project:`,
    chalk.yellow(name),
    `(${chalk.green(type)})`,
    'in',
    `${chalk.cyan(cwd)}${chalk.yellow(`/${name}`)}`
  )

  // Verify that the selected template is valid.
  if (!await checkTemplate(type))
    return die('Cannot find template:', type)

  // Verify that we can write here.
  if (!await canAccess(cwd))
    return die('Access denied:', cwd)

  // Verify that the target directory doesn't exist yet.
  if (await canAccess(target))
    return die('Target directory already exists:', target)

  // Seems we're good to go.
  try {
    const status = await createApp(name, type, target)
    if (status.ok) {
      createEpilogue(name, type, target, status)
    }
  }
  catch (err) {
    logErrorFatal('An error occurred while creating the project:')
    log(err)
    die('Exiting because of errors.')
  }
}

/** Displays successful scaffolding result. */
const createEpilogue = (name, type, target, status) => {
  log('Successfully created new project.')
  printTable(status.template.vars)
}

/**
 * Attempts to create the project. Returns an object with success information or error status.
 */
const createApp = async (name, type, target) => {
  const tplPath = templateDir(type)
  const appConfig = addDefaultVars({ ...tplDefaults, name })
  const hasDir = await ensureDir(target)
  const result = await copyTemplate(tplPath, target, appConfig)
  await copyCommon(target)
  await copyLicense(target, appConfig.license)
  return {
    ok: true,
    template: {
      status: result,
      path: tplPath,
      vars: appConfig,
      name: type
    },
    hasDir
  }
}

module.exports = {
  createApp,
  createApp$
}
