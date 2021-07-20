import axios from 'axios'
import React from 'react'
import config from './../config'
import { Tabs, Tab } from 'react-bootstrap'
import CategoryListItem from '../components/CategoryListItem'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'

class Categories extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      alphabetical: [],
      popular: [],
      isRequestFailed: false,
      requestFailedMessage: ''
    }
  }

  componentDidMount () {
    const route = config.api.getUriPrefix() + '/tag'
    axios.get(route)
      .then(res => {
        this.setState({
          isRequestFailed: false,
          requestFailedMessage: '',
          alphabetical: res.data.data.sort(function (a, b) {
            const keyA = a.name.toLowerCase()
            const keyB = b.name.toLowerCase()
            if (keyA < keyB) {
              return -1
            }
            if (keyB < keyA) {
              return 1
            }
            return 0
          }),
          popular: res.data.data.sort(function (a, b) {
            const keyA = a.submissionCount
            const keyB = b.submissionCount
            if (keyA < keyB) {
              return -1
            }
            if (keyB < keyA) {
              return 1
            }
            return 0
          })
        })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div className='container'>
        <header>MetriQ - Categories</header>
        <br />
        <Tabs defaultActiveKey='popular' id='categories-tabs'>
          <Tab eventKey='popular' title='Popular'>
            {this.state.popular.map((item, index) => <CategoryListItem item={item} key={index} />)}
          </Tab>
          <Tab eventKey='alphabetical' title='Alphabetical'>
            {this.state.alphabetical.map((item, index) => <CategoryListItem item={item} key={index} />)}
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

export default Categories
