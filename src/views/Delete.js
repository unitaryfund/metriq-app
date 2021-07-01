import axios from 'axios'
import React from 'react'
import config from './../config'
import FormFieldValidator from '../components/FormFieldValidator'

class Delete extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {},
      isRequestFailed: false,
      requestFailedMessage: ''
    }

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
        this.setState({ isRequestFailed: true, requestFailedMessage: err ? (err.message ? err.message : err) : 'Could not reach server.' })
      })
  }

  handleDeleteOnClick () {
    const confirmString = window.prompt('To delete your account, type your username or email below, then hit "OK."', '').trim().toLowerCase()
    if (confirmString && ((confirmString === this.state.data.usernameNormal) || (confirmString === this.state.data.email))) {
      axios.delete(config.api.getUriPrefix() + '/user')
        .then(res => {
          this.props.onLogout()
        })
        .catch(err => {
          this.setState({ isRequestFailed: true, requestFailedMessage: err ? (err.message ? err.message : err) : 'Could not reach server.' })
        })
    } else {
      this.setState({ isRequestFailed: true, requestFailedMessage: 'Entered incorrect username/email!' })
    }
  }

  render () {
    return (
      <div className='container'>
        <header>Delete Account</header>
        <br />
        <div className='row'>
          <div className='col-md-2' />
          <div className='col-md-8'>
            <span><b>If you delete your account, all of your submissions will be deleted with it!</b></span>
          </div>
          <div className='col-md-2' />
        </div>
        <br />
        <div className='row'>
          <div className='col-md-3' />
          <div className='col-md-6'>
            <span>If you still want to delete your account, press the button below, and you will be prompted to confirm the action one more time.</span>
          </div>
          <div className='col-md-3' />
        </div>
        <br />
        <div className='row'>
          <div className='col-md-3' />
          <div className='col-md-6'>
            <FormFieldValidator invalid={this.state.isRequestFailed} message={this.state.requestFailedMessage} />
          </div>
          <div className='col-md-3' />
        </div>
        <br />
        <div className='row'>
          <div className='col-md-12 text-center'>
            <button className='btn btn-danger' onClick={this.handleDeleteOnClick}>Delete Account</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Delete
