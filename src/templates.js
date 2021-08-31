// create-dada-cli - Quickly scaffold CLI utilities <https://github.com/msikma/create-dada-cli>
// © MIT license

const fs = require('fs').promises
const path = require('path')
const fg = require('fast-glob')
const { ensureDir, canAccess } = require('dada-cli-tools/util/fs')

const assetsDir = `${__dirname}/../assets`
const tplDir = `${assetsDir}/templates`
const licenseDir = `${assetsDir}/licenses`
const commonFiles = [['gitignore', '.gitignore']]

/** Checks if a template exists and can be used to create a project. */
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
  await fs.copyFile(`${licenseDir}/${file}`, `${target}/${file}`)
  await fs.rename(`${target}/${file}`, `${target}/license.md`)
}

/** Copies over common files (such as .gitignore) to the target directory. */
const copyCommon = (target) => (
  Promise.all(commonFiles.map(async file => fs.copyFile(`${assetsDir}/${file[0]}`, `${target}/${file[1]}`)))
)

/**
 * Copies over a template directory to a destination, and replaces all of the
 * template strings inside the files to their proper desired values.
 * 
 * Returns a list of files and a list of unused template variables (which should be an empty array).
 */
const copyDir = async (source, target, vars = {}) => {
  let unused = {}
  const files = await fg(['**'], { dot: true, cwd: source })
  for (const file of files) {
    const srcPath = `${source}/${file}`
    const dstPath = `${target}/${file}`
    const dstDir = path.dirname(dstPath)
    const content = await fs.readFile(srcPath, 'utf8')
    const [tplContent, tplUnused] = expandTemplateStrings(content, vars)
    await ensureDir(dstDir)
    await fs.writeFile(dstPath, tplContent, 'utf8')
    unused = { ...unused, ...tplUnused }
  }
  return [files, Object.keys(unused)]
}

/**
 * Replaces template tags with their desired values.
 * 
 * Tags that get replaced must be '{{', followed by a string not containing '{' or '}', then '}}'.
 * 
 * All tags found in the template should be replaced with their corresponding values. If a tag name
 * does not have an entry in the 'vars' object, its name is saved so we can report an error later.
 */
const expandTemplateStrings = (string, vars = {}) => {
  const unused = {}
  const expanded = string.replace(/\{\{([^{}]+)\}\}/g, (tag, name) => {
    if (!vars[name]) {
      unused[name] = true
      return tag
    }
    return vars[name]
  })
  return [expanded, unused]
}

module.exports = {
  addDefaultVars,
  checkTemplate,
  copyCommon,
  copyTemplate,
  copyLicense,
  templateDir
}
