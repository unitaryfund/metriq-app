import axios from 'axios'
import React from 'react'
import { sortCommon, sortAlphabetical } from '../components/SortFunctions'
import { withRouter, Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faExternalLinkAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'
import config from '../config'
import ErrorHandler from '../components/ErrorHandler'
import Partners from '../components/Partners'
import Committee from './Committee'

library.add(faHeart, faExternalLinkAlt, faChartLine)

class Partners extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      alphabetical: [],
      allNames: [],
      platforms: [],
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
  }

  render () {
    return (
      <span>
        <div className='metriq-header'>
          <h1>Open tracking of quantum technology progress</h1>
          <br />
        </div>
        <div id='metriq-main-content'>
          <Partners />
          <Committee />
        </div>
      </span>
    )
  }
}

export default withRouter(Partners)
