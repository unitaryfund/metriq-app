import axios from 'axios'
import React from 'react'
import config from './../config'
import InfiniteScroll from 'react-infinite-scroll-component'
import FormFieldValidator from '../components/FormFieldValidator'
import SubmissionBox from '../components/SubmissionBox'

class SubmissionScroll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nextPage: 0,
      items: [],
      hasMore: true,
      isRequestFailed: false,
      requestFailedMessage: ''
    }

    this.fetchMoreData = this.fetchMoreData.bind(this)
  }

  componentDidMount () {
    axios.get(config.api.getUriPrefix() + '/submission/' + this.props.sortType + '/0')
      .then(res => {
        this.setState({ isRequestFailed: false, requestFailedMessage: '', nextPage: 1, items: res.data.data })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: err ? (err.message ? err.message : err) : 'Could not reach server.' })
      })
  }

  fetchMoreData () {
    axios.get(config.api.getUriPrefix() + '/submission/' + this.props.sortType + '/' + toString(this.state.nextPage))
      .then(res => {
        this.setState({ isRequestFailed: false, requestFailedMessage: '', nextPage: this.state.nextPage + 1 })
        if (res.data.data.length > 0) {
          this.setState({ items: this.state.items.concat(res.data.data) })
        } else {
          this.setState({ hasMore: false })
        }
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: err ? (err.message ? err.message : err) : 'Could not reach server.' })
      })
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <InfiniteScroll
              dataLength={this.state.items.length} // This is important field to render the next data
              next={this.fetchMoreData}
              hasMore={this.state.hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>You have seen all submissions.</b>
                </p>
              }
            >
              {this.state.items.map(SubmissionBox)}
            </InfiniteScroll>
          </div>
        </div>
        <br />
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

export default SubmissionScroll
