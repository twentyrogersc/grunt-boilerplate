var async = require('async')
  , exec = require('child_process').exec
  , install = module.exports
  , run


// run an array of commands in series

run = function(cmds, dir, cb) {
  async.forEachSeries(
    cmds,
    function(cmd, next) {
      exec(cmd, { cwd: dir }, next)
    },
    cb
  )
}


// install the required global npm modules

install.globals = function(cb) {
  var globals = ['grunt-cli', 'sass', 'bower']

  globals.forEach(function(pkg, key) {
    globals[key] = 'npm install -g '+pkg
  })

  run(globals, '.', cb)
}


// install dependencies for the grunt project

install.grunt = function(dir, cb) {
  var cmds = ['npm install', 'grunt init']
  run(cmds, dir, cb)
}