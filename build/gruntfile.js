var bourbon = require('node-bourbon')
  , path = require('path')

module.exports = function(grunt) {

  grunt.initConfig({

    mkdir: {
      init: {
        options: {
          create: [
            '{{ paths.css }}',
            '{{ paths.scss }}',
            '{{ paths.bower }}'
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
        cwd: '{{ paths.scss }}',
        src: '*.scss',
        dest: '{{ paths.css }}',
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
        cwd: '{{ paths.scss }}',
        src: '*.scss',
        dest: '{{ paths.css }}',
        ext: '.css'
      }
    },

    bower: {
      install: {
        options: {
          cleanup: true,
          targetDir: '{{ paths.bower }}'
        }
      }
    },

    copy: {
      bower: {
        files: [{
          expand: true,
          flatten: true,
          src: '{{ paths.bower }}**',
          dest: '{{ paths.bower }}',
          filter: 'isFile'
        }]
      }
    },

    clean: {
      bower: {
        src: '{{ paths.bower }}*',
        filter: 'isDirectory'
      }
    },

    requirejs: {
      production: {
        options: {
          name: 'app',
          baseUrl: '{{ paths.js }}',
          mainConfigFile: '{{ paths.js }}app.js',
          out: '{{ paths.js }}app.min.js'
        }
      }
    },

    watch: {
      sass: {
        files: ['{{ paths.scss }}*.scss'],
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
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-requirejs')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['init', 'sass:dev', 'watch'])
  grunt.registerTask('init', ['mkdir:init', 'bower:update', 'sass:dev'])
  grunt.registerTask('bower:update', ['bower:install', 'copy:bower', 'clean:bower'])
  grunt.registerTask('production', ['bower:update', 'requirejs:production', 'sass:production'])
}