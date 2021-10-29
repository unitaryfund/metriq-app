import axios from 'axios'
import React from 'react'
import config from './../config'
import Table from 'rc-table'
import ErrorHandler from './../components/ErrorHandler'
import FormFieldRow from '../components/FormFieldRow'
import FormFieldSelectRow from '../components/FormFieldSelectRow'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SotaChart from '../components/SotaChart'

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
      results: [],
      chartData: {},
      isChart: false,
      chartKey: '',
      metricNames: [],
      isLowerBetterDict: {}
    }

    this.handleShowEditModal = this.handleShowEditModal.bind(this)
    this.handleHideEditModal = this.handleHideEditModal.bind(this)
    this.handleEditModalDone = this.handleEditModalDone.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.sliceChartData = this.sliceChartData.bind(this)
  }

  handleShowEditModal () {
    let mode = 'Edit'
    if (!this.props.isLoggedIn) {
      mode = 'Login'
    }
    const task = { description: this.state.task.description }
    this.setState({ showEditModal: true, modalMode: mode, task: task })
  }

  handleHideEditModal () {
    this.setState({ showEditModal: false })
  }

  handleEditModalDone () {
    if (!this.props.isLoggedIn) {
      window.location.href = '/Login'
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
            if (item.submissions[i].results[j].task.id === item.id) {
              results.push(item.submissions[i].results[j])
              results[results.length - 1].submission = item.submissions[i]
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
        method: row.method.name,
        metric: row.metricName,
        label: new Date(row.evaluatedAt ? row.evaluatedAt : row.createdAt),
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
    let isChart = false
    let chartKey = ''
    let m = 0
    const isLowerBetterDict = {}
    for (let i = 0; i < metricNames.length; i++) {
      const length = chartData[metricNames[i]].length
      if (length > m) {
        chartKey = metricNames[i]
        m = length
        isChart |= (m > 1)
      }
      isLowerBetterDict[metricNames[i]] = (isHigherBetterCounts[metricNames[i]] < (length / 2))
    }
    this.setState({ metricNames: metricNames, isChart: isChart, chartKey: chartKey, chartData: chartData, isLowerBetterDict: isLowerBetterDict })
  }

  render () {
    return (
      <div>
        {this.state.isChart &&
          <div>
            <div className='container'>
              <FormFieldSelectRow
                inputName='chartKey'
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
            </div>
            <SotaChart data={this.state.chartData[this.state.chartKey]} width={900} height={400} xLabel='Date' xType='time' yLabel={this.state.chartKey} yType='number' isLowerBetter={this.state.isLowerBetterDict[this.state.chartKey]} />
          </div>}
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
                        dataIndex: 'name',
                        key: 'name',
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
                          key: row.id,
                          name: row.submission.name,
                          methodName: row.method.name,
                          metricName: row.metricName,
                          metricValue: row.metricValue
                        }))}
                      onRow={(record) => ({
                        onClick () { window.location.href = '/Submission/' + record.key }
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
