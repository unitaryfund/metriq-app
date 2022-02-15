import axios from 'axios'
import React from 'react'
import config from './../config'
import Table from 'rc-table'
import ErrorHandler from './../components/ErrorHandler'
import FormFieldRow from '../components/FormFieldRow'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faEdit)

class Method extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRequestFailed: false,
      requestFailedMessage: '',
      showEditModal: false,
      method: { description: '' },
      item: {}
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
    const method = { description: this.state.item.description }
    this.setState({ showEditModal: true, modalMode: mode, method: method })
  }

  handleHideEditModal () {
    this.setState({ showEditModal: false })
  }

  handleEditModalDone () {
    if (!this.props.isLoggedIn) {
      window.location.href = '/Login'
    }

    const reqBody = {}
    if (this.state.method.description) {
      reqBody.description = this.state.method.description
    }

    axios.post(config.api.getUriPrefix() + '/method/' + this.props.match.params.id, reqBody)
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
    const methodRoute = config.api.getUriPrefix() + '/method/' + this.props.match.params.id
    axios.get(methodRoute)
      .then(res => {
        this.setState({ isRequestFailed: false, requestFailedMessage: '', item: res.data.data })
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
              <button className='submission-button btn btn-secondary' onClick={this.handleShowEditModal}><FontAwesomeIcon icon='edit' /></button>
            </div>
          </div>
          <br />
          {this.state.item.parentMethod &&
            <div className='row'>
              <div className='col-md-12'>
                <div className='submission-description'>
                  <b>Parent method:</b> <a href={'/Method/' + this.state.item.parentMethod.id}>{this.state.item.parentMethod.name}</a>
                </div>
              </div>
              <br />
            </div>}
          {(this.state.item.childMethods && (this.state.item.childMethods.length > 0)) &&
            <div>
              <h2>Child Methods</h2>
              <div className='row'>
                <div className='col-md-12'>
                  <Table
                    className='detail-table'
                    columns={[{
                      title: 'Name',
                      dataIndex: 'name',
                      key: 'name',
                      width: 700
                    }]}
                    data={this.state.item.childMethods
                      ? this.state.item.childMethods.map(row => ({
                          key: row.id,
                          name: row.name
                        }))
                      : []}
                    onRow={(record) => ({
                      onClick () { window.location.href = '/Method/' + record.key }
                    })}
                    tableLayout='auto'
                    rowClassName='link'
                  />
                </div>
              </div>
              <br />
            </div>}
          <br/>
          <h2>Submissions</h2>
          <div className='row'>
            <div className='col-md-12'>
              <Table
                className='detail-table'
                columns={[{
                  title: 'Name',
                  dataIndex: 'name',
                  key: 'name',
                  width: 700
                },
                {
                  title: 'Submitted',
                  dataIndex: 'createdAt',
                  key: 'createdAt',
                  width: 200
                },
                {
                  title: 'Up-votes',
                  dataIndex: 'upvoteCount',
                  key: 'upvoteCount',
                  width: 200
                }]}
                data={this.state.item.submissions
                  ? this.state.item.submissions.map(row => ({
                      key: row.id,
                      name: row.name,
                      createdAt: new Date(row.createdAt).toLocaleDateString('en-US'),
                      upvoteCount: row.upvoteCount || 0
                    }))
                  : []}
                onRow={(record) => ({
                  onClick () { window.location.href = '/Submission/' + record.key }
                })}
                tableLayout='auto'
                rowClassName='link'
              />
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
                  value={this.state.method.description}
                  onChange={(field, value) => this.handleOnChange('method', field, value)}
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

export default Method
