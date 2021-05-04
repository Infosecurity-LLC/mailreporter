var showdown  = require('showdown')
let MDConverter = new showdown.Converter()

export function mdToHtml (markdownString) {
  markdownString = markdownString || ''
  let result = ''
  try {
    result = MDConverter.makeHtml(markdownString || '')
  } catch (e) {
    console.log('failed to convert markdown to html')
    throw e
  }
  return result
}
