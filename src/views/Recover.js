import axios from 'axios'
import React from 'react'
import config from './../config'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldValidator from '../components/FormFieldValidator'
import ErrorHandler from '../components/ErrorHandler'

const usernameMissingError = 'Username cannot be blank.'
const passwordInvalidError = 'Password is too short.'
const passwordMismatchError = 'Confirm does not match.'

const usernameValidRegex = /^(?!\s*$).+/
const passwordValidRegex = /.{12,}/

class Recover extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: this.props.match.params.username,
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

    const request = {
      username: this.state.username,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      uuid: this.props.match.params.uuid
    }

    axios.post(config.api.getUriPrefix() + '/password', request)
      .then(res => {
        this.props.onLogin()
        window.location.href = '/'
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
    event.preventDefault()
  }

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        <header><h4>Account Recovery</h4></header>
        <form onSubmit={this.handleOnSubmit}>
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <span><b>You can log in with either your username or email for your account, with your password.</b></span><br />
            </div>
            <div className='col-md-3' />
          </div>
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <span><b>If you have forgotten your password,</b> enter either your username or account email below, and your new password. If your account recovery link is valid, your password will be changed, and you will be redirected to the homepage.</span><br />
            </div>
            <div className='col-md-3' />
          </div>
          <FormFieldRow
            inputName='username' inputType='text' label='Username'
            defaultValue={this.props.match.params.username}
            validatorMessage={usernameMissingError}
            onChange={this.handleOnChange}
            validRegex={usernameValidRegex}
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
              <FormFieldValidator invalid={!this.state.isPasswordMatch} message={passwordMismatchError} /> <br />
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

export default Recover
