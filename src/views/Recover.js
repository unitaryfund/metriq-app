import axios from 'axios'
import React from 'react'
import config from './../config'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldValidator from '../components/FormFieldValidator'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import FormFieldWideRow from '../components/FormFieldWideRow'
import ViewHeader from '../components/ViewHeader'

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
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })
    event.preventDefault()
  }

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        <ViewHeader>Account Recovery</ViewHeader>
        <form onSubmit={this.handleOnSubmit}>
          <FormFieldAlertRow>
            <b>You can log in with either your username or email for your account, with your password.</b><br />
          </FormFieldAlertRow>
          <FormFieldAlertRow>
            <b>If you have forgotten your password,</b> enter either your username or account email below, and your new password. If your account recovery link is valid, your password will be changed, and you will be redirected to the homepage.<br />
          </FormFieldAlertRow>
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

          <FormFieldAlertRow>
            <FormFieldValidator invalid={!this.state.isPasswordMatch} message={passwordMismatchError} /> <br />
            <FormFieldValidator invalid={!!this.state.requestFailedMessage} message={this.state.requestFailedMessage} />
          </FormFieldAlertRow>
          <FormFieldWideRow className='text-center'>
            <input className='btn btn-primary' type='submit' value='Submit' />
          </FormFieldWideRow>
        </form>
      </div>
    )
  }
}

export default Recover
