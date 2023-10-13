import axios from 'axios'
import React from 'react'
import { Button, Tab, Tabs } from 'react-bootstrap'
import config from '../config'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import CategoryScroll from '../components/CategoryScroll'
import CategoryItemIcon from '../components/CategoryItemIcon'
import CategoryItemBox from '../components/CategoryItemBox'
import SubscribeButton from '../components/SubscribeButton'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import FormFieldWideRow from '../components/FormFieldWideRow'
import { sortCommon, sortAlphabetical } from '../components/SortFunctions'
import SotaChart from '../components/SotaChart'
import { withRouter, Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'
import TopSubmitters from '../components/TopSubmitters'
import SubmissionScroll from '../components/SubmissionScroll'
import QuantumLandscapeChart from '../components/QuantumLandscapeChart'

library.add(faHeart, faExternalLinkAlt, faChartLine)

const qedcIds = [34, 2, 97, 142, 150, 172, 173, 174, 175, 176, 177, 178, 179]

class Home extends React.Component {
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
      requestFailedMessage: '',
      isLinkBlocked: false
    }

    this.handleOnFilter = this.handleOnFilter.bind(this)
    this.handleOnSelect = this.handleOnSelect.bind(this)
    this.handleOnLinkClick = this.handleOnLinkClick.bind(this)
    this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this)
    this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this)
  }

  handleOnLinkClick (event) {
    if (this.state.isLinkBlocked) {
      event.preventDefault()
    }
  }

  handleOnMouseEnter () {
    this.setState({ isLinkBlocked: true })
  }

  handleOnMouseLeave () {
    this.setState({ isLinkBlocked: false })
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

    axios.get(config.api.getUriPrefix() + '/platform/submissionCount')
      .then(res => {
        const common = [...res.data.data]
        common.sort(sortCommon)
        const rws = []
        for (let i = 0; i < 2; ++i) {
          const row = []
          for (let j = 0; j < 3; ++j) {
            row.push(common[3 * i + j])
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
        <p className='text-left'>Metriq is a platform for tracking and sharing quantum technology benchmarks. Users can make new <Link to='/Submissions'>submissions</Link> that show the performance of different <Link to='/Methods'>methods</Link> on <Link to='/Platforms'>platforms</Link> against <Link to='/Tasks'>tasks</Link>.</p>
        <p className='text-left'>We have highlighted tasks here and you can search for more:</p>
        <br />
        <FormFieldTypeaheadRow
          className='search-bar'
          innerClassName='search-accent'
          options={this.state.allNames}
          labelKey='name'
          inputName='name'
          value=''
          placeholder='🔎'
          onChange={(field, value) => this.handleOnFilter(value)}
          onSelect={this.handleOnSelect}
          alignLabelRight
          isRow
        />
        <FormFieldWideRow>
          <div className='row'>
            <div className='col'>
              <h4 align='left'>Featured Tasks</h4>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-9'>
              {this.state.featured.map((item, index) =>
                <span key={index}>
                  <Link to={'/Task/' + item.id} className='active-navlink' onClick={this.handleOnLinkClick}>
                    <div className='task card task-card-link'>
                      <div className='row h-100 text-left'>
                        <div className='col-xl-4 col-lg-5 col'>
                          <SotaChart
                            isPreview
                            chartId={index}
                            xLabel='Time'
                            taskId={item.id}
                            key={index}
                            isLog
                            logBase={(index === 0) ? '2' : '10'}
                            onMouseEnter={this.handleOnMouseEnter}
                            onMouseLeave={this.handleOnMouseLeave}
                          />
                        </div>
                        <div className='col-xl-8 col-lg-7 col'>
                          <h5>
                            {item.name}
                            {qedcIds.includes(parseInt(item.id)) &&
                              <span> <Link to='/QEDC' onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave}><span className='link'>(QED-C)</span></Link></span>}
                            <span className='float-right'><SubscribeButton item={item} type='task' isLoggedIn={this.props.isLoggedIn} onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave} /></span>
                          </h5>
                          {item.description}
                        </div>
                      </div>
                      <div className='row h-100'>
                        <div className='col-lg-4 col text-left'>
                          <Link to={'/Task/' + item.parentTask.id} onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave}>{item.parentTask.name}</Link>
                        </div>
                        <div className='col-lg-8 col'>
                          <CategoryItemIcon count={item.resultCount} type='task' word='results' icon={faChartLine} />
                          <CategoryItemIcon count={item.submissionCount} type='task' word='submissions' icon={faExternalLinkAlt} />
                          <CategoryItemIcon count={item.upvoteTotal} type='task' word='up-votes' icon={faHeart} />
                        </div>
                      </div>
                    </div>
                  </Link>
                  <br />
                </span>
              )}
            </div>
            <div className='col-md-3'>
              <div className='card top-submitters-card'>
                <TopSubmitters isOnlyAllTime />
              </div>
              <br />
              <div className='card top-submitters-card'>
                <h5>Top Submissions</h5>
                <Tabs id='top-submissions-tabs' activeKey={this.state.activeTab} onSelect={activeTab => this.setState({ activeTab })}>
                  <Tab eventKey='Trending' title='Trending' className='metriq-nav-tab'>
                    <SubmissionScroll isSmall sortType='trending' isLoggedIn={this.props.isLoggedIn} />
                  </Tab>
                  <Tab eventKey='Popular' title='Popular' className='metriq-nav-tab'>
                    <SubmissionScroll isSmall sortType='popular' isLoggedIn={this.props.isLoggedIn} />
                  </Tab>
                  <Tab eventKey='Latest' title='Latest' className='metriq-nav-tab'>
                    <SubmissionScroll isSmall sortType='latest' isLoggedIn={this.props.isLoggedIn} />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </FormFieldWideRow>
        <br />
        <FormFieldWideRow className='centered-tabs'>
          <CategoryScroll className='col-lg-9 col' type='task' isLoading={this.state.isLoading} items={this.state.alphabetical} isLoggedIn={this.props.isLoggedIn} heading={<span>Tasks <Link to='/Tasks'><Button variant='outline-light' className='platforms-more-button'>Explore tasks</Button></Link></span>} />
        </FormFieldWideRow>
        <br />
        {(this.state.platforms.length > 0) &&
          <span>
            <FormFieldWideRow className='text-left'>
              <h4 align='left' style={{ display: 'inline-block' }}>Platforms</h4> <Link to='/Platforms'><Button variant='outline-light' className='platforms-more-button'>See more platforms</Button></Link>
            </FormFieldWideRow>
            <FormFieldWideRow>
              <div className='row h-100'>
                <div className='col-lg-9 col h-100'>
                  {this.state.platforms.map((row, rid) => <div className='row' key={rid}>{row.map((item, id) => <CategoryItemBox item={item} key={3 * rid + id} isLoggedIn={this.props.isLoggedIn} type='platform' />)}</div>)}
                </div>
              </div>
            </FormFieldWideRow>
            <br />
          </span>}
        <div className='row'>
          <div className='col-md-9'>
            <QuantumLandscapeChart />
          </div>
        </div>
        <FormFieldAlertRow>
          <FormFieldValidator invalid={!!this.state.requestFailedMessage} message={this.state.requestFailedMessage} />
        </FormFieldAlertRow>
      </div>
    )
  }
}

export default withRouter(Home)
