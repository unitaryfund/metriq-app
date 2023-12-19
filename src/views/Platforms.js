import axios from 'axios'
import React from 'react'
import config from '../config'
import { Tabs, Tab } from 'react-bootstrap'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'
import CategoryScroll from '../components/CategoryScroll'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import ViewHeader from '../components/ViewHeader'
import { sortCommon, sortPopular, sortAlphabetical } from '../components/SortFunctions'
import { withRouter, useParams } from 'react-router-dom'
import ViewSubHeader from '../components/ViewSubHeader'
import FormFieldWideRow from '../components/FormFieldWideRow'

function withParams (Component) {
  return props => <Component {...props} params={useParams()} />
}

class Platforms extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      alphabetical: [],
      popular: [],
      common: [],
      isLoadingArchitectures: true,
      alphabeticalArchitectures: [],
      popularArchitectures: [],
      commonArchitectures: [],
      isLoadingProviders: true,
      alphabeticalProviders: [],
      popularProviders: [],
      commonProviders: [],
      allNames: [],
      allArchitectureNames: [],
      allProviderNames: [],
      filterId: null,
      architecture: { name: '' },
      provider: { name: '' },
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
      this.props.history.push('/Platform/' + value.id)
    }
  }

  componentDidMount () {
    if (this.props.isArchitecture) {
      axios.get(config.api.getUriPrefix() + '/architecture/' + this.props.params.id)
        .then(res => {
          this.setState({
            requestFailedMessage: '',
            architecture: res.data.data
          })
        })
        .catch(err => {
          this.setState({ requestFailedMessage: ErrorHandler(err) })
        })
    }

    if (this.props.isProvider) {
      axios.get(config.api.getUriPrefix() + '/provider/' + this.props.params.id)
        .then(res => {
          this.setState({
            requestFailedMessage: '',
            provider: res.data.data
          })
        })
        .catch(err => {
          this.setState({ requestFailedMessage: ErrorHandler(err) })
        })
    }

    if (!this.props.isArchitecture && !this.props.isProvider) {
      axios.get(config.api.getUriPrefix() + '/architecture/submissionCount')
        .then(res => {
          const commonArchitectures = [...res.data.data]
          commonArchitectures.sort(sortCommon)
          this.setState({
            requestFailedMessage: '',
            commonArchitectures
          })

          const popularArchitectures = [...res.data.data]
          popularArchitectures.sort(sortPopular)
          this.setState({ popularArchitectures })

          const alphabeticalArchitectures = res.data.data
          alphabeticalArchitectures.sort(sortAlphabetical)
          this.setState({ alphabeticalArchitectures, isLoadingArchitectures: false })
        })
        .catch(err => {
          this.setState({ requestFailedMessage: ErrorHandler(err) })
        })

      axios.get(config.api.getUriPrefix() + '/provider/submissionCount')
        .then(res => {
          const commonProviders = [...res.data.data]
          commonProviders.sort(sortCommon)
          this.setState({
            requestFailedMessage: '',
            commonProviders
          })

          const popularProviders = [...res.data.data]
          popularProviders.sort(sortPopular)
          this.setState({ popularProviders })

          const alphabeticalProviders = res.data.data
          alphabeticalProviders.sort(sortAlphabetical)
          this.setState({ alphabeticalProviders, isLoadingProviders: false })
        })
        .catch(err => {
          this.setState({ requestFailedMessage: ErrorHandler(err) })
        })
    }

    if (this.props.isArchitecture) {
      axios.get(config.api.getUriPrefix() + '/provider/submissionCount/architecture/' + this.props.params.id)
        .then(res => {
          const commonProviders = [...res.data.data]
          commonProviders.sort(sortCommon)
          this.setState({
            requestFailedMessage: '',
            commonProviders
          })

          const popularProviders = [...res.data.data]
          popularProviders.sort(sortPopular)
          this.setState({ popularProviders })

          const alphabeticalProviders = res.data.data
          alphabeticalProviders.sort(sortAlphabetical)
          this.setState({ alphabeticalProviders, isLoadingProviders: false })
        })
        .catch(err => {
          this.setState({ requestFailedMessage: ErrorHandler(err) })
        })
    }

    axios.get(config.api.getUriPrefix() + '/platform/submissionCount' + (this.props.isArchitecture ? '/architecture/' + this.props.params.id : (this.props.isProvider ? '/provider/' + this.props.params.id : '')))
      .then(res => {
        const common = [...res.data.data]
        common.sort(sortCommon)
        this.setState({
          requestFailedMessage: '',
          common
        })

        const popular = [...res.data.data]
        popular.sort(sortPopular)
        this.setState({ popular })

        const alphabetical = res.data.data
        alphabetical.sort(sortAlphabetical)
        this.setState({ alphabetical, isLoading: false })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })

    axios.get(config.api.getUriPrefix() + '/architecture/names')
      .then(res => {
        this.setState({
          requestFailedMessage: '',
          allArchitectureNames: res.data.data
        })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })

    axios.get(config.api.getUriPrefix() + '/provider/names')
      .then(res => {
        const apn = res.data.data
        // Sort alphabetically and put "Other" at end of array.
        apn.sort(sortAlphabetical)
        const otherIndex = apn.findIndex(x => x.name === 'Other')
        const allProviderNames = apn.toSpliced(otherIndex, 1)
        allProviderNames.push(apn[otherIndex])
        allProviderNames.splice(otherIndex, 1)
        this.setState({
          requestFailedMessage: '',
          allProviderNames
        })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })

    axios.get(config.api.getUriPrefix() + '/platform/names')
      .then(res => {
        this.setState({
          requestFailedMessage: '',
          allNames: res.data.data
        })
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div id='metriq-main-content'>
        <ViewHeader>Platforms{this.props.isArchitecture ? ': ' + this.state.architecture.name + ' architecture' : (this.props.isProvider ? ': ' + this.state.provider.name + ' provider' : '')} </ViewHeader>
        <ViewSubHeader>Platforms are the hardware devices used for a submission.</ViewSubHeader>
        <br />
        <FormFieldTypeaheadRow
          className='search-bar'
          options={this.state.allNames}
          labelKey='name'
          inputName='name'
          label='Search name'
          value=''
          onChange={(field, value) => this.handleOnFilter(value)}
          onSelect={this.handleOnSelect}
          alignLabelRight
        />
        <br />
        {!this.props.isArchitecture && !this.props.isProvider &&
          <span>
            <FormFieldWideRow>
              <div className='row'>
                <div className='col'>
                  <h4 align='left'>Architectures</h4>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12 centered-tabs'>
                  <Tabs defaultActiveKey='common' id='categories-tabs'>
                    <Tab eventKey='common' title='Common'>
                      <CategoryScroll type='architecture' isLoading={this.state.isLoadingArchitectures} items={this.state.commonArchitectures} isLoggedIn={this.props.isLoggedIn} />
                    </Tab>
                    <Tab eventKey='popular' title='Popular'>
                      <CategoryScroll type='architecture' isLoading={this.state.isLoadingArchitectures} items={this.state.popularArchitectures} isLoggedIn={this.props.isLoggedIn} />
                    </Tab>
                    <Tab eventKey='alphabetical' title='Alphabetical'>
                      <CategoryScroll type='architecture' isLoading={this.state.isLoadingArchitectures} items={this.state.alphabeticalArchitectures} isLoggedIn={this.props.isLoggedIn} />
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </FormFieldWideRow>
            <br />
          </span>}
        {!this.props.isProvider &&
          <span>
            <FormFieldWideRow>
              <div className='row'>
                <div className='col'>
                  <h4 align='left'>Providers</h4>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12 centered-tabs'>
                  <Tabs defaultActiveKey='common' id='categories-tabs'>
                    <Tab eventKey='common' title='Common'>
                      <CategoryScroll type='provider' isLoading={this.state.isLoadingProviders} items={this.state.commonProviders} isLoggedIn={this.props.isLoggedIn} />
                    </Tab>
                    <Tab eventKey='popular' title='Popular'>
                      <CategoryScroll type='provider' isLoading={this.state.isLoadingProviders} items={this.state.popularProviders} isLoggedIn={this.props.isLoggedIn} />
                    </Tab>
                    <Tab eventKey='alphabetical' title='Alphabetical'>
                      <CategoryScroll type='provider' isLoading={this.state.isLoadingProviders} items={this.state.alphabeticalProviders} isLoggedIn={this.props.isLoggedIn} />
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </FormFieldWideRow>
            <br />
          </span>}
        <FormFieldWideRow>
          <div className='row'>
            <div className='col'>
              <h4 align='left'>Platforms</h4>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12 centered-tabs'>
              <Tabs defaultActiveKey='common' id='categories-tabs'>
                <Tab eventKey='common' title='Common'>
                  <CategoryScroll type='platform' isLoading={this.state.isLoading} items={this.state.common} isLoggedIn={this.props.isLoggedIn} />
                </Tab>
                <Tab eventKey='popular' title='Popular'>
                  <CategoryScroll type='platform' isLoading={this.state.isLoading} items={this.state.popular} isLoggedIn={this.props.isLoggedIn} />
                </Tab>
                <Tab eventKey='alphabetical' title='Alphabetical'>
                  <CategoryScroll type='platform' isLoading={this.state.isLoading} items={this.state.alphabetical} isLoggedIn={this.props.isLoggedIn} />
                </Tab>
              </Tabs>
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

export default withRouter(withParams(Platforms))
