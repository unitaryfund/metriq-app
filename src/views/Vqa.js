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
import { renderLatex } from '../components/RenderLatex'

class Vqa extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      alphabetical: [],
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

    axios.get(config.api.getUriPrefix() + '/task/submissionCount/119')
      .then(res => {
        let featured = [res.data.data]
        this.setState({ featured })

        axios.get(config.api.getUriPrefix() + '/task/submissionCount/156')
          .then(res => {
            featured = featured.concat([res.data.data])
            this.setState({ featured })

            axios.get(config.api.getUriPrefix() + '/task/submissionCount/179')
              .then(res => {
                featured = featured.concat([res.data.data])
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
      <div id='metriq-main-content' className='container'>
        <ViewHeader align='center'>VQA Benchmarks</ViewHeader>
        <h5>Metriq has the latest data on variational quantum algoritms (VQAs).</h5>
        <p>Here you can find and contribute to VQA benchmarks like those in this <Link to='Submission/179'>GitHub repository</Link> by a member of the QED-C Standards Committee, Joan Étude Arrow, and her collaborators.</p>
        <p>{renderLatex("Joan’s approach to benchmarking prioritizes application-based measures of performance that enable cross-comparison across all VQA applications. This project investigates the largest instance of a problem that can be solved by a VQA in various noisy environments. A VQA instance is considered solved provided the solution found by the algorithm is within $\\epsilon = 10^{-3}$ of the true solution.")}</p>
        <p>{renderLatex("$S_T-S_A||_{VQA}\\leq\\epsilon$")}</p>
        <p>Here the metric is determined by the output type of the VQA. If the solution output is a number, the metric is simply the difference between the true value and the algorithm output. If the solution output is a probability distribution, then we employ the Hellinger distance to be consistent with the fidelity calculations of previous QED-C benchmarks.</p>
        <p>The Quantum Economic Development Consortium (<a href='https://quantumconsortium.org/'>QED-C</a>) is a consortium of stakeholders that aims to enable and grow the quantum industry. Metriq enables independent testing of quantum cloud service performance on many standard applications and algorithms. Metriq has adopted the QED-C open-source benchmarks into an automated benchmark pipeline. From these results, we extract metrics like VQA error and iteration count.</p>
        <p>The Metriq Python client (metriq-client) and API (metriq-api) enable addition of new data points on metriq.info. You can read more about automatically running QED-C benchmarks on Metriq in <a href='https://unitary.fund/posts/2023_metriq_qedc.html'>this blog post</a> on the Unitary Fund website.</p>
        <p>Below you can find the list of <a href='#Tasks'>VQA Benchmark Tasks</a> (containing a Task surveyed in the QED-C Benchmarks repository) and <a href='#Submissions'>VQA Benchmarks Submissions</a> (containing the "vqa" tag). Consider contributing your results with novel data points related to new measurements, methods, or new quantum quantum cloud service providers.</p>
        <br />
        <FormFieldWideRow id='Tasks'>
          <h5>VQA Benchmark Tasks</h5>
          {this.state.featured.map((item, index) =>
            <div key={index} className='row'>
              <div className='col-md col'>
                <CategoryItemBox item={item} isWide isPreview isLoggedIn={this.props.isLoggedIn} type='task' className='submission' />
                <SotaChart
                  chartId={index}
                  xLabel='Time'
                  taskId={item.id}
                  key={index}
                  isLog
                />
                <hr />
              </div>
            </div>
          )}
        </FormFieldWideRow>
        <br />
        <FormFieldWideRow id='Submissions'>
          <h5>VQA Benchmark Submissions</h5>
          <SubmissionScroll sortType='trending' isLoggedIn={this.props.isLoggedIn} tag='vqa' key={Math.random()} />
        </FormFieldWideRow>
        <br />
        <FormFieldAlertRow>
          <FormFieldValidator invalid={!!this.state.requestFailedMessage} message={this.state.requestFailedMessage} />
        </FormFieldAlertRow>
      </div>
    )
  }
}

export default withRouter(Vqa)
