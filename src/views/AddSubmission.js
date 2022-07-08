import axios from 'axios'
import React from 'react'
import config from './../config'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldRowDeleter from '../components/FormFieldRowDeleter'
import FormFieldSelectRow from '../components/FormFieldSelectRow'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import FormFieldValidator from '../components/FormFieldValidator'
import ErrorHandler from '../components/ErrorHandler'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import FormFieldWideRow from '../components/FormFieldWideRow'
import ViewHeader from '../components/ViewHeader'
import { Redirect } from 'react-router-dom'
import { nonblankRegex, urlValidRegex } from '../components/ValidationRegex'
import SubmissionRefsAddModal from '../components/SubmissionRefsAddModal'

library.add(faPlus)

const requiredFieldMissingError = 'Required field.'

class AddSubmission extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      contentUrl: '',
      thumbnailUrl: '',
      description: '',
      tasks: [],
      task: '',
      taskNames: [],
      methods: [],
      method: '',
      methodNames: [],
      platforms: [],
      platform: '',
      platformNames: [],
      tags: [],
      tag: '',
      tagNames: [],
      allNames: [],
      showAddRefsModal: false,
      showRemoveModal: false,
      requestFailedMessage: '',
      isValidated: false
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnFieldBlur = this.handleOnFieldBlur.bind(this)
    this.isAllValid = this.isAllValid.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
    this.handleOnClickRemoveTag = this.handleOnClickRemoveTag.bind(this)
    this.handleOnClickAddTag = this.handleOnClickAddTag.bind(this)
    this.handleOnClickRemoveTask = this.handleOnClickRemoveTask.bind(this)
    this.handleOnClickAddTask = this.handleOnClickAddTask.bind(this)
    this.handleOnClickNewTask = this.handleOnClickNewTask.bind(this)
    this.handleOnClickRemoveMethod = this.handleOnClickRemoveMethod.bind(this)
    this.handleOnClickAddMethod = this.handleOnClickAddMethod.bind(this)
    this.handleOnClickNewMethod = this.handleOnClickNewMethod.bind(this)
    this.handleOnClickRemovePlatform = this.handleOnClickRemovePlatform.bind(this)
    this.handleOnClickAddPlatform = this.handleOnClickAddPlatform.bind(this)
    this.handleOnClickNewPlatform = this.handleOnClickNewPlatform.bind(this)
    this.handleModalRefAddNew = this.handleModalRefAddNew.bind(this)
    this.validURL = this.validURL.bind(this)
  }

  validURL (str) {
    return !!urlValidRegex.test(str)
  }

  handleModalRefAddNew (ref) {
    const mode = this.state.modalMode
    let allNames = []
    let names = []

    if (mode === 'Task') {
      allNames = this.state.taskNames
      names = this.state.tasks
      allNames.push(ref)
      names.push(ref)
    } else if (mode === 'Method') {
      allNames = this.state.methodNames
      names = this.state.methods
      allNames.push(ref)
      names.push(ref)
    } else if (mode === 'Platform') {
      allNames = this.state.platformNames
      names = this.state.platforms
      allNames.push(ref)
      names.push(ref)
    } else {
      return
    }

    this.handleSortNames(allNames)

    if (mode === 'Task') {
      this.setState({ showAddRefsModal: false, taskNames: allNames, tasks: names })
    } else if (mode === 'Method') {
      this.setState({ showAddRefsModal: false, methodNames: allNames, methods: names })
    } else if (mode === 'Platform') {
      this.setState({ showAddRefsModal: false, platformNames: allNames, platforms: names })
    }
  }

  handleOnChange (field, value) {
    // parent class change handler is always called with field name and value
    this.setState({ [field]: value, isValidated: false })
  }

  handleOnFieldBlur (field, value) {
    if (field === 'thumbnailUrl' || field === 'contentUrl') {
      if (value.trim().length <= 0) {
        this.setState({ name: '', isValidated: false })
        this.setState({ description: '', isValidated: false })
      } else if (this.validURL(value.trim())) {
        axios.post(config.api.getUriPrefix() + '/pagemetadata', { url: value.trim() })
          .then(res => {
            this.setState({ name: res.data.data.og.title, isValidated: false })
            this.setState({ description: res.data.data.og.description, isValidated: false })
          })
          .catch(err => {
            this.setState({ requestFailedMessage: ErrorHandler(err) })
          })
      }
    }
  }

  isAllValid () {
    if (!this.state.isValidated) {
      this.setState({ isValidated: true })
    }

    return true
  }

  handleOnSubmit (event) {
    if (!this.isAllValid()) {
      event.preventDefault()
      return
    }

    const request = {
      name: this.state.name,
      contentUrl: this.state.contentUrl,
      thumbnailUrl: this.state.thumbnailUrl,
      description: this.state.description,
      tags: this.state.tags.join(',')
    }

    let validatedPassed = true
    if (!this.validURL(request.contentUrl)) {
      this.setState({ requestFailedMessage: ErrorHandler({ response: { data: { message: 'Invalid content url' } } }) })
      validatedPassed = false
    }

    if (request.thumbnailUrl && !this.validURL(request.thumbnailUrl)) {
      this.setState({ requestFailedMessage: ErrorHandler({ response: { data: { message: 'Invalid thumbnail url' } } }) })
      validatedPassed = false
    }

    if (validatedPassed) {
      axios.post(config.api.getUriPrefix() + '/submission', request)
        .then(res => {
          this.props.history.push('/Submissions')
        })
        .catch(err => {
          this.setState({ requestFailedMessage: ErrorHandler(err) })
        })
    }
    event.preventDefault()
  }

  handleOnClickAddTask (taskId) {
    const tasks = this.state.tasks
    const task = this.state.taskNames.find(x => x.id === parseInt(taskId))
    if (task && tasks.indexOf(task) < 0) {
      tasks.push(task)
      this.setState({ tasks: tasks, task: {} })
    }
  }

  handleOnClickNewTask () {
    this.setState({ showAddRefsModal: true, modalMode: 'Task', allNames: this.state.taskNames })
  }

  handleOnClickRemoveTask (taskId) {
    const tasks = this.state.tasks
    const task = tasks.find(x => x.id === taskId)
    tasks.splice(tasks.indexOf(task), 1)
    this.setState({ tasks: tasks })
  }

  handleOnClickAddMethod (methodId) {
    const methods = this.state.methods
    const method = this.state.methodNames.find(x => x.id === parseInt(methodId))
    if (method && methods.indexOf(method) < 0) {
      methods.push(method)
      this.setState({ methods: methods, method: {} })
    }
  }

  handleOnClickNewMethod () {
    this.setState({ showAddRefsModal: true, modalMode: 'Method', allNames: this.state.methodNames })
  }

  handleOnClickRemoveMethod (methodId) {
    const methods = this.state.methods
    const method = methods.find(x => x.id === methodId)
    methods.splice(methods.indexOf(method), 1)
    this.setState({ methods: methods })
  }

  handleOnClickAddPlatform (platformId) {
    const platforms = this.state.platforms
    const platform = this.state.platformNames.find(x => x.id === parseInt(platformId))
    if (platform && platforms.indexOf(platform) < 0) {
      platforms.push(platform)
      this.setState({ platforms: platforms, platform: {} })
    }
  }

  handleOnClickNewPlatform () {
    this.setState({ showAddRefsModal: true, modalMode: 'Platform', allNames: this.state.platformNames })
  }

  handleOnClickRemovePlatform (platformId) {
    const platforms = this.state.platforms
    const platform = platforms.find(x => x.id === platformId)
    platforms.splice(platforms.indexOf(platform), 1)
    this.setState({ platforms: platforms })
  }

  handleOnClickAddTag () {
    const tags = this.state.tags
    if (tags.indexOf(this.state.tag) < 0) {
      tags.push(this.state.tag)
      this.setState({ tags: tags, tag: '' })
    }
  }

  handleOnClickRemoveTag (tag) {
    const tags = this.state.tags
    tags.splice(tags.indexOf(tag), 1)
    this.setState({ tags: tags })
  }

  handleSortNames (names) {
    names.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
      return 0
    })
  }

  componentDidMount () {
    const taskNamesRoute = config.api.getUriPrefix() + '/task/names'
    axios.get(taskNamesRoute)
      .then(res => {
        const tasks = res.data.data
        this.handleSortNames(tasks)
        this.setState({ isRequestFailed: false, requestFailedMessage: '', taskNames: tasks })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })

    const methodNamesRoute = config.api.getUriPrefix() + '/method/names'
    axios.get(methodNamesRoute)
      .then(res => {
        const methods = res.data.data
        this.handleSortNames(methods)
        this.setState({ isRequestFailed: false, requestFailedMessage: '', methodNames: methods })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })

    const platformNamesRoute = config.api.getUriPrefix() + '/platform/names'
    axios.get(platformNamesRoute)
      .then(res => {
        const platforms = res.data.data
        this.handleSortNames(platforms)
        this.setState({ isRequestFailed: false, requestFailedMessage: '', platformNames: platforms })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })

    const tagNamesRoute = config.api.getUriPrefix() + '/tag/names'
    axios.get(tagNamesRoute)
      .then(res => {
        const tags = res.data.data
        this.setState({ requestFailedMessage: '', tagNames: tags })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })

    const metricNameRoute = config.api.getUriPrefix() + '/result/metricNames'
    axios.get(metricNameRoute)
      .then(subRes => {
        const metricNames = subRes.data.data
        this.setState({ metricNames: metricNames })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return ((!this.props.isLoggedIn && <Redirect to='/LogIn/AddSubmission' />) ||
      (this.props.isLoggedIn &&
        <div id='metriq-main-content' className='container'>
          <ViewHeader>Add Submission</ViewHeader>
          <form onSubmit={this.handleOnSubmit}>
            <FormFieldAlertRow>
              <b>
                <p>If you have an article, code repository, or any URL constituting or presenting a "method" for quantum applications, use this form to create a unique page for it.</p>
                <p>If you have independently recreated or validated the results of another submission on Metriq, you can add your new results to its page.</p>
              </b>
            </FormFieldAlertRow>
            <FormFieldRow
              inputName='contentUrl' inputType='text' label='Content URL'
              validatorMessage={requiredFieldMissingError}
              onChange={this.handleOnChange}
              onBlur={this.handleOnFieldBlur}
              validRegex={nonblankRegex}
            />
            <FormFieldAlertRow>
              <b>The external content URL points to the full content of the submission.<br />(This could be a link to arXiv, for example.)<br /><i>This cannot be changed after hitting "Submit."</i></b>
            </FormFieldAlertRow>
            <FormFieldRow
              inputName='name' inputType='text' label='Submission Name'
              validatorMessage={requiredFieldMissingError}
              onChange={this.handleOnChange}
              validRegex={nonblankRegex}
              value={this.state.name}
            />
            <FormFieldAlertRow>
              <b>The submission name must be unique.</b>
            </FormFieldAlertRow>
            <FormFieldRow
              inputName='description' inputType='textarea' label='Description'
              placeholder='Explain the content of the submission URL at a high level, as one would with a peer-reviewed research article abstract...'
              onChange={this.handleOnChange}
              value={this.state.description}
            />
            <FormFieldAlertRow>
              <b>We encourage using an abstract, for the submission description.</b>
            </FormFieldAlertRow>
            <FormFieldRow
              inputName='thumbnailUrl' inputType='text' label='Image URL' imageUrl
              onChange={this.handleOnChange}
            />
            <FormFieldAlertRow>
              <b>The image URL is loaded as a thumbnail, for the submission.<br />(For free image hosting, see <a href='https://imgbb.com/' target='_blank' rel='noreferrer'>https://imgbb.com/</a>, for example.)</b>
            </FormFieldAlertRow>
            <FormFieldSelectRow
              inputName='task' label='Tasks'
              onChange={this.handleOnChange}
              options={this.state.taskNames}
              onClickAdd={this.handleOnClickAddTask}
              onClickNew={this.handleOnClickNewTask}
            />
            <FormFieldRowDeleter options={this.state.tasks} onClickRemove={this.handleOnClickRemoveTask} emptyMessage='There are no associated tasks, yet.' />
            <FormFieldSelectRow
              inputName='method' label='Methods'
              onChange={this.handleOnChange}
              options={this.state.methodNames}
              onClickAdd={this.handleOnClickAddMethod}
              onClickNew={this.handleOnClickNewMethod}
            />
            <FormFieldRowDeleter options={this.state.methods} onClickRemove={this.handleOnClickRemoveMethod} emptyMessage='There are no associated methods, yet.' />
            <FormFieldSelectRow
              inputName='platform' label='Platforms'
              onChange={this.handleOnChange}
              options={this.state.platformNames}
              onClickAdd={this.handleOnClickAddPlatform}
              onClickNew={this.handleOnClickNewPlatform}
            />
            <FormFieldRowDeleter options={this.state.platforms} onClickRemove={this.handleOnClickRemovePlatform} emptyMessage='There are no associated platforms, yet.' />
            <FormFieldTypeaheadRow
              inputName='tag' label='Tags'
              onChange={this.handleOnChange}
              options={this.state.tagNames.map(item => item.name)}
              onClickAdd={this.handleOnClickAddTag}
            />
            <FormFieldRowDeleter options={this.state.tags.map((item) => { return { name: item } })} onClickRemove={this.handleOnClickRemoveTag} emptyMessage='There are no associated tags, yet.' />
            <FormFieldAlertRow>
              <b>"Tags" are a set of descriptive labels.<br />(Tags can contain spaces.)</b>
            </FormFieldAlertRow>
            <FormFieldAlertRow>
              <FormFieldValidator invalid={!!this.state.requestFailedMessage} message={this.state.requestFailedMessage} />
            </FormFieldAlertRow>
            <FormFieldWideRow className='text-center'>
              <input className='btn btn-primary' type='submit' value='Submit' disabled={!this.state.isValidated && !this.isAllValid()} />
            </FormFieldWideRow>
          </form>
          <SubmissionRefsAddModal
            show={this.state.showAddRefsModal}
            onHide={() => this.setState({ showAddRefsModal: false })}
            modalMode={this.state.modalMode}
            submissionId={0}
            allNames={this.state.allNames}
            filteredNames={this.state.allNames}
            onAddNew={this.handleModalRefAddNew}
            isNewOnly
          />
        </div>
      )
    )
  }
}

export default AddSubmission
