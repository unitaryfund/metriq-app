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

class Task extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRequestFailed: false,
      requestFailedMessage: '',
      showEditModal: false,
      task: { description: '' },
      item: { submissions: [] },
      results: []
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
    const task = { description: this.state.item.description }
    this.setState({ showEditModal: true, modalMode: mode, task: task })
  }

  handleHideEditModal () {
    this.setState({ showEditModal: false })
  }

  handleEditModalDone () {
    if (!this.props.isLoggedIn) {
      window.location = '/Login'
    }

    const reqBody = {}
    if (this.state.task.description) {
      reqBody.description = this.state.task.description
    }

    axios.post(config.api.getUriPrefix() + '/task/' + this.props.match.params.id, reqBody)
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
    const methodRoute = config.api.getUriPrefix() + '/task/' + this.props.match.params.id
    axios.get(methodRoute)
      .then(res => {
        const item = res.data.data
        this.setState({ isRequestFailed: false, requestFailedMessage: '', item: item })
        const results = []
        for (let i = 0; i < item.submissions.length; i++) {
          for (let j = 0; j < item.submissions[i].results.length; j++) {
            if (item.submissions[i].results[j].task._id === item._id) {
              results.push(item.submissions[i].results[j])
            }
          }
        }
        results.sort(function (a, b) {
          const mna = a.metricName.toLowerCase()
          const mnb = b.metricName.toLowerCase()
          if (mna < mnb) {
            return -1
          }
          if (mnb < mna) {
            return 1
          }
          const mva = parseFloat(a.metricValue)
          const mvb = parseFloat(b.metricValue)
          if (!a.isHigherBetter) {
            if (mva < mvb) {
              return -1
            }
            if (mvb < mva) {
              return 1
            }
            return 0
          } else {
            if (mva > mvb) {
              return -1
            }
            if (mvb > mva) {
              return 1
            }
            return 0
          }
        })
        this.setState({ results: results })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div>
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
          {(this.state.item.submissions.length > 0) &&
            <div>
              <h2>Submissions</h2>
              <div className='row'>
                <div className='col-md-12'>
                  <Table
                    className='detail-table'
                    columns={[{
                      title: 'Name',
                      dataIndex: 'submissionName',
                      key: 'submissionName',
                      width: 700
                    },
                    {
                      title: 'Submitted',
                      dataIndex: 'submittedDate',
                      key: 'submittedDate',
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
                          key: row._id,
                          submissionName: row.submissionName,
                          submittedDate: new Date(row.submittedDate).toLocaleDateString('en-US'),
                          upvoteCount: row.upvotes.length
                        }))
                      : []}
                    onRow={(record) => ({
                      onClick () { window.location = '/Submission/' + record.key }
                    })}
                    tableLayout='auto'
                    rowClassName='index-table-link'
                  />
                </div>
              </div>
              <br />
              {(this.state.results.length > 0) &&
                <h2>Results</h2>}
              {(this.state.results.length > 0) &&
                <div className='row'>
                  <div className='col-md-12'>
                    <Table
                      className='detail-table'
                      columns={[{
                        title: 'Submission',
                        dataIndex: 'submissionName',
                        key: 'submissionName',
                        width: 300
                      },
                      {
                        title: 'Method',
                        dataIndex: 'methodName',
                        key: 'methodName',
                        width: 300
                      },
                      {
                        title: 'Metric',
                        dataIndex: 'metricName',
                        key: 'metricName',
                        width: 300
                      },
                      {
                        title: 'Value',
                        dataIndex: 'metricValue',
                        key: 'metricValue',
                        width: 300
                      }]}
                      data={this.state.results.map(row =>
                        ({
                          key: row.submission._id,
                          submissionName: row.submission.submissionName,
                          methodName: row.method.name,
                          metricName: row.metricName,
                          metricValue: row.metricValue
                        }))}
                      onRow={(record) => ({
                        onClick () { window.location = '/Submission/' + record.key }
                      })}
                      tableLayout='auto'
                      rowClassName='index-table-link'
                    />
                  </div>
                </div>}
            </div>}
          <div />
        </div>
        <Modal show={this.state.showEditModal} onHide={this.handleHideEditModal}>
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
                  inputName='description' inputType='textarea' label='Description'
                  value={this.state.task.description}
                  onChange={(field, value) => this.handleOnChange('task', field, value)}
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

export default Task
