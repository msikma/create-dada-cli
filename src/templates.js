// create-dada-cli - Quickly scaffold CLI utilities <https://github.com/msikma/create-dada-cli>
// © MIT license

const copyTemplateDir = require('copy-template-dir')
const { canAccess } = require('dada-cli-tools/util/fs')
const { copyFile, rename } = require('fs').promises

const assetsDir = `${__dirname}/../assets`
const tplDir = `${assetsDir}/templates`
const licenseDir = `${assetsDir}/licenses`
const commonFiles = [['gitignore', '.gitignore']]

/**
 * Checks if a template exists and can be used to create a project.
 */
const checkTemplate = async type => {
  const dir = templateDir(type)
  return await canAccess(dir)
}

/** Returns template directory path for a given project type. */
const templateDir = type => (
  `${tplDir}/${type}`
)

/** Returns license file path for a given license type. */
const licensePath = type => (
  `${licenseDir}/`
)

/** Ensures that the list of template vars contains everything needed. */
const addDefaultVars = tplVars => {
  const homepage = tplVars.homepage ? tplVars.homepage : `https://github.com/${tplVars.username}/${tplVars.name}`
  const repository = tplVars.repository ? tplVars.repository : `git+${homepage}`
  return { ...tplVars, homepage, repository }
}

/** Copies over a create-dada-cli template to the target directory and replaces placeholders. */
const copyTemplate = async (source, target, tplVars) => {
  return await copyDir(source, target, tplVars)
}

/** Copies over the requested license file. */
const copyLicense = async (target, license) => {
  const file = `${license.toLowerCase()}.md`
  await copyFile(`${licenseDir}/${file}`, `${target}/${file}`)
  await rename(`${target}/${file}`, `${target}/license.md`)
}

/** Copies over common files (such as .gitignore) to the target directory. */
const copyCommon = (target) => (
  Promise.all(commonFiles.map(async file => copyFile(`${assetsDir}/${file[0]}`, `${target}/${file[1]}`)))
)

/** Promisified version of copy-template-dir. */
const copyDir = async (source, target, vars = {}) => new Promise((resolve, reject) => (
  copyTemplateDir(source, target, vars, (err, files) => {
    if (err) return reject(err, files)
    resolve(files)
  })
))

module.exports = {
  addDefaultVars,
  checkTemplate,
  copyCommon,
  copyTemplate,
  copyLicense,
  templateDir
}
