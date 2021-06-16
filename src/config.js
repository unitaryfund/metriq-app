const config = {}

config.isDebug = true

config.api = {}
config.api.url = config.isDebug ? 'localhost:8080' : 'metriq.info'
config.api.protocol = config.isDebug ? 'http://' : 'https://'
config.api.endpoint = '/api'
config.api.getUriPrefix = () => {
  return config.api.protocol + config.api.url + config.api.endpoint
}

module.exports = config
