import axios from 'axios'
import React from 'react'
import config from './../config'
import { Tabs, Tab } from 'react-bootstrap'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import CategoryScroll from '../components/CategoryScroll'
import CategoryItemBox from '../components/CategoryItemBox'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import FormFieldWideRow from '../components/FormFieldWideRow'
import ViewHeader from '../components/ViewHeader'
import { sortCommon, sortPopular, sortAlphabetical } from '../components/SortFunctions'
import SotaChart from '../components/SotaChart'
import { withRouter } from 'react-router-dom'
import ViewSubHeader from '../components/ViewSubHeader'

class Tasks extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      alphabetical: [],
      popular: [],
      common: [],
      allNames: [],
      featured: [],
      filterId: null,
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
      this.props.history.push('/Task/' + value.id)
    }
  }

  componentDidMount () {
    axios.get(config.api.getUriPrefix() + '/task/submissionCount')
      .then(res => {
        const common = [...res.data.data]
        common.sort(sortCommon)
        this.setState({
          requestFailedMessage: '',
          common: common
        })

        const popular = [...res.data.data]
        popular.sort(sortPopular)
        this.setState({ popular: popular })

        const alphabetical = res.data.data
        alphabetical.sort(sortAlphabetical)
        this.setState({ alphabetical: alphabetical, isLoading: false })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })

    axios.get(config.api.getUriPrefix() + '/task/names')
      .then(res => {
        this.setState({
          requestFailedMessage: '',
          allNames: res.data.data
        })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })

    const featured = []
    axios.get(config.api.getUriPrefix() + '/task/submissionCount/34')
      .then(res => {
        featured.push(res.data.data)
        this.setState({ featured: featured })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        <ViewHeader>Tasks</ViewHeader>
          <h5>Tasks are workloads of interest performed on a quantum computer.</h5>
        <br />
        <FormFieldWideRow className='centered-tabs'>
          <ViewSubHeader>Categories</ViewSubHeader>
        </FormFieldWideRow>
        <FormFieldWideRow className='search-bar'>
          <FormFieldTypeaheadRow
            options={this.state.allNames}
            labelKey='name'
            inputName='name'
            label='Search name'
            value=''
            onChange={(field, value) => this.handleOnFilter(value)}
            onSelect={this.handleOnSelect}
            alignLabelRight
          />
        </FormFieldWideRow>
        <br />
        <FormFieldWideRow className='centered-tabs'>
          <Tabs defaultActiveKey='common' id='categories-tabs'>
            <Tab eventKey='common' title='Common'>
              <CategoryScroll type='task' isLoading={this.state.isLoading} items={this.state.common} isLoggedIn={this.props.isLoggedIn} heading='Sorted by submission count' />
            </Tab>
            <Tab eventKey='popular' title='Popular'>
              <CategoryScroll type='task' isLoading={this.state.isLoading} items={this.state.popular} isLoggedIn={this.props.isLoggedIn} heading='Sorted by aggregate upvote count' />
            </Tab>
            <Tab eventKey='alphabetical' title='Alphabetical'>
              <CategoryScroll type='task' isLoading={this.state.isLoading} items={this.state.alphabetical} isLoggedIn={this.props.isLoggedIn} heading='Sorted alphabetically' />
            </Tab>
          </Tabs>
        </FormFieldWideRow>
        <br />
        <br />
        <FormFieldWideRow>
          <h5>Featured</h5>
          <div className='task card'>
            <div className='row h-100'>
              <div className='col-md col h-100'>
                <table className='task-method-item'>
                  <tbody>
                    {this.state.featured.map((item, index) => {
                      return (
                        <div key={index}>
                          <CategoryItemBox item={item} isLoggedIn={this.props.isLoggedIn} type='task' />
                          <SotaChart
                            chartId={index}
                            xLabel='Time'
                            taskId={item.id}
                            key={index}
                          />
                        </div>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </FormFieldWideRow>
        <FormFieldAlertRow>
          <FormFieldValidator invalid={!!this.state.requestFailedMessage} message={this.state.requestFailedMessage} />
        </FormFieldAlertRow>
      </div>
    )
  }
}

export default withRouter(Tasks)
