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

    uglify: {
      bower: {
        files: [{
          expand: true,
          cwd: '{{ paths.bower }}',
          src: '**/*.js',
          rename: function(dest, src) {
            src = path.basename(src)
            return path.join('{{ paths.bower }}', src)
          }
        }]
      }
    },

    clean: {
      bower: {
        src: '{{ paths.bower }}*',
        filter: 'isDirectory'
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
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['init', 'sass:dev', 'watch'])
  grunt.registerTask('init', ['mkdir:init', 'bower:update'])
  grunt.registerTask('bower:update', ['bower:install', 'uglify:bower', 'clean:bower'])
  grunt.registerTask('production', ['bower:update', 'sass:production'])
}