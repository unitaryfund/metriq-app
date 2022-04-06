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

class Platform extends React.Component {
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
      platform: { description: '' },
      item: {
        id: 0,
        properties: []
      },
      allPlatformNames: [],
      allPropertyNames: [],
      allDataTypeNames: [],
      propertyNames: [],
      property: {
        id: 0,
        name: '',
        fullName: '',
        dataTypeId: 1,
        typeFriendlyName: 'bool',
        typeDescription: '',
        value: '',
        inputType: 'checkbox',
        inputRegex: defaultRegex,
        valueDescription: '',
        platformId: this.props.match.params.id
      }
    }

    this.handleAccordionToggle = this.handleAccordionToggle.bind(this)
    this.handleShowEditModal = this.handleShowEditModal.bind(this)
    this.handleHideEditModal = this.handleHideEditModal.bind(this)
    this.handleEditModalDone = this.handleEditModalDone.bind(this)
    this.handleAddModalSubmit = this.handleAddModalSubmit.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnClickAdd = this.handleOnClickAdd.bind(this)
    this.handleOnClickAddProperty = this.handleOnClickAddProperty.bind(this)
    this.handleOnClickRemove = this.handleOnClickRemove.bind(this)
    this.handleHideAddModal = this.handleHideAddModal.bind(this)
    this.handleRemoveModalDone = this.handleRemoveModalDone.bind(this)
    this.handleOnTypeChange = this.handleOnTypeChange.bind(this)
    this.handleOnClickEditProperty = this.handleOnClickEditProperty.bind(this)
  }

  handleAccordionToggle () {
    this.setState({ showAccordion: !this.state.showAccordion, isValidated: false })
  }

  handleShowEditModal () {
    let mode = 'Edit'
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    const platform = {
      properties: this.state.item.properties,
      description: this.state.item.description
    }
    this.setState({ showEditModal: true, modalMode: mode, platform: platform })
  }

  handleHideEditModal () {
    this.setState({ showEditModal: false })
  }

  handleEditModalDone () {
    if (!this.props.isLoggedIn) {
      window.location.href = '/Login'
    }

    const reqBody = {
      description: this.state.platform.description
    }

    axios.post(config.api.getUriPrefix() + '/platform/' + this.props.match.params.id, reqBody)
      .then(res => {
        this.setState({ item: res.data.data, showEditModal: false })
      })
      .catch(err => {
        window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
      })
  }

  handleAddModalSubmit () {
    if (!this.props.isLoggedIn) {
      window.location.href = '/Login'
    }

    const property = {
      id: this.state.property.id,
      name: this.state.property.name,
      fullName: this.state.property.fullName,
      value: this.state.property.value,
      dataTypeId: this.state.property.dataTypeId
    }
    if (!property.name) {
      window.alert('Error: Property name cannot be blank.')
      return
    }
    if (!property.dataTypeId) {
      window.alert('Error: Property type cannot be null.')
      return
    }
    if (!property.value) {
      if (property.dataTypeId === 1) {
        property.value = false
      } else {
        window.alert('Error: Property value cannot be blank.')
        return
      }
    }
    if (!property.fullName) {
      property.fullName = property.name
    }

    const propertyRoute = config.api.getUriPrefix() + (this.state.property.id ? '/property' + this.state.property.id : '/platform/' + this.state.item.id + '/property')
    axios.post(propertyRoute, property)
      .then(res => {
        window.location.reload()
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

  handleOnTypeChange (dataTypeId, id, name, fullName, value) {
    const friendlyType = this.state.allDataTypeNames ? this.state.allDataTypeNames.find(x => x.id === dataTypeId).friendlyType : 'bool'

    let inputType = 'textarea'
    let inputRegex = defaultRegex
    if (friendlyType === 'bool') {
      inputType = 'checkbox'
      inputRegex = undefined
    } else if (friendlyType === 'date') {
      inputType = 'date'
      inputRegex = undefined
    } else if (friendlyType === 'datetime') {
      inputType = 'datetime-local'
      inputRegex = undefined
    }
    if (friendlyType === 'int') {
      inputType = 'number'
      inputRegex = intRegex
    } else if (friendlyType === 'number') {
      inputType = 'number'
      inputRegex = numberRegex
    }

    const property = this.state.property
    property.dataTypeId = dataTypeId
    property.typeFriendlyName = friendlyType
    property.inputType = inputType
    property.inputRegex = inputRegex
    property.id = id === undefined ? 0 : id
    property.name = name === undefined ? '' : name
    property.fullName = fullName === undefined ? property.name : fullName
    property.value = value === undefined ? '' : value

    console.log(property)

    this.setState({ property: property })
  }

  handleOnClickAddProperty () {
    if (this.state.allPropertyNames.length) {
      const property = this.state.allPropertyNames[0]
      this.handleOnTypeChange(property.dataTypeId, property.id, property.name, property.fullName)
    } else {
      this.handleOnTypeChange(1)
    }
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

  handleOnClickEditProperty (propertyId) {
    for (let i = 0; i < this.state.item.properties.length; i++) {
      if (this.state.item.properties[i].id === propertyId) {
        const property = this.state.item.properties[i]
        property.submissionId = this.state.item.id
        this.handleOnTypeChange(property.dataTypeId, propertyId, property.name, property.fullName, property.value)
        break
      }
    }
    this.handleOnClickAdd('property')
  }

  componentDidMount () {
    const platformRoute = config.api.getUriPrefix() + '/platform/' + this.props.match.params.id
    axios.get(platformRoute)
      .then(res => {
        const platform = res.data.data
        this.setState({ isRequestFailed: false, requestFailedMessage: '', item: platform })

        const propertyRoute = config.api.getUriPrefix() + '/property/names'
        axios.get(propertyRoute)
          .then(res => {
            this.setState({ isRequestFailed: false, requestFailedMessage: '', allPropertyNames: res.data.data })

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
                <FacebookShareButton url={config.api.getUriPrefix() + '/platform/' + this.props.match.params.id}>
                  <FacebookIcon size={32} />
                </FacebookShareButton>
              </OverlayTrigger>
              <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Share via Twitter</Tooltip>}>
                <TwitterShareButton url={config.api.getUriPrefix() + '/platform/' + this.props.match.params.id}>
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
                      render: (value, row, index) => <div className='text-center'><FontAwesomeIcon icon='edit' onClick={() => this.handleOnClickEditProperty(row.key)} /></div>
                    }
                  ]}
                  data={this.state.item.properties.length
                    ? this.state.item.properties.map(row =>
                        ({
                          key: row.id,
                          name: row.name,
                          type: row.typeFriendlyName,
                          value: row.value
                        }))
                    : []}
                  tableLayout='auto'
                />}
              {(this.state.item.properties.length === 0) &&
                <div className='card bg-light'>
                  <div className='card-body'>There are no associated properties, yet.</div>
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
            <Modal.Title>Edit Platform</Modal.Title>
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
                  value={this.state.platform.description}
                  onChange={(field, value) => this.handleOnChange('platform', field, value)}
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
            {(this.state.modalMode === 'Login') &&
              <Modal.Title>Add Result</Modal.Title>}
            {(this.state.modalMode !== 'Login') &&
              <Modal.Title>{(this.state.property.id) ? 'Edit' : 'Add'} {this.state.modalMode}</Modal.Title>}
          </Modal.Header>
          <Modal.Body>
            {(this.state.modalMode === 'Login') &&
              <span>
                Please <Link to='/Login'>login</Link> before editing.
              </span>}
            {(this.state.modalMode !== 'Login') &&
              <span>
                <FormFieldSelectRow
                  inputName='id'
                  label='Property'
                  options={this.state.allPropertyNames}
                  value={this.state.property.id}
                  onChange={(field, value) => this.handleOnChange('property', field, value)}
                  tooltip='An explicitely-typed key/value property of this platform'
                  disabled={this.state.showAccordion}
                /><br />
                <FormFieldRow
                  inputName='value'
                  inputType={this.state.property.inputType}
                  label='Value'
                  validRegex={this.state.property.inputRegex}
                  value={this.state.property.value}
                  checked={this.state.property.inputType === 'checkbox' ? this.state.property.value === 'true' : undefined}
                  onChange={(field, value) => this.handleOnChange('property', field, value)}
                  tooltip='Platform value of selected property'
                />
                {!this.state.property.id &&
                  <span>
                    <br />Not in the list?<br />
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
                              inputName='dataTypeId'
                              label='Type'
                              options={this.state.allDataTypeNames}
                              value={this.state.property.dataTypeId}
                              onChange={(field, value) => this.handleOnTypeChange(parseInt(value))}
                              tooltip='Explicit data type of new property'
                            /><br />
                            <FormFieldRow
                              inputName='value'
                              inputType={this.state.property.inputType}
                              label='Value'
                              onChange={(field, value) => this.handleOnChange('property', field, value)}
                              validRegex={this.state.property.inputRegex}
                              tooltip='Value of new property'
                            /><br />
                            <FormFieldRow
                              inputName='typeDescription'
                              inputType='textarea'
                              label='Type Description<br/>(optional)'
                              onChange={(field, value) => this.handleOnChange('property', field, value)}
                              tooltip='Long description of new property type'
                            /><br />
                            <FormFieldRow
                              inputName='valueDescription'
                              inputType='textarea'
                              label='Value Description<br/>(optional)'
                              onChange={(field, value) => this.handleOnChange('property', field, value)}
                              tooltip='Long description of new property value'
                            />
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  </span>}
              </span>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={this.handleAddModalSubmit}>
              {(this.state.modalMode === 'Login') ? 'Cancel' : 'Done'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Platform
