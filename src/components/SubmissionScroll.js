import axios from 'axios'
import React from 'react'
import config from './../config'
import InfiniteScroll from 'react-infinite-scroll-component'
import FormFieldValidator from '../components/FormFieldValidator'
import SubmissionBox from '../components/SubmissionBox'
import ErrorHandler from './ErrorHandler'
import FormFieldTypeaheadRow from './FormFieldTypeaheadRow'

class SubmissionScroll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nextPage: 0,
      filterText: '',
      filterOptions: [],
      items: [],
      filteredItems: [],
      hasMore: true,
      isRequestFailed: false,
      requestFailedMessage: ''
    }

    this.fetchMoreData = this.fetchMoreData.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }

  componentDidMount () {
    const route = this.props.isEditView
      ? config.api.getUriPrefix() + '/user/submission/0'
      : (this.props.tag
          ? config.api.getUriPrefix() + '/submission/' + this.props.tag + '/' + this.props.sortType + '/0'
          : config.api.getUriPrefix() + '/submission/' + this.props.sortType + '/0')
    axios.get(route)
      .then(res => {
        const items = res.data.data
        const filterOptions = []
        for (let i = 0; i < items.length; i++) {
          filterOptions.push(items[i].name)
          filterOptions.push(items[i].contentUrl)
        }
        this.setState({ isRequestFailed: false, requestFailedMessage: '', nextPage: 1, items: items, filterOptions: filterOptions, filteredItems: items })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  fetchMoreData () {
    const route = this.props.isEditView
      ? config.api.getUriPrefix() + '/user/submission/' + this.state.nextPage
      : (this.props.tag
          ? config.api.getUriPrefix() + '/submission/' + this.props.tag + '/' + this.props.sortType + '/' + this.state.nextPage
          : config.api.getUriPrefix() + '/submission/' + this.props.sortType + '/' + this.state.nextPage)
    axios.get(route)
      .then(res => {
        this.setState({ isRequestFailed: false, requestFailedMessage: '', nextPage: this.state.nextPage + 1 })
        const items = res.data.data
        const filterOptions = []
        for (let i = 0; i < items.length; i++) {
          filterOptions.push(items[i].name)
          filterOptions.push(items[i].contentUrl)
        }
        if (items.length > 0) {
          this.setState({ items: this.state.items.concat(items), filterOptions: this.state.filterOptions.concat(filterOptions) })
        } else {
          this.setState({ hasMore: false })
        }

        this.onFilter(this.state.filterText)
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })
  }

  onFilter (text) {
    if (!text || (text.length < 3)) {
      this.setState({ filterText: text, filteredItems: this.state.items })
      return
    }

    text = text.toLowerCase()

    const fItems = []
    for (let i = 0; i < this.state.items.length; i++) {
      const item = this.state.items[i]
      if (item.name.toLowerCase().includes(text) || item.contentUrl.toLowerCase().includes(text)) {
        fItems.push(item)
      }
    }

    if (this.state.hasMore && fItems.length === 0) {
      this.fetchMoreData()
    }

    this.setState({ filterText: text, filteredItems: fItems })
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-12 search-bar'>
            <FormFieldTypeaheadRow
              options={this.state.filterOptions}
              inputName='nameOrUrl'
              label='Search title or URL'
              value=''
              onChange={(field, value) => this.onFilter(value)}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            {this.state.items.length
              ? (<InfiniteScroll dataLength={this.state.filteredItems.length} next={this.fetchMoreData} hasMore={this.state.hasMore} loader={<h4>Loading...</h4>} endMessage={<p style={{ textAlign: 'center' }}><b>You have seen all submissions.</b></p>}>{this.state.filteredItems.map((item, index) => <SubmissionBox item={item} key={index} isLoggedIn={this.props.isLoggedIn} isEditView={this.props.isEditView} isUnderReview={!(item.approvedAt)} />)}</InfiniteScroll>)
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
