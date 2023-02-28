import axios from 'axios'
import React, { Suspense } from 'react'
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
import { sortAlphabetical } from '../components/SortFunctions'
import SotaChart from '../components/SotaChart'
import { withRouter } from 'react-router-dom'
const SortingTable = React.lazy(() => import('../components/SortingTable'))
const SubmissionBox = React.lazy(() => import('../components/SubmissionBox'))

class Tasks extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      alphabetical: [],
      allNames: [],
      activeTab: 'Trending',
      featured: [],
      trending: [],
      popular: [],
      latest: [],
      filterId: null,
      requestFailedMessage: '',
      topSubmitters: { weekly: [], monthly: [], allTime: [] }
    }

    this.handleOnFilter = this.handleOnFilter.bind(this)
    this.handleOnSelect = this.handleOnSelect.bind(this)
    this.handleOnToggle = this.handleOnToggle.bind(this)
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

  handleOnToggle (tab) {
    this.setState({ activeTab: tab })
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

    axios.get(config.api.getUriPrefix() + '/user/topSubmitters')
      .then(res => {
        const topSubmitters = res.data.data
        topSubmitters.allTime[0].rank = '🥇'
        topSubmitters.allTime[1].rank = '🥈'
        topSubmitters.allTime[2].rank = '🥉'
        topSubmitters.monthly[0].rank = '🥇'
        topSubmitters.monthly[1].rank = '🥈'
        topSubmitters.monthly[2].rank = '🥉'
        topSubmitters.weekly[0].rank = '🥇'
        topSubmitters.weekly[1].rank = '🥈'
        topSubmitters.weekly[2].rank = '🥉'

        this.setState({ topSubmitters: topSubmitters })
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

    const featured = []
    axios.get(config.api.getUriPrefix() + '/task/submissionCount/34')
      .then(res => {
        featured.push(res.data.data)
        axios.get(config.api.getUriPrefix() + '/task/submissionCount/51')
          .then(res => {
            featured.push(res.data.data)
            axios.get(config.api.getUriPrefix() + '/task/submissionCount/38')
              .then(res => {
                featured.push(res.data.data)
                this.setState({ featured: featured })
              })
              .catch(err => {
                this.setState({ requestFailedMessage: ErrorHandler(err) })
              })
          })
          .catch(err => {
            this.setState({ requestFailedMessage: ErrorHandler(err) })
          })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        {this.props.isHomepage &&
          <span>
            <ViewHeader>Top Submissions</ViewHeader>
            <h5>Submissions are articles and code presenting research and tools for quantum technologies.</h5>
            <Suspense fallback={<div>Loading...</div>}>
              <Tabs id='top-submissions-tabs' activeKey={this.state.activeTab} onSelect={this.handleOnToggle}>
                <Tab eventKey='Trending' title='Trending' className='metriq-nav-tab'>
                  {this.state.trending.map((item, index) =>
                    <SubmissionBox
                      item={item}
                      key={index}
                      isLoggedIn={this.props.isLoggedIn}
                      isEditView={false}
                      isUnderReview={!(item.approvedAt)}
                      isDraft={!(item.publishedAt)}
                    />)}
                </Tab>
                <Tab eventKey='Popular' title='Popular' className='metriq-nav-tab'>
                  {this.state.popular.map((item, index) =>
                    <SubmissionBox
                      item={item}
                      key={index}
                      isLoggedIn={this.props.isLoggedIn}
                      isEditView={false}
                      isUnderReview={!(item.approvedAt)}
                      isDraft={!(item.publishedAt)}
                    />)}
                </Tab>
                <Tab eventKey='Latest' title='Latest' className='metriq-nav-tab'>
                  {this.state.latest.map((item, index) =>
                    <SubmissionBox
                      item={item}
                      key={index}
                      isLoggedIn={this.props.isLoggedIn}
                      isEditView={false}
                      isUnderReview={!(item.approvedAt)}
                      isDraft={!(item.publishedAt)}
                    />)}
                </Tab>
              </Tabs>
            </Suspense>
            <br />
            <h5>Top Submitters</h5>
            <Suspense fallback={<div>Loading...</div>}>
              <Tabs id='top-submissions-tabs'>
                <Tab eventKey='Weekly' title='Weekly' className='metriq-nav-tab'>
                  <div className='card'>
                    <SortingTable
                      columns={[
                        {
                          title: 'Name',
                          key: 'username',
                          width: 360
                        },
                        {
                          title: 'Rank',
                          key: 'rank',
                          width: 80
                        },
                        {
                          title: 'Submission Count',
                          key: 'submissionsCount',
                          width: 360
                        }
                      ]}
                      data={this.state.topSubmitters.weekly}
                      key={Math.random()}
                      onRowClick={(record) => this.props.history.push('/User/' + record.id + '/Submissions')}
                      tableLayout='auto'
                      rowClassName='link'
                    />
                  </div>
                </Tab>
                <Tab eventKey='Monthly' title='Monthly' className='metriq-nav-tab'>
                  <div className='card'>
                    <SortingTable
                      columns={[
                        {
                          title: 'Name',
                          key: 'username',
                          width: 360
                        },
                        {
                          title: 'Rank',
                          key: 'rank',
                          width: 80
                        },
                        {
                          title: 'Submission Count',
                          key: 'submissionsCount',
                          width: 360
                        }
                      ]}
                      data={this.state.topSubmitters.monthly}
                      key={Math.random()}
                      onRowClick={(record) => this.props.history.push('/User/' + record.id + '/Submissions')}
                      tableLayout='auto'
                      rowClassName='link'
                    />
                  </div>
                </Tab>
                <Tab eventKey='AllTime' title='All Time' className='metriq-nav-tab'>
                  <div className='card'>
                    <SortingTable
                      columns={[
                        {
                          title: 'Name',
                          key: 'username',
                          width: 360
                        },
                        {
                          title: 'Rank',
                          key: 'rank',
                          width: 80
                        },
                        {
                          title: 'Submission Count',
                          key: 'submissionsCount',
                          width: 360
                        }
                      ]}
                      data={this.state.topSubmitters.allTime}
                      key={Math.random()}
                      onRowClick={(record) => this.props.history.push('/User/' + record.id + '/Submissions')}
                      tableLayout='auto'
                      rowClassName='link'
                    />
                  </div>
                </Tab>
              </Tabs>
            </Suspense>
            <br />
            <br />
          </span>}
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
