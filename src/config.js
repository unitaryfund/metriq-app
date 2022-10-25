const config = {}

config.isDebug = false

config.api = {}
config.api.url = config.isDebug ? 'localhost:3000' : 'metriq.info'
config.api.protocol = config.isDebug ? 'http://' : 'https://'
config.api.endpoint = '/api'
config.api.serverSideUrl = 'http://localhost:8080'
config.api.getUriPrefix = () => {
  return config.api.protocol + config.api.url + config.api.endpoint
}

config.web = {}
config.web.url = config.isDebug ? 'localhost:3000' : 'metriq.info'
config.web.protocol = config.isDebug ? 'http://' : 'https://'
config.web.endpoint = ''
config.web.serverSideUrl = 'http://localhost:8080'
config.web.getUriPrefix = () => {
  return config.web.protocol + config.web.url + config.web.endpoint
}

module.exports = config
