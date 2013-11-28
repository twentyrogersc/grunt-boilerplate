var async = require('async')
  , files = module.exports
  , fs = require('fs')
  , handlebars = require('handlebars')
  , merge = {}
  , mkdirp = require('mkdirp')
  , move
  , path = require('path')
  , render


// copy, render and save each file

render = function(templatePath, newPath, data, cb) {
  var fileName = path.basename(templatePath)
    , mergeF = merge[fileName]
    , template = null

  fs.readFile(templatePath, 'utf8', function(err, contents) {
    template = handlebars.compile(contents)
    contents = template(data)

    fs.readFile(newPath, 'utf8', function(err, original) {
      if (original && mergeF) contents = mergeF(original, contents)
      fs.writeFile(newPath, contents, cb)
    })
  })
}


// merge objects just by the keys specified, return json string

merge.object = function(original, replace, keys) {
  keys = Array.isArray(keys) ? keys : [keys]
  original = JSON.parse(original)
  replace = JSON.parse(replace)

  keys.forEach(function(key) {
    original[key] = original[key] || {}
    Object.keys(replace[key]).forEach(function(child) {
      original[key][child] = replace[key][child]
    })
  })

  return JSON.stringify(original, null, 2)
}


// add any additional rules to the end of the original

merge['.gitignore'] = function(original, replace) {
  original = original.split('\n')
  replace = replace.split('\n')

  replace.forEach(function(ignore, key) {
    var index = original.indexOf(ignore)
    if (index > -1) replace.splice(key, 1)
  })

  original = original.join('\n')
  replace = replace.join('\n')
  return original+'\n\n'+replace
}


// merge any dependencies and overrides for bower

merge['bower.json'] = function(original, replace) {
  var keys = ['dependencies', 'exportsOverride']
  return merge.object(original, replace, keys)
}


// merge any dev dev dependencies for node.js

merge['package.json'] = function(original, replace) {
  return merge.object(original, replace, 'devDependencies')
}


// if there is a readme, leave the original

merge['readme.md'] = function(original) {
  return original
}


// iterate through files and render each

files.render = function(config, cb) {
  var build = path.join(__dirname, '../build')
    , data = { name: config.name }

  data.paths = { css: 'css', js: 'js', scss: 'scss', bower: 'js/lib' }
  Object.keys(data.paths).forEach(function(key) {
    data.paths[key] = path.join(config.assets, data.paths[key])+'/'
    data.paths[key] = path.relative(config.dir, data.paths[key])+'/'
  })

  mkdirp(config.dir, function() {
    fs.readdir(build, function(err, files) {
      async.each(files, function(file, next) {
        var buildPath = path.join(build, file)
          , newPath = path.join(config.dir, file)

        render(buildPath, newPath, data, next)
      }, cb)
    })
  })
}