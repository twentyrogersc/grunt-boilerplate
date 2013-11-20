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
        src: '*.scss',
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
        src: config.bower+'*',
        filter: 'isDirectory'
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
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['bower:update', 'watch'])
  grunt.registerTask('bower:update', ['bower:install', 'uglify:bower', 'clean:bower'])
  grunt.registerTask('production', ['bower:update', 'sass:production'])
}