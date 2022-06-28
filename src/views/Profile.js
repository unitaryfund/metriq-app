import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import config from './../config'
import FieldRow from '../components/FieldRow'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldValidator from '../components/FormFieldValidator'
import ErrorHandler from '../components/ErrorHandler'
import { Button, Modal } from 'react-bootstrap'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: { affiliation: '', name: ''},
      showEditModal: false,
      isRequestFailed: false,
      requestFailedMessage: ''
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleHideModal = this.handleHideModal.bind(this)
    this.handleShowModal = this.handleShowModal.bind(this)
    this.handleUpdateDetails = this.handleUpdateDetails.bind(this)
  }

  handleOnChange (field, value) {
    const data = this.state.data
    data[field] = value
    this.setState({ data: data })
  }

  handleHideModal () {
    this.setState({ showEditModal: false })
  }

  handleShowModal () {
    this.setState({ showEditModal: true })
  }

  handleUpdateDetails () {
    axios.post(config.api.getUriPrefix() + '/user', this.state.data)
      .then(res => {
        this.setState({
          data: res.data.data,
          showEditModal: false,
          isRequestFailed: false,
          requestFailedMessage: ''
        })
      })
      .catch(err => {
        this.setState({ showEditModal: false, isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
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
      <div id='metriq-main-content' className='container'>
        <header><h4>Profile</h4></header>
        <br />
        <div>
          <FieldRow fieldName='username' label='Username' value={this.state.data.username} />
          <FieldRow fieldName='usernameNormal' label='Normalized Username' value={this.state.data.usernameNormal} />
          <FieldRow fieldName='email' label='Email' value={this.state.data.email} />
          <FieldRow fieldName='affiliation' label='Affiliation' value={this.state.data.affiliation} />
          <FieldRow fieldName='name' label='Name' value={this.state.data.name} />
          <FieldRow fieldName='clientToken' label='API Token' value={this.state.data.clientTokenCreated ? 'Active' : 'None'} />
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
              <Button variant='primary' onClick={this.handleShowModal}>Edit Details</Button>
            </div>
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
              <Link to='/Password'><button className='btn btn-primary'>Change password</button></Link>
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-md-12 text-center'>
              <Link to='/Delete'><button className='btn btn-danger'>Delete Account</button></Link>
            </div>
          </div>
        </div>
        <Modal
          show={this.state.showEditModal}
          onHide={this.handleHideModal}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span>
              <FormFieldRow
                inputName='affiliation' inputType='text' label='Affiliation'
                value={this.state.data.affiliation}
                onChange={(field, value) => this.handleOnChange(field, value)}
              />
            </span>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={this.handleHideModal}>Cancel</Button>
            <Button variant='primary' onClick={this.handleUpdateDetails}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Profile
