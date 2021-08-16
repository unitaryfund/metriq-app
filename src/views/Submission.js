import axios from 'axios'
import React from 'react'
import config from './../config'
import Table from 'rc-table'
import ErrorHandler from './../components/ErrorHandler'
import EditButton from '../components/EditButton'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldSelectRow from '../components/FormFieldSelectRow'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import { Accordion, Button, Card, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faExternalLinkAlt, faThumbsUp, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

library.add(faEdit, faExternalLinkAlt, faThumbsUp, faPlus, faTrash)

const dateRegex = /^\d{4}-\d{2}-\d{2}$/
const metricNameRegex = /.{1,}/
const methodNameRegex = /.{1,}/
const taskNameRegex = /.{1,}/
const tagNameRegex = /.{1,}/
const metricValueRegex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/

class Submission extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRequestFailed: false,
      requestFailedMessage: '',
      item: { upvotes: 0, tags: [], tasks: [], methods: [], results: [] },
      metricNames: [],
      methodNames: [],
      taskNames: [],
      tagNames: [],
      allMethodNames: [],
      allTaskNames: [],
      allTagNames: [],
      showAddModal: false,
      showRemoveModal: false,
      showEditModal: false,
      showAccordian: false,
      modalMode: '',
      submission: {
        description: '',
        submissionThumbnailUrl: ''
      },
      result: {
        task: '',
        method: '',
        metricName: '',
        metricValue: 0,
        isHigherBetter: false,
        evaluatedDate: new Date()
      },
      task: {
        name: '',
        fullName: '',
        parentTask: '',
        description: '',
        submissions: this.props.match.params.id
      },
      method: {
        name: '',
        fullName: '',
        submissions: this.props.match.params.id
      },
      taskId: '',
      methodId: '',
      tag: ''
    }

    this.handleAddDescription = this.handleAddDescription.bind(this)
    this.handleHideEditModal = this.handleHideEditModal.bind(this)
    this.handleEditModalDone = this.handleEditModalDone.bind(this)
    this.handleAccordianToggle = this.handleAccordianToggle.bind(this)
    this.handleUpVoteOnClick = this.handleUpVoteOnClick.bind(this)
    this.handleOnClickAdd = this.handleOnClickAdd.bind(this)
    this.handleOnClickRemove = this.handleOnClickRemove.bind(this)
    this.handleHideAddModal = this.handleHideAddModal.bind(this)
    this.handleHideRemoveModal = this.handleHideRemoveModal.bind(this)
    this.handleAddModalSubmit = this.handleAddModalSubmit.bind(this)
    this.handleRemoveModalDone = this.handleRemoveModalDone.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnTaskRemove = this.handleOnTaskRemove.bind(this)
    this.handleOnMethodRemove = this.handleOnMethodRemove.bind(this)
    this.handleOnResultRemove = this.handleOnResultRemove.bind(this)
    this.handleOnTagRemove = this.handleOnTagRemove.bind(this)
    this.handleTrimTasks = this.handleTrimTasks.bind(this)
    this.handleTrimMethods = this.handleTrimMethods.bind(this)
    this.handleTrimTags = this.handleTrimTags.bind(this)
  }

  handleAddDescription () {
    let mode = 'Edit'
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    const submission = { description: this.state.item.description, submissionThumbnailUrl: this.state.item.submissionThumbnailUrl }
    this.setState({ showEditModal: true, modalMode: mode, submission: submission })
  }

  handleHideEditModal () {
    this.setState({ showEditModal: false })
  }

  handleEditModalDone () {
    if (!this.props.isLoggedIn) {
      window.location = '/Login'
    }

    const reqBody = {}
    if (this.state.submission.submissionThumbnailUrl) {
      reqBody.submissionThumbnailUrl = this.state.submission.submissionThumbnailUrl
    }
    if (this.state.submission.description) {
      reqBody.description = this.state.submission.description
    }

    axios.post(config.api.getUriPrefix() + '/submission/' + this.props.match.params.id, reqBody)
      .then(res => {
        this.setState({ item: res.data.data, showEditModal: false })
      })
      .catch(err => {
        window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
      })
  }

  handleAccordianToggle () {
    this.setState({ showAccordian: !this.state.showAccordian })
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

  handleOnTaskRemove (taskId) {
    if (!window.confirm('Are you sure you want to remove this task from the submission?')) {
      return
    }
    if (this.props.isLoggedIn) {
      axios.delete(config.api.getUriPrefix() + '/submission/' + this.props.match.params.id + '/task/' + taskId)
        .then(res => {
          const submission = res.data.data
          const tasks = [...this.state.allTaskNames]
          this.handleTrimTasks(submission, tasks)
          this.setState({ item: submission, taskNames: tasks })
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      window.location = '/Login'
    }
  }

  handleOnMethodRemove (methodId) {
    if (!window.confirm('Are you sure you want to remove this method from the submission?')) {
      return
    }
    if (this.props.isLoggedIn) {
      axios.delete(config.api.getUriPrefix() + '/submission/' + this.props.match.params.id + '/method/' + methodId)
        .then(res => {
          const submission = res.data.data
          const methods = [...this.state.allMethodNames]
          this.handleTrimMethods(submission, methods)
          this.setState({ item: submission, methodNames: methods })
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      window.location = '/Login'
    }
  }

  handleOnTagRemove (tagName) {
    if (!window.confirm('Are you sure you want to remove this tag from the submission?')) {
      return
    }
    if (this.props.isLoggedIn) {
      axios.delete(config.api.getUriPrefix() + '/submission/' + this.props.match.params.id + '/tag/' + tagName)
        .then(res => {
          const submission = res.data.data
          const tags = [...this.state.allTagNames]
          this.handleTrimTags(submission, tags)
          this.setState({ item: submission, tagNames: tags })
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      window.location = '/Login'
    }
  }

  handleOnResultRemove (resultId) {
    if (!window.confirm('Are you sure you want to delete this result?')) {
      return
    }
    if (this.props.isLoggedIn) {
      axios.delete(config.api.getUriPrefix() + '/result/' + resultId)
        .then(res => {
          const rId = res.data.data._id
          const item = { ...this.state.item }
          console.log(item)
          for (let i = 0; i < item.results.length; i++) {
            if (item.results[i]._id === rId) {
              item.results.splice(i, 1)
              break
            }
          }
          this.setState({ item: item })
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      window.location = '/Login'
    }
  }

  handleUpVoteOnClick (event) {
    if (this.props.isLoggedIn) {
      axios.post(config.api.getUriPrefix() + '/submission/' + this.props.match.params.id + '/upvote', {})
        .then(res => {
          this.setState({ item: res.data.data })
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else {
      window.location = '/Login'
    }
    event.preventDefault()
  }

  handleOnClickAdd (mode) {
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    this.setState({ showAddModal: true, showAccordian: false, modalMode: mode })
  }

  handleOnClickRemove (mode) {
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    this.setState({ showRemoveModal: true, modalMode: mode })
  }

  handleHideAddModal () {
    this.setState({ showAddModal: false, showAccordian: false })
  }

  handleHideRemoveModal () {
    this.setState({ showRemoveModal: false })
  }

  handleAddModalSubmit () {
    if (!this.props.isLoggedIn) {
      window.location = '/Login'
    }

    if (this.state.modalMode === 'Task') {
      if (this.state.showAccordian) {
        axios.post(config.api.getUriPrefix() + '/task', this.state.task)
          .then(res => {
            window.location.reload()
          })
          .catch(err => {
            window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
          })
      } else {
        axios.post(config.api.getUriPrefix() + '/submission/' + this.props.match.params.id + '/task/' + this.state.taskId, {})
          .then(res => {
            const submission = res.data.data
            const tasks = [...this.state.taskNames]
            for (let j = 0; j < tasks.length; j++) {
              if (this.state.taskId === tasks[j]._id) {
                tasks.splice(j, 1)
                break
              }
            }
            this.setState({ isRequestFailed: false, requestFailedMessage: '', taskNames: tasks, item: submission })
          })
          .catch(err => {
            window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
          })
      }
    } else if (this.state.modalMode === 'Method') {
      if (this.state.showAccordian) {
        axios.post(config.api.getUriPrefix() + '/method', this.state.method)
          .then(res => {
            window.location.reload()
          })
          .catch(err => {
            window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
          })
      } else {
        axios.post(config.api.getUriPrefix() + '/submission/' + this.props.match.params.id + '/method/' + this.state.methodId, {})
          .then(res => {
            const submission = res.data.data
            const methods = [...this.state.methodNames]
            for (let j = 0; j < methods.length; j++) {
              if (this.state.methodId === methods[j]._id) {
                methods.splice(j, 1)
                break
              }
            }
            this.setState({ isRequestFailed: false, requestFailedMessage: '', methodNames: methods, item: submission })
          })
          .catch(err => {
            window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
          })
      }
    } else if (this.state.modalMode === 'Tag') {
      axios.post(config.api.getUriPrefix() + '/submission/' + this.props.match.params.id + '/tag/' + this.state.tag, {})
        .then(res => {
          const submission = res.data.data
          const tags = [...this.state.tagNames]
          for (let j = 0; j < tags.length; j++) {
            if (this.state.tag === tags[j].name) {
              tags.splice(j, 1)
              break
            }
          }
          this.setState({ isRequestFailed: false, requestFailedMessage: '', tagNames: tags, item: submission })
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    } else if (this.state.modalMode === 'Result') {
      const result = this.state.result
      if (!result.task) {
        result.task = this.state.item.tasks[0]._id
      }
      if (!result.method) {
        result.method = this.state.item.methods[0]._id
      }
      console.log(result)
      if (!result.metricName) {
        window.alert('Error: Metric Name cannot be blank.')
      }
      if (!result.metricValue) {
        window.alert('Error: Metric Value cannot be blank.')
      }
      if (!result.evaluatedDate) {
        result.evaluatedDate = new Date()
      }
      const resultRoute = config.api.getUriPrefix() + '/submission/' + this.props.match.params.id + '/result'
      axios.post(resultRoute, result)
        .then(res => {
          this.setState({ isRequestFailed: false, requestFailedMessage: '', item: res.data.data })
        })
        .catch(err => {
          window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
        })
    }

    this.setState({ showAddModal: false })
  }

  handleRemoveModalDone () {
    this.setState({ showRemoveModal: false })
  }

  handleTrimTasks (submission, tasks) {
    for (let i = 0; i < submission.tasks.length; i++) {
      for (let j = 0; j < tasks.length; j++) {
        if (submission.tasks[i]._id === tasks[j]._id) {
          tasks.splice(j, 1)
          break
        }
      }
    }
  }

  handleTrimMethods (submission, methods) {
    for (let i = 0; i < submission.methods.length; i++) {
      for (let j = 0; j < methods.length; j++) {
        if (submission.methods[i]._id === methods[j]._id) {
          methods.splice(j, 1)
          break
        }
      }
    }
  }

  handleTrimTags (submission, tags) {
    for (let i = 0; i < submission.tags.length; i++) {
      for (let j = 0; j < tags.length; j++) {
        if (submission.tags[i]._id === tags[j]._id) {
          tags.splice(j, 1)
          break
        }
      }
    }
  }

  componentDidMount () {
    const submissionRoute = config.api.getUriPrefix() + '/submission/' + this.props.match.params.id
    axios.get(submissionRoute)
      .then(subRes => {
        const submission = subRes.data.data

        const taskNamesRoute = config.api.getUriPrefix() + '/task/names'
        axios.get(taskNamesRoute)
          .then(res => {
            const tasks = [...res.data.data]
            this.handleTrimTasks(submission, tasks)

            let defTask = ''
            if (tasks.length) {
              defTask = tasks[0]._id
            }

            this.setState({ isRequestFailed: false, requestFailedMessage: '', allTaskNames: res.data.data, taskNames: tasks, taskId: defTask })

            const methodNamesRoute = config.api.getUriPrefix() + '/method/names'
            axios.get(methodNamesRoute)
              .then(res => {
                const methods = [...res.data.data]
                this.handleTrimMethods(submission, methods)

                let defMethod = ''
                if (methods.length) {
                  defMethod = methods[0]._id
                }

                this.setState({ isRequestFailed: false, requestFailedMessage: '', allMethodNames: res.data.data, methodNames: methods, methodId: defMethod })

                const tagNamesRoute = config.api.getUriPrefix() + '/tag/names'
                axios.get(tagNamesRoute)
                  .then(res => {
                    const tags = [...res.data.data]
                    this.handleTrimTags(submission, tags)

                    this.setState({ isRequestFailed: false, requestFailedMessage: '', allTagNames: res.data.data, tagNames: tags, item: submission })
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
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='submission-description'>
              {this.state.item.description ? this.state.item.description : <div className='card bg-light'><div className='card-body'><i>(No description provided.)</i><button className='btn btn-link' onClick={this.handleAddDescription}>Add one.</button></div></div>}
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <button className='submission-button btn btn-secondary' onClick={this.handleUpVoteOnClick}><FontAwesomeIcon icon='thumbs-up' /> {this.state.item.upvotes.length}</button>
            <button className='submission-button btn btn-secondary' onClick={() => { window.open(this.item.submissionContentUrl, '_blank') }}><FontAwesomeIcon icon={faExternalLinkAlt} /></button>
            <button className='submission-button btn btn-secondary' onClick={this.handleAddDescription}><FontAwesomeIcon icon='edit' /></button>
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
            {(this.state.item.tasks.length > 0) &&
              <Table
                columns={[{
                  title: 'Task',
                  dataIndex: 'name',
                  key: 'name',
                  width: 700
                }]}
                data={this.state.item.tasks.map(row =>
                  ({
                    key: row._id,
                    name: row.name
                  }))}
                onRow={(record) => ({
                  onClick () { window.location = '/Task/' + record.key }
                })}
                tableLayout='auto'
                rowClassName='index-table-link'
                showHeader={false}
              />}
            {(this.state.item.tasks.length === 0) &&
              <div className='card bg-light'>
                <div className='card-body'>There are no associated tasks, yet.</div>
              </div>}
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
            {(this.state.item.methods.length > 0) &&
              <Table
                columns={[{
                  title: 'Method',
                  dataIndex: 'name',
                  key: 'name',
                  width: 700
                }]}
                data={this.state.item.methods.map(row =>
                  ({
                    key: row._id,
                    name: row.name
                  }))}
                onRow={(record) => ({
                  onClick () { window.location = '/Method/' + record.key }
                })}
                tableLayout='auto'
                rowClassName='index-table-link'
                showHeader={false}
              />}
            {(this.state.item.methods.length === 0) &&
              <div className='card bg-light'>
                <div className='card-body'>There are no associated methods, yet.</div>
              </div>}
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
            {(this.state.item.results.length > 0) &&
              <Table
                columns={[
                  {
                    title: 'Task',
                    dataIndex: 'taskName',
                    key: 'taskName',
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
                  }
                ]}
                data={this.state.item.results.length
                  ? this.state.item.results.map(row =>
                      ({
                        key: row._id,
                        taskName: row.task.name,
                        methodName: row.method.name,
                        metricName: row.metricName,
                        metricValue: row.metricValue
                      }))
                  : []}
                tableLayout='auto'
              />}
            {(this.state.item.results.length === 0) &&
              <div className='card bg-light'>
                <div className='card-body'>There are no associated results, yet.</div>
              </div>}
          </div>
        </div>
        <br />
        <div className='row'>
          <div className='col-md-12'>
            <div>
              <h2>Tags
                <EditButton
                  className='float-right edit-button btn'
                  onClickAdd={() => this.handleOnClickAdd('Tag')}
                  onClickRemove={() => this.handleOnClickRemove('Tag')}
                />
              </h2>
              <hr />
            </div>
            {(this.state.item.tags.length > 0) &&
              this.state.item.tags.map(tag => <span key={tag._id}><Link to={'/Tag/' + tag.name}>{tag.name}</Link> </span>)}
            {(this.state.item.tags.length === 0) &&
              <div className='card bg-light'>
                <div className='card-body'>There are no associated tags, yet.</div>
              </div>}
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
            {(this.state.modalMode === 'Method') &&
              <span>
                <FormFieldSelectRow
                  inputName='methodId'
                  label='Method'
                  options={this.state.methodNames}
                  onChange={(field, value) => this.handleOnChange('', field, value)}
                /><br />
                Not in the list?<br />
                <Accordion defaultActiveKey='0'>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant='link' eventKey='1' onClick={this.handleAccordianToggle}>
                        <FontAwesomeIcon icon='plus' /> Create a new method.
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey='1'>
                      <Card.Body>
                        <FormFieldRow
                          inputName='name'
                          inputType='text'
                          label='Name'
                          onChange={(field, value) => this.handleOnChange('method', field, value)}
                          validRegex={methodNameRegex}
                        /><br />
                        <FormFieldRow
                          inputName='fullName'
                          inputType='text'
                          label='Full name'
                          onChange={(field, value) => this.handleOnChange('method', field, value)}
                          validRegex={methodNameRegex}
                        /><br />
                        <FormFieldRow
                          inputName='description'
                          inputType='textarea'
                          label='Description'
                          onChange={(field, value) => this.handleOnChange('method', field, value)}
                        />
                        <div className='row'>
                          <div className='col-md-12'>
                            <input type='submit' className='btn btn-primary float-right' value='Create' />
                          </div>
                        </div>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </span>}
            {(this.state.modalMode === 'Task') &&
              <span>
                <FormFieldSelectRow
                  inputName='taskId'
                  label='Task'
                  options={this.state.taskNames}
                  onChange={(field, value) => this.handleOnChange('', field, value)}
                /><br />
                Not in the list?<br />
                <Accordion defaultActiveKey='0'>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant='link' eventKey='1' onClick={this.handleAccordianToggle}>
                        <FontAwesomeIcon icon='plus' /> Create a new task.
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey='1'>
                      <Card.Body>
                        <FormFieldRow
                          inputName='name'
                          inputType='text'
                          label='Name'
                          onChange={(field, value) => this.handleOnChange('task', field, value)}
                          validRegex={taskNameRegex}
                        /><br />
                        <FormFieldRow
                          inputName='fullName'
                          inputType='text'
                          label='Full name'
                          onChange={(field, value) => this.handleOnChange('task', field, value)}
                          validRegex={taskNameRegex}
                        /><br />
                        <FormFieldSelectRow
                          inputName='taskParent'
                          label='Parent task (if any)'
                          isNullDefault
                          options={this.state.allTaskNames}
                          onChange={(field, value) => this.handleOnChange('task', field, value)}
                        /><br />
                        <FormFieldRow
                          inputName='description'
                          inputType='textarea'
                          label='Description'
                          onChange={(field, value) => this.handleOnChange('task', field, value)}
                        />
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </span>}
            {(this.state.modalMode === 'Result') && ((this.state.item.tasks.length === 0) || (this.state.item.methods.length === 0)) &&
              <span>
                A <b>result</b> must cross-reference a <b>task</b> and a <b>method</b>.<br /><br />Make sure to add your task and method to the submission, first.
              </span>}
            {(this.state.modalMode === 'Result') && (this.state.item.tasks.length > 0) && (this.state.item.methods.length > 0) &&
              <span>
                <FormFieldSelectRow
                  inputName='task' label='Task'
                  options={this.state.item.tasks}
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                /><br />
                <FormFieldSelectRow
                  inputName='method' label='Method'
                  options={this.state.item.methods}
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                /><br />
                <FormFieldTypeaheadRow
                  inputName='metricName' label='Metric name'
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                  validRegex={metricNameRegex}
                  options={this.state.metricNames}
                  value=''
                /><br />
                <FormFieldRow
                  inputName='metricValue' inputType='number' label='Metric value'
                  validRegex={metricValueRegex}
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                /><br />
                <FormFieldRow
                  inputName='evaluatedDate' inputType='date' label='Evaluated'
                  validRegex={dateRegex}
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                /><br />
                <FormFieldRow
                  inputName='isHigherBetter' inputType='checkbox' label='Is higher better?'
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                />
              </span>}
            {(this.state.modalMode === 'Tag') &&
              <span>
                <FormFieldTypeaheadRow
                  inputName='tag' label='Tag'
                  onChange={(field, value) => this.handleOnChange('', field, value)}
                  validRegex={tagNameRegex}
                  options={this.state.tagNames.map(item => item.name)}
                /><br />
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
            {(this.state.modalMode === 'Task') &&
              <span>
                <b>Attached tasks:</b><br />
                {(this.state.item.tasks.length > 0) &&
                  this.state.item.tasks.map(task =>
                    <div key={task._id}>
                      <hr />
                      <div className='row'>
                        <div className='col-md-10'>
                          {task.name}
                        </div>
                        <div className='col-md-2'>
                          <button className='btn btn-danger' onClick={() => this.handleOnTaskRemove(task._id)}><FontAwesomeIcon icon='trash' /> </button>
                        </div>
                      </div>
                    </div>
                  )}
                {(this.state.item.tasks.length === 0) &&
                  <span><i>There are no attached tasks.</i></span>}
              </span>}
            {(this.state.modalMode === 'Method') &&
              <span>
                <b>Attached methods:</b><br />
                {(this.state.item.methods.length > 0) &&
                  this.state.item.methods.map(method =>
                    <div key={method._id}>
                      <hr />
                      <div className='row'>
                        <div className='col-md-10'>
                          {method.name}
                        </div>
                        <div className='col-md-2'>
                          <button className='btn btn-danger' onClick={() => this.handleOnMethodRemove(method._id)}><FontAwesomeIcon icon='trash' /> </button>
                        </div>
                      </div>
                    </div>
                  )}
                {(this.state.item.methods.length === 0) &&
                  <span><i>There are no attached methods.</i></span>}
              </span>}
            {(this.state.modalMode === 'Result') &&
              <span>
                <b>Attached results:</b><br />
                {(this.state.item.results.length > 0) &&
                  this.state.item.results.map(result =>
                    <div key={result._id}>
                      <hr />
                      <div className='row'>
                        <div className='col-md-10'>
                          {result.task.name}, {result.method.name}, {result.metricName}: {result.metricValue}
                        </div>
                        <div className='col-md-2'>
                          <button className='btn btn-danger' onClick={() => this.handleOnResultRemove(result._id)}><FontAwesomeIcon icon='trash' /> </button>
                        </div>
                      </div>
                    </div>
                  )}
                {(this.state.item.results.length === 0) &&
                  <span><i>There are no attached results.</i></span>}
              </span>}
            {(this.state.modalMode === 'Tag') &&
              <span>
                <b>Attached tags:</b><br />
                {(this.state.item.results.length > 0) &&
                  this.state.item.tags.map(tag =>
                    <div key={tag._id}>
                      <hr />
                      <div className='row'>
                        <div className='col-md-10'>
                          {tag.name}
                        </div>
                        <div className='col-md-2'>
                          <button className='btn btn-danger' onClick={() => this.handleOnTagRemove(tag.name)}><FontAwesomeIcon icon='trash' /> </button>
                        </div>
                      </div>
                    </div>
                  )}
                {(this.state.item.tags.length === 0) &&
                  <span><i>There are no attached tags.</i></span>}
              </span>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={this.handleRemoveModalDone}>
              {(this.state.modalMode === 'Login') ? 'Cancel' : 'Done'}
            </Button>
          </Modal.Footer>
        </Modal>
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
                  inputName='submissionThumbnailUrl' inputType='text' label='Thumbnail URL'
                  value={this.state.submission.submissionThumbnailUrl}
                  onChange={(field, value) => this.handleOnChange('submission', field, value)}
                /><br />
                <FormFieldRow
                  inputName='description' inputType='textarea' label='Description'
                  value={this.state.submission.description}
                  onChange={(field, value) => this.handleOnChange('submission', field, value)}
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

export default Submission
