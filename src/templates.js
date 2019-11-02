// create-dada-cli - Quickly scaffold CLI utilities <https://github.com/msikma/create-dada-cli>
// © MIT license

const copyTemplateDir = require('copy-template-dir')
const { canAccess } = require('dada-cli-tools/util/fs')
const { copyFile } = require('fs').promises

const assetsDir = `${__dirname}/../assets`
const tplDir = `${assetsDir}/templates`
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

/** Copies over a create-dada-cli template to the target directory and replaces placeholders. */
const copyTemplate = async (source, target, tplVars) => {
  const homepage = tplVars.homepage ? tplVars.homepage : `https://github.com/${tplVars.username}/${tplVars.name}`
  const repository = tplVars.repository ? tplVars.repository : `git+${homepage}`
  return await copyDir(source, target, { ...tplVars, homepage, repository })
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
  checkTemplate,
  copyCommon,
  copyTemplate,
  templateDir
}
