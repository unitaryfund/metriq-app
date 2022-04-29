const config = {}

config.isDebug = true

config.api = {}
config.api.url = config.isDebug ? 'localhost:3000' : 'metriq.info'
config.api.protocol = config.isDebug ? 'http://' : 'https://'
config.api.endpoint = '/api'
config.api.serverSideUrl = 'http://localhost:8080'
config.api.getUriPrefix = () => {
  return config.api.protocol + config.api.url + config.api.endpoint
}

config.wiki = {}
config.wiki.url = 'wiki.metriq.info'
config.wiki.protocol = 'https://'
config.wiki.getUriPrefix = () => {
  return config.api.protocol + config.api.url
}

module.exports = config
