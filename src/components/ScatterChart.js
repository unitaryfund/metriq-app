// ScatterChart.js
// from https://www.d3-graph-gallery.com/graph/scatter_basic.html
// and https://betterprogramming.pub/react-d3-plotting-a-line-chart-with-tooltips-ed41a4c31f4f

import React, { useEffect } from 'react'
import * as d3 from 'd3'

function ScatterChart (props) {
  const { data, width, height, xLabel, yLabel } = props

  useEffect(() => {
    function drawChart () {
      d3.select('#metriq-line-chart-container')
        .select('svg')
        .remove()
      d3.select('#metriq-line-chart-container')
        .select('.tooltip')
        .remove()

      const margin = { top: 10, right: 30, bottom: 60, left: 60 }
      const width = 900 - margin.left - margin.right
      const height = 400 - margin.top - margin.bottom
      const yMinValue = d3.min(data, d => d.value)
      const yMaxValue = d3.max(data, d => d.value)
      const xMinValue = d3.min(data, d => d.label)
      const xMaxValue = d3.max(data, d => d.label)

      // set the dimensions and margins of the graph

      // append the svg object to the body of the page
      const svg = d3.select('#metriq-line-chart-container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')')

      // Add X axis
      const x = d3.scaleLinear()
        .domain([xMinValue, xMaxValue])
        .range([0, width])
      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([(yMinValue < 0) ? yMinValue : 0, (yMaxValue < 0) ? 0 : yMaxValue])
        .range([height, 0])
      svg.append('g')
        .call(d3.axisLeft(y))

      // Add dots
      svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function (d) { return x(d.label) })
        .attr('cy', function (d) { return y(d.value) })
        .attr('r', 1.5)
        .style('fill', '#69b3a2')

      const xAxisLabelX = width / 2
      const xAxisLabelY = height + 40

      svg.append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'middle')
        .attr('x', xAxisLabelX)
        .attr('y', xAxisLabelY)
        .text(xLabel)

      const yAxisLabelX = -40
      const yAxisLabelY = height / 2

      svg.append('g')
        .attr('transform', 'translate(' + yAxisLabelX + ', ' + yAxisLabelY + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text(yLabel)
    }
    drawChart()
  }, [data, width, height, xLabel, yLabel])

  return <div id='metriq-line-chart-container' />
}

export default ScatterChart
