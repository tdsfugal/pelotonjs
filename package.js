Package.describe({
  name: 'fugality:peloton',
  version: '0.0.1',
  summary: 'Stream-based Physics utilities for Cycle.JS',
  git: '',
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.4.1')
  api.use('ecmascript','client')

  api.mainModule('client/peloton.js', 'client')
})

Package.onTest(function(api) {
  api.use('ecmascript','client')
  api.use('tinytest','client')
  api.use('peloton','client')
  api.mainModule('peloton-tests.js')
})
