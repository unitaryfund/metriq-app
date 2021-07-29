import axios from 'axios'
import React from 'react'
import config from './../config'
import Table from 'rc-table'
import ErrorHandler from './../components/ErrorHandler'

class Method extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRequestFailed: false,
      requestFailedMessage: '',
      item: {}
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
      <div className='container submission-detail-container'>
        <div className='row'>
          <div className='col-md-12'>
            <div><h1>{this.state.item.fullName}</h1></div>
            <div className='submission-description'>
              {this.state.item.description ? this.state.item.description : <i>No description provided.</i>}
            </div>
          </div>
        </div>
        <br />
        <div>
          <Table
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
          />
        </div>
      </div>
    )
  }
}

export default Method
