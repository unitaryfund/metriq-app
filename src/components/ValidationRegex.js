const dateRegex = /^\d{4}-\d{2}-\d{2}$/
const intRegex = /^([+-]?[1-9]\d*|0)$/
const metricValueRegex = /(^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$)|([+-]?\d(\.\d+)?[Ee][+-]?\d+)/
const nonblankRegex = /(.|\s)*\S(.|\s)*/
const numberRegex = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/
const passwordValidRegex = /.{12,}/
const standardErrorRegex = /^[0-9]+([.][0-9]*)?|[.][0-9]+$/
const numeralRegex = /^[0-9]+$/
const urlValidRegex = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
const blankOrurlValidRegex = new RegExp('^$|(^(^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$)$)', 'i') // fragment locator
const usernameValidRegex = /^(?!\s*$).+/

module.exports = {
  dateRegex,
  intRegex,
  metricValueRegex,
  nonblankRegex,
  numberRegex,
  passwordValidRegex,
  standardErrorRegex,
  numeralRegex,
  urlValidRegex,
  blankOrurlValidRegex,
  usernameValidRegex
}
