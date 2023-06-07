import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import config from './../config'
import FieldRow from '../components/FieldRow'
import FormFieldValidator from '../components/FormFieldValidator'
import ErrorHandler from '../components/ErrorHandler'
import { Button } from 'react-bootstrap'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import FormFieldWideRow from '../components/FormFieldWideRow'
import ViewHeader from '../components/ViewHeader'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: { affiliation: '', name: '', usernameNormal: '', email: '', isSubscribedToNewSubmissions: false },
      showEditModal: false,
      requestFailedMessage: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleUpdateDetails = this.handleUpdateDetails.bind(this)
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this)
    this.handleSubscribeNewSubmissions = this.handleSubscribeNewSubmissions.bind(this)
    this.handleUnsubscribeNewSubmissions = this.handleUnsubscribeNewSubmissions.bind(this)
  }

  handleOnChange (field, value) {
    const data = this.state.data
    data[field] = value
    this.setState({ data })
  }

  handleUpdateDetails () {
    axios.post(config.api.getUriPrefix() + '/user', this.state.data)
      .then(res => {
        this.setState({
          data: res.data.data,
          showEditModal: false,
          requestFailedMessage: ''
        })
      })
      .catch(err => {
        this.setState({ showEditModal: false, requestFailedMessage: ErrorHandler(err) })
      })
  }

  handleUnsubscribe () {
    let confirmString = window.prompt('To unsubscribe from all email updates, type your username or email below, then hit "OK."', '')
    if (confirmString) {
      confirmString = confirmString.trim().toLowerCase()
    }
    if (confirmString && ((confirmString === this.state.data.usernameNormal) || (confirmString === this.state.data.email))) {
      axios.post(config.api.getUriPrefix() + '/user/unsubscribe', {})
        .then(res => {
          this.setState({
            data: res.data.data,
            requestFailedMessage: ''
          })
          window.alert('Successfully unsubscribed from all email updates!')
        })
        .catch(err => {
          this.setState({ requestFailedMessage: ErrorHandler(err) })
        })
    } else {
      this.setState({ requestFailedMessage: 'Entered incorrect username/email!' })
    }
  }

  handleSubscribeNewSubmissions () {
    axios.post(config.api.getUriPrefix() + '/user/subscribeNewSubmissions', {})
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

  handleUnsubscribeNewSubmissions () {
    axios.post(config.api.getUriPrefix() + '/user/unsubscribeNewSubmissions', {})
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

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        <ViewHeader>Profile</ViewHeader>
        <br />
        <div>
          <FieldRow fieldName='username' label='Username' value={this.state.data.username} />
          <FieldRow fieldName='usernameNormal' label='Normalized Username' value={this.state.data.usernameNormal} />
          <FieldRow fieldName='email' label='Email' value={this.state.data.email} />
          <FieldRow fieldName='affiliation' label='Affiliation' value={this.state.data.affiliation} />
          <FieldRow fieldName='twitterHandle' label='Twitter Handle' value={this.state.data.twitterHandle} />
          <FieldRow fieldName='name' label='Name' value={this.state.data.name} />
          <FieldRow fieldName='clientToken' label='API Token' value={this.state.data.clientTokenCreated ? 'Active' : 'None'} />
          <FieldRow fieldName='createdAt' label='Date Joined' value={this.state.data.createdAt} />
          <FormFieldAlertRow>
            <FormFieldValidator invalid={!!this.state.requestFailedMessage} message={this.state.requestFailedMessage} />
          </FormFieldAlertRow>
          <br />
          <FormFieldWideRow className='text-center'>
            <Link to='/EditDetails'><Button variant='primary'>Edit Details</Button></Link>
          </FormFieldWideRow>
          <br />
          <FormFieldWideRow className='text-center'>
            <Link to='/Token'><Button variant='primary'>Manage API Token</Button></Link>
          </FormFieldWideRow>
          <br />
          <FormFieldWideRow className='text-center'>
            <Link to='/Password'><Button variant='primary'>Change password</Button></Link>
          </FormFieldWideRow>
          <br />
          {!this.state.data.isSubscribedToNewSubmissions &&
            <FormFieldWideRow className='text-center'>
              <Button variant='primary' onClick={this.handleSubscribeNewSubmissions}>Subscribe to daily new submission updates</Button>
            </FormFieldWideRow>}
          {this.state.data.isSubscribedToNewSubmissions &&
            <FormFieldWideRow className='text-center'>
              <Button variant='danger' onClick={this.handleUnsubscribeNewSubmissions}>Unsubscribe from daily new submission updates</Button>
            </FormFieldWideRow>}
          <br />
          <FormFieldWideRow className='text-center'>
            <Button variant='danger' onClick={this.handleUnsubscribe}>Unsubscribe From All Email Updates</Button>
          </FormFieldWideRow>
          <br />
          <FormFieldWideRow className='text-center'>
            <Link to='/Delete'><Button variant='danger'>Delete Account</Button></Link>
          </FormFieldWideRow>
        </div>
      </div>
    )
  }
}

export default Profile
