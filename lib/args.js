var args = module.exports
  , path = require('path')
  , program = require('commander')


// avilable command line options

program
  .usage('[options] <dir>')
  .option('-n, --name <name>', 'name of the project')
  .option('-a, --assets <path>', 'path to assets')


// parse the arguments

args.parse = function(argv, cb) {
  program.parse(argv)

  if ( ! program.name) {
    return cb('No name specified (-n)')
  }

  if ( ! program.assets) {
    return cb('No assets path specified (-a)')
  }

  program.dir = path.resolve(program.args[0] || process.cwd())
  program.assets = path.resolve(program.dir, program.assets)

  if (program.dir.indexOf(__dirname) > -1) {
    return cb('Project root can not be set within this directory')
  }

  cb(null, program)
}