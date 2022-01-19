import axios from 'axios'
import React from 'react'
import config from './../config'
import { Tabs, Tab } from 'react-bootstrap'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'
import CategoryScroll from '../components/CategoryScroll'

class Methods extends React.Component {
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
    const route = config.api.getUriPrefix() + '/method/submissionCount'
    axios.get(route)
      .then(res => {
        const common = [...res.data.data]
        common.sort(function (a, b) {
          const keyA = a.submissionCount
          const keyB = b.submissionCount
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
          const keyA = a.upvoteTotal
          const keyB = b.upvoteTotal
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
  }

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        <header><h4>Methods</h4></header>
        <br />
        <Tabs defaultActiveKey='common' id='categories-tabs'>
          <Tab eventKey='common' title='Common'>
            <CategoryScroll type='method' items={this.state.common} isLoggedIn={this.props.isLoggedIn} heading='Sorted by submission count' />
          </Tab>
          <Tab eventKey='popular' title='Popular'>
            <CategoryScroll type='method' items={this.state.popular} isLoggedIn={this.props.isLoggedIn} heading='Sorted by aggregate upvote count' />
          </Tab>
          <Tab eventKey='alphabetical' title='Alphabetical'>
            <CategoryScroll type='method' items={this.state.alphabetical} isLoggedIn={this.props.isLoggedIn} heading='Sorted alphabetically' />
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

export default Methods
