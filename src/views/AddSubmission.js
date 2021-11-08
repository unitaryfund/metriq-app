import axios from 'axios'
import React from 'react'
import config from './../config'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import FormFieldValidator from '../components/FormFieldValidator'
import ErrorHandler from '../components/ErrorHandler'

const requiredFieldMissingError = 'Required field.'

const nonblankRegex = /(.|\s)*\S(.|\s)*/

class AddSubmission extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      contentUrl: '',
      thumbnailUrl: '',
      description: '',
      tags: '',
      tagNames: [],
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
      name: this.state.name,
      contentUrl: this.state.contentUrl,
      thumbnailUrl: this.state.thumbnailUrl,
      description: this.state.description,
      tags: this.state.tags
    }

    axios.post(config.api.getUriPrefix() + '/submission', request)
      .then(res => {
        window.location.href = '/Submissions'
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
    event.preventDefault()
  }

  componentDidMount () {
    const tagNamesRoute = config.api.getUriPrefix() + '/tag/names'
    axios.get(tagNamesRoute)
      .then(res => {
        const tags = [...res.data.data]
        this.setState({ isRequestFailed: false, requestFailedMessage: '', tagNames: tags })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        <header>Add Submission</header>
        <form onSubmit={this.handleOnSubmit}>
          <FormFieldRow
            inputName='name' inputType='text' label='Submission Name'
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
            inputName='contentUrl' inputType='text' label='Content URL'
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
            inputName='thumbnailUrl' inputType='text' label='Image URL' imageUrl
            onChange={this.handleOnChange}
          />
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <b>The image URL is loaded as a thumbnail, for the submission.<br />(For free image hosting, see <a href='https://imgbb.com/' target='_blank' rel='noreferrer'>https://imgbb.com/</a>, for example.)<br /><i>This cannot be changed after hitting "Submit."</i></b>
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
          <FormFieldTypeaheadRow
            inputName='tag' label='Tags'
            onChange={this.handleOnChange}
            options={this.state.tagNames.map(item => item.name)}
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
