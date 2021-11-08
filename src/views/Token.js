import axios from 'axios'
import React from 'react'
import config from './../config'
import FormFieldValidator from '../components/FormFieldValidator'
import ErrorHandler from '../components/ErrorHandler'

const isActiveTokenPrefix = 'You have an active API token, created '
const isNoTokenMessage = 'You do not have an active token.'

class Token extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {},
      isRequestFailed: false,
      requestFailedMessage: '',
      isGeneratedSuccess: false,
      token: ''
    }

    this.handleGenerateOnClick = this.handleGenerateOnClick.bind(this)
    this.handleDeleteOnClick = this.handleDeleteOnClick.bind(this)
  }

  componentDidMount () {
    axios.get(config.api.getUriPrefix() + '/user')
      .then(res => {
        this.setState({
          data: res.data.data,
          isRequestFailed: false,
          requestFailedMessage: ''
        })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  handleGenerateOnClick () {
    axios.post(config.api.getUriPrefix() + '/token', {})
      .then(res => {
        this.setState({
          token: res.data.data,
          isRequestFailed: false,
          requestFailedMessage: '',
          isGeneratedSuccess: true
        })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  handleDeleteOnClick () {
    axios.delete(config.api.getUriPrefix() + '/token')
      .then(res => {
        this.setState({
          data: {},
          token: '',
          isRequestFailed: true,
          requestFailedMessage: 'Token successfully deleted.',
          isGeneratedSuccess: false
        })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    if (this.state.isGeneratedSuccess) {
      return (
        <div id='metriq-main-content' className='container'>
          <header><h5>Get Token</h5></header>
          <br />
          <div>
            <div className='row'>
              <div className='col-md-12'>
                <span>This is your new token:</span>
              </div>
            </div>
            <br />
            <div className='row'>
              <div className='col-md-3' />
              <div className='col-md-6 break-all'>
                {this.state.token}
              </div>
              <div className='col-md-3' />
            </div>
            <br />
            <div className='row'>
              <div className='col-md-12'>
                <span>You <b>cannot</b> retrieve it here again.<br />Save it in a secure place.</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className='container'>
        <header><h5>Get Token</h5></header>
        <br />
        <div>
          <div className='row'>
            <div className='col-md-12'>
              <span><b>{this.state.data.clientTokenCreated ? isActiveTokenPrefix + this.state.data.clientTokenCreated + '.' : isNoTokenMessage}</b></span>
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-md-12'>
              <span>Generating a new token will invalidate <b>all</b> previous tokens.<br />When you generate a new token, it will be displayed to you <b>once</b>.<br />Save it securely for your records. This is your token for client software access.</span><br />
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-md-12'>
              <span><b>Are you sure you want to generate a new token?<br />All previous tokens will be invalidated.</b></span>
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-md-12 text-center'>
              <button className='btn btn-primary' onClick={this.handleGenerateOnClick}>Generate new API Token</button>
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-md-12 text-center'>
              <button className='btn btn-primary' onClick={this.handleDeleteOnClick}>Disable API access</button>
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <FormFieldValidator invalid={this.state.isRequestFailed} message={this.state.requestFailedMessage} />
            </div>
            <div className='col-md-3' />
          </div>
        </div>
      </div>
    )
  }
}

export default Token
