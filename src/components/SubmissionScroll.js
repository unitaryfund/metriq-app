import axios from 'axios'
import React, { useState } from 'react'
import config from './../config'
import InfiniteScroll from 'react-infinite-scroll-component'
import FormFieldValidator from '../components/FormFieldValidator'
import SubmissionBox from '../components/SubmissionBox'
import ErrorHandler from './ErrorHandler'
import FormFieldTypeaheadRow from './FormFieldTypeaheadRow'
import FormFieldAlertRow from './FormFieldAlertRow'
import FormFieldWideRow from './FormFieldWideRow'

const SubmissionScroll = (props) => {
  const [nextPage, setNextPage] = useState(0)
  const [filterText, setFilterText] = useState('')
  const [filterOptions, setFilterOptions] = useState([])
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [requestFailedMessage, setRequestFailedMessage] = useState('')

  const route = props.isEditView
    ? config.api.getUriPrefix() + '/user/submission/0'
    : (props.isPublicView
        ? config.api.getUriPrefix() + '/user/' + props.userId + '/submission/0'
        : (props.tag
            ? config.api.getUriPrefix() + '/submission/' + props.tag + '/' + props.sortType + '/0'
            : config.api.getUriPrefix() + '/submission/' + props.sortType + '/0'))

  axios.get(route)
    .then(res => {
      const items = res.data.data
      const filterOptions = []
      for (let i = 0; i < items.length; i++) {
        filterOptions.push(items[i].name)
        filterOptions.push(items[i].contentUrl)
      }
      setRequestFailedMessage('')
      setNextPage(1)
      setItems(items)
      setFilterOptions(filterOptions)
      setFilteredItems(items)
    })
    .catch(err => {
      setRequestFailedMessage(ErrorHandler(err))
    })

  const fetchMoreData = () => {
    const route = props.isEditView
      ? config.api.getUriPrefix() + '/user/submission/' + nextPage
      : (props.isPublicView
          ? config.api.getUriPrefix() + '/user/' + props.userId + '/submission/' + nextPage
          : (props.tag
              ? config.api.getUriPrefix() + '/submission/' + props.tag + '/' + props.sortType + '/' + nextPage
              : config.api.getUriPrefix() + '/submission/' + props.sortType + '/' + nextPage))
    axios.get(route)
      .then(res => {
        setRequestFailedMessage('')
        setNextPage(nextPage + 1)
        const items = res.data.data
        const filterOptions = []
        for (let i = 0; i < items.length; i++) {
          filterOptions.push(items[i].name)
          filterOptions.push(items[i].contentUrl)
        }
        if (items.length > 0) {
          setItems(items.concat(items))
          setFilterOptions(filterOptions.concat(filterOptions))
        } else {
          setHasMore(false)
        }

        this.onFilter(filterText)
      })
      .catch(err => {
        setRequestFailedMessage(ErrorHandler(err))
      })
  }

  const onFilter = (text) => {
    if (!text || (text.length < 3)) {
      setFilterText(text)
      setFilteredItems(items)
      return
    }

    text = text.toLowerCase()

    const fItems = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.name.toLowerCase().includes(text) || item.contentUrl.toLowerCase().includes(text)) {
        fItems.push(item)
      }
    }

    if (hasMore && fItems.length === 0) {
      this.fetchMoreData()
    }

    setFilterText(text)
    setFilteredItems(fItems)
  }

  return (
    <div className='container'>
      <FormFieldWideRow className='search-bar'>
        <FormFieldTypeaheadRow
          options={filterOptions}
          inputName='nameOrUrl'
          label='Search title or URL'
          value=''
          onChange={(field, value) => onFilter(value)}
        />
      </FormFieldWideRow>
      <FormFieldWideRow>
        {items.length && (
          <InfiniteScroll
            dataLength={filteredItems.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p style={{ textAlign: 'center' }}><b>You have seen all submissions.</b></p>}
          >
            {filteredItems.map((item, index) =>
              <SubmissionBox
                item={item}
                key={index}
                isLoggedIn={props.isLoggedIn}
                isEditView={props.isEditView}
                isUnderReview={!(item.approvedAt)}
              />)}
          </InfiniteScroll>
        )}
        {!items.length && (props.isEditView
          ? <p><b>You have no submissions, yet.</b></p>
          : <p><b>There are no approved submissions, yet.</b></p>)}
      </FormFieldWideRow>
      <br />
      <FormFieldAlertRow>
        <FormFieldValidator invalid={!!requestFailedMessage} message={requestFailedMessage} />
      </FormFieldAlertRow>
    </div>
  )
}

export default SubmissionScroll
