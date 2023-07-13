import axios from 'axios'
import React from 'react'
import { Button, Tab, Tabs } from 'react-bootstrap'
import config from './../config'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import CategoryScroll from '../components/CategoryScroll'
import CategoryItemIcon from '../components/CategoryItemIcon'
import CategoryItemBox from '../components/CategoryItemBox'
import SubscribeButton from '../components/SubscribeButton'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import FormFieldWideRow from '../components/FormFieldWideRow'
import ViewHeader from '../components/ViewHeader'
import { sortAlphabetical } from '../components/SortFunctions'
import SotaChart from '../components/SotaChart'
import { withRouter, Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'
import TopSubmitters from '../components/TopSubmitters'
import SubmissionScroll from '../components/SubmissionScroll'

library.add(faHeart, faExternalLinkAlt, faChartLine)

const qedcIds = [34, 2, 97, 142, 150, 172, 173, 174, 175, 176, 177, 178, 179]

class Tasks extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      alphabetical: [],
      allNames: [],
      platforms: [],
      featured: [],
      trending: [],
      popular: [],
      latest: [],
      topSubmitters: [],
      activeTab: 'Trending',
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
        const alphabetical = res.data.data
        alphabetical.sort(sortAlphabetical)
        this.setState({ alphabetical, isLoading: false })
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
    axios.get(config.api.getUriPrefix() + '/platform/names')
      .then(res => {
        const rws = []
        for (let i = 0; i < 2; ++i) {
          const row = []
          for (let j = 0; j < 3; ++j) {
            row.push(res.data.data[3 * i + j])
          }
          rws.push(row)
        }
        this.setState({
          requestFailedMessage: '',
          platforms: rws
        })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })

    axios.get(config.api.getUriPrefix() + '/task/submissionCount/34')
      .then(res => {
        const featured = [res.data.data]

        axios.get(config.api.getUriPrefix() + '/task/submissionCount/50')
          .then(res => {
            featured.push(res.data.data)

            axios.get(config.api.getUriPrefix() + '/task/submissionCount/164')
              .then(res => {
                featured.push(res.data.data)
                this.setState({ featured })
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
      <div id='metriq-main-content'>
        <ViewHeader>Tasks</ViewHeader>
        <h4>Tasks are workloads of interest performed on a quantum computer.</h4>
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
          <div className='row'>
            <div className='col-md-9'>
              <h4 align='left'>Featured</h4>
              {this.state.featured.map((item, index) =>
                <div className='task card' key={index}>
                  <div className='row h-100 text-left'>
                    <div className='col-md-3 col'>
                      <Link to={'/Task/' + item.id} className='active-navlink'>
                        <SotaChart
                          isPreview
                          chartId={index}
                          xLabel='Time'
                          taskId={item.id}
                          key={index}
                          isLog
                          logBase={(index === 0) ? '2' : '10'}
                        />
                      </Link>
                    </div>
                    <div className='col-md-9 col'>
                      <h5>
                        <Link to={'/Task/' + item.id} className='active-navlink'>{item.name}</Link>
                        {qedcIds.includes(parseInt(item.id)) &&
                          <span> <Link to='/QEDC'><span className='link'>(QED-C)</span></Link></span>}
                        <span className='float-right'><SubscribeButton item={item} type='task' isLoggedIn={this.props.isLoggedIn} /></span>
                      </h5>
                      <Link to={'/Task/' + item.id} className='active-navlink'>{item.description}</Link>
                    </div>
                  </div>
                  <div className='row h-100'>
                    <div className='col-md-4 col text-left'>
                      <Link to={'/Task/' + item.parentTask.id}>{item.parentTask.name}</Link>
                    </div>
                    <div className='col-md-8 col text_right'>
                      <Link to={'/Task/' + item.id} className='active-navlink text-right' style={{ width: 'auto' }}>
                        <CategoryItemIcon count={item.resultCount} type='task' word='results' icon={faChartLine} />
                        <CategoryItemIcon count={item.submissionCount} type='task' word='submissions' icon={faExternalLinkAlt} />
                        <CategoryItemIcon count={item.upvoteTotal} type='task' word='up-votes' icon={faHeart} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className='col-md-3'>
              <TopSubmitters />
              <br />
              <h5>Top Submissions</h5>
              <Tabs id='top-submissions-tabs' activeKey={this.state.activeTab} onSelect={activeTab => this.setState({ activeTab })}>
                <Tab eventKey='Trending' title='Trending' className='metriq-nav-tab'>
                  <SubmissionScroll isSmall sortType='trending' isLoggedIn={this.props.isLoggedIn} key={Math.random()} />
                </Tab>
                <Tab eventKey='Popular' title='Popular' className='metriq-nav-tab'>
                  <SubmissionScroll isSmall sortType='popular' isLoggedIn={this.props.isLoggedIn} key={Math.random()} />
                </Tab>
                <Tab eventKey='Latest' title='Latest' className='metriq-nav-tab'>
                  <SubmissionScroll isSmall sortType='latest' isLoggedIn={this.props.isLoggedIn} key={Math.random()} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </FormFieldWideRow>
        <br />
        <FormFieldWideRow className='centered-tabs'>
          <CategoryScroll className='col-md-9 col' type='task' isLoading={this.state.isLoading} items={this.state.alphabetical} isLoggedIn={this.props.isLoggedIn} heading='Top-level task categories' />
        </FormFieldWideRow>
        <br />
        {(this.state.platforms.length > 0) &&
          <span>
            <FormFieldWideRow>
              <h4 align='left'>Platforms</h4>
            </FormFieldWideRow>
            <FormFieldWideRow>
              <div className='task'>
                <div className='row h-100'>
                  <div className='col-md-9 col h-100'>
                    {this.state.platforms.map((row, rid) => <div className='row' key={rid}>{row.map((item, id) => <CategoryItemBox item={item} key={3 * rid + id} isLoggedIn={this.props.isLoggedIn} type='platform' />)}</div>)}
                  </div>
                </div>
              </div>
            </FormFieldWideRow>
            <br />
            <FormFieldWideRow className='text-left'>
              <Link to='/Platforms'><Button variant='outline-light' className='platforms-more-button'>See more platforms</Button></Link>
            </FormFieldWideRow>
          </span>}
        <FormFieldAlertRow>
          <FormFieldValidator invalid={!!this.state.requestFailedMessage} message={this.state.requestFailedMessage} />
        </FormFieldAlertRow>
      </div>
    )
  }
}

export default withRouter(Tasks)
