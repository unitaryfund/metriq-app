// SotaChart.js
// from https://www.d3-graph-gallery.com/graph/scatter_basic.html
// and https://betterprogramming.pub/react-d3-plotting-a-line-chart-with-tooltips-ed41a4c31f4f

import React from 'react'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Line } from 'react-chartjs-2'

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June'
]

const data = {
  labels: labels,
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45]
  }]
}

class SotaChart extends React.Component {
  constructor (props) {
    super(props)
    Chart.register(CategoryScale)
    Chart.register(LinearScale)
    Chart.register(PointElement)
    Chart.register(LineElement)
  }

  render () {
    return <Line data={data} />
  }
}

export default SotaChart
