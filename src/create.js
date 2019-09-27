#!/usr/bin/env node

// create-dada-cli - Quickly scaffold CLI utilities <https://github.com/msikma/create-dada-cli>
// © MIT license

const createProject = (projName, env) => {
  const isOK = canMakeProject(projName, env)
  console.log({ projName, env, isOK })
}

const canMakeProject = (name, env) => {
  return false
}

module.exports = {
  createProject
}
