// SotaChart.js
// from https://www.d3-graph-gallery.com/graph/scatter_basic.html
// and https://betterprogramming.pub/react-d3-plotting-a-line-chart-with-tooltips-ed41a4c31f4f

import React from 'react'
import { Chart, LinearScale, TimeScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment'

class SotaChart extends React.Component {
  constructor (props) {
    super(props)
    Chart.register([LinearScale, PointElement, LineElement, TimeScale, Tooltip, Legend, ChartDataLabels])
    Chart.defaults.font.size = 16

    const data = this.props.data
    const sotaData = data.length ? [data[0]] : []
    for (let i = 1; i < data.length; i++) {
      if (this.props.isLowerBetter) {
        if (data[i].value <= sotaData[sotaData.length - 1].value) {
          sotaData.push(data[i])
        }
      } else {
        if (data[i].value >= sotaData[sotaData.length - 1].value) {
          sotaData.push(data[i])
        }
      }
    }

    this.state = {
      data: {
        datasets: [{
          type: 'scatter',
          label: 'All',
          labels: this.props.data.map((obj, index) => obj.method),
          backgroundColor: 'rgb(0, 0, 0)',
          borderColor: 'rgb(0, 0, 0)',
          data: this.props.data.map((obj, index) => { return { label: obj.method, isShowLabel: false, x: obj.label, y: obj.value } })
        },
        {
          type: 'line',
          label: 'State-of-the-art',
          labels: sotaData.map((obj, index) => obj.method),
          backgroundColor: 'rgb(60, 210, 249)',
          borderColor: 'rgb(60, 210, 249)',
          data: sotaData.map((obj, index) => { return { label: obj.method, isShowLabel: true, x: obj.label, y: obj.value } })
        }]
      },
      options: {
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
              text: this.props.xLabel ? this.props.xLabel : 'Date'
            },
            time: {
              displayFormats: {
                millisecond: 'YYYY-MM-DD HH:MM:ss.SSS',
                second: 'YYYY-MM-DD HH:MM:ss',
                minute: 'YYYY-MM-DD HH:MM',
                hour: 'YYYY-MM-DD HH',
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
            },
            filter: function (tooltipItem) {
              const type = tooltipItem.dataset.type
              return (type === 'scatter')
            }
          },
          datalabels: {
            align: 'right',
            formatter: function (value, context) {
              return value.isShowLabel ? value.label : ''
            }
          }
        }
      }
    }
  }

  // TODO: "key={Math.random()}" is a work-around to make the chart update on input properties change,
  // See https://github.com/reactchartjs/react-chartjs-2/issues/90#issuecomment-409105108
  render () {
    return <Line data={this.state.data} options={this.state.options} key={Math.random()} />
  }
}

export default SotaChart
