
require.config({
  paths: { jquery: 'lib/jquery' }
})

require([ 'jquery' ], function($) {
  $(function() {
    console.log('dom ready')
  })
})
