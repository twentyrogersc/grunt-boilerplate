# grunt-boilerplate

## Installation
```sh
$ npm install -g grunt-cli && npm install -g sass && npm install -g bower && npm install
$ cp grunt.json.dist grunt.json # edit config as below
```

## Config
```json
{
  "css": "path/to/compiled/scss/files",
  "sass": "path/to/scss/files",
  "bower": "path/to/place/js/libraries"
}
```

## Run
```sh
$ grunt # install bower libraries/watch scss
$ grunt production # compile/minify assets
```