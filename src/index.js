import 'babel-polyfill';
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const service = require("./service")
const browserSync = require('browser-sync');
var os = require("os");

const isProduction = 'production' === process.env.NODE_ENV;
var hostname = os.hostname();

// cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// input data limit
app.use(bodyParser.json({limit: '4mb'}));
app.use(express.static('public'))

/**
 * Main
 * Generate Html email from data.
 */
app.post('/email', function (req, res) {

  service(req.body).then(function (result) {
    res.send(result)
  })
    .catch(function (err) {
      res.status(500).send(err.toString());
    })
});

/**
 * Stats
 * Generate Html email with stats from data.
 */
app.post('/emailstats', function (req, res) {

  service(req.body, true).then(function (result) {
    res.send(result)
  })
    .catch(function (err) {
      res.status(500).send(err.toString());
    })
});
/**
 * Alias
 * Alias for /email
 */
app.post('/', function (req, res) {

  service(req.body).then(function (result) {
    res.send(result)
  })
    .catch(function (err) {
      res.status(500).send(err.toString());
    })
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.set({
    "Content-Type": "application/health+json",
    "Cache-Control": "max-age=3600",
    "Connection": "close"
  })
  res.send(JSON.stringify({
    "status": "pass",
    "version": "v1.0.0",
    "description": "Email generation service",
    "details": {
      "container": hostname
    },
    "links": {}
  }))
})


const port = process.env.PORT || 3000
app.listen(port, listening)


function listening () {
  console.log('Server started at port:' + port + '...')
}
