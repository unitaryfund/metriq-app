import axios from 'axios'
import React from 'react'
import config from '../config'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldWideRow from '../components/FormFieldWideRow'
import ErrorHandler from '../components/ErrorHandler'

const emailValidRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class EditDetails extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRequestFailed: false,
      requestFailedMessage: '',
      newAffiliation: '',
      newEmail: '',
      newName: '',
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
    return true
  }

  handleOnSubmit (event) {
    if (!this.isAllValid()) {
      event.preventDefault()
      return
    }

    const request = {
      email: this.state.newEmail,
      affiliation: this.state.newAffiliation,
      name: this.state.newName
    }

    axios.post(config.api.getUriPrefix() + '/user', request)
      .then(res => {
        this.props.history.push('/')
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
    event.preventDefault()
  }

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        <header><h4>Edit Details</h4></header>
        <form onSubmit={this.handleOnSubmit}>
          <FormFieldRow
            inputName='newName' inputType='text' label='Name'
            onChange={this.handleOnChange}
          />
          <FormFieldRow
            inputName='newEmail' inputType='text' label='Email'
            onChange={this.handleOnChange}
            validRegex={emailValidRegex}
          />
          <FormFieldRow
            inputName='newAffiliation' inputType='text' label='Affiliation'
            onChange={this.handleOnChange}
          />
          <FormFieldWideRow className='text-center'>
            <input className='btn btn-primary' type='submit' value='Submit' />
          </FormFieldWideRow>
        </form>
      </div>
    )
  }
}

export default EditDetails
