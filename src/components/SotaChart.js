// SotaChart.js
// from https://www.d3-graph-gallery.com/graph/scatter_basic.html
// and https://betterprogramming.pub/react-d3-plotting-a-line-chart-with-tooltips-ed41a4c31f4f

import React from 'react'
import { Chart, LinearScale, TimeScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment'

const options = {
  scales: {
    x: {
      type: 'time'
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (ctx) {
          // console.log(ctx);
          let label = ctx.dataset.labels[ctx.dataIndex]
          label += ' (' + ctx.parsed.y + ')'
          return label
        }
      },
      filter: function (tooltipItem) {
        const type = tooltipItem.dataset.type
        return (type === 'scatter')
      }
    }
  }
}

class SotaChart extends React.Component {
  constructor (props) {
    super(props)
    Chart.register([LinearScale, PointElement, LineElement, TimeScale, Tooltip, Legend])
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
          data: this.props.data.map((obj, index) => { return { x: obj.label, y: obj.value } })
        },
        {
          type: 'line',
          label: 'State-of-the-art',
          labels: sotaData.map((obj, index) => obj.method),
          backgroundColor: 'rgb(60, 210, 249)',
          borderColor: 'rgb(60, 210, 249)',
          data: sotaData.map((obj, index) => { return { x: obj.label, y: obj.value } })
        }]
      }
    }
  }

  render () {
    return <Line data={this.state.data} options={options} />
  }
}

export default SotaChart
