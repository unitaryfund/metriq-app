import axios from 'axios'
import React from 'react'
import config from './../config'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldValidator from '../components/FormFieldValidator'

const usernameMissingError = 'Username cannot be blank.'
const usernameValidRegex = /^(?!\s*$).+/

class Forgot extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username_email: '',
      password: '',
      isUsernamePasswordMatch: true,
      isRequestFailed: false,
      requestFailedMessage: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.isAllValid = this.isAllValid.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  handleOnChange (field, value) {
    // parent class change handler is always called with field name and value
    this.setState({ [field]: value })
  }

  isAllValid () {
    if (!usernameValidRegex.test(this.state.username)) {
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
      username_email: this.state.username_email
    }

    axios.post(config.api.getUriPrefix() + '/recover', request)
      .then(res => {
        // TODO
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: err ? (err.message ? err.message : err) : 'Could not reach server.' })
      })
    event.preventDefault()
  }

  render () {
    return (
      <div className='container'>
        <header>Account Recovery</header>
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
              <span><b>If you have forgotten your password,</b> enter either your username or account email below, and we will send a password recovery link to the associated account email, if it exists.</span><br />
            </div>
            <div className='col-md-3' />
          </div>
          <FormFieldRow
            inputName='username_email' inputType='text' label='Username/Email'
            validatorMessage={usernameMissingError}
            onChange={this.handleOnChange}
            validRegex={usernameValidRegex}
          />
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
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

export default Forgot
