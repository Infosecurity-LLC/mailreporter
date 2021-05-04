// Helps with this problem:
// http://stackoverflow.com/questions/8059914/express-js-hbs-module-register-partials-from-hbs-file

import { mdToHtml } from './mdToHtml'
import _ from 'lodash'
import { isRowsHaveAllNullRightValues, isRowsInBlocksHaveAllNullRightValues } from './blocksNullCheck'
var hbs = require('handlebars');
var fs = require('fs');
var helpers = require('handlebars-helpers')();
var partialsDir = __dirname + '/../handlebars/partials';

var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});


var layoutsDir = __dirname + '/../handlebars/layouts';
var layoutsfilenames = fs.readdirSync(layoutsDir);

layoutsfilenames.forEach(function (filename) {
  let matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  let name = matches[1];
  let template = fs.readFileSync(layoutsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

/**
 * Custome handlebars helpers
 */
hbs.registerHelper('markd', function(object) {
  let markdownString = hbs.escapeExpression(object)
  let res = mdToHtml(markdownString)
  return res
});


hbs.registerHelper('rowscheck', function(rowsArray) {
  let rowsCheckResult = isRowsHaveAllNullRightValues(rowsArray)
  return rowsCheckResult
});

hbs.registerHelper('blocksrowscheck', function(blocksArray) {
  let blocksCheckResult = isRowsInBlocksHaveAllNullRightValues(blocksArray)
  return blocksCheckResult
});
