// SotaChart.js
// from https://www.d3-graph-gallery.com/graph/scatter_basic.html
// and https://betterprogramming.pub/react-d3-plotting-a-line-chart-with-tooltips-ed41a4c31f4f

import React from 'react'
import { Chart, LinearScale, LogarithmicScale, TimeScale, PointElement, LineElement, ScatterController, Tooltip } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { BarWithErrorBarsChart } from 'chartjs-chart-error-bars'
import moment from 'moment'
import 'chartjs-adapter-moment'
import axios from 'axios'
import config from '../config'
import { sortByCounts } from './SortFunctions'
import ErrorHandler from './ErrorHandler'
import SotaControlRow from './SotaControlRow'
import { Button } from 'react-bootstrap'

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

const chartComponents = [LinearScale, LogarithmicScale, TimeScale, PointElement, LineElement, ScatterController, Tooltip, ChartDataLabels]
Chart.register(chartComponents)
Chart.defaults.font.size = 13
let chart = null

class SotaChart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      windowWidth: 0,
      chart: null,
      task: {},
      isLog: props.isLog ? 1 : 0,
      chartKey: '',
      chartKeyInt: 0,
      chartData: [],
      metricNames: [],
      isLowerBetterDict: {},
      key: Math.random(),
      log: (props.isLog < 2)
        ? (((props.logBase === '10') ? Math.log10 : ((props.logBase === '2') ? Math.log2 : Math.log)))
        : ((props.logBase === '10') ? x => Math.log10(Math.log10(x)) : ((props.logBase === '2') ? x => Math.log2(Math.log2(x)) : x => Math.log(Math.log(x)))),
      logBase: props.logBase ? props.logBase : 10,
      subset: '',
      subsetDataSets: [],
      subsetDataSetsActive: new Map(),
      isSubset: true,
      label: 'arXiv',
      isSotaLineVisible: true,
      isSotaLabelVisible: true,
      isErrorVisible: true,
      isErrorEnabled: true
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.loadChartFromState = this.loadChartFromState.bind(this)
    this.sliceChartData = this.sliceChartData.bind(this)
    this.handleOnChangeLog = this.handleOnChangeLog.bind(this)
    this.handleOnChangeSubset = this.handleOnChangeSubset.bind(this)
    this.handleOnChangeLabel = this.handleOnChangeLabel.bind(this)
    this.handleOnChangeShowLabels = this.handleOnChangeShowLabels.bind(this)
    this.handleOnChangeShowLine = this.handleOnChangeShowLine.bind(this)
    this.handleOnChangeShowError = this.handleOnChangeShowError.bind(this)
    this.fillCanvasBackgroundWithColor = this.fillCanvasBackgroundWithColor.bind(this)
    this.handlePngExport = this.handlePngExport.bind(this)
    this.handleSeriesToggle = this.handleSeriesToggle.bind(this)
  }

  pickLog (type, value) {
    return (type < 2)
      ? (((value === '10') ? Math.log10 : ((value === '2') ? Math.log2 : Math.log)))
      : ((value === '10') ? x => Math.log10(Math.log10(x)) : ((value === '2') ? x => Math.log2(Math.log2(x)) : x => Math.log(Math.log(x))))
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

  handleSeriesToggle (label) {
    const m = this.state.subsetDataSetsActive
    m.set(label, !(m.get(label) ?? true))
    this.setState({ subsetDataSetsActive: m })
    this.loadChartFromState({
      subset: this.state.subset,
      label: this.state.label,
      metricNames: this.state.metricNames,
      chartKey: this.state.chartKey,
      chartData: this.state.chartData,
      isLowerBetterDict: this.state.isLowerBetterDict,
      isLog: this.state.isLog,
      logBase: this.state.logBase,
      log: this.state.log,
      isSotaLineVisible: this.state.isSotaLineVisible,
      isSotaLabelVisible: this.state.isSotaLabelVisible,
      isErrorVisible: this.state.isErrorVisible,
      subsetDataSetsActive: m
    })
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

  handleOnChangeShowLabels (event) {
    const isSotaLabelVisible = event.target.checked
    this.setState({ isSotaLabelVisible })
    this.loadChartFromState({
      subset: this.state.subset,
      label: this.state.label,
      metricNames: this.state.metricNames,
      chartKey: this.state.chartKey,
      chartData: this.state.chartData,
      isLowerBetterDict: this.state.isLowerBetterDict,
      isLog: this.state.isLog,
      logBase: this.state.logBase,
      log: this.state.log,
      isSotaLineVisible: this.state.isSotaLineVisible,
      isSotaLabelVisible,
      isErrorVisible: this.state.isErrorVisible,
      subsetDataSetsActive: this.state.subsetDataSetsActive
    })
  }

  handleOnChangeShowLine (event) {
    const isSotaLineVisible = event.target.checked
    this.setState({ isSotaLineVisible })
    this.loadChartFromState({
      subset: this.state.subset,
      label: this.state.label,
      metricNames: this.state.metricNames,
      chartKey: this.state.chartKey,
      chartData: this.state.chartData,
      isLowerBetterDict: this.state.isLowerBetterDict,
      isLog: this.state.isLog,
      logBase: this.state.logBase,
      log: this.state.log,
      isSotaLineVisible,
      isSotaLabelVisible: this.state.isSotaLabelVisible,
      isErrorVisible: this.state.isErrorVisible,
      subsetDataSetsActive: this.state.subsetDataSetsActive
    })
  }

  handleOnChangeShowError (event) {
    const isErrorVisible = event.target.checked
    this.setState({ isErrorVisible })
    this.loadChartFromState({
      subset: this.state.subset,
      label: this.state.label,
      metricNames: this.state.metricNames,
      chartKey: this.state.chartKey,
      chartData: this.state.chartData,
      isLowerBetterDict: this.state.isLowerBetterDict,
      isLog: this.state.isLog,
      logBase: this.state.logBase,
      log: this.state.log,
      isSotaLineVisible: this.state.isSotaLineVisible,
      isSotaLabelVisible: this.state.isSotaLabelVisible,
      isErrorVisible,
      subsetDataSetsActive: this.state.subsetDataSetsActive
    })
  }

  handleOnChangeLog (type, logBase) {
    type = parseInt(type)
    const log = this.pickLog(type, logBase)
    this.setState({ isLog: type, logBase, log })
    this.loadChartFromState({
      subset: this.state.subset,
      label: this.state.label,
      metricNames: this.state.metricNames,
      chartKey: this.state.chartKey,
      chartData: this.state.chartData,
      isLowerBetterDict: this.state.isLowerBetterDict,
      isLog: type,
      logBase,
      log,
      isSotaLineVisible: this.state.isSotaLineVisible,
      isSotaLabelVisible: this.state.isSotaLabelVisible,
      isErrorVisible: this.state.isErrorVisible,
      subsetDataSetsActive: this.state.subsetDataSetsActive
    })
  }

  handleOnChangeSubset (event) {
    this.setState({ subset: event.target.value })
    this.loadChartFromState({
      subset: event.target.value,
      label: this.state.label,
      metricNames: this.state.metricNames,
      chartKey: this.state.chartKey,
      chartData: this.state.chartData,
      isLowerBetterDict: this.state.isLowerBetterDict,
      isLog: this.state.isLog,
      logBase: this.state.logBase,
      log: this.state.log,
      isSotaLineVisible: this.state.isSotaLineVisible,
      isSotaLabelVisible: this.state.isSotaLabelVisible,
      isErrorVisible: this.state.isErrorVisible,
      subsetDataSetsActive: this.state.subsetDataSetsActive
    })
  }

  handleOnChangeLabel (event) {
    this.setState({ label: event.target.value })
    this.loadChartFromState({
      subset: this.state.subset,
      label: event.target.value,
      metricNames: this.state.metricNames,
      chartKey: this.state.chartKey,
      chartData: this.state.chartData,
      isLowerBetterDict: this.state.isLowerBetterDict,
      isLog: this.state.isLog,
      logBase: this.state.logBase,
      log: this.state.log,
      isSotaLineVisible: this.state.isSotaLineVisible,
      isSotaLabelVisible: this.state.isSotaLabelVisible,
      isErrorVisible: this.state.isErrorVisible,
      subsetDataSetsActive: this.state.subsetDataSetsActive
    })
  }

  loadChartFromState (state) {
    const z95 = percentileZ(0.95)
    const isLowerBetter = state.isLowerBetterDict[state.chartKey]
    const d = [...state.chartData[state.chartKey]]
    const sotaData = d.length ? [d[0]] : []
    const dataDate = d.length ? d[0].label : ''
    let isSameDate = true
    let canLog = true
    let isErrorBars = false
    let highest = d.length ? d[0].value : 1
    let lowest = d.length ? d[0].value : 1
    for (let i = 1; i < d.length; ++i) {
      if (isLowerBetter && (d[i].value < sotaData[sotaData.length - 1].value)) {
        sotaData.push(d[i])
      } else if (!isLowerBetter && (d[i].value > sotaData[sotaData.length - 1].value)) {
        sotaData.push(d[i])
      }
      if (d[i].value <= 0) {
        canLog = false
      }
      if (d[i].standardError) {
        isErrorBars = true
      }
      if ((new Date(dataDate)).getTime() !== (new Date(d[i].label)).getTime()) {
        isSameDate = false
      }
      if (d[i].value < lowest) {
        lowest = d[i].value
      }
      if (d[i].value > highest) {
        highest = d[i].value
      }
    }

    if (state.isLog && canLog) {
      lowest = state.log(lowest)
      highest = state.log(highest)
    }

    let data = {}
    if (isSameDate) {
      data = {
        datasets: [],
        labels: d.map((obj, index) => ((state.label === 'arXiv') && obj.arXivId) ? (obj.arXivId + '\n') : (obj.method + (obj.platform ? '\n' + obj.platform : '')))
      }
    }
    if (!isSameDate) {
      const dataSotaLine = state.isSotaLineVisible
        ? {
            type: 'line',
            label: '[HIDE LABEL]',
            labels: sotaData.map((obj, index) => obj.method + (obj.platform ? '\n' + obj.platform : '')),
            backgroundColor: 'rgb(60, 210, 249)',
            borderColor: 'rgb(60, 210, 249)',
            data: sotaData.map((obj, index) => {
              return {
                label: ((state.label === 'arXiv') && obj.arXivId) ? (obj.arXivId + '\n') : (obj.method + (obj.platform ? '\n' + obj.platform : '')),
                isShowLabel: index === (sotaData.length - 1),
                submissionId: obj.submissionId,
                x: obj.label,
                y: (state.isLog && canLog) ? state.log(obj.value) : obj.value
              }
            }),
            pointRadius: 0,
            pointHoverRadius: 0
          }
        : {}
      const dataSotaLabels = state.isSotaLabelVisible
        ? {
            type: 'scatter',
            label: '[HIDE LABEL]',
            labels: sotaData.map((obj, index) => obj.method + (obj.platform ? '\n' + obj.platform : '')),
            backgroundColor: 'rgb(60, 210, 249)',
            borderColor: 'rgb(60, 210, 249)',
            data: sotaData.map((obj, index) => {
              return {
                label: ((state.label === 'arXiv') && obj.arXivId) ? (obj.arXivId + '\n') : (obj.method + (obj.platform ? '\n' + obj.platform : '')),
                isShowLabel: index !== (sotaData.length - 1),
                submissionId: obj.submissionId,
                x: obj.label,
                y: (state.isLog && canLog) ? state.log(obj.value) : obj.value
              }
            }),
            pointRadius: 0,
            pointHoverRadius: 0
          }
        : {}
      const datasets = []
      if (state.isSotaLineVisible) {
        datasets.push(dataSotaLine)
      }
      if (state.isSotaLabelVisible) {
        datasets.push(dataSotaLabels)
      }
      data = { datasets }
    }

    if (isSameDate || !isErrorBars) {
      this.setState({ isErrorEnabled: false, isErrorVisible: false })
    } else if (state.isErrorVisible) {
      data.datasets.push({
        type: 'scatterWithErrorBars',
        label: '[HIDE LABEL]',
        backgroundColor: 'rgb(128, 128, 128)',
        borderColor: 'rgb(128, 128, 128)',
        data: d.map((obj, index) => {
          return {
            x: obj.label,
            y: (state.isLog && canLog) ? state.log(obj.value) : obj.value,
            isShowLabel: false,
            submissionId: obj.submissionId,
            yMin: obj.standardError ? ((state.isLog && canLog) ? state.log(obj.value - obj.standardError * z95) : (obj.value - obj.standardError * z95)) : undefined,
            yMax: obj.standardError ? ((state.isLog && canLog) ? state.log(obj.value + obj.standardError * z95) : (obj.value + obj.standardError * z95)) : undefined
          }
        }),
        pointRadius: 0,
        pointHoverRadius: 0
      })
    }

    const subsets = {}
    if (state.subset === 'qubits') {
      d.sort((a, b) => (a.qubitCount > b.qubitCount) ? 1 : -1)
    } else if (state.subset === 'depth') {
      d.sort((a, b) => (a.circuitDepth > b.circuitDepth) ? 1 : -1)
    } else if (state.subset === 'platform') {
      d.sort((a, b) => (a.platform > b.platform) ? 1 : -1)
    } else {
      d.sort((a, b) => (a.method > b.method) ? 1 : -1)
    }
    for (let i = 0; i < d.length; ++i) {
      let key = 'Uncategorized'
      if (state.subset === 'qubits') {
        key = d[i].qubitCount ? d[i].qubitCount.toString() : 'Uncategorized'
      } else if (state.subset === 'depth') {
        key = d[i].circuitDepth ? d[i].circuitDepth.toString() : 'Uncategorized'
      } else if (state.subset === 'platform') {
        key = d[i].platform ? d[i].platform.toString() : 'Uncategorized'
      } else {
        key = d[i].method ? d[i].method.toString() : 'Uncategorized'
      }
      if (subsets[key]) {
        subsets[key].push(d[i])
      } else {
        subsets[key] = [d[i]]
      }
    }

    const subsetDataSets = []
    let subsetDataSetGroup = []
    let color = 0
    for (const key in subsets) {
      let rgb = '#000000'
      switch (color) {
        case 0:
          rgb = '#dc3545'
          break
        case 1:
          rgb = '#fd7e14'
          break
        case 2:
          rgb = '#ffc107'
          break
        case 3:
          rgb = '#28a745'
          break
        case 4:
          rgb = '#007bff'
          break
        case 5:
          rgb = '#6610f2'
          break
        default:
          break
      }
      if (state.subsetDataSetsActive.get(key) ?? true) {
        if (isSameDate) {
          data.datasets.push({
            labels: d.map((obj, index) => obj.method + (obj.platform ? '\n' + obj.platform : '')),
            data: subsets[key].map(obj => (state.isLog && canLog)
              ? (((state.log(obj.value) < 1000) && (state.log(obj.value) >= 0.01))
                  ? parseFloat(state.log(obj.value).toPrecision(3))
                  : parseFloat(state.log(obj.value).toPrecision(3)).toExponential())
              : (((obj.value < 1000) && (obj.value >= 0.01))
                  ? parseFloat(obj.value.toPrecision(3))
                  : parseFloat(obj.value.toPrecision(3)).toExponential())),
            backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#007bff', '#6610f2'],
            borderColor: rgb,
            pointRadius: 4,
            pointHitRadius: 4
          })
        } else {
          data.datasets.push({
            type: 'scatter',
            label: (state.subset === '') ? 'All (±95% CI, when provided)' : (key + ' ' + state.subset),
            labels: subsets[key].map(obj => obj.method + (obj.platform ? ' | ' + obj.platform : '')),
            backgroundColor: rgb,
            borderColor: rgb,
            data: subsets[key].map(obj => {
              return {
                label: obj.arXivId + '\n',
                isShowLabel: false,
                submissionId: obj.submissionId,
                x: obj.label,
                y: (state.isLog && canLog) ? state.log(obj.value) : obj.value,
                yMin: obj.standardError ? ((state.isLog && canLog) ? state.log(obj.value - obj.standardError * z95) : (obj.value - obj.standardError * z95)) : undefined,
                yMax: obj.standardError ? ((state.isLog && canLog) ? state.log(obj.value + obj.standardError * z95) : (obj.value + obj.standardError * z95)) : undefined
              }
            }),
            pointRadius: 4,
            pointHitRadius: 4
          })
        }
      }
      subsetDataSetGroup.push({ label: key, color: rgb })
      if (subsetDataSetGroup.length >= 5) {
        subsetDataSets.push(subsetDataSetGroup)
        subsetDataSetGroup = []
      }
      ++color
      color = color % 6
    }
    if (subsetDataSetGroup.length) {
      subsetDataSets.push(subsetDataSetGroup)
    }

    let options = {}
    if (isSameDate) {
      options = {
        animation: this.state.chart
          ? {
              duration: 0
            }
          : undefined,
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: this.state.windowWidth >= 820 ? 16 : 8,
            right: this.state.windowWidth >= 820 ? 24 : 12
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: ((state.isLog && canLog) ? (((state.isLog > 1) ? 'Log Log ' : 'Log ') + state.logBase.toString() + ' ') : '') + (state.chartKey ? state.chartKey : 'Metric value')
            },
            type: (state.isLog && !canLog) ? 'logarithmic' : 'linear',
            suggestedMin: lowest,
            suggestedMax: highest,
            ticks: {
              fontStyle: 'bold'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (ctx) {
                let label = ctx.dataset.labels[ctx.dataIndex]
                label += ' (' + ctx.parsed.y + ')'
                return label
              }
            }
          },
          datalabels: {
            color: '#000000',
            font: {
              weight: 'bold',
              size: 16
            }
          }
        }
      }
    } else {
      options = {
        animation: this.state.chart
          ? {
              duration: 0
            }
          : undefined,
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: this.props.isPreview ? 0 : ((this.state.windowWidth >= 820) ? 40 : 8),
            right: this.props.isPreview ? 0 : ((this.state.windowWidth >= 820) ? 100 : 16)
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
              text: ((state.isLog && canLog) ? (((state.isLog > 1) ? 'Log Log ' : 'Log ') + state.logBase.toString() + ' ') : '') + (state.chartKey ? state.chartKey : 'Metric value')
            },
            type: (state.isLog && !canLog) ? 'logarithmic' : 'linear'
          }
        },
        onClick (event, elements) {
          const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)
          if (points.length) {
            const firstPoint = points[0]
            const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index]
            window.location.href = config.web.getUriPrefix() + '/Submission/' + value.submissionId
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
          datalabels: (this.props.isPreview || (this.state.windowWidth < 820))
            ? { display: false }
            : {
                font: { weight: '600', color: '#000000' },
                align: 'center',
                display: 'auto',
                formatter: function (value, context) {
                  return value.isShowLabel ? value.label : null
                }
              }
        }
      }
    }

    const chartFunc = () => {
      if (this.state.chart) {
        this.state.chart.destroy()
      }
      chart = new BarWithErrorBarsChart(document.getElementById('sota-chart-canvas-' + this.props.chartId).getContext('2d'), { data, options })
      this.setState({ chart, subsetDataSets })
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
    const allData = results.map(row => {
      let aid = ''
      if (row.submissionUrl.toLowerCase().startsWith('https://arxiv.org/')) {
        const parts = row.submissionUrl.split('/')
        aid = (parts[parts.length - 1] === '') ? parts[parts.length - 2] : parts[parts.length - 1]
        aid = 'arXiv:' + aid
      }
      return {
        method: row.methodName,
        platform: row.platformName,
        metric: row.metricName,
        arXivId: aid,
        label: moment(new Date(row.evaluatedAt ? row.evaluatedAt : row.createdAt)),
        value: row.metricValue,
        isHigherBetter: row.isHigherBetter,
        standardError: row.standardError,
        qubitCount: row.qubitCount,
        circuitDepth: row.circuitDepth,
        submissionId: row.submissionId
      }
    })

    let isQubits = false
    let isDepth = false
    let isPlatform = false
    let isMethod = false
    for (let i = 0; i < allData.length; ++i) {
      if (allData[i].qubitCount) {
        isQubits = true
      }
      if (allData[i].circuitDepth) {
        isDepth = true
      }
      if (allData[i].platform) {
        isPlatform = true
      }
      if (allData[i].method) {
        isMethod = true
      }
    }

    let subsetCount = 0
    if (isQubits) {
      ++subsetCount
    }
    if (isDepth) {
      ++subsetCount
    }
    if (isPlatform) {
      ++subsetCount
    }
    if (isMethod) {
      ++subsetCount
    }
    const isSubset = this.state.subset && (subsetCount > 1)
    if (isQubits) {
      this.setState({ isSubset, subset: 'qubits' })
    } else if (isDepth) {
      this.setState({ isSubset, subset: 'depth' })
    } else if (isPlatform) {
      this.setState({ isSubset, subset: 'platform' })
    } else if (isMethod) {
      this.setState({ isSubset, subset: 'method' })
    } else {
      this.setState({ isSubset, subset: '' })
    }

    const chartData = {}
    const isHigherBetterCounts = {}
    for (let i = 0; i < allData.length; i++) {
      const metricName = allData[i].metric.charAt(0).toUpperCase() + allData[i].metric.slice(1).toLowerCase()
      if (!chartData[metricName]) {
        chartData[metricName] = []
        isHigherBetterCounts[metricName] = 0
      }
      chartData[metricName].push(allData[i])
      if (allData[i].isHigherBetter) {
        isHigherBetterCounts[metricName]++
      }
    }
    const metricNames = Object.keys(chartData)
    let chartKey = metricNames[0]
    let chartKeyInt = 0
    let m = 0
    const isLowerBetterDict = {}
    for (let i = 0; i < metricNames.length; i++) {
      const length = chartData[metricNames[i]].length
      isLowerBetterDict[metricNames[i]] = (isHigherBetterCounts[metricNames[i]] < (length / 2))
      if (length > m) {
        chartKeyInt = i
        chartKey = metricNames[i]
        m = length
      }
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
    this.setState({ metricNames, chartKey, chartKeyInt, chartData, isLowerBetterDict, key: Math.random() })
    this.loadChartFromState({ subset: this.state.subset, label: this.state.label, metricNames, chartKey, chartData, isLowerBetterDict, isLog: this.state.isLog, logBase: this.state.logBase, log: this.state.log, isSotaLineVisible: this.state.isSotaLineVisible, isSotaLabelVisible: this.state.isSotaLabelVisible, isErrorVisible: this.state.isErrorVisible, subsetDataSetsActive: this.state.subsetDataSetsActive })
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
        this.setState({ task })
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
      <span className={!this.state.metricNames.length ? 'hide' : undefined}>
        <div className='container' />
        {this.props.isPreview &&
          <div className='chart-container sota-preview'>
            <canvas id={'sota-chart-canvas-' + this.props.chartId} key={this.state.key} />
          </div>}
        {!this.props.isPreview &&
          <div className='card sota-card'>
            <div className='row'>
              <div className='col-xl-8 col-12'>
                <div className='chart-container sota-chart'>
                  <canvas id={'sota-chart-canvas-' + this.props.chartId} key={this.state.key} />
                </div>
                <div style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                  <span className='metric-chart-label'>Subset Entry</span>
                  <table style={{ width: '100%' }}>
                    {this.state.subsetDataSets.map((row, key1) =>
                      <tr key={key1}>
                        {row.map((series, key2) =>
                          <td key={key2} style={{ width: '20%' }}>
                            <input type='checkbox' className='sota-checkbox-control' checked={this.state.subsetDataSetsActive.get(series.label) ?? true} onChange={e => this.handleSeriesToggle(series.label)} /> <span class='dot' style={{ backgroundColor: series.color }} /> {series.label + ' ' + this.state.subset}
                          </td>)}
                      </tr>)}
                  </table>
                </div>
                <br />
              </div>
              <div className='col-xl-4 col-12 text-center'>
                <div>
                  <Button variant='outline-dark' className='sota-button' aria-label='Export to CSV button' onClick={this.props.onCsvExport}>Export to CSV</Button>
                  <Button variant='primary' className='sota-button' aria-label='Download to PNG button' onClick={this.handlePngExport}>Download to PNG</Button>
                </div>
                <SotaControlRow
                  name='chartKeyOption'
                  label='Chart Metric:'
                  value={this.state.chartKeyInt}
                  options={this.state.metricNames.map(name => name)}
                  onChange={event => {
                    const value = parseInt(event.target.value)
                    this.setState({ chartKeyInt: value, chartKey: this.state.metricNames[value] })
                    this.loadChartFromState({
                      subset: this.state.subset,
                      label: this.state.label,
                      metricNames: this.state.metricNames,
                      chartKey: this.state.metricNames[parseInt(value)],
                      chartData: this.state.chartData,
                      isLowerBetterDict: this.state.isLowerBetterDict,
                      isLog: this.state.isLog,
                      logBase: this.state.logBase,
                      log: this.state.log,
                      isSotaLineVisible: this.state.isSotaLineVisible,
                      isSotaLabelVisible: this.state.isSotaLabelVisible,
                      isErrorVisible: this.state.isErrorVisible,
                      subsetDataSetsActive: this.state.subsetDataSetsActive
                    })
                  }}
                  tooltip='A metric performance measure of any "method" on this "task"'
                />
                <SotaControlRow
                  name='subsetOption'
                  label='Subset option:'
                  value={this.state.subset}
                  options={{
                    qubits: 'Qubit count',
                    depth: 'Circuit depth',
                    platform: 'Platform',
                    method: 'Method'
                  }}
                  onChange={this.handleOnChangeSubset}
                  disabled={this.state.isSubset}
                />
                <SotaControlRow
                  name='logOption'
                  label='Log option:'
                  value={this.state.isLog}
                  options={{
                    0: 'Linear',
                    1: 'Log',
                    2: 'LogLog'
                  }}
                  onChange={e => this.handleOnChangeLog(parseInt(e.target.value), this.state.logBase)}
                />
                <SotaControlRow
                  name='logBaseOption'
                  label='Log base:'
                  value={this.state.logBase}
                  options={{
                    2: '2',
                    10: '10',
                    e: 'e'
                  }}
                  onChange={e => this.handleOnChangeLog(this.state.isLog, e.target.value)}
                />
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
                <div className='row sota-checkbox-row' style={{ paddingTop: '32px' }}>
                  <div className='col-10 text-left sota-label'>
                    Show all labels
                  </div>
                  <div className='col-2 text-right'>
                    <input type='checkbox' className='sota-checkbox-control' checked={this.state.isSotaLabelVisible} onChange={this.handleOnChangeShowLabels} />
                  </div>
                </div>
                <div className='row sota-checkbox-row'>
                  <div className='col-10 text-left'>
                    <span style={{ color: 'rgb(60, 210, 249)', fontWeight: 'bold' }}>―</span> Trace state of the art (SOTA) entries
                  </div>
                  <div className='col-2 text-right'>
                    <input type='checkbox' className='sota-checkbox-control' checked={this.state.isSotaLineVisible} onChange={this.handleOnChangeShowLine} />
                  </div>
                </div>
                <div className='row sota-checkbox-row'>
                  <div className='col-10 text-left' style={this.state.isErrorEnabled ? undefined : { color: 'gray' }}>
                    Show confidence intervals
                  </div>
                  <div className='col-2 text-right'>
                    <input type='checkbox' className='sota-checkbox-control' disabled={!this.state.isErrorEnabled} checked={this.state.isErrorVisible} onChange={this.handleOnChangeShowError} />
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </span>
    )
  }
}

export default SotaChart
