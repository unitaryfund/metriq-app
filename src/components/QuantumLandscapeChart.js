// QuantumLandscapeChart.js

import React from 'react'
import config from './../config'
import { Chart, LinearScale, LogarithmicScale, PointElement, ScatterController, Tooltip } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Button } from 'react-bootstrap'
import SotaControlRow from './SotaControlRow'

const chartComponents = [LinearScale, LogarithmicScale, PointElement, ScatterController, Tooltip, ChartDataLabels]
Chart.register(chartComponents)
Chart.defaults.font.size = 13

class QuantumLandscapeChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      windowWidth: 0,
      chart: null,
      chartData: [
        /* {
             'title': 'How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits',
             'reference': 'arXiv:1905.09749',
             'task_name': 'factoring',
             'task_id': 4,
             'num_qubits': 20000000,
             'num_gates': 2.4e21 //'0.3 num_qubits^3 + 0.0005^ num_qubits^3 lg num_qubits',
          }, */
        {
          title: 'How to compute a 256-bit elliptic curve private key with only 50 million Toffoli gates',
          reference: 'arXiv:2306.08585',
          task_name: 'factoring',
          task_id: 4,
          num_qubits: 1152,
          num_gates: 50000000
        },
        {
          title: 'A Threshold for Quantum Advantage in Derivative Pricing',
          reference: 'arXiv:2012.03819',
          task_name: 'derivative pricing',
          task_id: 0,
          num_qubits: 8000, // logical
          num_gates: 54000000 // T-gates
        },
        {
          title: 'Towards Quantum Advantage in Financial Market Risk using Quantum Gradient Algorithms',
          reference: 'arXiv:2111.12509',
          task_name: 'derivative pricing',
          task_id: 0,
          num_qubits: 12000, // logical
          num_gates: 12000000000
        },
        /*
          {
             'title': 'Using Q# to estimate resources needed for quantum advantage in derivative pricing',
             'reference': 'https://cloudblogs.microsoft.com/quantum/2022/09/15/using-q-to-estimate-resources-needed-for-quantum-advantage-in-derivative-pricing/',
             'task_name': 'derivative pricing',
             'task_id': 0,
             'num_qubits': '',
             'num_gates': '',
          },
          */
        {
          title: 'Derivative Pricing using Quantum Signal Processing',
          reference: 'arXiv:2307.14310',
          task_name: 'derivative pricing',
          task_id: 0,
          num_qubits: 4700, // logical
          num_gates: 1000000000 // T-gates
        }
      ],
      key: Math.random(),
      label: 'arXiv'
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.loadChartFromState = this.loadChartFromState.bind(this)
    this.handleOnChangeLabel = this.handleOnChangeLabel.bind(this)
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
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Restore the original context state from `context.save()`
    context.restore()
  }

  handlePngExport () {
    this.fillCanvasBackgroundWithColor(document.getElementById('sota-chart-canvas-' + this.props.chartId), 'white')

    const element = document.createElement('a')
    element.setAttribute('href', this.state.chart.toBase64Image())
    element.setAttribute('download', this.state.item.name + '.png')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  handleOnChangeLabel (event) {
    this.setState({ label: event.target.value })
    this.loadChartFromState({
      metricNames: this.state.metricNames,
      chartData: this.state.chartData
    })
  }

  loadChartFromState (state) {
    const data = { datasets: [] }
    data.datasets.push({
      type: 'scatter',
      backgroundColor: '#007bff',
      borderColor: '#007bff',
      data: state.chartData.map((obj, index) => {
        return {
          x: obj.num_gates,
          y: obj.num_qubits,
          label: obj.task_name + '/n' + obj.reference,
          title: obj.task_name,
          value: 'Circuit depth ' + obj.num_qubits + '\n Qubits ' + obj.num_gates
        }
      })
    })
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: (this.state.windowWidth >= 820) ? 40 : 8,
          right: (this.state.windowWidth >= 820) ? 100 : 16
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Circuit depth'
          },
          type: 'linear'
        },
        y: {
          title: {
            display: true,
            text: 'Qubits'
          },
          type: 'linear'
        }
      },
      onClick (event, elements) {
        if (!elements.length) {
          return
        }
        const selected = state.chartData[elements[0].index]
        if (selected.submissionId) {
          window.location.href = config.web.getUriPrefix() + '/Task/' + selected.task_id
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (ctx) {
              return data.datasets[0].data[ctx[0].dataIndex].title
            },
            label: function (ctx) {
              return 'Circuit depth ' + ctx.parsed.x + '\n Qubits ' + ctx.parsed.y
            }
          }
        },
        datalabels: (this.state.windowWidth < 820)
          ? { display: false }
          : {
              font: { weight: '600', color: '#000000' },
              align: 'center',
              display: 'auto',
              formatter: function (value, context) {
                return value.label
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
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)

    this.loadChartFromState({
      metricNames: this.state.metricNames,
      chartData: this.state.chartData
    })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions () {
    this.setState({ windowWidth: window.innerWidth })
  }

  // TODO: "key={Math.random()}" is a work-around to make the chart update on input properties change,
  // See https://github.com/reactchartjs/react-chartjs-2/issues/90#issuecomment-409105108
  render () {
    return (
      <span>
        <div className='row'>
          <div className='col'>
            <h4 align='left'>Quantum Technology Landscape</h4>
          </div>
        </div>
        <div className='card sota-card'>
          <div className='row'>
            <div className='col-xl-9 col-12'>
              <div className='chart-container sota-chart'>
                <canvas id='quantum-landscape-chart-canvas' key={this.state.key} />
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
                  method: 'Method and platform'
                }}
                onChange={this.handleOnChangeLabel}
              />
            </div>
          </div>
        </div>
      </span>
    )
  }
}

export default QuantumLandscapeChart
