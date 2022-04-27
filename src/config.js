const config = {}

config.isDebug = true

config.api = {}
config.api.url = config.isDebug ? 'qa.metriq.info' : 'metriq.info'
config.api.protocol = config.isDebug ? 'http://' : 'https://'
config.api.endpoint = '/api'
config.api.serverSideUrl = 'http://localhost:8080'
config.api.getUriPrefix = () => {
  return config.api.protocol + config.api.url + config.api.endpoint
}

config.wiki = {}
config.wiki.url = config.isDebug ? 'qa-wiki.metriq.info' : 'wiki.metriq.info'
config.wiki.protocol = config.isDebug ? 'http://' : 'https://'
config.wiki.getUriPrefix = () => {
  return config.wiki.protocol + config.wiki.url
}

module.exports = config
