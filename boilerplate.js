#! /usr/bin/env node

var async = require('async')
  , colors = require('colors')
  , exec = require('child_process').exec
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , mu = require('mu2')
  , step = {}
  , path = require('path')
  , program = require('commander')


// logging colors

colors.setTheme({
  error: [ 'red', 'underline' ],
  ok: [ 'green', 'underline' ]
})


// parse args

program
  .usage('[options] <dir>')
  .option('-n, --name <name>', 'name of the project')
  .option('-a, --assets <path>', 'path to assets')
  .parse(process.argv)

if ( ! program.name) {
  return console.error('Error'.error, 'No name specified (-n)')
}

if ( ! program.assets) {
  return console.error('Error'.error, 'No assets path specified (-a)')
}

program.dir = path.resolve(program.args[0] || process.cwd())
program.assets = path.resolve(program.dir, program.assets)

if (program.dir.indexOf(__dirname) > -1) {
  return console.error('Error'.error, 'Project root can not be set within this directory')
}


// install globals

step.globals = function(cb) {
  var globals = ['grunt-cli', 'sass', 'bower']
    , npmInstall

  npmInstall = function(module, next) {
    exec('npm install -g '+module, next)
  }

  console.info('Installing'.ok, 'global dependencies')
  async.forEachSeries(globals, npmInstall, cb)
}


// render/create files

step.files = function(cb) {
  var dir = path.join(__dirname, 'build')
    , paths = { css: 'css', js: 'js', scss: 'scss', bower: 'js/lib' }
    , renderAndMove

  Object.keys(paths).forEach(function(key) {
    paths[key] = path.join(program.assets, paths[key])+'/'
    paths[key] = path.relative(program.dir, paths[key])+'/'
  })

  renderAndMove = function(file, next) {
    var contents = []
      , data = { name: program.name, paths: paths }
      , filePath = path.join(dir, file)
      , on = {}

    on.data = function(partial) {
      contents.push(partial.toString())
    }

    on.end = function() {
      contents = contents.join('')
      filePath = path.join(program.dir, file)
      fs.writeFile(filePath, contents, next)
    }

    mu.compileAndRender(filePath, data)
      .on('data', on.data)
      .on('end', on.end)
      .on('error', next)
  }

  console.info('Writing'.ok, 'package files')
  fs.readdir(dir, function(err, files) {
    mkdirp(program.dir, function() {
      async.forEachSeries(files, renderAndMove, cb)
    })
  })
}


// install grunt dependencies

step.grunt = function(cb) {
  var cmds = [ 'npm install', 'grunt init' ]
    , run

  run = function(cmd, next) {
    exec(cmd, { cwd: program.dir }, next)
  }

  console.info('Running'.ok, 'grunt')
  async.forEachSeries(cmds, run, cb)
}


// go

async.series([ step.globals, step.files, step.grunt ])