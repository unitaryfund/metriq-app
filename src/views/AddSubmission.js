import axios from 'axios'
import React from 'react'
import config from './../config'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldValidator from '../components/FormFieldValidator'
import ErrorHandler from '../components/ErrorHandler'

const requiredFieldMissingError = 'Required field.'

const nonblankRegex = /(.|\s)*\S(.|\s)*/

class AddSubmission extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      submissionName: '',
      submissionContentUrl: '',
      submissionThumbnailUrl: '',
      description: '',
      tags: '',
      isRequestFailed: false,
      requestFailedMessage: '',
      isValidated: false
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.isAllValid = this.isAllValid.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
  }

  handleOnChange (field, value) {
    // parent class change handler is always called with field name and value
    this.setState({ [field]: value, isValidated: false })
  }

  isAllValid () {
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

    const request = {
      submissionName: this.state.submissionName,
      submissionContentUrl: this.state.submissionContentUrl,
      submissionThumbnailUrl: this.state.submissionThumbnailUrl,
      description: this.state.description,
      tags: this.state.tags
    }

    axios.post(config.api.getUriPrefix() + '/submission', request)
      .then(res => {
        window.location = '/Submissions'
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
    event.preventDefault()
  }

  render () {
    return (
      <div className='container'>
        <header>Add Submission</header>
        <form onSubmit={this.handleOnSubmit}>
          <FormFieldRow
            inputName='submissionName' inputType='text' label='Submission Name'
            validatorMessage={requiredFieldMissingError}
            onChange={this.handleOnChange}
            validRegex={nonblankRegex}
          />
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <b>The submission name must be unique.</b>
            </div>
            <div className='col-md-3' />
          </div>
          <FormFieldRow
            inputName='submissionContentUrl' inputType='text' label='Content URL'
            validatorMessage={requiredFieldMissingError}
            onChange={this.handleOnChange}
            validRegex={nonblankRegex}
          />
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <b>The external content URL points to the full content of the submission.<br />(This could be a link to arXiv, for example.)<br /><i>This cannot be changed after hitting "Submit."</i></b>
            </div>
            <div className='col-md-3' />
          </div>
          <FormFieldRow
            inputName='submissionThumbnailUrl' inputType='text' label='Image URL'
            onChange={this.handleOnChange}
          />
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <b>The external image URL points to an image loaded as a thumbnail, for the submission.<br /><i>This cannot be changed after hitting "Submit."</i></b>
            </div>
            <div className='col-md-3' />
          </div>
          <FormFieldRow
            inputName='description' inputType='textarea' label='Description'
            onChange={this.handleOnChange}
          />
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <b>We encourage using an abstract, for the submission description.</b>
            </div>
            <div className='col-md-3' />
          </div>
          <FormFieldRow
            inputName='tags' inputType='text' label='Tags'
            onChange={this.handleOnChange}
          />
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <b>"Tags" are a comma-separated list of descriptive labels.<br />(Tags can contain spaces.)</b>
            </div>
            <div className='col-md-3' />
          </div>
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
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

export default AddSubmission
