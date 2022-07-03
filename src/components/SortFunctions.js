function sortCommon (a, b) {
  const keyA = parseInt(a.submissionCount)
  const keyB = parseInt(b.submissionCount)
  if (keyA < keyB) {
    return 1
  }
  if (keyB < keyA) {
    return -1
  }
  const key2A = a.name
  const key2B = b.name
  if (key2A < key2B) {
    return -1
  }
  if (key2B < key2A) {
    return 1
  }
  return 0
}

function sortPopular (a, b) {
  const keyA = parseInt(a.upvoteTotal)
  const keyB = parseInt(b.upvoteTotal)
  if (keyA < keyB) {
    return 1
  }
  if (keyB < keyA) {
    return -1
  }
  const key2A = a.name
  const key2B = b.name
  if (key2A < key2B) {
    return -1
  }
  if (key2B < key2A) {
    return 1
  }
  return 0
}

function sortAlphabetical (a, b) {
  const keyA = a.name.toLowerCase()
  const keyB = b.name.toLowerCase()
  if (keyA < keyB) {
    return -1
  }
  if (keyB < keyA) {
    return 1
  }
  return 0
}

module.exports = {
  sortCommon: sortCommon,
  sortPopular: sortPopular,
  sortAlphabetical: sortAlphabetical
}
