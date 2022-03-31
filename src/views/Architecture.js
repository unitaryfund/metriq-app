import axios from 'axios'
import React from 'react'
import config from '../config'
import Table from 'rc-table'
import ErrorHandler from '../components/ErrorHandler'
import EditButton from '../components/EditButton'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldSelectRow from '../components/FormFieldSelectRow'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { Accordion, Button, Card, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share'

const defaultRegex = /.+/
const nameRegex = /.{1,}/
const intRegex = /^([+-]?[1-9]\d*|0)$/
const numberRegex = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/
// bool is handled by checkbox FormFieldRow
// datetime is handled by date/time picker FormFieldRow
// date is handled by date-only picker FormFieldRow

library.add(faEdit)

class Architecture extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRequestFailed: false,
      requestFailedMessage: '',
      showAddModal: false,
      showRemoveModal: false,
      showEditModal: false,
      showAccordion: false,
      isValidated: false,
      modalMode: '',
      architecture: { description: '' },
      item: {
        properties: []
      },
      allArchitectureNames: [],
      allDataTypeNames: [],
      propertyNames: [],
      propertyId: '',
      propertyValue: '',
      propertyRegex: defaultRegex,
      property: {
        id: '',
        name: '',
        fullName: '',
        type: '',
        value: '',
        inputType: 'textarea'
      }
    }

    this.handleAccordionToggle = this.handleAccordionToggle.bind(this)
    this.handleShowEditModal = this.handleShowEditModal.bind(this)
    this.handleHideEditModal = this.handleHideEditModal.bind(this)
    this.handleEditModalDone = this.handleEditModalDone.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnClickAdd = this.handleOnClickAdd.bind(this)
    this.handleOnClickAddProperty = this.handleOnClickAddProperty.bind(this)
    this.handleOnClickRemove = this.handleOnClickRemove.bind(this)
    this.handleHideAddModal = this.handleHideAddModal.bind(this)
    this.handleRemoveModalDone = this.handleRemoveModalDone.bind(this)
  }

  handleAccordionToggle () {
    this.setState({ showAccordion: !this.state.showAccordion, isValidated: false })
  }

  handleShowEditModal () {
    let mode = 'Edit'
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    const architecture = {
      properties: this.state.item.properties,
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

  handleOnClickAddProperty () {
    let inputType = 'textarea'
    if (this.state.property.friendlyType === 'bool') {
      inputType = 'checkbox'
    } else if (this.state.property.friendlyType === 'date') {
      inputType = 'date'
    } else if (this.state.property.friendlyType === 'datetime') {
      inputType = 'datetime'
    }

    let inputRegex = defaultRegex
    if (this.state.property.friendlyType === 'int') {
      inputRegex = intRegex
    } else if (this.state.property.friendlyType === 'number') {
      inputRegex = numberRegex
    }

    const property = {
      id: '',
      name: '',
      fullName: '',
      type: '',
      value: '',
      inputType,
      inputRegex
    }
    this.setState({ property: property })
    this.handleOnClickAdd('Property')
  }

  handleOnClickAdd (mode) {
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    this.setState({ showAddModal: true, showAccordion: false, modalMode: mode, isValidated: false })
  }

  handleHideAddModal () {
    this.setState({ showAddModal: false, showAccordion: false })
  }

  handleOnClickRemove (mode) {
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    this.setState({ showRemoveModal: true, modalMode: mode })
  }

  handleRemoveModalDone () {
    this.setState({ showRemoveModal: false })
  }

  componentDidMount () {
    const architectureRoute = config.api.getUriPrefix() + '/architecture/' + this.props.match.params.id
    axios.get(architectureRoute)
      .then(res => {
        const architecture = res.data.data
        this.setState({ isRequestFailed: false, requestFailedMessage: '', item: architecture })

        const dataTypeNamesRoute = config.api.getUriPrefix() + '/dataType/names'
        axios.get(dataTypeNamesRoute)
          .then(res => {
            this.setState({ isRequestFailed: false, requestFailedMessage: '', allDataTypeNames: res.data.data })
          })
          .catch(err => {
            this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
          })
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
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Edit description</Tooltip>}>
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
          <div className='row'>
            <div className='col-md-12'>
              <div>
                <h2>Properties
                  <EditButton
                    className='float-right edit-button btn'
                    onClickAdd={() => this.handleOnClickAddProperty()}
                    onClickRemove={() => this.handleOnClickRemove('Property')}
                  />
                </h2>
                <hr />
              </div>
              {(this.state.item.properties.length > 0) &&
                <Table
                  columns={[
                    {
                      title: 'Name',
                      dataIndex: 'name',
                      key: 'name',
                      width: 386
                    },
                    {
                      title: 'Type',
                      dataIndex: 'type',
                      key: 'type',
                      width: 386
                    },
                    {
                      title: 'Value',
                      dataIndex: 'value',
                      key: 'value',
                      width: 386
                    },
                    {
                      title: '',
                      dataIndex: 'edit',
                      key: 'edit',
                      width: 42,
                      render: (value, row, index) => <div className='text-center'><FontAwesomeIcon icon='edit' onClick={() => this.handleOnClickEditResult(row.key)} /></div>
                    }
                  ]}
                  data={this.state.item.properties.length
                    ? this.state.item.properties.map(row =>
                        ({
                          key: row.id,
                          name: row.name,
                          type: row.type,
                          value: row.value
                        }))
                    : []}
                  tableLayout='auto'
                />}
              {(this.state.item.properties.length === 0) &&
                <div className='card bg-light'>
                  <div className='card-body'>There are no associated results, yet.</div>
                </div>}
            </div>
          </div>
        </div>
        <Modal
          show={this.state.showEditModal}
          onHide={this.handleHideEditModal}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Architecture</Modal.Title>
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
        <Modal
          show={this.state.showAddModal}
          onHide={this.handleHideAddModal}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Property</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(this.state.modalMode === 'Login') &&
              <span>
                Please <Link to='/Login'>login</Link> before editing.
              </span>}
            {(this.state.modalMode !== 'Login') &&
              <span>
                <FormFieldSelectRow
                  inputName='propertyId'
                  label='Property'
                  options={this.state.propertyNames}
                  onChange={(field, value) => this.handleOnChange('', field, value)}
                  tooltip='An explicitely-typed key/value property of this architecture'
                  disabled={this.state.showAccordion}
                /><br />
                <FormFieldRow
                  inputName='propertyValue'
                  inputType={this.state.property.inputType}
                  label='Value'
                  validRegex={this.state.property.inputRegex}
                  onChange={(field, value) => this.handleOnChange('', field, value)}
                  tooltip='Architecture value of selected property'
                /><br />
                Not in the list?<br />
                <Accordion defaultActiveKey='0'>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant='link' eventKey='1' onClick={this.handleAccordionToggle}>
                        <FontAwesomeIcon icon='plus' /> Create a new property.
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey='1'>
                      <Card.Body>
                        <FormFieldRow
                          inputName='name'
                          inputType='text'
                          label='Name'
                          onChange={(field, value) => this.handleOnChange('property', field, value)}
                          validRegex={nameRegex}
                          tooltip='Short name of new property'
                        /><br />
                        <FormFieldRow
                          inputName='fullName'
                          inputType='text'
                          label='Full name (optional)'
                          onChange={(field, value) => this.handleOnChange('property', field, value)}
                          tooltip='Long name of new method'
                        /><br />
                        <FormFieldSelectRow
                          inputName='type'
                          label='Type'
                          value={this.state.allDataTypeNames.length ? this.state.allDataTypeNames[0].id : 0}
                          options={this.state.allDataTypeNames}
                          onChange={(field, value) => this.handleOnChange('property', field, value)}
                          tooltip='Explicit data type of new property'
                        /><br />
                        <FormFieldRow
                          inputName='value'
                          inputType='text'
                          label='Value'
                          onChange={(field, value) => this.handleOnChange('property', field, value)}
                          validRegex={this.state.propertyRegex}
                          tooltip='Value of new property'
                        /><br />
                        <FormFieldRow
                          inputName='description'
                          inputType='textarea'
                          label='Description (optional)'
                          onChange={(field, value) => this.handleOnChange('property', field, value)}
                          tooltip='Long description of new method'
                        />
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
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
