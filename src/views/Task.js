import axios from 'axios'
import React from 'react'
import config from './../config'
import Table from 'rc-table'
import ErrorHandler from './../components/ErrorHandler'

class Task extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRequestFailed: false,
      requestFailedMessage: '',
      item: { submissions: [] },
      results: []
    }
  }

  componentDidMount () {
    const methodRoute = config.api.getUriPrefix() + '/task/' + this.props.match.params.id
    axios.get(methodRoute)
      .then(res => {
        const item = res.data.data
        let results = []
        for (let i = 0; i < item.submissions.length; i++) {
          results = results.concat(item.submissions[i].results)
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
        this.setState({ isRequestFailed: false, requestFailedMessage: '', item: item, results: results })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div className='container submission-detail-container'>
        <div className='row'>
          <div className='col-md-12'>
            <div><h1>{this.state.item.name}</h1></div>
            <div className='submission-description'>
              {this.state.item.description ? this.state.item.description : <i>No description provided.</i>}
            </div>
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
                    title: 'Submission',
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
    )
  }
}

export default Task
