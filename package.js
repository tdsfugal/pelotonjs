Package.describe({
  name: 'fugality:peloton',
  version: '0.2.0',
  summary: 'Stream-based Physics library for animating Cycle.JS apps. Uses Most.js',
  git: '',
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.4.1')
  api.use('ecmascript','client')

  api.mainModule('client/peloton.js', 'client')
})
