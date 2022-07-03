import axios from 'axios'
import React from 'react'
import config from './../config'
import { Tabs, Tab } from 'react-bootstrap'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import CategoryScroll from '../components/CategoryScroll'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import FormFieldWideRow from '../components/FormFieldWideRow'
import ViewHeader from '../components/ViewHeader'
import { sortCommon, sortPopular, sortAlphabetical } from '../components/SortFunctions'

class Methods extends React.Component {
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
      window.location.href = '/Method/' + value.id
    }
  }

  componentDidMount () {
    axios.get(config.api.getUriPrefix() + '/method/submissionCount')
      .then(res => {
        const common = [...res.data.data]
        common.sort(sortCommon)
        this.setState({
          isRequestFailed: false,
          requestFailedMessage: '',
          common: common
        })

        const popular = [...res.data.data]
        popular.sort(sortPopular)
        this.setState({ popular: popular })

        const alphabetical = res.data.data
        alphabetical.sort(sortAlphabetical)
        this.setState({ alphabetical: alphabetical })
      })
      .catch(err => {
        this.setState({ isRequestFailed: true, requestFailedMessage: ErrorHandler(err) })
      })

    axios.get(config.api.getUriPrefix() + '/method/names')
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
        <ViewHeader>Methods</ViewHeader>
        <br />
        <FormFieldWideRow className='search-bar'>
          <FormFieldTypeaheadRow
            options={this.state.allNames}
            labelKey='name'
            inputName='name'
            label='Search name'
            value=''
            onChange={(field, value) => this.handleOnFilter(value)}
            onSelect={this.handleOnSelect}
          />
        </FormFieldWideRow>
        <br />
        <div className='centered-tabs'>
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
        </div>
        <FormFieldAlertRow>
          <FormFieldValidator invalid={this.state.isRequestFailed} message={this.state.requestFailedMessage} />
        </FormFieldAlertRow>
      </div>
    )
  }
}

export default Methods
