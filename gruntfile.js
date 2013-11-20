var config = require('./grunt.json')
  , path = require('path')

module.exports = function(grunt) {

  Object.keys(config).forEach(function(key) {
    config[key] = path.resolve(config[key])+'/'
  })

  grunt.initConfig({

    sass: {
      production: {
        options: { style: 'compressed' },
        expand: true,
        cwd: config.sass,
        src: ['*.scss'],
        dest: config.css,
        ext: '.css'
      },
      dev: {
        options: {
          debugInfo: true,
          lineNumbers: true,
          style: 'nested'
        },
        expand: true,
        cwd: config.sass,
        src: ['*.scss'],
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

    watch: {
      sass: {
        files: [config.sass+'*.scss'],
        tasks: ['sass:dev']
      }
    }

  })

  grunt.loadNpmTasks('grunt-bower-task')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['bower:install', 'watch'])
  grunt.registerTask('production', ['bower:install', 'sass:production'])
}