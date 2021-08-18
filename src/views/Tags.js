import axios from 'axios'
import React from 'react'
import config from '../config'
import { Tabs, Tab } from 'react-bootstrap'
import CategoryListItem from '../components/CategoryListItem'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'

class Tags extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alphabetical: [],
      common: [],
      popular: [],
      isRequestFailed: false,
      requestFailedMessage: ''
    }
  }

  componentDidMount () {
    const route = config.api.getUriPrefix() + '/tag'
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
        const common = res.data.data
        common.sort(function (a, b) {
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
        const popular = res.data.data
        popular.sort(function (a, b) {
          const keyA = a.upvoteTotal
          const keyB = b.upvoteTotal
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
          common: common,
          popular: popular
        })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div className='container'>
        <header>Tags</header>
        <br />
        <Tabs defaultActiveKey='common' id='categories-tabs'>
          <Tab eventKey='common' title='Common'>
            <div className='row'>
              <div className='col-md-12'>
                <b>Name (Submission Count)</b>
              </div>
            </div>
            {this.state.common.map((item, index) => <CategoryListItem routePrefix='/Tag' isTag item={item} key={index} />)}
          </Tab>
          <Tab eventKey='popular' title='Popular'>
            <div className='row'>
              <div className='col-md-12'>
                <b>Name (Total Submission Up-Votes)</b>
              </div>
            </div>
            {this.state.popular.map((item, index) => <CategoryListItem routePrefix='/Tag' isTag isPopular item={item} key={index} />)}
          </Tab>
          <Tab eventKey='alphabetical' title='Alphabetical'>
            <div className='row'>
              <div className='col-md-12'>
                <b>Name (Submission Count)</b>
              </div>
            </div>
            {this.state.alphabetical.map((item, index) => <CategoryListItem routePrefix='/Tag' isTag item={item} key={index} />)}
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

export default Tags
