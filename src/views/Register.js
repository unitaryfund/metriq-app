import axios from 'axios'
import React from 'react'
import config from './../config'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldValidator from '../components/FormFieldValidator'
import PasswordVisibleControlRow from '../components/PasswordVisibleControlRow'
import ErrorHandler from '../components/ErrorHandler'

const usernameMissingError = 'Username cannot be blank.'
const emailBadFormatError = 'Email is blank or invalid.'
const passwordInvalidError = 'Must be at least 12 characters long.'
const passwordMismatchError = 'Confirm does not match.'

const usernameValidRegex = /^(?!\s*$).+/
const emailValidRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordValidRegex = /.{12,}/

class Register extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      isAgreedToTerms: false,
      isPasswordMatch: true,
      isRequestFailed: false,
      requestFailedMessage: '',
      isValidated: false,
      isPasswordVisible: false
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
    this.setState({ [field]: value, isValidated: false })
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
    if (!this.state.isAgreedToTerms) {
      return false
    }

    if (!this.state.isValidated) {
      this.setState({ isValidated: true })
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
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
    event.preventDefault()
  }

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        <header><h4>Register</h4></header>
        <form onSubmit={this.handleOnSubmit}>
          <FormFieldRow
            inputName='username' inputType='text' label='Username'
            validatorMessage={usernameMissingError}
            onChange={this.handleOnChange}
            validRegex={usernameValidRegex}
          />
          <FormFieldRow
            inputName='name' inputType='text' label='Name'
            onChange={this.handleOnChange}
          />
          <FormFieldRow
            inputName='email' inputType='email' label='Email'
            validatorMessage={emailBadFormatError}
            onChange={this.handleOnChange}
            validRegex={emailValidRegex}
          />
          <FormFieldRow
            inputName='affiliation' inputType='text' label='Affiliation'
            onChange={this.handleOnChange}
          />
          <FormFieldRow
            inputName='password' inputType={this.state.isPasswordVisible ? 'text' : 'password'} label='Password'
            validatorMessage={passwordInvalidError}
            onChange={this.handleOnChangePassword}
            validRegex={passwordValidRegex}
          />
          <FormFieldRow
            inputName='passwordConfirm' inputType={this.state.isPasswordVisible ? 'text' : 'password'} label='Password Confirm'
            validatorMessage={passwordInvalidError}
            onChange={this.handleOnChangePasswordConfirm}
            validRegex={passwordValidRegex}
          />
          <PasswordVisibleControlRow
            inputName='isPasswordVisible'
            onChange={this.handleOnChange}
          />
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <input type='checkbox' onChange={(event) => this.setState({ isAgreedToTerms: event.target.checked })} />
              <b>&nbsp;I agree to the <a href='/MetriqTermsofUse' target='_blank'>Metriq Platform Terms of Use</a></b>
            </div>
            <div className='col-md-3' />
          </div>
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <FormFieldValidator invalid={!this.state.isPasswordMatch} message={passwordMismatchError} /><br />
              <FormFieldValidator invalid={!this.state.isAgreedToTerms} message='You must agree to the Metriq Terms of Use' /><br />
              <FormFieldValidator invalid={this.state.isRequestFailed} message={this.state.requestFailedMessage} />
            </div>
            <div className='col-md-3' />
          </div>
          <div className='row'>
            <div className='col-md-12 text-center'>
              <input className='btn btn-primary' type='submit' value='Submit' disabled={!this.state.isValidated && !this.isAllValid()} />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default Register
