import axios from 'axios'
import React from 'react'
import config from './../config'
import Table from 'rc-table'
import ErrorHandler from './../components/ErrorHandler'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldWideRow from '../components/FormFieldWideRow'
import FormFieldSelectRow from '../components/FormFieldSelectRow'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SotaChart from '../components/SotaChart'
import CategoryScroll from '../components/CategoryScroll'
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share'
import moment from 'moment'
import { parse } from 'json2csv'
import Commento from '../components/Commento'

library.add(faEdit)

class Task extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRequestFailed: false,
      requestFailedMessage: '',
      showEditModal: false,
      task: { description: '', parentTask: 0 },
      item: { submissions: [], childTasks: [], parentTask: {} },
      allTaskNames: [],
      results: [],
      resultsJson: [],
      chartData: {},
      chartKey: '',
      metricNames: [],
      isLowerBetterDict: {},
      isLog: false
    }

    this.handleShowEditModal = this.handleShowEditModal.bind(this)
    this.handleHideEditModal = this.handleHideEditModal.bind(this)
    this.handleEditModalDone = this.handleEditModalDone.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleTrimTasks = this.handleTrimTasks.bind(this)
    this.sliceChartData = this.sliceChartData.bind(this)
    this.handleCsvExport = this.handleCsvExport.bind(this)
    this.handleToggleLog = this.handleToggleLog.bind(this)
  }

  handleShowEditModal () {
    let mode = 'Edit'
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    const task = { description: this.state.item.description, parentTask: { id: this.state.item.parentTask.id, name: this.state.item.parentTask.name } }
    this.setState({ showEditModal: true, modalMode: mode, task: task })
  }

  handleHideEditModal () {
    this.setState({ showEditModal: false })
  }

  handleEditModalDone () {
    if (!this.props.isLoggedIn) {
      this.props.history.push('/Login')
    }

    const reqBody = {
      description: this.state.task.description,
      parentTask: this.state.task.parentTask
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

  handleTrimTasks (taskId, tasks) {
    for (let j = 0; j < tasks.length; j++) {
      if (taskId === tasks[j].id) {
        tasks.splice(j, 1)
        break
      }
    }
    tasks.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
      return 0
    })
  }

  componentDidMount () {
    const methodRoute = config.api.getUriPrefix() + '/task/' + this.props.match.params.id
    axios.get(methodRoute)
      .then(res => {
        const task = res.data.data
        task.childTasks.sort(function (a, b) {
          const rca = parseInt(a.resultCount)
          const rcb = parseInt(b.resultCount)
          if (rca > rcb) {
            return -1
          }
          if (rcb > rca) {
            return 1
          }
          const tna = a.name.toLowerCase()
          const tnb = b.name.toLowerCase()
          if (tna < tnb) {
            return -1
          }
          if (tnb < tna) {
            return 1
          }
          return 0
        })
        this.setState({ isRequestFailed: false, requestFailedMessage: '', item: task })

        const taskNamesRoute = config.api.getUriPrefix() + '/task/names'
        axios.get(taskNamesRoute)
          .then(res => {
            const tasks = [...res.data.data]
            this.handleTrimTasks(task.id, tasks)
            this.setState({ isRequestFailed: false, requestFailedMessage: '', allTaskNames: tasks })
          })
          .catch(err => {
            this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
          })

        const results = task.results
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
        const resultsJson = results.map(row =>
          ({
            key: row.id,
            submissionId: this.state.item.submissions.find(e => e.name === row.submissionName).id,
            name: row.submissionName,
            platformName: row.platformName,
            methodName: row.methodName,
            metricName: row.metricName,
            metricValue: row.metricValue,
            tableDate: row.evaluatedAt ? new Date(row.evaluatedAt).toLocaleDateString() : new Date(row.createdAt).toLocaleDateString(),
            props: this.props
          }))
        this.setState({ results: results, resultsJson: resultsJson })
        this.sliceChartData(results)
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  sliceChartData (results) {
    const sortedResults = [...results]
    sortedResults.sort(function (a, b) {
      const mna = a.metricName.toLowerCase()
      const mnb = b.metricName.toLowerCase()
      if (mna < mnb) {
        return -1
      }
      if (mnb < mna) {
        return 1
      }

      const mda = new Date(a.evaluatedAt ? a.evaluatedAt : a.createdAt)
      const mdb = new Date(b.evaluatedAt ? b.evaluatedAt : b.createdAt)
      if (mda < mdb) {
        return -1
      }
      if (mdb < mda) {
        return 1
      }

      return 0
    })
    const allData = sortedResults.map(row =>
      ({
        method: row.methodName,
        platform: row.platformName,
        metric: row.metricName,
        label: moment(new Date(row.evaluatedAt ? row.evaluatedAt : row.createdAt)),
        value: row.metricValue,
        isHigherBetter: row.isHigherBetter
      }))
    const chartData = {}
    const isHigherBetterCounts = {}
    for (let i = 0; i < allData.length; i++) {
      if (!chartData[allData[i].metric]) {
        chartData[allData[i].metric] = []
        isHigherBetterCounts[allData[i].metric] = 0
      }
      chartData[allData[i].metric].push(allData[i])
      if (allData[i].isHigherBetter) {
        isHigherBetterCounts[allData[i].metric]++
      }
    }
    const metricNames = Object.keys(chartData)
    let chartKey = ''
    let m = 0
    const isLowerBetterDict = {}
    for (let i = 0; i < metricNames.length; i++) {
      const length = chartData[metricNames[i]].length
      if (length > m) {
        chartKey = metricNames[i]
        m = length
      }
      isLowerBetterDict[metricNames[i]] = (isHigherBetterCounts[metricNames[i]] < (length / 2))
    }
    let i = 0
    while (i < metricNames.length) {
      const length = chartData[metricNames[i]].length
      if (length < 3) {
        metricNames.splice(i, 1)
      } else {
        i++
      }
    }
    this.setState({ metricNames: metricNames, chartKey: chartKey, chartData: chartData, isLowerBetterDict: isLowerBetterDict })
  }

  handleToggleLog () {
    this.setState({ isLog: !this.state.isLog })
  }

  handleCsvExport () {
    const fields = Object.keys(this.state.resultsJson[0])
    const opts = { fields }
    const csv = parse(this.state.resultsJson, opts)

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv))
    element.setAttribute('download', this.state.item.name)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  render () {
    return (
      <div id='metriq-main-content'>
        <div className='container submission-detail-container'>
          {!this.state.item.isHideChart && (this.state.metricNames.length > 0) &&
            <div>
              <div className='sota-chart'>
                <div className='container'>
                  <FormFieldSelectRow
                    inputName='chartKey'
                    value={this.state.chartKey}
                    label='Chart Metric:'
                    labelClass='metric-chart-label'
                    options={this.state.metricNames.map(name =>
                      ({
                        id: name,
                        name: name
                      }))}
                    onChange={(field, value) => this.handleOnChange('', field, value)}
                    tooltip='A metric performance measure of any "method" on this "task"'
                  />
                  <div className='row' style={{ marginTop: '5px' }}>
                    <span htmlFor='logcheckbox' className='col-md-3 form-field-label metric-chart-label' dangerouslySetInnerHTML={{ __html: 'Logarithmic:' }} />
                    <div className='col-md-6'>
                      <input type='checkbox' id='logcheckbox' name='logcheckbox' className='form-control' checked={this.state.islog} onChange={this.handleToggleLog} />
                    </div>
                  </div>

                </div>
                <SotaChart data={this.state.chartData[this.state.chartKey]} xLabel='Time' yLabel={this.state.chartKey} isLowerBetter={this.state.isLowerBetterDict[this.state.chartKey]} key={Math.random()} isLog={this.state.isLog} />
              </div>
              <div className='sota-chart-message'><SotaChart isMobile data={this.state.chartData[this.state.chartKey]} xLabel='Time' yLabel={this.state.chartKey} isLowerBetter={this.state.isLowerBetterDict[this.state.chartKey]} key={Math.random()} isLog={this.state.isLog} /></div>
            </div>}
          <FormFieldWideRow>
            <div><h1>{this.state.item.fullName ? this.state.item.fullName : this.state.item.name}</h1></div>
            <div className='submission-description'>
              {this.state.item.description ? this.state.item.description : <i>No description provided.</i>}
            </div>
          </FormFieldWideRow>
          <FormFieldWideRow>
            <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Edit task</Tooltip>}>
              <button className='submission-button btn btn-secondary' onClick={this.handleShowEditModal}><FontAwesomeIcon icon='edit' /></button>
            </OverlayTrigger>
            <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Share via Facebook</Tooltip>}>
              <FacebookShareButton url={config.api.getUriPrefix() + '/task/' + this.props.match.params.id}>
                <FacebookIcon size={32} />
              </FacebookShareButton>
            </OverlayTrigger>
            <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>Share via Twitter</Tooltip>}>
              <TwitterShareButton url={config.api.getUriPrefix() + '/task/' + this.props.match.params.id}>
                <TwitterIcon size={32} />
              </TwitterShareButton>
            </OverlayTrigger>
          </FormFieldWideRow>
          <br />
          {this.state.item.parentTask &&
            <div className='row'>
              <div className='col-md-12'>
                <div className='submission-description'>
                  <b>Parent task:</b><Link to={'/Task/' + this.state.item.parentTask.id}>{this.state.item.parentTask.name}</Link>
                </div>
              </div>
              <br />
            </div>}
          {(this.state.item.childTasks && (this.state.item.childTasks.length > 0)) &&
            <div>
              <h2>Child Tasks</h2>
              <CategoryScroll type='task' items={this.state.item.childTasks} isLoggedIn={this.props.isLoggedIn} />
              <br />
            </div>}
          {(this.state.results.length > 0) &&
            <h2>Results <button className='btn btn-primary' onClick={this.handleCsvExport}>Export to CSV</button></h2>}
          {(this.state.results.length > 0) &&
            <FormFieldWideRow>
              <Table
                className='detail-table'
                columns={[{
                  title: 'Submission',
                  dataIndex: 'name',
                  key: 'name',
                  width: 250
                },
                {
                  title: 'Method',
                  dataIndex: 'methodName',
                  key: 'methodName',
                  width: 250
                },
                {
                  title: 'Platform',
                  dataIndex: 'platformName',
                  key: 'platformName',
                  width: 250
                },
                {
                  title: 'Date',
                  dataIndex: 'tableDate',
                  key: 'tableDate',
                  width: 250
                },
                {
                  title: 'Metric',
                  dataIndex: 'metricName',
                  key: 'metricName',
                  width: 250
                },
                {
                  title: 'Value',
                  dataIndex: 'metricValue',
                  key: 'metricValue',
                  width: 250
                }]}
                data={this.state.resultsJson}
                onRow={(record) => ({
                  onClick () { record.props.history.push('/Submission/' + record.key) }
                })}
                tableLayout='auto'
                rowClassName='link'
              />
            </FormFieldWideRow>}
          {(this.state.item.submissions.length > 0) &&
            <div>
              <h2>Submissions</h2>
              <FormFieldWideRow>
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
                        upvoteCount: row.upvoteCount || 0,
                        props: this.props
                      }))
                    : []}
                  onRow={(record) => ({
                    onClick () { record.props.history.push('/Submission/' + record.key) }
                  })}
                  tableLayout='auto'
                  rowClassName='link'
                />
              </FormFieldWideRow>
              <br />
            </div>}
          <div />
          <FormFieldWideRow>
            <hr />
            <Commento id={'task-' + toString(this.state.item.id)} />
          </FormFieldWideRow>
        </div>
        <Modal
          show={this.state.showEditModal}
          onHide={this.handleHideEditModal}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(this.state.modalMode === 'Login') &&
              <span>
                Please <Link to='/Login'>login</Link> before editing.
              </span>}
            {(this.state.modalMode !== 'Login') &&
              <span>
                <FormFieldSelectRow
                  inputName='parentTask'
                  label='Parent task'
                  options={this.state.allTaskNames}
                  value={this.state.task.parentTask.id}
                  onChange={(field, value) => this.handleOnChange('task', field, value)}
                  tooltip='The new task is a sub-task of a "parent" task.'
                /><br />
                <FormFieldRow
                  inputName='description' inputType='textarea' label='Description' rows='12'
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
