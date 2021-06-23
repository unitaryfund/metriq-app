import axios from 'axios'
import React from 'react'
import config from './../config'
import FieldRow from '../components/FieldRow'
import FormFieldValidator from '../components/FormFieldValidator'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {},
      isRequestFailed: false,
      requestFailedMessage: ''
    }
  }

  componentDidMount() {
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

  render () {
    return (
      <div className='container'>
        <header>Test - Profile</header>
        <div>
          <FieldRow fieldName='username' label='Username' value={this.state.data.username}/>
          <FieldRow fieldName='usernameNormal' label='Normalized Username' value={this.state.data.usernameNormal}/>
          <FieldRow fieldName='email' label='Email' value={this.state.data.email}/>
          <FieldRow fieldName='clientToken' label='API Token' value={this.state.data.clienToken ? 'Active' : 'None' }/>
          <FieldRow fieldName='dateJoined' label='Date Joined' value={this.state.data.dateJoined}/>
          <div className='row'>
            <div className='col-md-3' />
            <div className='col-md-6'>
              <FormFieldValidator invalid={this.state.isRequestFailed} message={this.state.requestFailedMessage} />
            </div>
            <div className='col-md-3' />
          </div>
          <div className='row'>
            <div className='col-md-12 text-center'>
              <button className='btn btn-primary'>Get API Token</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Profile
