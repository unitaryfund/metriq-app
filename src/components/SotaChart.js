// SotaChart.js
// from https://www.d3-graph-gallery.com/graph/scatter_basic.html
// and https://betterprogramming.pub/react-d3-plotting-a-line-chart-with-tooltips-ed41a4c31f4f

import React from 'react'
import { Chart, LinearScale, LogarithmicScale, TimeScale, PointElement, LineElement, ScatterController, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { LineWithErrorBarsChart } from 'chartjs-chart-error-bars'
import moment from 'moment'
import 'chartjs-adapter-moment'

class SotaChart extends React.Component {
  constructor (props) {
    super(props)

    this.percentileZ = this.percentileZ.bind(this)
    const z95 = this.percentileZ(0.95)

    const chartComponents = [LinearScale, LogarithmicScale, TimeScale, PointElement, LineElement, ScatterController, Tooltip, Legend]
    if (!props.isMobile) {
      chartComponents.push(ChartDataLabels)
    }

    Chart.register(chartComponents)
    Chart.defaults.font.size = 12

    const data = this.props.data
    const sotaData = data.length ? [data[0]] : []
    for (let i = 1; i < data.length; i++) {
      if (this.props.isLowerBetter) {
        if (data[i].value < sotaData[sotaData.length - 1].value) {
          sotaData.push(data[i])
        }
      } else {
        if (data[i].value > sotaData[sotaData.length - 1].value) {
          sotaData.push(data[i])
        }
      }
    }

    this.state = {
      key: Math.random(),
      data: {
        datasets: [{
          type: 'scatter',
          label: 'All (±95% CI, when provided)',
          labels: this.props.data.map((obj, index) => obj.method + (obj.platform ? ' | ' + obj.platform : '')),
          backgroundColor: 'rgb(0, 0, 0)',
          borderColor: 'rgb(0, 0, 0)',
          data: this.props.data.map((obj, index) => {
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
          data: this.props.data.map((obj, index) => {
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
      },
      options: {
        responsive: this.props.isMobile,
        maintainAspectRatio: !this.props.isMobile,
        layout: {
          padding: {
            right: 160
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
              text: this.props.yLabel ? this.props.yLabel : 'Metric value'
            },
            type: this.props.isLog ? 'logarithmic' : 'linear'
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
          datalabels: props.isMobile
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
    }
  }

  componentDidMount () {
    (() => new LineWithErrorBarsChart(document.getElementById('sota-chart-canvas-' + this.state.key).getContext('2d'), {
      data: this.state.data,
      options: this.state.options
    }))()
  }

  // See https://stackoverflow.com/questions/36575743/how-do-i-convert-probability-into-z-score#answer-36577594
  percentileZ (p) {
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

  // TODO: "key={Math.random()}" is a work-around to make the chart update on input properties change,
  // See https://github.com/reactchartjs/react-chartjs-2/issues/90#issuecomment-409105108
  render () {
    return <canvas id={'sota-chart-canvas-' + this.state.key} key={Math.random()} />
  }
}

export default SotaChart
