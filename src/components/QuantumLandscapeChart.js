// QuantumLandscapeChart.js

import React from 'react'
import config from './../config'
import { Chart, LinearScale, LogarithmicScale, PointElement, ScatterController, Tooltip } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import annotationPlugin from 'chartjs-plugin-annotation'
import { Button } from 'react-bootstrap'
import SotaControlRow from './SotaControlRow'

const chartComponents = [LinearScale, LogarithmicScale, PointElement, ScatterController, Tooltip, ChartDataLabels, annotationPlugin]
Chart.register(chartComponents)
Chart.defaults.font.size = 13

class QuantumLandscapeChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      windowWidth: 0,
      chart: null,
      yearSlider: 2023,
      achievedSubset: true,
      estimatedSubset: true,
      chartData: [
        [{
          title: 'Quantum supremacy using a programmable superconducting processor',
          reference: 'Nature volume 574, pages 505–510 (2019)',
          year: 2019,
          domain: 'Quantum supremacy',
          task_name: 'Random circuit sampling',
          task_id: 47,
          num_qubits: 53,
          num_gates: 1543
        },
        {
          title: 'Strong quantum computational advantage using a superconducting quantum processor',
          reference: 'Phys. Rev. Lett. 127, 180501 (2021-10-25)',
          year: 2021,
          domain: 'Quantum supremacy',
          task_name: 'Random circuit sampling',
          task_id: 47,
          num_qubits: 56,
          num_gates: 1590
        },
        {
          title: 'Evidence for the utility of quantum computing before fault tolerance',
          reference: 'Nature volume 618, pages 500–505 (2023)',
          year: 2023,
          domain: 'Quantum supremacy',
          task_name: '2D transverse-field Ising model',
          task_id: 195,
          num_qubits: 127,
          num_gates: 14400
        },
        {
          title: 'Quantinuum H-Series quantum computer accelerates through 3 more performance records for quantum volume: 2^17, 2^18, and 2^19',
          reference: 'Quantinuum blog post (2023)',
          year: 2023,
          domain: 'Quantum supremacy',
          task_name: 'Quantum volume',
          task_id: 34,
          num_qubits: 19,
          num_gates: 532
        }],
        /* {
             'title': 'How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits',
             'reference': 'arXiv:1905.09749',
             'task_name': 'factoring',
             'task_id': 4,
             'num_qubits': 20000000,
             'num_gates': 2.4e21 //'0.3 num_qubits^3 + 0.0005^ num_qubits^3 lg num_qubits',
          }, */
        [{
          title: 'How to compute a 256-bit elliptic curve private key with only 50 million Toffoli gates',
          reference: 'arXiv:2306.08585',
          year: 2023,
          domain: 'Cryptography',
          task_name: 'Factoring',
          task_id: 4,
          num_qubits: 1152,
          num_gates: 50000000
        },
        {
          title: 'A Threshold for Quantum Advantage in Derivative Pricing',
          reference: 'arXiv:2012.03819',
          year: 2020,
          domain: 'Finance',
          task_name: 'Derivative pricing',
          task_id: 0,
          num_qubits: 8000, // logical
          num_gates: 54000000 // T-gates
        },
        {
          title: 'Towards Quantum Advantage in Financial Market Risk using Quantum Gradient Algorithms',
          reference: 'arXiv:2111.12509',
          year: 2021,
          domain: 'Finance',
          task_name: 'Derivative pricing',
          task_id: 0,
          num_qubits: 12000, // logical
          num_gates: 12000000000
        },
        {
          title: 'Using Q# to estimate resources needed for quantum advantage in derivative pricing',
          reference: 'https://cloudblogs.microsoft.com/quantum/2022/09/15/using-q-to-estimate-resources-needed-for-quantum-advantage-in-derivative-pricing/',
          year: 2022,
          domain: 'Finance',
          task_name: 'Derivative pricing',
          task_id: 0,
          num_qubits: '',
          num_gates: ''
        },
        {
          title: 'Derivative Pricing using Quantum Signal Processing',
          reference: 'arXiv:2307.14310',
          year: 2023,
          domain: 'Finance',
          task_name: 'Derivative pricing',
          task_id: 0,
          num_qubits: 4700, // logical
          num_gates: 1000000000 // T-gates
        },
        {
          title: 'Quantum dynamics',
          reference: 'arXiv:2211.07629',
          year: 2022,
          domain: 'Physics simulation',
          task_name: 'Quantum dynamics',
          task_id: 0,
          num_qubits: 230, // logical
          num_gates: 1.03e11 // T-gates
        },
        {
          title: 'Quantum chemistry',
          reference: 'arXiv:2211.07629',
          year: 2022,
          domain: 'Physics simulation',
          task_name: 'Quantum chemistry',
          task_id: 0,
          num_qubits: 2740, // logical
          num_gates: 3.33e16 // T-gates
        },
        {
          title: 'Factoring',
          reference: 'arXiv:2211.07629',
          year: 2022,
          domain: 'Cryptography',
          task_name: 'Factoring',
          task_id: 0,
          num_qubits: 25481, // logical
          num_gates: 2.86e16 // T-gates
        }]
      ],
      label: 'arXiv'
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.loadChartFromState = this.loadChartFromState.bind(this)
    this.handleOnChangeLabel = this.handleOnChangeLabel.bind(this)
    this.handleOnChangeYear = this.handleOnChangeYear.bind(this)
    this.handleOnClickAchieved = this.handleOnClickAchieved.bind(this)
    this.handleOnClickEstimated = this.handleOnClickEstimated.bind(this)
    this.fillCanvasBackgroundWithColor = this.fillCanvasBackgroundWithColor.bind(this)
    this.handlePngExport = this.handlePngExport.bind(this)
  }

  // See https://stackoverflow.com/questions/50104437/set-background-color-to-save-canvas-chart#answer-50126796
  fillCanvasBackgroundWithColor (canvas, color) {
    // Get the 2D drawing context from the provided canvas.
    const context = canvas.getContext('2d')

    // We're going to modify the context state, so it's
    // good practice to save the current state first.
    context.save()

    // Normally when you draw on a canvas, the new drawing
    // covers up any previous drawing it overlaps. This is
    // because the default `globalCompositeOperation` is
    // 'source-over'. By changing this to 'destination-over',
    // our new drawing goes behind the existing drawing. This
    // is desirable so we can fill the background, while leaving
    // the chart and any other existing drawing intact.
    // Learn more about `globalCompositeOperation` here:
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    context.globalCompositeOperation = 'destination-over'

    // Fill in the background. We do this by drawing a rectangle
    // filling the entire canvas, using the provided color.
    context.fillStyle = color
    context.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    // Restore the original context state from `context.save()`
    context.restore()
  }

  handlePngExport () {
    this.fillCanvasBackgroundWithColor(document.getElementById('quantum-landscape-chart-canvas'), 'white')

    const element = document.createElement('a')
    element.setAttribute('href', this.state.chart.toBase64Image())
    element.setAttribute('download', 'quantum_landscape.png')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  handleOnChangeLabel (event) {
    this.setState({ label: event.target.value })
    this.loadChartFromState({
      metricNames: this.state.metricNames,
      chartData: this.state.chartData,
      achievedSubset: this.state.achievedSubset,
      estimatedSubset: this.state.estimatedSubset,
      windowWidth: this.state.windowWidth,
      label: event.target.value,
      yearSlider: this.state.yearSlider
    })
  }

  handleOnChangeYear (event) {
    const nVal = event.target.value
    this.setState({ yearSlider: nVal })
    this.loadChartFromState({
      metricNames: this.state.metricNames,
      chartData: this.state.chartData,
      achievedSubset: this.state.achievedSubset,
      estimatedSubset: this.state.estimatedSubset,
      windowWidth: this.state.windowWidth,
      label: this.state.label,
      yearSlider: nVal
    })
  }

  handleOnClickAchieved (event) {
    const nVal = !this.state.achievedSubset
    this.setState({ achievedSubset: nVal })
    this.loadChartFromState({
      metricNames: this.state.metricNames,
      chartData: this.state.chartData,
      achievedSubset: nVal,
      estimatedSubset: this.state.estimatedSubset,
      windowWidth: this.state.windowWidth,
      label: this.state.label,
      yearSlider: this.state.yearSlider
    })
  }

  handleOnClickEstimated (event) {
    const nVal = !this.state.estimatedSubset
    this.setState({ estimatedSubset: nVal })
    this.loadChartFromState({
      metricNames: this.state.metricNames,
      chartData: this.state.chartData,
      achievedSubset: this.state.achievedSubset,
      estimatedSubset: nVal,
      windowWidth: this.state.windowWidth,
      label: this.state.label,
      yearSlider: this.state.yearSlider
    })
  }

  loadChartFromState (state) {
    const data = { datasets: [] }
    state.chartData.forEach((subset, id) => {
      if (!(((id === 0) && state.achievedSubset) || ((id === 1) && state.estimatedSubset))) {
        return
      }
      data.datasets.push({
        type: 'scatter',
        label: (id === 0) ? 'Achieved' : 'Estimated',
        backgroundColor: (id === 0) ? '#007bff' : '#ff0000',
        borderColor: (id === 0) ? '#007bff' : '#ff0000',
        data: subset.filter(obj => obj.year <= state.yearSlider).map((obj, index) => {
          return {
            x: obj.num_gates,
            y: obj.num_qubits,
            label: obj.task_name + '\n' + ((state.label === 'arXiv') ? obj.reference : obj.domain),
            title: obj.task_name,
            value: 'Qubits: ' + obj.num_qubits + '\n Gates: ' + obj.num_gates
          }
        })
      })
    })
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 1,
          max: 1000000000000000000,
          title: {
            display: true,
            text: 'Number of operations'
          },
          type: 'logarithmic',
          ticks: {
            callback: (val) => (val.toExponential())
          },
          afterBuildTicks: scale => {
            scale.ticks = [
              {
                value: 10
              },
              {
                value: 100
              },
              {
                value: 1000
              },
              {
                value: 10000
              },
              {
                value: 100000
              },
              {
                value: 1000000
              },
              {
                value: 10000000
              },
              {
                value: 100000000
              },
              {
                value: 1000000000
              },
              {
                value: 10000000000
              },
              {
                value: 100000000000
              },
              {
                value: 1000000000000
              },
              {
                value: 10000000000000
              },
              {
                value: 100000000000000
              },
              {
                value: 1000000000000000
              },
              {
                value: 10000000000000000
              },
              {
                value: 100000000000000000
              }]
          }
        },
        y: {
          min: 1,
          max: 100000,
          title: {
            display: true,
            text: 'Qubits'
          },
          type: 'logarithmic',
          ticks: {
            callback: (val) => (val.toExponential())
          },
          afterBuildTicks: scale => {
            scale.ticks = [{
              value: 10
            },
            {
              value: 100
            },
            {
              value: 1000
            },
            {
              value: 10000
            }]
          }
        }
      },
      onClick (event, elements) {
        if (!elements.length) {
          return
        }
        const selected = state.chartData[elements[0].index]
        if (selected.submissionId) {
          window.location.href = config.web.getUriPrefix() + '/Task/' + selected.submissionId
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (ctx) {
              return data.datasets[(ctx[0].dataIndex < data.datasets[0].length) ? 0 : 1].data[ctx[0].dataIndex].title
            },
            label: function (ctx) {
              return 'Circuit depth ' + ctx.parsed.x.toExponential() + '\n Qubits ' + ctx.parsed.y.toExponential()
            }
          }
        },
        datalabels: (state.windowWidth < 820)
          ? { display: false }
          : {
              font: { weight: '600', color: '#000000' },
              align: 'center',
              display: 'auto',
              formatter: function (value, context) {
                return value.label
              }
            },
        annotation: {
          annotations: {
            box1: {
              type: 'box',
              xMin: 0,
              xMax: 1000000000000000000,
              yMin: 0,
              yMax: 50,
              backgroundColor: '#007bff10',
              borderColor: '#00000000'
            }
          }
        }
      }
    }

    const chartFunc = () => {
      if (this.state.chart) {
        this.state.chart.destroy()
      }
      this.setState({ chart: new Chart(document.getElementById('quantum-landscape-chart-canvas').getContext('2d'), { data, options, plugins: [ChartDataLabels] }) })
    }
    chartFunc()
  }

  componentDidMount () {
    this.setState({ windowWidth: window.innerWidth })
    window.addEventListener('resize', this.updateWindowDimensions)

    this.loadChartFromState({
      metricNames: this.state.metricNames,
      chartData: this.state.chartData,
      achievedSubset: this.state.achievedSubset,
      estimatedSubset: this.state.estimatedSubset,
      windowWidth: window.innerWidth,
      label: this.state.label,
      yearSlider: this.state.yearSlider
    })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions () {
    this.setState({ windowWidth: window.innerWidth })
    this.loadChartFromState({
      metricNames: this.state.metricNames,
      chartData: this.state.chartData,
      achievedSubset: this.state.achievedSubset,
      estimatedSubset: this.state.estimatedSubset,
      windowWidth: window.innerWidth,
      label: this.state.label,
      yearSlider: this.state.yearSlider
    })
  }

  render () {
    return (
      <span>
        <div className='row'>
          <div className='col text-left'>
            <h4 align='left'>Quantum Computers: What We Need and What We Have</h4>
            <br />
            <p>This chart shows two things: (1) the Achieved series in blue gives what size quantum programs have been successfully run and (2) the Estimated series shows what size programs would be needed for advantage across different domains. Here we plot the size of a quantum program by the number of qubits and number of quantum operations.</p>
            <p>This plot does not include clock speed which is another important parameter to consider.</p>
          </div>
        </div>
        <div className='card sota-card'>
          <div className='row'>
            <div className='col-xl-9 col-12'>
              <br />
              <div className='sota-chart'>
                <canvas id='quantum-landscape-chart-canvas' />
              </div>
              <br />
            </div>
            <div className='col-xl-3 col-12 text-center'>
              <div>
                <Button variant='outline-dark' className='sota-button' aria-label='Export to CSV button' onClick={this.props.onCsvExport}>Export to CSV</Button>
                <Button variant='primary' className='sota-button' aria-label='Download to PNG button' onClick={this.handlePngExport}>Download to PNG</Button>
              </div>
              <SotaControlRow
                name='labelOption'
                label='Label:'
                value={this.state.label}
                options={{
                  arXiv: 'arXiv ID',
                  domain: 'Domain'
                }}
                onChange={this.handleOnChangeLabel}
              />
              <br />
              <div className='row sota-control-row'>
                <span htmlFor='year-slider' className='col col-md-5 form-field-label metric-chart-label text-left'>Published</span>
                <div className='col col-md-7'>
                  <input
                    style={{ width: '100%' }} type='range' min='2019' max='2023' list='markers'
                    className='form-control'
                    id='year-slider'
                    name='year-slider'
                    value={this.state.yearSlider}
                    onChange={this.handleOnChangeYear}
                  />
                  <datalist style={{ width: '100%' }} id='markers'>
                    <option value='2019' label='2019' />
                    <option value='2020' label='2020' />
                    <option value='2021' label='2021' />
                    <option value='2022' label='2022' />
                    <option value='2023' label='2023' />
                  </datalist>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-9 col-12'>
              <div style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                <span className='metric-chart-label'>Subset Entry</span>
                <table style={{ width: '100%' }}>
                  <tr>
                    <td style={{ width: '20%' }}>
                      <input type='checkbox' className='sota-checkbox-control' checked={this.state.achievedSubset} onChange={this.handleOnClickAchieved} /> <span class='dot' style={{ backgroundColor: '#007bff' }} /> Achieved
                    </td>
                    <td style={{ width: '20%' }}>
                      <input type='checkbox' className='sota-checkbox-control' checked={this.state.estimatedSubset} onChange={this.handleOnClickEstimated} /> <span class='dot' style={{ backgroundColor: '#ff0000' }} /> Estimated
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </span>
    )
  }
}

export default QuantumLandscapeChart
