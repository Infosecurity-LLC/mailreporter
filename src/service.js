var showdown  = require('showdown')
require('dotenv').config()
const Inky = require('inky/lib/inky.js');
const i = new Inky();
const Pug = require('pug');
const cheerio = require('cheerio');
const inlineCss = require('inline-css');
const fs = require('fs');
const nodeMailer = require('nodemailer');
const Handlebars = require('handlebars')

// install handlebars helpers
require('./utils/load-hbs-partials')
var helpers = require('handlebars-helpers')();

let MDConverter = new showdown.Converter()


function inkyToHtml (inky) {
  return i.releaseTheKraken(inky)
}

/**
 * transform accepts the following params:
 * params.pug: pug for the template
 * params.css: css to add
 * params.json: a json object for the pug
 * params.snippet: boolean
 * and returns html
 */

async function transform (params, adv = false) {
  console.log(JSON.stringify({
    params,
    adv
  }))
  const sampleData = require('./sampleData/sample.json')
  let withSensorStats = require('./sampleData/sample_sensor_stats.json')
  if (process.env.NODE_ENV === 'dev') {
    withSensorStats = require('./sampleData/test_issue_0002_empty_sections.json')
  }
  // get data
  let data
  // we get data from params
  if (Object.keys(params).length) {
    data = params
  } else {
    // or use demo data
    if (adv) {
      data = withSensorStats
    } else {
      data = sampleData
    }
  }

  // images url
  if (!data.url) {
    data.url = 'cid:'
  }

  // import template
  let source = fs.readFileSync(__dirname + '/../handlebars/report/report.hbs', 'utf-8');
  if (adv) {
    source = fs.readFileSync(__dirname + '/../handlebars/report/report_adv.hbs', 'utf-8');
  }

  // compile template
  let template = Handlebars.compile(source);

  // pass data to template
  let result = template(data);

  // remove carets
  let noCarets = result.replace(/[\n\r]+/g, '');

  // convert markdown to html
  let htmlFromMarkdown = MDConverter.makeHtml(data.markdown || '')

  let withCustomBlock = noCarets.replace(/###markdown###/g, htmlFromMarkdown)

  // replace inky components
  let html = inkyToHtml(withCustomBlock)

  // load css
  const baseCss = fs.readFileSync('node_modules/foundation-emails/dist/foundation-emails.min.css', 'utf-8')

  // custom css
  const customCss = fs.readFileSync('src/assets/compiled.css', 'utf-8')


  // prepend css to html
  // html = prependCss(html, customCss)

  // inline style tag
  let res = await inlineCss(html, { url: ' '})
  return res
}

module.exports = transform


// image
// errors
