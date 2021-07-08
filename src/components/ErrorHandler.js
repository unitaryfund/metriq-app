function ErrorHandler (error) {
  if (!error || !error.response) {
    return 'Something went wrong.'
  }
  if (error.response.status === 400) {
    console.log(error)
    if (error.response.data.message) {
      return 'Bad request: ' + error.response.data.message
    }
    return 'Bad request.'
  }
  if (error.response.status === 401) {
    return 'Unauthorized.'
  }
  if (error.response.status === 404) {
    return 'Not found.'
  }
  if (error.response.status === 500) {
    return 'Could not reach server.'
  }
  return error.response.data.message ? error.response.data.message : 'Something went wrong.'
}

export default ErrorHandler
