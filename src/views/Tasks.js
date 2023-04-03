import axios from 'axios'
import React from 'react'
import config from './../config'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import CategoryScroll from '../components/CategoryScroll'
import CategoryItemBox from '../components/CategoryItemBox'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import FormFieldWideRow from '../components/FormFieldWideRow'
import ViewHeader from '../components/ViewHeader'
import { sortAlphabetical } from '../components/SortFunctions'
import SotaChart from '../components/SotaChart'
import { withRouter } from 'react-router-dom'

class Tasks extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      alphabetical: [],
      allNames: [],
      featured: [],
      trending: [],
      popular: [],
      latest: [],
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
    axios.get(config.api.getUriPrefix() + '/submission/trending/0')
      .then(res => {
        this.setState({ trending: res.data.data.slice(0, 3) })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })

    axios.get(config.api.getUriPrefix() + '/submission/popular/0')
      .then(res => {
        this.setState({ popular: res.data.data.slice(0, 3) })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })

    axios.get(config.api.getUriPrefix() + '/submission/latest/0')
      .then(res => {
        this.setState({ latest: res.data.data.slice(0, 3) })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })

    axios.get(config.api.getUriPrefix() + '/task/submissionCount')
      .then(res => {
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

    axios.get(config.api.getUriPrefix() + '/task/submissionCount/34')
      .then(res => {
        this.setState({ featured: [res.data.data] })
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
        <p>Search the task hierarchy to see charts of comparative performance across methods, see our submitter leader board and featured task charts, or click into the parent/child task hierarchy through top-level task categories.</p>
        <br />
        <FormFieldTypeaheadRow
          className='search-bar'
          options={this.state.allNames}
          labelKey='name'
          inputName='name'
          label='Search tasks'
          value=''
          onChange={(field, value) => this.handleOnFilter(value)}
          onSelect={this.handleOnSelect}
          alignLabelRight
        />
        <br />
        <FormFieldWideRow>
          <h5>Featured</h5>
          {this.state.featured.map((item, index) => {
            return (
              <div className='task card' key={index}>
                <div className='row h-100'>
                  <div className='col-md col h-100'>
                    <table className='task-method-item'>
                      <tbody>
                        <CategoryItemBox item={item} isLoggedIn={this.props.isLoggedIn} type='task' className='submission' />
                        <SotaChart
                          chartId={index}
                          xLabel='Time'
                          taskId={item.id}
                          key={index}
                          isLog
                          logBase={(index === 0) ? '2' : ((index === 1) ? 'e' : '10')}
                        />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          })}
        </FormFieldWideRow>
        <br />
        <FormFieldWideRow className='centered-tabs'>
          <CategoryScroll type='task' isLoading={this.state.isLoading} items={this.state.alphabetical} isLoggedIn={this.props.isLoggedIn} heading='Top-level task categories' />
        </FormFieldWideRow>
        <FormFieldAlertRow>
          <FormFieldValidator invalid={!!this.state.requestFailedMessage} message={this.state.requestFailedMessage} />
        </FormFieldAlertRow>
      </div>
    )
  }
}

export default withRouter(Tasks)
