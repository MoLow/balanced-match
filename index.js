'use strict'
const {
  StringPrototypeSlice,
  StringPrototypeIndexOf,
  StringPrototypeMatch,
  ArrayPrototypePush,
  ArrayPrototypePop
} = require('node-primordials')

/**
 * @param {string | RegExp} a
 * @param {string | RegExp} b
 * @param {string} str
 */
function balanced (a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str)
  if (b instanceof RegExp) b = maybeMatch(b, str)

  const r = range(a, b, str)

  return (
    r && {
      start: r[0],
      end: r[1],
      pre: StringPrototypeSlice(str, 0, r[0]),
      body: StringPrototypeSlice(str, r[0] + a.length, r[1]),
      post: StringPrototypeSlice(str, r[1] + b.length)
    }
  )
}

/**
 * @param {RegExp} reg
 * @param {string} str
 */
function maybeMatch (reg, str) {
  const m = StringPrototypeMatch(str, reg)
  return m ? m[0] : null
}

balanced.range = range

/**
 * @param {string} a
 * @param {string} b
 * @param {string} str
 */
function range (a, b, str) {
  let begs, beg, left, right, result
  let ai = StringPrototypeIndexOf(str, a)
  let bi = StringPrototypeIndexOf(str, b, ai + 1)
  let i = ai

  if (ai >= 0 && bi > 0) {
    if (a === b) {
      return [ai, bi]
    }
    begs = []
    left = str.length

    while (i >= 0 && !result) {
      if (i === ai) {
        ArrayPrototypePush(begs, i)
        ai = StringPrototypeIndexOf(str, a, i + 1)
      } else if (begs.length === 1) {
        result = [ArrayPrototypePop(begs), bi]
      } else {
        beg = ArrayPrototypePop(begs)
        if (beg < left) {
          left = beg
          right = bi
        }

        bi = StringPrototypeIndexOf(str, b, i + 1)
      }

      i = ai < bi && ai >= 0 ? ai : bi
    }

    if (begs.length) {
      result = [left, right]
    }
  }

  return result
}

module.exports = balanced
