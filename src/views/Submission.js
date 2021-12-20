import axios from 'axios'
import React from 'react'
import config from './../config'
import Table from 'rc-table'
import ErrorHandler from './../components/ErrorHandler'
import EditButton from '../components/EditButton'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldSelectRow from '../components/FormFieldSelectRow'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { Accordion, Button, Card, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faExternalLinkAlt, faThumbsUp, faPlus, faTrash, faMobileAlt, faStickyNote, faSuperscript } from '@fortawesome/free-solid-svg-icons'

library.add(faEdit, faExternalLinkAlt, faThumbsUp, faPlus, faTrash, faMobileAlt, faStickyNote, faSuperscript)

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
      isValidated: false,
      isRequestFailed: false,
      requestFailedMessage: '',
      isArxiv: false,
      vanityUrl: '',
      bibtexUrl: '',
      item: { isUpvoted: false, upvotesCount: 0, tags: [], tasks: [], methods: [], results: [] },
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
      showAccordion: false,
      modalMode: '',
      modalTextMode: '',
      submission: {
        description: ''
      },
      moderationReport: {
        description: ''
      },
      result: {
        id: '',
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
        description: '',
        submissions: this.props.match.params.id
      },
      taskId: '',
      methodId: '',
      tag: ''
    }

    this.handleAddDescription = this.handleAddDescription.bind(this)
    this.handleModerationReport = this.handleModerationReport.bind(this)
    this.handleHideEditModal = this.handleHideEditModal.bind(this)
    this.handleEditModalDone = this.handleEditModalDone.bind(this)
    this.handleAccordionToggle = this.handleAccordionToggle.bind(this)
    this.handleUpVoteOnClick = this.handleUpVoteOnClick.bind(this)
    this.handleOnClickAdd = this.handleOnClickAdd.bind(this)
    this.handleOnClickRemove = this.handleOnClickRemove.bind(this)
    this.handleOnClickAddResult = this.handleOnClickAddResult.bind(this)
    this.handleOnClickEditResult = this.handleOnClickEditResult.bind(this)
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
    this.isAllValid = this.isAllValid.bind(this)
  }

  handleAddDescription () {
    let mode = 'Edit'
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    const submission = { description: this.state.item.description }
    this.setState({ showEditModal: true, modalMode: mode, submission: submission })
  }

  handleModerationReport () {
    let mode = 'Moderation'
    const modalTextMode = 'Moderation'
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    const submission = { description: this.state.item.description }
    this.setState({ showEditModal: true, modalMode: mode, modalTextMode: modalTextMode, submission: submission })
  }

  handleHideEditModal () {
    this.setState({ showEditModal: false })
  }

  handleEditModalDone () {
    if (!this.props.isLoggedIn) {
      window.location.href = '/Login'
    }

    const isModerationReport = (this.state.modalMode === 'Moderation')

    const reqBody = {}
    if (isModerationReport && this.state.moderationReport.description) {
      reqBody.description = this.state.moderationReport.description
    } else if (this.state.submission.description) {
      reqBody.description = this.state.submission.description
    }

    let requestUrl = config.api.getUriPrefix() + '/submission/' + this.props.match.params.id
    if (isModerationReport) {
      requestUrl = requestUrl + '/report'
    }

    axios.post(requestUrl, reqBody)
      .then(res => {
        if (isModerationReport) {
          window.alert('Thank you, your report has been submitted to the moderators. They will contact you via your Metriq account email, if further action is necessary.')
          this.setState({ showEditModal: false })
        } else {
          this.setState({ item: res.data.data, showEditModal: false })
        }
      })
      .catch(err => {
        window.alert('Error: ' + ErrorHandler(err) + '\nSorry! Check your connection and login status, and try again.')
      })
  }

  handleAccordionToggle () {
    this.setState({ showAccordion: !this.state.showAccordion, isValidated: false })
  }

  handleOnChange (key1, key2, value) {
    if (!value && value !== false) {
      value = null
    }
    if (key1) {
      const k1 = this.state[key1]
      k1[key2] = value
      this.setState({ [key1]: k1, isValidated: false })
    } else {
      this.setState({ [key2]: value, isValidated: false })
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
      window.location.href = '/Login'
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
      window.location.href = '/Login'
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
      window.location.href = '/Login'
    }
  }

  handleOnResultRemove (resultId) {
    if (!window.confirm('Are you sure you want to delete this result?')) {
      return
    }
    if (this.props.isLoggedIn) {
      axios.delete(config.api.getUriPrefix() + '/result/' + resultId)
        .then(res => {
          const rId = res.data.data.id
          const item = { ...this.state.item }
          for (let i = 0; i < item.results.length; i++) {
            if (item.results[i].id === rId) {
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
      window.location.href = '/Login'
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
      window.location.href = '/Login'
    }
    event.preventDefault()
  }

  handleOnClickAdd (mode) {
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    this.setState({ showAddModal: true, showAccordion: false, modalMode: mode, isValidated: false })
  }

  handleOnClickRemove (mode) {
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    this.setState({ showRemoveModal: true, modalMode: mode })
  }

  handleOnClickAddResult () {
    const result = {
      id: '',
      task: '',
      method: '',
      metricName: '',
      metricValue: 0,
      isHigherBetter: false,
      evaluatedDate: new Date()
    }
    this.setState({ result: result })
    this.handleOnClickAdd('Result')
  }

  handleOnClickEditResult (resultId) {
    for (let i = 0; i < this.state.item.results.length; i++) {
      if (this.state.item.results[i].id === resultId) {
        const result = this.state.item.results[i]
        result.submissionId = this.state.item.id
        this.setState({ result: result })
        break
      }
    }
    this.handleOnClickAdd('Result')
  }

  handleHideAddModal () {
    this.setState({ showAddModal: false, showAccordion: false })
  }

  handleHideRemoveModal () {
    this.setState({ showRemoveModal: false })
  }

  handleAddModalSubmit () {
    if (!this.props.isLoggedIn) {
      window.location.href = '/Login'
    }

    if (this.state.modalMode === 'Task') {
      if (this.state.showAccordion) {
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
              if (this.state.taskId === tasks[j].id) {
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
      if (this.state.showAccordion) {
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
              if (this.state.methodId === methods[j].id) {
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
        result.task = this.state.item.tasks[0].id
      }
      if (!result.method) {
        result.method = this.state.item.methods[0].id
      }
      if (!result.metricName) {
        window.alert('Error: Metric Name cannot be blank.')
      }
      if (!result.metricValue) {
        window.alert('Error: Metric Value cannot be blank.')
      }
      if (!result.evaluatedDate) {
        result.evaluatedDate = new Date()
      }
      const resultRoute = config.api.getUriPrefix() + (result.id ? ('/result/' + result.id) : ('/submission/' + this.props.match.params.id + '/result'))
      const request = axios.post(resultRoute, result)
      request
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
        if (submission.tasks[i].id === tasks[j].id) {
          tasks.splice(j, 1)
          break
        }
      }
    }
  }

  handleTrimMethods (submission, methods) {
    for (let i = 0; i < submission.methods.length; i++) {
      for (let j = 0; j < methods.length; j++) {
        if (submission.methods[i].id === methods[j].id) {
          methods.splice(j, 1)
          break
        }
      }
    }
  }

  handleTrimTags (submission, tags) {
    for (let i = 0; i < submission.tags.length; i++) {
      for (let j = 0; j < tags.length; j++) {
        if (submission.tags[i].id === tags[j].id) {
          tags.splice(j, 1)
          break
        }
      }
    }
  }

  isAllValid () {
    if (this.state.modalMode === 'Login') {
      if (this.state.isValidated) {
        this.setState({ isValidated: true })
      }
      return true
    }

    if (this.state.modalMode === 'Task') {
      if (this.state.showAccordion) {
        if (!taskNameRegex.test(this.state.task.name)) {
          return false
        }
        if (!taskNameRegex.test(this.state.task.fullName)) {
          return false
        }
      } else if (!this.state.taskId) {
        return false
      }
    } else if (this.state.modalMode === 'Method') {
      if (this.state.showAccordion) {
        if (!methodNameRegex.test(this.state.method.name)) {
          return false
        }
        if (!methodNameRegex.test(this.state.method.fullName)) {
          return false
        }
      } else if (!this.state.methodId) {
        return false
      }
    } else if (this.state.modalMode === 'Result') {
      if (!metricNameRegex.test(this.state.result.metricName)) {
        return false
      }
      if (!metricValueRegex.test(this.state.result.metricValue)) {
        return false
      }
    }

    if (this.state.isValidated) {
      this.setState({ isValidated: true })
    }

    return true
  }

  componentDidMount () {
    const submissionRoute = config.api.getUriPrefix() + '/submission/' + this.props.match.params.id
    axios.get(submissionRoute)
      .then(subRes => {
        const submission = subRes.data.data

        let isArxiv = false
        let vanityUrl = ''
        let bibtexUrl = ''
        const url = submission.contentUrl
        if (url.toLowerCase().startsWith('https://arxiv.org/')) {
          isArxiv = true
          let urlTail = url.substring(18)
          vanityUrl = 'https://www.arxiv-vanity.com/' + urlTail
          urlTail = urlTail.substring(4)
          bibtexUrl = 'https://arxiv.org/bibtex/' + urlTail
        }

        // Just get the view populated as quickly as possible, before we "trim."
        this.setState({ isRequestFailed: false, requestFailedMessage: '', item: submission, isArxiv: isArxiv, vanityUrl: vanityUrl, bibtexUrl: bibtexUrl })

        const taskNamesRoute = config.api.getUriPrefix() + '/task/names'
        axios.get(taskNamesRoute)
          .then(res => {
            const tasks = [...res.data.data]
            this.handleTrimTasks(submission, tasks)

            let defTask = ''
            if (tasks.length) {
              defTask = tasks[0].id
            }

            this.setState({ isRequestFailed: false, requestFailedMessage: '', allTaskNames: res.data.data, taskNames: tasks, taskId: defTask })

            const methodNamesRoute = config.api.getUriPrefix() + '/method/names'
            axios.get(methodNamesRoute)
              .then(res => {
                const methods = [...res.data.data]
                this.handleTrimMethods(submission, methods)

                let defMethod = ''
                if (methods.length) {
                  defMethod = methods[0].id
                }

                this.setState({ isRequestFailed: false, requestFailedMessage: '', allMethodNames: res.data.data, methodNames: methods, methodId: defMethod })

                const tagNamesRoute = config.api.getUriPrefix() + '/tag/names'
                axios.get(tagNamesRoute)
                  .then(res => {
                    const tags = [...res.data.data]
                    this.handleTrimTags(submission, tags)

                    this.setState({ isRequestFailed: false, requestFailedMessage: '', allTagNames: res.data.data, tagNames: tags })
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

    const metricNameRoute = config.api.getUriPrefix() + '/result/metricNames'
    axios.get(metricNameRoute)
      .then(subRes => {
        const metricNames = subRes.data.data
        this.setState({ metricNames: metricNames })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div id='metriq-main-content' className='container submission-detail-container'>
        <div className='row'>
          <div className='col-md-12'>
            <div><h1>{this.state.item.name}</h1></div>
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
            <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Upvote submission</Tooltip>}>
              <button className={'submission-button btn ' + (this.state.item.isUpvoted ? 'btn-primary' : 'btn-secondary')} onClick={this.handleUpVoteOnClick}><FontAwesomeIcon icon='thumbs-up' /> {this.state.item.upvotesCount}</button>
            </OverlayTrigger>
            <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Submission link</Tooltip>}>
              <button className='submission-button btn btn-secondary' onClick={() => { window.open(this.state.item.contentUrl, '_blank') }}><FontAwesomeIcon icon={faExternalLinkAlt} /></button>
            </OverlayTrigger>
            {this.state.isArxiv &&
              <span>
                <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Mobile view preprint</Tooltip>}>
                  <button className='submission-button btn btn-secondary' onClick={() => { window.open(this.state.vanityUrl, '_blank') }}><FontAwesomeIcon icon={faMobileAlt} /></button>
                </OverlayTrigger>
                <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>BibTex reference</Tooltip>}>
                  <button className='submission-button btn btn-secondary' onClick={() => { window.open(this.state.bibtexUrl, '_blank') }}><FontAwesomeIcon icon={faSuperscript} /></button>
                </OverlayTrigger>
              </span>}
            <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Edit submission</Tooltip>}>
              <button className='submission-button btn btn-secondary' onClick={this.handleAddDescription}><FontAwesomeIcon icon='edit' /></button>
            </OverlayTrigger>
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
                    key: row.id,
                    name: row.name
                  }))}
                onRow={(record) => ({
                  onClick () { window.location.href = '/Task/' + record.key }
                })}
                tableLayout='auto'
                rowClassName='link'
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
                    key: row.id,
                    name: row.name
                  }))}
                onRow={(record) => ({
                  onClick () { window.location.href = '/Method/' + record.key }
                })}
                tableLayout='auto'
                rowClassName='link'
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
                  onClickAdd={() => this.handleOnClickAddResult()}
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
                    width: 280
                  },
                  {
                    title: 'Method',
                    dataIndex: 'methodName',
                    key: 'methodName',
                    width: 280
                  },
                  {
                    title: 'Metric',
                    dataIndex: 'metricName',
                    key: 'metricName',
                    width: 280
                  },
                  {
                    title: 'Value',
                    dataIndex: 'metricValue',
                    key: 'metricValue',
                    width: 280
                  },
                  {
                    title: 'Notes',
                    dataIndex: 'notes',
                    key: 'notes',
                    width: 40,
                    render: (value, row, index) => <div className='text-center'>{row.notes && <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}><span className='display-linebreak'>{row.notes}</span></Tooltip>}><div className='text-center'><FontAwesomeIcon icon='sticky-note' /></div></OverlayTrigger>}</div>
                  },
                  {
                    title: '',
                    dataIndex: 'edit',
                    key: 'edit',
                    width: 40,
                    render: (value, row, index) => <div className='text-center'><FontAwesomeIcon icon='edit' onClick={() => this.handleOnClickEditResult(row.key)} /></div>
                  }
                ]}
                data={this.state.item.results.length
                  ? this.state.item.results.map(row =>
                      ({
                        key: row.id,
                        taskName: row.task.name,
                        methodName: row.method.name,
                        metricName: row.metricName,
                        metricValue: row.metricValue,
                        notes: row.notes
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
              this.state.item.tags.map(tag => <span key={tag.id}><Link to={'/Tag/' + tag.name}>{tag.name}</Link> </span>)}
            {(this.state.item.tags.length === 0) &&
              <div className='card bg-light'>
                <div className='card-body'>There are no associated tags, yet.</div>
              </div>}
          </div>
        </div>
        <br />
        <div className='row'>
          <div className='col-md-12'>
            <hr />
            <div className='text-center'>
              Notice something about this submission that needs moderation? <span className='link' onClick={this.handleModerationReport}>Let us know.</span>
            </div>
          </div>
        </div>
        <Modal
          show={this.state.showAddModal} onHide={this.handleHideAddModal}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          {(this.state.modalMode === 'Login') &&
            <Modal.Header closeButton>
              <Modal.Title>Add</Modal.Title>
            </Modal.Header>}
          {(this.state.modalMode !== 'Login') &&
            <Modal.Header closeButton>
              <Modal.Title>{(this.state.modalMode === 'Result' && this.state.result.id) ? 'Edit' : 'Add'} {this.state.modalMode}</Modal.Title>
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
                  tooltip='A method used in or by this submission, (to perform a task)'
                /><br />
                Not in the list?<br />
                <Accordion defaultActiveKey='0'>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant='link' eventKey='1' onClick={this.handleAccordionToggle}>
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
                          tooltip='Short name of new method'
                        /><br />
                        <FormFieldRow
                          inputName='fullName'
                          inputType='text'
                          label='Full name'
                          onChange={(field, value) => this.handleOnChange('method', field, value)}
                          validRegex={methodNameRegex}
                          tooltip='Long name of new method'
                        /><br />
                        <FormFieldRow
                          inputName='description'
                          inputType='textarea'
                          label='Description'
                          onChange={(field, value) => this.handleOnChange('method', field, value)}
                          tooltip='Long description of new method'
                        />
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
                  tooltip='A task performed in or by this submission, (using a method)'
                /><br />
                Not in the list?<br />
                <Accordion defaultActiveKey='0'>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant='link' eventKey='1' onClick={this.handleAccordionToggle}>
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
                          tooltip='Short name of new task'
                        /><br />
                        <FormFieldRow
                          inputName='fullName'
                          inputType='text'
                          label='Full name'
                          onChange={(field, value) => this.handleOnChange('task', field, value)}
                          validRegex={taskNameRegex}
                          tooltip='Long name of new task'
                        /><br />
                        <FormFieldSelectRow
                          inputName='parentTask'
                          label='Parent task<br/>(if any)'
                          isNullDefault
                          options={this.state.allTaskNames}
                          onChange={(field, value) => this.handleOnChange('task', field, value)}
                          tooltip='Optionally, the new task is a sub-task of a "parent" task.'
                        /><br />
                        <FormFieldRow
                          inputName='description'
                          inputType='textarea'
                          label='Description'
                          onChange={(field, value) => this.handleOnChange('task', field, value)}
                          tooltip='Long description of new task'
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
                  value={this.state.result.task}
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                  tooltip='Task from submission, used in this result'
                /><br />
                <FormFieldSelectRow
                  inputName='method' label='Method'
                  options={this.state.item.methods}
                  value={this.state.result.method}
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                  tooltip='Method from submission, used in this result'
                /><br />
                <FormFieldTypeaheadRow
                  inputName='metricName' label='Metric name'
                  value={this.state.result.metricName}
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                  validRegex={metricNameRegex}
                  options={this.state.metricNames}
                  tooltip='The name of the measure of performance, for this combination of task and method, for this submission.'
                /><br />
                <FormFieldRow
                  inputName='metricValue' inputType='number' label='Metric value'
                  value={this.state.result.metricValue}
                  validRegex={metricValueRegex}
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                  tooltip='The value of the measure of performance, for this combination of task and method, for this submission.'
                /><br />
                <FormFieldRow
                  inputName='evaluatedAt' inputType='date' label='Evaluated'
                  value={this.state.result.evaluatedAt}
                  validRegex={dateRegex}
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                  tooltip='(Optionally) What date was the metric value collected on?'
                /><br />
                <FormFieldRow
                  inputName='isHigherBetter' inputType='checkbox' label='Is higher better?'
                  checked={this.state.result.isHigherBetter}
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                  tooltip='Does a higher value of the metric indicate better performance? (If not checked, then a lower value of the metric indicates better performance.)'
                /><br />
                <FormFieldRow
                  inputName='notes' inputType='textarea' label='Notes'
                  value={this.state.result.notes}
                  onChange={(field, value) => this.handleOnChange('result', field, value)}
                  tooltip='You may include any additional notes on the result, in this field, and they will be visible to all readers.'
                />
              </span>}
            {(this.state.modalMode === 'Tag') &&
              <span>
                <FormFieldTypeaheadRow
                  inputName='tag' label='Tag'
                  onChange={(field, value) => this.handleOnChange('', field, value)}
                  validRegex={tagNameRegex}
                  options={this.state.tagNames.map(item => item.name)}
                  tooltip='A "tag" can be any string that loosely categorizes a submission by relevant topic.'
                /><br />
              </span>}
            {(this.state.modalMode !== 'Login') && <div className='text-center'><br /><b>(Mouse-over or tap labels for explanation.)</b></div>}
          </Modal.Body>
          <Modal.Footer>
            {(this.state.modalMode === 'Login') && <Button variant='primary' onClick={this.handleHideAddModal}>Cancel</Button>}
            {(this.state.modalMode !== 'Login') && <Button variant='primary' onClick={this.handleAddModalSubmit} disabled={!this.state.isValidated && !this.isAllValid()}>Submit</Button>}
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
                    <div key={task.id}>
                      <hr />
                      <div className='row'>
                        <div className='col-md-10'>
                          {task.name}
                        </div>
                        <div className='col-md-2'>
                          <button className='btn btn-danger' onClick={() => this.handleOnTaskRemove(task.id)}><FontAwesomeIcon icon='trash' /> </button>
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
                    <div key={method.id}>
                      <hr />
                      <div className='row'>
                        <div className='col-md-10'>
                          {method.name}
                        </div>
                        <div className='col-md-2'>
                          <button className='btn btn-danger' onClick={() => this.handleOnMethodRemove(method.id)}><FontAwesomeIcon icon='trash' /> </button>
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
                    <div key={result.id}>
                      <hr />
                      <div className='row'>
                        <div className='col-md-10'>
                          {result.task.name}, {result.method.name}, {result.metricName}: {result.metricValue}
                        </div>
                        <div className='col-md-2'>
                          <button className='btn btn-danger' onClick={() => this.handleOnResultRemove(result.id)}><FontAwesomeIcon icon='trash' /> </button>
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
                    <div key={tag.id}>
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
        <Modal
          show={this.state.showEditModal}
          onHide={this.handleHideEditModal}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalTextMode === 'Moderation' ? 'Report' : 'Edit'} Submission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(this.state.modalMode === 'Login') &&
              <span>
                Please <Link to='/Login'>login</Link> before {this.state.modalTextMode === 'Moderation' ? 'filing a report' : 'editing'}.
              </span>}
            {(this.state.modalMode !== 'Login') &&
              <span>
                {(this.state.modalMode === 'Moderation') &&
                  <div>
                    <div>
                      <b>Remember that any logged in user can edit any submission. However, if editing won't address the issue, please describe for a moderator what's wrong.</b>
                    </div>
                    <br />
                  </div>}
                {(this.state.modalMode === 'Moderation') &&
                  <FormFieldRow
                    inputName='description' inputType='textarea' label='Description' rows='12'
                    value={this.state.moderationReport.description}
                    onChange={(field, value) => this.handleOnChange('moderationReport', field, value)}
                  />}
                {(this.state.modalMode !== 'Moderation') &&
                  <FormFieldRow
                    inputName='description' inputType='textarea' label='Description' rows='12'
                    value={this.state.submission.description}
                    onChange={(field, value) => this.handleOnChange('submission', field, value)}
                  />}
              </span>}
          </Modal.Body>
          <Modal.Footer>
            {(this.state.modalMode === 'Login') && <Button variant='primary' onClick={this.handleHideEditModal}>Cancel</Button>}
            {(this.state.modalMode !== 'Login') && <Button variant='primary' onClick={this.handleEditModalDone}>Submit</Button>}
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default Submission
