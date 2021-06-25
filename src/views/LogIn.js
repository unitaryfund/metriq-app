import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import config from './../config'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldValidator from '../components/FormFieldValidator'

const usernameMissingError = 'Username cannot be blank.'
const passwordInvalidError = 'Password is too short.'
const usernamePasswordMismatchError = 'Could not log in. Please check that username and password are correct'

const usernameValidRegex = /^(?!\s*$).+/
const passwordValidRegex = /.{8,}/

class LogIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      isUsernamePasswordMatch: true,
      isRequestFailed: false,
      requestFailedMessage: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.isUsernamePasswordMatch = this.isUsernamePasswordMatch.bind(this)
    this.isAllValid = this.isAllValid.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  handleOnChange (field, value) {
    // parent class change handler is always called with field name and value
    this.setState({ [field]: value })
  }

  isUsernamePasswordMatch () {
    // TODO: https://github.com/unitaryfund/metriq-api/issues/9
    // Call to DB to see if this.state.username and
    // this.state.password match.
  }

  isAllValid () {
    if (!usernameValidRegex.test(this.state.username)) {
      return false
    }
    if (!passwordValidRegex.test(this.state.password)) {
      return false
    }

    return true
  }

  handleOnSubmit (event) {
    if (!this.isAllValid()) {
      event.preventDefault()
      return
    }

    const request = {
      username: this.state.username,
      password: this.state.password
    }

    axios.post(config.api.getUriPrefix() + '/login', request)
      .then(res => {
        this.props.onLogin()
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: err ? (err.message ? err.message : err) : 'Could not reach server.' })
      })
    event.preventDefault()
  }

  render () {
    return (
      <div className='container'>
        <header>Test - LogIn</header>
        <form onSubmit={this.handleOnSubmit}>
          <FormFieldRow
            inputName='username' inputType='text' label='Username'
            validatorMessage={usernameMissingError}
            onChange={this.handleOnChange}
            validRegex={usernameValidRegex}
          />
          <FormFieldRow
            inputName='password' inputType='password' label='Password'
            validatorMessage={passwordInvalidError}
            onChange={this.handleOnChange}
            validRegex={passwordValidRegex}
          />
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <FormFieldValidator invalid={!this.state.isUsernamePasswordMatch} message={usernamePasswordMismatchError} /><br />
              <FormFieldValidator invalid={this.state.isRequestFailed} message={this.state.requestFailedMessage} />
            </div>
            <div className='col-md-3' />
          </div>
          <div className='row'>
            <div className='col-md-12 text-center'>
              <input className='btn btn-primary' type='submit' value='Submit' />
            </div>
          </div>
        </form>
        <Link to='/Register'>Create a new account</Link>
      </div>
    )
  }
}

export default LogIn
