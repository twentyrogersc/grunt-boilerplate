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

    watch: {
      sass: {
        files: [config.sass+'*.scss'],
        tasks: ['sass:dev']
      }
    }

  })

  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['watch'])
  grunt.registerTask('production', ['sass:production'])

}