import _ from 'lodash'

/**
 * returns false if rows is not have at least one right value or faulty
 * @returns {boolean}
 * @param {{left: string, right: string}[]} rows
 */
export function isRowsHaveAllNullRightValues (rows = []) {
  if (!rows || !rows.length) {
    return false
  }
  let allRightValuesArray = rows
    .map(row => row.right)

  let foundNotNull = allRightValuesArray.filter(val => {
    return val !== null
  })
  if (!foundNotNull.length) {
    return false
  }
  return true
}

export function isRowsNotFaulty (rows) {
  return isRowsHaveAllNullRightValues(rows)
}


/**
 *
 * @returns {boolean}
 * @param blocks
 */
export function isRowsInBlocksHaveAllNullRightValues (blocks) {
  if (!blocks || !blocks.length) {
    return false
  }
  let faultBlocks = []
  blocks.forEach(block => {
    let isBlockCorrect = isRowsNotFaulty(block.rows)
    if (!isBlockCorrect) {
      faultBlocks.push(faultBlocks)
    }
  })
  if (faultBlocks.length) {
    return false
  }
  return true
}
