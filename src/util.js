// create-dada-cli - Quickly scaffold CLI utilities <https://github.com/msikma/create-dada-cli>
// © MIT license

const { log } = require('dada-cli-tools/log')

/** Returns the size of the longest string element in a list. */
const listLongest = list => list.reduce((longest, curr) => Math.max(longest, curr.length), 0)

/** Unicode characters used to construct tables. */
const tableAssets = {
  space: ' ',
  padding: 1,
  box: {
    topLeft: '╭',
    top: '─',
    topRight: '╮',
    left: '│',
    right: '│',
    bottomLeft: '╰',
    bottom: '─',
    bottomRight: '╯',

    vertical: '│',
    horizontalDown: '┬',
    horizontalUp: '┴'
  }
}

// A single padding character.
const padChar = tableAssets.space.repeat(tableAssets.padding)

/** Logs a single array, joined with an empty string. */
const logArr = arr => log(arr.join(''))

/** Logs the top or bottom edge of a table.  */
const _logTableEdge = (assetLeft, assetMiddle, assetRight, assetT) => (keyLength, valLength) =>
  logArr([assetLeft, assetMiddle.repeat(keyLength + (tableAssets.padding * 2)), assetT, assetMiddle.repeat(valLength + (tableAssets.padding * 2)), assetRight])
const logTableStart = _logTableEdge(tableAssets.box.topLeft, tableAssets.box.top, tableAssets.box.topRight, tableAssets.box.horizontalDown)
const logTableEnd = _logTableEdge(tableAssets.box.bottomLeft, tableAssets.box.bottom, tableAssets.box.bottomRight, tableAssets.box.horizontalUp)

/** Logs a single table row. */
const logTableRow = (key, keyLength, val, valLength) =>
  logArr([tableAssets.box.left, padChar, key.padEnd(keyLength), padChar, tableAssets.box.vertical, padChar, val.padEnd(valLength), padChar, tableAssets.box.right])

/**
 * Prints a table with the information of an object.
 */
const printTable = data => {
  const longestKey = listLongest(Object.keys(data))
  const longestVal = listLongest(Object.values(data))
  logTableStart(longestKey, longestVal)
  Object.entries(data).forEach(([key, val], n) => logTableRow(key, longestKey, val, longestVal))
  logTableEnd(longestKey, longestVal)
}

module.exports = {
  printTable
}
