var async = require('async')
  , files = module.exports
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , mu = require('mu2')
  , path = require('path')


files.render = function(config, cb) {
  var dir = path.join(__dirname, '../build')
    , paths = { css: 'css', js: 'js', scss: 'scss', bower: 'js/lib' }
    , renderAndMove

  Object.keys(paths).forEach(function(key) {
    paths[key] = path.join(config.assets, paths[key])+'/'
    paths[key] = path.relative(config.dir, paths[key])+'/'
  })

  renderAndMove = function(file, next) {
    var contents = []
      , data = { name: config.name, paths: paths }
      , filePath = path.join(dir, file)
      , on = {}

    on.data = function(partial) {
      contents.push(partial.toString())
    }

    on.end = function() {
      contents = contents.join('')
      filePath = path.join(config.dir, file)
      fs.writeFile(filePath, contents, next)
    }

    mu.compileAndRender(filePath, data)
      .on('data', on.data)
      .on('end', on.end)
      .on('error', next)
  }

  fs.readdir(dir, function(err, files) {
    mkdirp(config.dir, function() {
      async.forEachSeries(files, renderAndMove, cb)
    })
  })
}