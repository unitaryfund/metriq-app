// SotaChart.js
// from https://www.d3-graph-gallery.com/graph/scatter_basic.html
// and https://betterprogramming.pub/react-d3-plotting-a-line-chart-with-tooltips-ed41a4c31f4f

import React from 'react'
import { Chart, LinearScale, LogarithmicScale, TimeScale, PointElement, LineElement, ScatterController, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { LineWithErrorBarsChart } from 'chartjs-chart-error-bars'
import moment from 'moment'
import 'chartjs-adapter-moment'
import FormFieldSelectRow from './FormFieldSelectRow'
import axios from 'axios'
import config from '../config'
import { sortByCounts } from './SortFunctions'
import ErrorHandler from './ErrorHandler'

// See https://stackoverflow.com/questions/36575743/how-do-i-convert-probability-into-z-score#answer-36577594
const percentileZ = (p) => {
  if (p < 0.5) return -this.percentileZ(1 - p)

  if (p > 0.92) {
    if (p === 1) return Infinity
    const r = Math.sqrt(-Math.log(1 - p))
    return (((2.3212128 * r + 4.8501413) * r - 2.2979648) * r - 2.7871893) /
             ((1.6370678 * r + 3.5438892) * r + 1)
  }
  p -= 0.5
  const r = p * p
  return p * (((-25.4410605 * r + 41.3911977) * r - 18.6150006) * r + 2.5066282) /
           ((((3.1308291 * r - 21.0622410) * r + 23.0833674) * r - 8.4735109) * r + 1)
}

const chartComponents = [LinearScale, LogarithmicScale, TimeScale, PointElement, LineElement, ScatterController, Tooltip, Legend, ChartDataLabels]
Chart.register(chartComponents)
Chart.defaults.font.size = 12

class SotaChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      windowWidth: 0,
      chart: null,
      task: {},
      isLog: false,
      chartKey: '',
      chartData: [],
      metricNames: [],
      isLowerBetterDict: {},
      key: Math.random()
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.loadChartFromState = this.loadChartFromState.bind(this)
    this.sliceChartData = this.sliceChartData.bind(this)
  }

  loadChartFromState (state) {
    const z95 = percentileZ(0.95)
    const isLowerBetter = state.isLowerBetterDict[state.chartKey]
    const d = state.chartData[state.chartKey]
    const sotaData = d.length ? [d[0]] : []
    for (let i = 1; i < d.length; i++) {
      if (isLowerBetter) {
        if (d[i].value < sotaData[sotaData.length - 1].value) {
          sotaData.push(d[i])
        }
      } else {
        if (d[i].value > sotaData[sotaData.length - 1].value) {
          sotaData.push(d[i])
        }
      }
    }
    const data = {
      datasets: [{
        type: 'scatter',
        label: 'All (±95% CI, when provided)',
        labels: d.map(obj => obj.method + (obj.platform ? ' | ' + obj.platform : '')),
        backgroundColor: 'rgb(0, 0, 0)',
        borderColor: 'rgb(0, 0, 0)',
        data: d.map(obj => {
          return {
            label: obj.method + (obj.platform ? ' | ' + obj.platform : ''),
            isShowLabel: false,
            x: obj.label,
            y: obj.value,
            yMin: obj.standardError ? (obj.value - obj.standardError * z95) : undefined,
            yMax: obj.standardError ? (obj.value + obj.standardError * z95) : undefined
          }
        })
      },
      {
        type: 'scatterWithErrorBars',
        label: '[HIDE LABEL] 1',
        backgroundColor: 'rgb(128, 128, 128)',
        borderColor: 'rgb(128, 128, 128)',
        data: d.map((obj, index) => {
          return {
            x: obj.label,
            y: obj.value,
            yMin: obj.standardError ? (obj.value - obj.standardError * z95) : undefined,
            yMax: obj.standardError ? (obj.value + obj.standardError * z95) : undefined
          }
        })
      },
      {
        type: 'line',
        label: 'State-of-the-art',
        labels: sotaData.map((obj, index) => obj.method + (obj.platform ? '\n' + obj.platform : '')),
        backgroundColor: 'rgb(60, 210, 249)',
        borderColor: 'rgb(60, 210, 249)',
        data: sotaData.map((obj, index) => {
          return {
            label: obj.method + (obj.platform ? '\n' + obj.platform : ''),
            isShowLabel: true,
            x: obj.label,
            y: obj.value
          }
        })
      }]
    }
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          right: this.state.windowWidth >= 820 ? 100 : undefined
        }
      },
      scales: {
        x: {
          type: 'time',
          title: {
            display: true,
            text: this.props.xLabel ? this.props.xLabel : 'Time'
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10
          },
          time: {
            displayFormats: {
              millisecond: 'YYYY-MM-DD',
              second: 'YYYY-MM-DD',
              minute: 'YYYY-MM-DD',
              hour: 'YYYY-MM-DD',
              day: 'YYYY-MM-DD',
              week: 'YYYY-MM-DD',
              month: 'YYYY-MM',
              quarter: 'YYYY-MM',
              year: 'YYYY'
            }
          }
        },
        y: {
          title: {
            display: true,
            text: state.chartKey ? state.chartKey : 'Metric value'
          },
          type: state.isLog ? 'logarithmic' : 'linear'
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (ctx) {
              return moment(ctx[0].parsed.x).format('YYYY-MM-DD')
            },
            label: function (ctx) {
              let label = ctx.dataset.labels[ctx.dataIndex]
              label += ' (' + ctx.parsed.y + ')'
              return label
            }
          },
          filter: function (tooltipItem) {
            const type = tooltipItem.dataset.type
            return (type === 'scatter')
          }
        },
        datalabels: this.state.windowWidth < 820
          ? { display: false }
          : {
              align: 'center',
              formatter: function (value, context) {
                return value.isShowLabel ? value.label : ''
              }
            },
        legend: {
          labels: {
            filter: function (item, chart) {
            // Logic to remove a particular legend item goes here
              return !item.text.includes('[HIDE LABEL]')
            }
          }
        }
      }
    }

    const chartFunc = () => {
      if (this.state.chart) {
        this.state.chart.destroy()
      }
      this.setState({ chart: new LineWithErrorBarsChart(document.getElementById('sota-chart-canvas-' + this.props.chartId).getContext('2d'), { data: data, options: options }) })
    }
    chartFunc()
  }

  sliceChartData (task) {
    const results = task.results
    results.sort(function (a, b) {
      const mna = a.metricName.toLowerCase()
      const mnb = b.metricName.toLowerCase()
      if (mna < mnb) {
        return -1
      }
      if (mnb < mna) {
        return 1
      }

      const mda = new Date(a.evaluatedAt ? a.evaluatedAt : a.createdAt)
      const mdb = new Date(b.evaluatedAt ? b.evaluatedAt : b.createdAt)
      if (mda < mdb) {
        return -1
      }
      if (mdb < mda) {
        return 1
      }

      return 0
    })
    const allData = results.map(row =>
      ({
        method: row.methodName,
        platform: row.platformName,
        metric: row.metricName,
        label: moment(new Date(row.evaluatedAt ? row.evaluatedAt : row.createdAt)),
        value: row.metricValue,
        isHigherBetter: row.isHigherBetter
      }))
    const chartData = {}
    const isHigherBetterCounts = {}
    for (let i = 0; i < allData.length; i++) {
      if (!chartData[allData[i].metric]) {
        chartData[allData[i].metric] = []
        isHigherBetterCounts[allData[i].metric] = 0
      }
      chartData[allData[i].metric].push(allData[i])
      if (allData[i].isHigherBetter) {
        isHigherBetterCounts[allData[i].metric]++
      }
    }
    const metricNames = Object.keys(chartData)
    let chartKey = ''
    let m = 0
    const isLowerBetterDict = {}
    for (let i = 0; i < metricNames.length; i++) {
      const length = chartData[metricNames[i]].length
      if (length > m) {
        chartKey = metricNames[i]
        m = length
      }
      isLowerBetterDict[metricNames[i]] = (isHigherBetterCounts[metricNames[i]] < (length / 2))
    }
    let i = 0
    while (i < metricNames.length) {
      const length = chartData[metricNames[i]].length
      if (length < 3) {
        metricNames.splice(i, 1)
      } else {
        i++
      }
    }
    this.setState({ metricNames: metricNames, chartKey: chartKey, chartData: chartData, isLowerBetterDict: isLowerBetterDict, key: Math.random() })
    this.loadChartFromState({ metricNames: metricNames, chartKey: chartKey, chartData: chartData, isLowerBetterDict: isLowerBetterDict, isLog: this.state.isLog })
  }

  componentDidMount () {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)

    const taskRoute = config.api.getUriPrefix() + '/task/' + this.props.taskId
    axios.get(taskRoute)
      .then(res => {
        const task = res.data.data
        task.childTasks.sort(sortByCounts)
        this.setState({ requestFailedMessage: '', item: task })

        const taskNamesRoute = config.api.getUriPrefix() + '/task/names'
        axios.get(taskNamesRoute)
          .then(res => {
            const tasks = [...res.data.data]
            this.handleTrimTasks(task.id, tasks)
            this.setState({ requestFailedMessage: '', allTaskNames: tasks })
          })
          .catch(err => {
            this.setState({ requestFailedMessage: ErrorHandler(err) })
          })

        const results = task.results
        results.sort(function (a, b) {
          const mna = a.metricName.toLowerCase()
          const mnb = b.metricName.toLowerCase()
          if (mna < mnb) {
            return -1
          }
          if (mnb < mna) {
            return 1
          }
          const mva = parseFloat(a.metricValue)
          const mvb = parseFloat(b.metricValue)
          if (!a.isHigherBetter) {
            if (mva < mvb) {
              return -1
            }
            if (mvb < mva) {
              return 1
            }
            return 0
          } else {
            if (mva > mvb) {
              return -1
            }
            if (mvb > mva) {
              return 1
            }
            return 0
          }
        })
        this.setState({ task: task })
        this.sliceChartData(task)
        if (this.props.onLoadData) {
          this.props.onLoadData(task)
        }
      })
      .catch(err => {
        this.setState({ requestFailedMessage: ErrorHandler(err) })
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
        <div className='container'>
          <FormFieldSelectRow
            inputName='chartKey'
            value={this.state.chartKey}
            label='Chart Metric:'
            labelClass='metric-chart-label'
            options={this.state.metricNames.map(name =>
              ({
                id: name,
                name: name
              }))}
            onChange={(field, value) => {
              this.setState({ chartKey: value })
              this.loadChartFromState({
                metricNames: this.state.metricNames,
                chartKey: value,
                chartData: this.state.chartData,
                isLowerBetterDict: this.state.isLowerBetterDict,
                isLog: this.state.isLog
              })
            }}
            tooltip='A metric performance measure of any "method" on this "task"'
          />
          <div className='row' style={{ marginTop: '5px' }}>
            <span
              htmlFor='logcheckbox'
              className='col col-md-3 form-field-label metric-chart-label'
              dangerouslySetInnerHTML={{ __html: 'Logarithmic:' }}
            />
            <div className='col col-md-6'>
              <input
                type='checkbox'
                id='logcheckbox'
                name='logcheckbox'
                className='form-control'
                checked={this.state.isLog}
                onChange={() => {
                  const val = !this.state.isLog
                  this.setState({ isLog: val })
                  this.loadChartFromState({
                    metricNames: this.state.metricNames,
                    chartKey: this.state.chartKey,
                    chartData: this.state.chartData,
                    isLowerBetterDict: this.state.isLowerBetterDict,
                    isLog: val
                  })
                }}
              />
            </div>
            <div className='col col-md-3' />
          </div>
        </div>
        <div className='chart-container sota-chart'>
          <canvas id={'sota-chart-canvas-' + this.props.chartId} key={this.state.key} />
        </div>
      </span>
    )
  }
}

export default SotaChart
