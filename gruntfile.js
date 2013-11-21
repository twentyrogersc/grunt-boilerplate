var bourbon = require('node-bourbon')
  , config = {}
  , path = require('path')

module.exports = function(grunt) {

  config.assets = 'app'
  config.css = config.assets+'/css'
  config.sass = config.assets+'/scss'
  config.js = config.assets+'/js'
  config.bower = config.js+'/lib'


  grunt.initConfig({

    mkdir: {
      init: {
        options: {
          create: [
            config.css,
            config.sass,
            config.bower
          ]
        },
      },
    },

    sass: {
      production: {
        options: {
          loadPath: bourbon.includePaths,
          style: 'compressed'
        },
        expand: true,
        cwd: config.sass,
        src: '*.scss',
        dest: config.css,
        ext: '.css'
      },
      dev: {
        options: {
          debugInfo: true,
          lineNumbers: true,
          loadPath: bourbon.includePaths,
          style: 'nested'
        },
        expand: true,
        cwd: config.sass,
        src: '*.scss',
        dest: config.css,
        ext: '.css'
      }
    },

    bower: {
      install: {
        options: {
          cleanup: true,
          targetDir: config.bower
        }
      }
    },

    uglify: {
      bower: {
        files: [{
          expand: true,
          cwd: config.bower,
          src: '**/*.js',
          rename: function(dest, src) {
            src = path.basename(src)
            return path.join(config.bower, src)
          }
        }]
      }
    },

    clean: {
      bower: {
        src: config.bower+'/*',
        filter: 'isDirectory'
      }
    },

    watch: {
      sass: {
        files: [config.sass+'/*.scss'],
        tasks: ['sass:dev']
      },
      bower: {
        files: ['bower.json'],
        tasks: ['bower:update']
      }
    }

  })

  grunt.loadNpmTasks('grunt-bower-task')
  grunt.loadNpmTasks('grunt-mkdir')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['init', 'sass:dev', 'watch'])
  grunt.registerTask('init', ['mkdir:init', 'bower:update'])
  grunt.registerTask('bower:update', ['bower:install', 'uglify:bower', 'clean:bower'])
  grunt.registerTask('production', ['bower:update', 'sass:production'])
}