import axios from 'axios'
import React, { Suspense } from 'react'
import config from './../config'
import ErrorHandler from './ErrorHandler'
import FormFieldValidator from './FormFieldValidator'
import FormFieldAlertRow from './FormFieldAlertRow'
import FormFieldWideRow from './FormFieldWideRow'
import FormFieldTypeaheadRow from './FormFieldTypeaheadRow'
const InfiniteScroll = React.lazy(() => import('react-infinite-scroll-component'))
const SubmissionBox = React.lazy(() => import('./SubmissionBox'))

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
      requestFailedMessage: ''
    }

    this.fetchMoreData = this.fetchMoreData.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }

  componentDidMount () {
    const route = this.props.isEditView
      ? config.api.getUriPrefix() + '/user/submission/0'
      : (this.props.isPublicView
          ? config.api.getUriPrefix() + '/user/' + this.props.userId + '/submission/0'
          : (this.props.tag
              ? config.api.getUriPrefix() + '/submission/' + this.props.tag + '/' + this.props.sortType + '/0'
              : config.api.getUriPrefix() + '/submission/' + this.props.sortType + '/0'))

    axios.get(route)
      .then(res => {
        const items = res.data.data
        const filterOptions = []
        for (let i = 0; i < items.length; i++) {
          filterOptions.push(items[i].name)
          filterOptions.push(items[i].contentUrl)
        }
        this.setState({
          requestFailedMessage: '',
          nextPage: 1,
          items: items,
          filterOptions: filterOptions,
          filteredItems: items
        })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })
  }

  fetchMoreData () {
    const route = this.props.isEditView
      ? config.api.getUriPrefix() + '/user/submission/' + this.state.nextPage
      : (this.props.isPublicView
          ? config.api.getUriPrefix() + '/user/' + this.props.userId + '/submission/' + this.state.nextPage
          : (this.props.tag
              ? config.api.getUriPrefix() + '/submission/' + this.props.tag + '/' + this.props.sortType + '/' + this.state.nextPage
              : config.api.getUriPrefix() + '/submission/' + this.props.sortType + '/' + this.state.nextPage))
    axios.get(route)
      .then(res => {
        this.setState({ requestFailedMessage: '', nextPage: this.state.nextPage + 1 })
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
        this.setState({ requestFailedMessage: ErrorHandler(err) })
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
        <FormFieldTypeaheadRow
          className='search-bar'
          options={this.state.filterOptions}
          inputName='nameOrUrl'
          inputId={'nameOrUrl-' + this.props.sortType}
          label='Search title or URL'
          value=''
          onChange={(field, value) => this.onFilter(value)}
          alignLabelRight
        />
        <FormFieldWideRow>
          {this.state.items.length && (
            <Suspense fallback={<div>Loading...</div>}>
              <InfiniteScroll
                dataLength={this.state.filteredItems.length}
                next={this.fetchMoreData}
                hasMore={this.state.hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p style={{ textAlign: 'center' }}><b>You have seen all submissions.</b></p>}
              >
                {this.state.filteredItems.map((item, index) =>
                  <SubmissionBox
                    item={item}
                    key={index}
                    isLoggedIn={this.props.isLoggedIn}
                    isEditView={this.props.isEditView}
                    isUnderReview={!(item.approvedAt)}
                    isDraft={!(item.publishedAt)}
                  />)}
              </InfiniteScroll>
            </Suspense>
          )}
          {!this.state.items.length && (this.props.isEditView
            ? <p><b>You have no submissions, yet.</b></p>
            : <p><b>There are no approved submissions, yet.</b></p>)}
        </FormFieldWideRow>
        <br />
        <FormFieldAlertRow>
          <FormFieldValidator invalid={!!this.state.requestFailedMessage} message={this.state.requestFailedMessage} />
        </FormFieldAlertRow>
      </div>
    )
  }
}

export default SubmissionScroll
