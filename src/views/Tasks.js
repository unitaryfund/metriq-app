import axios from 'axios'
import React from 'react'
import config from './../config'
import { Tabs, Tab } from 'react-bootstrap'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'
import TaskMethodScroll from '../components/TaskMethodScroll'

class Tasks extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alphabetical: [],
      popular: [],
      common: [],
      isRequestFailed: false,
      requestFailedMessage: ''
    }
  }

  componentDidMount () {
    const route = config.api.getUriPrefix() + '/task/submissionCount'
    axios.get(route)
      .then(res => {
        const alphabetical = [...res.data.data]
        alphabetical.sort(function (a, b) {
          const keyA = a.name.toLowerCase()
          const keyB = b.name.toLowerCase()
          if (keyA < keyB) {
            return -1
          }
          if (keyB < keyA) {
            return 1
          }
          return 0
        })
        const popular = res.data.data
        popular.sort(function (a, b) {
          const keyA = a.submissionCount
          const keyB = b.submissionCount
          if (keyA < keyB) {
            return 1
          }
          if (keyB < keyA) {
            return -1
          }
          return 0
        })
        popular.sort(function (a, b) {
          const keyA = a.upvoteCount
          const keyB = b.upvoteCount
          if (keyA < keyB) {
            return 1
          }
          if (keyB < keyA) {
            return -1
          }
          return 0
        })
        this.setState({
          isRequestFailed: false,
          requestFailedMessage: '',
          alphabetical: alphabetical,
          popular: popular,
          common: res.data.data
        })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div className='container'>
        <header>Tasks</header>
        <br />
        <Tabs defaultActiveKey='common' id='categories-tabs'>
          <Tab eventKey='common' title='Common'>
            <TaskMethodScroll type='task' items={this.state.common} isLoggedIn={this.props.isLoggedIn} />
          </Tab>
          <Tab eventKey='popular' title='Popular'>
            <TaskMethodScroll type='task' items={this.state.popular} isLoggedIn={this.props.isLoggedIn} />
          </Tab>
          <Tab eventKey='alphabetical' title='Alphabetical'>
            <TaskMethodScroll type='task' items={this.state.alphabetical} isLoggedIn={this.props.isLoggedIn} />
          </Tab>
        </Tabs>
        <div className='row'>
          <div className='col-md-3' />
          <div className='col-md-6'>
            <FormFieldValidator invalid={this.state.isRequestFailed} message={this.state.requestFailedMessage} />
          </div>
          <div className='col-md-3' />
        </div>
      </div>
    )
  }
}

export default Tasks
