import axios from 'axios'
import React from 'react'
import config from './../config'
import InfiniteScroll from 'react-infinite-scroll-component'
import FormFieldValidator from '../components/FormFieldValidator'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nextPage: 0,
      items: [],
      isRequestFailed: false,
      requestFailedMessage: ''
    }

    this.fetchMoreData = this.fetchMoreData.bind(this)
  }

  componentDidMount () {
    axios.get(config.api.getUriPrefix() + '/submission/top/0')
      .then(res => {
        this.setState({ isRequestFailed: false, requestFailedMessage: '', nextPage: 1, items: res.data.data })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: err ? (err.message ? err.message : err) : 'Could not reach server.' })
      })
  }

  fetchMoreData () {
    axios.get(config.api.getUriPrefix() + '/submission/top/' + toString(this.state.nextPage))
      .then(res => {
        this.setState({ isRequestFailed: false, requestFailedMessage: '', nextPage: this.state.nextPage + 1, items: this.state.items.concat(res.data.data) })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: err ? (err.message ? err.message : err) : 'Could not reach server.' })
      })
  }

  render () {
    return (
      <div className='container'>
        <header>MetriQ - Top Submissions</header>
        <br />
        <div className='row'>
          <div className='col-md-3' />
          <div className='col-md-6'>
            <InfiniteScroll
              dataLength={this.state.items.length} // This is important field to render the next data
              next={this.fetchMoreData}
              hasMore
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>You have seen all submissions.</b>
                </p>
                }
            >
              {this.state.items.map((i, index) => (
                <div key={index}>
                  {i.submissionName}
                </div>
              ))}
            </InfiniteScroll>
          </div>
          <div className='col-md-3' />
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

export default Home
