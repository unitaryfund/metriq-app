import axios from 'axios'
import React from 'react'
import config from './../config'
import InfiniteScroll from 'react-infinite-scroll-component'
import FormFieldValidator from '../components/FormFieldValidator'
import SubmissionBox from '../components/SubmissionBox'
import ErrorHandler from './ErrorHandler'

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
    const route = this.props.isEditView
      ? config.api.getUriPrefix() + '/user/submission/0'
      : (this.props.tag
          ? config.api.getUriPrefix() + '/submission/' + this.props.tag + '/' + this.props.sortType + '/0'
          : config.api.getUriPrefix() + '/submission/' + this.props.sortType + '/0')
    axios.get(route)
      .then(res => {
        this.setState({ isRequestFailed: false, requestFailedMessage: '', nextPage: 1, items: res.data.data })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  fetchMoreData () {
    const route = this.props.isEditView
      ? config.api.getUriPrefix() + '/user/submission/' + this.state.nextPage
      : (this.props.tag
          ? config.api.getUriPrefix() + '/submission/' + this.props.tag + '/' + this.props.sortType + this.state.nextPage
          : config.api.getUriPrefix() + '/submission/' + this.props.sortType + this.state.nextPage)
    axios.get(route)
      .then(res => {
        this.setState({ isRequestFailed: false, requestFailedMessage: '', nextPage: this.state.nextPage + 1 })
        if (res.data.data.length > 0) {
          this.setState({ items: this.state.items.concat(res.data.data) })
        } else {
          this.setState({ hasMore: false })
        }
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            {this.state.items.length
              ? (<InfiniteScroll dataLength={this.state.items.length} next={this.fetchMoreData} hasMore={this.state.hasMore} loader={<h4>Loading...</h4>} endMessage={<p style={{ textAlign: 'center' }}><b>You have seen all submissions.</b></p>}>{this.state.items.map((item, index) => <SubmissionBox item={item} key={index} isLoggedIn={this.props.isLoggedIn} isEditView={this.props.isEditView} isUnderReview={!(item.approvedDate)} />)}</InfiniteScroll>)
              : (this.props.isEditView
                  ? <p><b>You have no submissions, yet.</b></p>
                  : <p><b>There are no approved submissions, yet.</b></p>)}
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
