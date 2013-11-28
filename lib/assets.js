var assets = module.exports
  , mkdirp = require('mkdirp')
  , ncp = require('ncp')
  , path = require('path')


// copy the assets directory

assets.copy = function(assetsPath, cb) {
  var dir = path.join(__dirname, '../assets')

  mkdirp(assetsPath, function() {
    ncp(dir, assetsPath, cb)
  })
}