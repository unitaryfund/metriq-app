import axios from 'axios'
import React from 'react'
import config from './../config'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldValidator from '../components/FormFieldValidator'

const usernameMissingError = 'Username cannot be blank.'
const emailBadFormatError = 'Email is blank or invalid.'
const passwordInvalidError = 'Password is too short.'
const passwordMismatchError = 'Confirm does not match.'

const usernameValidRegex = /^(?!\s*$).+/
const emailValidRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordValidRegex = /.{8,}/

class Register extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      isPasswordMatch: true,
      isRequestFailed: false,
      requestFailedMessage: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnChangePassword = this.handleOnChangePassword.bind(this)
    this.handleOnChangePasswordConfirm = this.handleOnChangePasswordConfirm.bind(this)
    this.isPasswordMatch = this.isPasswordMatch.bind(this)
    this.isAllValid = this.isAllValid.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  handleOnChange (field, value) {
    // parent class change handler is always called with field name and value
    this.setState({ [field]: value })
  }

  handleOnChangePassword (field, value) {
    // parent class change handler is always called with field name and value
    this.handleOnChange(field, value)
    this.setState({ isPasswordMatch: this.isPasswordMatch(value, this.state.passwordConfirm) })
  }

  handleOnChangePasswordConfirm (field, value) {
    // parent class change handler is always called with field name and value
    this.handleOnChange(field, value)
    this.setState({ isPasswordMatch: this.isPasswordMatch(this.state.password, value) })
  }

  isPasswordMatch (password, passwordConfirm) {
    return !passwordValidRegex.test(password) || (password === passwordConfirm)
  }

  isAllValid () {
    if (!usernameValidRegex.test(this.state.username)) {
      return false
    }
    if (!emailValidRegex.test(this.state.email)) {
      return false
    }
    if (!passwordValidRegex.test(this.state.password)) {
      return false
    }
    if (!passwordValidRegex.test(this.state.passwordConfirm)) {
      return false
    }
    if (!this.isPasswordMatch()) {
      return false
    }

    return true
  }

  handleOnSubmit (event) {
    if (!this.isAllValid()) {
      event.preventDefault()
      return
    }

    axios.post(config.api.getUriPrefix() + '/register', this.state)
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
        <header>Test - Register</header>
        <form onSubmit={this.handleOnSubmit}>
          <FormFieldRow
            inputName='username' inputType='text' label='Username'
            validatorMessage={usernameMissingError}
            onChange={this.handleOnChange}
            validRegex={usernameValidRegex}
          />
          <FormFieldRow
            inputName='email' inputType='email' label='Email'
            validatorMessage={emailBadFormatError}
            onChange={this.handleOnChange}
            validRegex={emailValidRegex}
          />
          <FormFieldRow
            inputName='password' inputType='password' label='Password'
            validatorMessage={passwordInvalidError}
            onChange={this.handleOnChangePassword}
            validRegex={passwordValidRegex}
          />
          <FormFieldRow
            inputName='passwordConfirm' inputType='password' label='Password Confirm'
            validatorMessage={passwordInvalidError}
            onChange={this.handleOnChangePasswordConfirm}
            validRegex={passwordValidRegex}
          />
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <FormFieldValidator invalid={!this.state.isPasswordMatch} message={passwordMismatchError} /><br />
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
      </div>
    )
  }
}

export default Register
