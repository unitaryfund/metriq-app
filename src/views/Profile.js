import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import config from './../config'
import FieldRow from '../components/FieldRow'
import FormFieldValidator from '../components/FormFieldValidator'
import ErrorHandler from '../components/ErrorHandler'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {},
      isRequestFailed: false,
      requestFailedMessage: ''
    }
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

  render () {
    return (
      <div className='container'>
        <header>Profile</header>
        <br />
        <div>
          <FieldRow fieldName='username' label='Username' value={this.state.data.username} />
          <FieldRow fieldName='usernameNormal' label='Normalized Username' value={this.state.data.usernameNormal} />
          <FieldRow fieldName='email' label='Email' value={this.state.data.email} />
          <FieldRow fieldName='clientToken' label='API Token' value={this.state.data.clientToken ? 'Active' : 'None'} />
          <FieldRow fieldName='createdAt' label='Date Joined' value={this.state.data.createdAt} />
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
              <Link to='/Token'><button className='btn btn-primary'>Manage API Token</button></Link>
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-md-12 text-center'>
              <Link to='/Delete'><button className='btn btn-danger'>Delete Account</button></Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Profile
