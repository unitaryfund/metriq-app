import axios from 'axios'
import React from 'react'
import config from '../config'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldValidator from '../components/FormFieldValidator'
import ErrorHandler from '../components/ErrorHandler'
import PasswordVisibleControlRow from '../components/PasswordVisibleControlRow'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import FormFieldWideRow from '../components/FormFieldWideRow'
import ViewHeader from '../components/ViewHeader'

const passwordInvalidError = 'Password is too short.'
const passwordMismatchError = 'Confirm does not match.'
const passwordRequiredError = 'Required'

const passwordValidRegex = /.{12,}/

class Password extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isPasswordVisible: false,
      oldPassword: '',
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
    if (!this.state.oldPassword) {
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
      oldPassword: this.state.oldPassword,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm
    }

    axios.post(config.api.getUriPrefix() + '/user/password', request)
      .then(res => {
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
        <ViewHeader>Change Password</ViewHeader>
        <form onSubmit={this.handleOnSubmit}>
          <FormFieldAlertRow>
            <b>Enter your current password below, then enter and confirm your new password.</b><br />
          </FormFieldAlertRow>
          <FormFieldRow
            inputName='oldPassword' inputType={this.state.isPasswordVisible ? 'text' : 'password'} label='Current Password'
            validatorMessage={passwordRequiredError}
            onChange={this.handleOnChange}
            validRegex={passwordValidRegex}
          />
          <FormFieldRow
            inputName='password' inputType={this.state.isPasswordVisible ? 'text' : 'password'} label='New Password'
            validatorMessage={passwordInvalidError}
            onChange={this.handleOnChangePassword}
            validRegex={passwordValidRegex}
          />
          <FormFieldRow
            inputName='passwordConfirm' inputType={this.state.isPasswordVisible ? 'text' : 'password'} label='New Password Confirm'
            validatorMessage={passwordInvalidError}
            onChange={this.handleOnChangePasswordConfirm}
            validRegex={passwordValidRegex}
          />
          <PasswordVisibleControlRow
            inputName='isPasswordVisible'
            onChange={this.handleOnChange}
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

export default Password
