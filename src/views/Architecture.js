import axios from 'axios'
import React from 'react'
import config from '../config'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldRow from '../components/FormFieldRow'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share'

library.add(faEdit)

class Architecture extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRequestFailed: false,
      requestFailedMessage: '',
      showEditModal: false,
      architecture: { description: '' },
      item: { parentArchitecture: {} },
      allArchitectureNames: []
    }

    this.handleShowEditModal = this.handleShowEditModal.bind(this)
    this.handleHideEditModal = this.handleHideEditModal.bind(this)
    this.handleEditModalDone = this.handleEditModalDone.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  handleShowEditModal () {
    let mode = 'Edit'
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    const architecture = {
      description: this.state.item.description
    }
    this.setState({ showEditModal: true, modalMode: mode, architecture: architecture })
  }

  handleHideEditModal () {
    this.setState({ showEditModal: false })
  }

  handleEditModalDone () {
    if (!this.props.isLoggedIn) {
      window.location.href = '/Login'
    }

    const reqBody = {
      description: this.state.architecture.description
    }

    axios.post(config.api.getUriPrefix() + '/architecture/' + this.props.match.params.id, reqBody)
      .then(res => {
        this.setState({ item: res.data.data, showEditModal: false })
      })
      .catch(err => {
        window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
      })
  }

  handleOnChange (key1, key2, value) {
    if (!value && value !== false) {
      value = null
    }
    if (key1) {
      const k1 = this.state[key1]
      k1[key2] = value
      this.setState({ [key1]: k1 })
    } else {
      this.setState({ [key2]: value })
    }
  }

  componentDidMount () {
    const architectureRoute = config.api.getUriPrefix() + '/architecture/' + this.props.match.params.id
    axios.get(architectureRoute)
      .then(res => {
        const architecture = res.data.data
        this.setState({ isRequestFailed: false, requestFailedMessage: '', item: architecture })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div id='metriq-main-content'>
        <div className='container submission-detail-container'>
          <div className='row'>
            <div className='col-md-12'>
              <div><h1>{this.state.item.fullName ? this.state.item.fullName : this.state.item.name}</h1></div>
              <div className='submission-description'>
                {this.state.item.description ? this.state.item.description : <i>No description provided.</i>}
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Edit architecture</Tooltip>}>
                <button className='submission-button btn btn-secondary' onClick={this.handleShowEditModal}><FontAwesomeIcon icon='edit' /></button>
              </OverlayTrigger>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Share via Facebook</Tooltip>}>
                <FacebookShareButton url={config.api.getUriPrefix() + '/architecture/' + this.props.match.params.id}>
                  <FacebookIcon size={32} />
                </FacebookShareButton>
              </OverlayTrigger>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Share via Twitter</Tooltip>}>
                <TwitterShareButton url={config.api.getUriPrefix() + '/architecture/' + this.props.match.params.id}>
                  <TwitterIcon size={32} />
                </TwitterShareButton>
              </OverlayTrigger>
            </div>
          </div>
          <br />
        </div>
        <Modal
          show={this.state.showEditModal}
          onHide={this.handleHideEditModal}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Submission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(this.state.modalMode === 'Login') &&
              <span>
                Please <Link to='/Login'>login</Link> before editing.
              </span>}
            {(this.state.modalMode !== 'Login') &&
              <span>
                <FormFieldRow
                  inputName='description' inputType='textarea' label='Description' rows='12'
                  value={this.state.architecture.description}
                  onChange={(field, value) => this.handleOnChange('architecture', field, value)}
                />
              </span>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={this.handleEditModalDone}>
              {(this.state.modalMode === 'Login') ? 'Cancel' : 'Done'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Architecture
