import axios from 'axios'
import React from 'react'
import config from './../config'
import ErrorHandler from './../components/ErrorHandler'
import EditButton from '../components/EditButton'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import { Modal, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class Submission extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      item: {},
      metricNames: [],
      showAddModal: false,
      showRemoveModal: false,
      modalMode: ''
    }

    this.handleOnClickAdd = this.handleOnClickAdd.bind(this)
    this.handleOnClickRemove = this.handleOnClickRemove.bind(this)
    this.handleHideAddModal = this.handleHideAddModal.bind(this)
    this.handleHideRemoveModal = this.handleHideRemoveModal.bind(this)
    this.handleAddModalSubmit = this.handleAddModalSubmit.bind(this)
    this.handleRemoveModalDone = this.handleRemoveModalDone.bind(this)
    this.handleOnResultChange = this.handleOnResultChange.bind(this)
  }

  handleOnClickAdd (mode) {
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    this.setState({ showAddModal: true, modalMode: mode })
  }

  handleOnClickRemove (mode) {
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    this.setState({ showRemoveModal: true, modalMode: mode })
  }

  handleHideAddModal () {
    this.setState({ showAddModal: false })
  }

  handleHideRemoveModal () {
    this.setState({ showRemoveModal: false })
  }

  handleAddModalSubmit () {
    this.setState({ showAddModal: false })
  }

  handleRemoveModalDone () {
    this.setState({ showRemoveModal: false })
  }

  handleOnResultChange () {

  }

  componentDidMount () {
    const submissionRoute = config.api.getUriPrefix() + '/submission/' + this.props.match.params.id
    axios.get(submissionRoute)
      .then(res => {
        this.setState({ isRequestFailed: false, requestFailedMessage: '', item: res.data.data })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
    const metricNamesRoute = config.api.getUriPrefix() + '/result/metricNames'
    axios.get(metricNamesRoute)
      .then(res => {
        this.setState({ isRequestFailed: false, requestFailedMessage: '', metricNames: res.data.data })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div className='container submission-detail-container'>
        <header>{this.state.item.name}</header>
        <br />
        <div className='row'>
          <div className='col-md-12'>
            <div><h1>{this.state.item.submissionName}</h1></div>
            <div className='submission-description'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec commodo est. Nunc mollis nunc ac ante vestibulum, eu consectetur magna porttitor. Proin ac tortor urna. Aliquam ac ante eu nunc aliquam convallis et in sem. Donec volutpat tincidunt tincidunt. Aliquam at risus non diam imperdiet vestibulum eget a orci. In ultricies, arcu vel semper lobortis, lorem orci placerat nisi, id fermentum purus odio ut nulla. Duis quis felis a erat mattis venenatis id sit amet purus. Aenean a risus dui.
            </div>
          </div>
        </div>
        <br />
        <div className='row'>
          <div className='col-md-6'>
            <div>
              <h2>Tasks
                <EditButton
                  className='float-right edit-button btn'
                  onClickAdd={() => this.handleOnClickAdd('Task')}
                  onClickRemove={() => this.handleOnClickRemove('Task')}
                />
              </h2>
              <hr />
            </div>
            <div className='card bg-light'>
              <div className='card-body'>Lorem ipsum</div>
            </div>
          </div>
          <div className='col-md-6'>
            <div>
              <h2>Methods
                <EditButton
                  className='float-right edit-button btn'
                  onClickAdd={() => this.handleOnClickAdd('Method')}
                  onClickRemove={() => this.handleOnClickRemove('Method')}
                />
              </h2>
              <hr />
            </div>
            <div className='card bg-light'>
              <div className='card-body'>Lorem ipsum</div>
            </div>
          </div>
        </div>
        <br />
        <div className='row'>
          <div className='col-md-12'>
            <div>
              <h2>Results
                <EditButton
                  className='float-right edit-button btn'
                  onClickAdd={() => this.handleOnClickAdd('Result')}
                  onClickRemove={() => this.handleOnClickRemove('Result')}
                />
              </h2>
              <hr />
            </div>
            <div className='card bg-light'>
              <div className='card-body'>Lorem ipsum</div>
            </div>
          </div>
        </div>
        <Modal show={this.state.showAddModal} onHide={this.handleHideAddModal}>
          {(this.state.modalMode === 'Login') &&
            <Modal.Header closeButton>
              <Modal.Title>Add</Modal.Title>
            </Modal.Header>}
          {(this.state.modalMode !== 'Login') &&
            <Modal.Header closeButton>
              <Modal.Title>Add {this.state.modalMode}</Modal.Title>
            </Modal.Header>}
          <Modal.Body>
            {(this.state.modalMode === 'Login') &&
              <span>
                Please <Link to='/Login'>login</Link> before editing.
              </span>}
            {(this.state.modalMode === 'Result') &&
              <span>
                <FormFieldTypeaheadRow
                  inputName='metricName' label='Metric name'
                  onChange={this.handleOnResultChange}
                  options={this.state.metricNames}
                  value=''
                /><br />
                <FormFieldRow
                  inputName='metricValue' inputType='number' label='Metric value'
                  onChange={this.handleOnResultChange}
                /><br />
                <FormFieldRow
                  inputName='evalutedDate' inputType='date' label='Evaluated'
                  onChange={this.handleOnResultChange}
                /><br />
                <FormFieldRow
                  inputName='isHigherBetter' inputType='checkbox' label='Is higher better?'
                  onChange={this.handleOnResultChange}
                />
              </span>}
            {(this.state.modalMode !== 'Login' && this.state.modalMode !== 'Result') &&
              <span>
                Woohoo, you're reading this text in a modal!<br /><br />Mode: {this.state.modalMode}
              </span>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={this.handleAddModalSubmit}>
              {(this.state.modalMode === 'Login') ? 'Cancel' : 'Submit'}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showRemoveModal} onHide={this.handleHideRemoveModal}>
          <Modal.Header closeButton>
            <Modal.Title>Remove</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(this.state.modalMode === 'Login') &&
              <span>
                Please <Link to='/Login'>login</Link> before editing.
              </span>}
            {(this.state.modalMode !== 'Login') &&
              <span>
                Woohoo, you're reading this text in a modal!<br /><br />Mode: {this.state.modalMode}
              </span>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={this.handleRemoveModalDone}>
              {(this.state.modalMode === 'Login') ? 'Cancel' : 'Done'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Submission
