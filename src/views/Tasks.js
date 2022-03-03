import axios from 'axios'
import React from 'react'
import config from './../config'
import { Tabs, Tab } from 'react-bootstrap'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import CategoryScroll from '../components/CategoryScroll'

class Tasks extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alphabetical: [],
      popular: [],
      common: [],
      allNames: [],
      filterId: null,
      isRequestFailed: false,
      requestFailedMessage: ''
    }

    this.handleOnFilter = this.handleOnFilter.bind(this)
    this.handleOnSelect = this.handleOnSelect.bind(this)
  }

  handleOnFilter (value) {
    if (value) {
      this.setState({ filterId: value.id })
    }
  }

  handleOnSelect (value) {
    if (value) {
      window.location.href = '/Task/' + value.id
    }
  }

  componentDidMount () {
    axios.get(config.api.getUriPrefix() + '/task/submissionCount')
      .then(res => {
        const common = [...res.data.data]
        common.sort(function (a, b) {
          const keyA = parseInt(a.submissionCount)
          const keyB = parseInt(b.submissionCount)
          if (keyA < keyB) {
            return 1
          }
          if (keyB < keyA) {
            return -1
          }
          const key2A = a.name
          const key2B = b.name
          if (key2A < key2B) {
            return -1
          }
          if (key2B < key2A) {
            return 1
          }
          return 0
        })
        this.setState({
          isRequestFailed: false,
          requestFailedMessage: '',
          common: common
        })

        const popular = [...res.data.data]
        popular.sort(function (a, b) {
          const keyA = parseInt(a.upvoteTotal)
          const keyB = parseInt(b.upvoteTotal)
          if (keyA < keyB) {
            return 1
          }
          if (keyB < keyA) {
            return -1
          }
          const key2A = a.name
          const key2B = b.name
          if (key2A < key2B) {
            return -1
          }
          if (key2B < key2A) {
            return 1
          }
          return 0
        })
        this.setState({ popular: popular })

        const alphabetical = res.data.data
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
        this.setState({ alphabetical: alphabetical })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })

    axios.get(config.api.getUriPrefix() + '/task/names')
      .then(res => {
        this.setState({
          isRequestFailed: false,
          requestFailedMessage: '',
          allNames: res.data.data
        })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        <header><h4>Tasks</h4></header>
        <br />
        <div className='row'>
          <div className='col-md-12 search-bar'>
            <FormFieldTypeaheadRow
              options={this.state.allNames}
              labelKey='name'
              inputName='name'
              label='Search name'
              value=''
              onChange={(field, value) => this.handleOnFilter(value)}
              onSelect={this.handleOnSelect}
            />
          </div>
        </div>
        <br />
        <Tabs defaultActiveKey='common' id='categories-tabs'>
          <Tab eventKey='common' title='Common'>
            <CategoryScroll type='task' items={this.state.common} isLoggedIn={this.props.isLoggedIn} heading='Sorted by submission count' />
          </Tab>
          <Tab eventKey='popular' title='Popular'>
            <CategoryScroll type='task' items={this.state.popular} isLoggedIn={this.props.isLoggedIn} heading='Sorted by aggregate upvote count' />
          </Tab>
          <Tab eventKey='alphabetical' title='Alphabetical'>
            <CategoryScroll type='task' items={this.state.alphabetical} isLoggedIn={this.props.isLoggedIn} heading='Sorted alphabetically' />
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
