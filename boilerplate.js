#! /usr/bin/env node

var args = require('./lib/args')
  , assets = require('./lib/assets')
  , async = require('async')
  , colors = require('colors')
  , files = require('./lib/files')
  , install = require('./lib/install')

// logging colors

colors.setTheme({
  error: [ 'red', 'underline' ],
  ok: [ 'green', 'underline' ]
})


// go

args.parse(process.argv, function(err, config) {
  if (err) return console.error('Error'.error, err)

  async.series([
    function(next) {
      console.info('Installing'.ok, 'global dependencies')
      install.globals(next)
    },
    function(next) {
      console.info('Writing'.ok, 'package files')
      files.render(config, next)
    },
    function(next) {
      console.info('Writing'.ok, 'asset files')
      assets.copy(config.assets, next)
    },
    function(next) {
      console.info('Running'.ok, 'grunt')
      install.grunt(config.dir, next)
    }
  ])
})