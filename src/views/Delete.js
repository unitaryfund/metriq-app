import axios from 'axios'
import React from 'react'
import config from './../config'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import FormFieldValidator from '../components/FormFieldValidator'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldWideRow from '../components/FormFieldWideRow'
import ViewHeader from '../components/ViewHeader'

class Delete extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {},
      requestFailedMessage: ''
    }

    this.handleDeleteOnClick = this.handleDeleteOnClick.bind(this)
  }

  componentDidMount () {
    axios.get(config.api.getUriPrefix() + '/user')
      .then(res => {
        this.setState({
          data: res.data.data,
          requestFailedMessage: ''
        })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })
  }

  handleDeleteOnClick () {
    let confirmString = window.prompt('To unsubscribe from all email updates, type your username or email below, then hit "OK."', '')
    if (confirmString) {
      confirmString = confirmString.trim().toLowerCase()
    }
    if (confirmString && ((confirmString === this.state.data.usernameNormal) || (confirmString === this.state.data.email))) {
      axios.delete(config.api.getUriPrefix() + '/user')
        .then(res => {
          this.props.onLogout()
        })
        .catch(err => {
          this.setState({ requestFailedMessage: ErrorHandler(err) })
        })
    } else {
      this.setState({ requestFailedMessage: 'Entered incorrect username/email!' })
    }
  }

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        <ViewHeader>Delete Account</ViewHeader>
        <br />
        <div className='row'>
          <div className='col-md-2' />
          <div className='col-md-8'>
            <span><b>If you delete your account, all of your submissions will be deleted with it!</b></span>
          </div>
          <div className='col-md-2' />
        </div>
        <br />
        <FormFieldAlertRow>
          If you still want to delete your account, press the button below, and you will be prompted to confirm the action one more time.
        </FormFieldAlertRow>
        <br />
        <FormFieldAlertRow>
          <FormFieldValidator invalid={!!this.state.requestFailedMessage} message={this.state.requestFailedMessage} />
        </FormFieldAlertRow>
        <br />
        <FormFieldWideRow className='text-center'>
          <button className='btn btn-danger' onClick={this.handleDeleteOnClick}>Delete Account</button>
        </FormFieldWideRow>
      </div>
    )
  }
}

export default Delete
