import axios from 'axios'
import React from 'react'
import config from './../config'
import ErrorHandler from '../components/ErrorHandler'
import FormFieldValidator from '../components/FormFieldValidator'
import CategoryItemBox from '../components/CategoryItemBox'
import FormFieldAlertRow from '../components/FormFieldAlertRow'
import FormFieldWideRow from '../components/FormFieldWideRow'
import ViewHeader from '../components/ViewHeader'
import { sortAlphabetical } from '../components/SortFunctions'
import SotaChart from '../components/SotaChart'
import SubmissionScroll from '../components/SubmissionScroll'
import { withRouter, Link } from 'react-router-dom'

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
        let featured = [res.data.data]
        this.setState({ featured: featured })

        axios.get(config.api.getUriPrefix() + '/task/submissionCount/2')
          .then(res => {
            featured = featured.concat([res.data.data])
            this.setState({ featured: featured })

            axios.get(config.api.getUriPrefix() + '/task/submissionCount/97')
              .then(res => {
                featured = featured.concat([res.data.data])
                this.setState({ featured: featured })

                axios.get(config.api.getUriPrefix() + '/task/submissionCount/142')
                  .then(res => {
                    featured = featured.concat([res.data.data])
                    this.setState({ featured: featured })

                    axios.get(config.api.getUriPrefix() + '/task/submissionCount/150')
                      .then(res => {
                        featured = featured.concat([res.data.data])
                        this.setState({ featured: featured })

                        axios.get(config.api.getUriPrefix() + '/task/submissionCount/172')
                          .then(res => {
                            featured = featured.concat([res.data.data])
                            this.setState({ featured: featured })

                            axios.get(config.api.getUriPrefix() + '/task/submissionCount/173')
                              .then(res => {
                                featured = featured.concat([res.data.data])
                                this.setState({ featured: featured })

                                axios.get(config.api.getUriPrefix() + '/task/submissionCount/174')
                                  .then(res => {
                                    featured = featured.concat([res.data.data])
                                    this.setState({ featured: featured })

                                    axios.get(config.api.getUriPrefix() + '/task/submissionCount/175')
                                      .then(res => {
                                        featured = featured.concat([res.data.data])
                                        this.setState({ featured: featured })

                                        axios.get(config.api.getUriPrefix() + '/task/submissionCount/176')
                                          .then(res => {
                                            featured = featured.concat([res.data.data])
                                            this.setState({ featured: featured })

                                            axios.get(config.api.getUriPrefix() + '/task/submissionCount/177')
                                              .then(res => {
                                                featured = featured.concat([res.data.data])
                                                this.setState({ featured: featured })

                                                axios.get(config.api.getUriPrefix() + '/task/submissionCount/178')
                                                  .then(res => {
                                                    featured = featured.concat([res.data.data])
                                                    this.setState({ featured: featured })

                                                    axios.get(config.api.getUriPrefix() + '/task/submissionCount/179')
                                                      .then(res => {
                                                        featured = featured.concat([res.data.data])
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
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
      })
  }

  render () {
    return (
      <div id='metriq-main-content' className='container'>
        <ViewHeader>Tasks</ViewHeader>
        <h5>Metriq and Unitary Fund are working with QED-C to run and share our own benchmarks of quantum cloud providers.</h5>
        <p>QED-C has produced a <Link to='/Submission/14'>repository of quantum benchmarks</Link> for independent testing of quantum cloud service performance on many standard applications and algorithms. From these results, we extract metrics like <Link to='/Task/34'>quantum volume</Link> and "algorithmic qubits" (or "AQ").</p>
        <br />
        <FormFieldWideRow>
          <h5>QED-C Benchmark Tasks</h5>
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
        <FormFieldWideRow>
          <SubmissionScroll sortType='trending' isLoggedIn={this.props.isLoggedIn} tag='qed-c' key={Math.random()} />
        </FormFieldWideRow>
        <br />
        <FormFieldAlertRow>
          <FormFieldValidator invalid={!!this.state.requestFailedMessage} message={this.state.requestFailedMessage} />
        </FormFieldAlertRow>
      </div>
    )
  }
}

export default withRouter(Tasks)
