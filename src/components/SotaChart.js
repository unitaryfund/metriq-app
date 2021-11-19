// SotaChart.js
// from https://www.d3-graph-gallery.com/graph/scatter_basic.html
// and https://betterprogramming.pub/react-d3-plotting-a-line-chart-with-tooltips-ed41a4c31f4f

import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'

function SotaChart (props) {
  const { data, width, height, xLabel, yLabel, xType, yType, isLowerBetter } = props

  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize () {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
  })

  useEffect(() => {
    function drawChart () {
      const sotaData = data.length ? [data[0]] : []
      for (let i = 1; i < data.length; i++) {
        if (isLowerBetter) {
          if (data[i].value <= sotaData[sotaData.length - 1].value) {
            sotaData.push(data[i])
          }
        } else {
          if (data[i].value >= sotaData[sotaData.length - 1].value) {
            sotaData.push(data[i])
          }
        }
      }

      d3.select('#metriq-line-chart-container')
        .select('svg')
        .remove()
      d3.select('#metriq-line-chart-container')
        .select('.tooltip')
        .remove()

      const margin = { top: 20, right: 256, bottom: 60, left: 128 }
      const sWidth = (width || screenWidth)
      let lWidth = sWidth - margin.left - margin.right
      const lHeight = height - margin.top - margin.bottom
      if (lWidth < 300) {
        const shim = (sWidth / 2) - 96
        margin.right = shim + 64
        margin.left = shim - 64
        lWidth = 300
      }
      if (lWidth > 900) {
        const shim = (sWidth - 900) / 2
        margin.right = shim + 64
        margin.left = shim - 64
        lWidth = 900
      }
      const yMinValue = d3.min(data, d => d.value)
      const yMaxValue = d3.max(data, d => d.value)
      const xMinValue = d3.min(data, d => d.label)
      const xMaxValue = d3.max(data, d => d.label)

      // set the dimensions and margins of the graph

      // append the svg object to the body of the page
      const svg = d3.select('#metriq-line-chart-container')
        .append('svg')
        .attr('width', sWidth)
        .attr('height', height)
        .append('g')
        .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')')

      // Add X axis
      const x = (xType === 'time')
        ? d3.scaleTime()
            .domain([xMinValue, xMaxValue])
            .range([0, lWidth])
        : d3.scaleLinear()
          .domain([xMinValue, xMaxValue])
          .range([0, lWidth])

      svg.append('g')
        .attr('transform', 'translate(0,' + lHeight + ')')
        .call(d3.axisBottom(x).tickSizeOuter(0))

      const yDomain = [(yMinValue < 0) ? yMinValue : 0, (yMaxValue < 0) ? 0 : yMaxValue]

      // Add Y axis
      const y = (yType === 'time')
        ? d3.scaleTime()
            .domain(yDomain)
            .range([lHeight, 0])
        : d3.scaleLinear()
          .domain(yDomain)
          .range([lHeight, 0])

      const yTickAxis = d3.axisLeft(y)
        .tickSize(0)
        .tickSizeInner(-lWidth)
        .tickSizeOuter(0)
        .tickFormat(d3.format('.1e'))

      svg.append('g')
        .attr('class', 'grid')
        .call(yTickAxis)

      // Add dots
      const dots = svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter()

      dots.append('circle')
        .attr('cx', function (d) { return x(d.label) })
        .attr('cy', function (d) { return y(d.value) })
        .attr('r', 3.0)
        .style('fill', '#69b3a2')

      dots.append('text').text(function (d) { return d.method })
        .attr('x', function (d) { return x(d.label) })
        .attr('y', function (d) { return y(d.value) })

      const line = d3.line()
        .x(function (d) { return x(d.label) })
        .y(function (d) { return y(d.value) })

      svg.append('path')
        .datum(sotaData)
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke', 'steelblue')
        .attr('d', line)

      const xAxisLabelX = lWidth / 2
      const xAxisLabelY = lHeight + 40

      svg.append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'middle')
        .attr('x', xAxisLabelX)
        .attr('y', xAxisLabelY)
        .text(xLabel)

      const yAxisLabelX = -60
      const yAxisLabelY = lHeight / 2

      svg.append('g')
        .attr('transform', 'translate(' + yAxisLabelX + ', ' + yAxisLabelY + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text(yLabel)

      const xLegendOffset = -5
      const yLegendOffset = 120

      const circleLegendKeys = ['Results']

      const circleLegend = svg
        .selectAll('.circleLegend')
        .data(circleLegendKeys)
        .enter().append('g')
        .attr('class', 'circleLegend')
        .attr('transform', function (d, i) {
          return 'translate(' + (lWidth - xLegendOffset + 5) + ',' + (yLegendOffset + i * 20) + ')'
        })

      circleLegend.append('text').text(function (d) { return d })
        .attr('transform', 'translate(10,6)') // align texts with boxes

      circleLegend.append('circle')
        .attr('r', 3.0)
        .style('fill', '#69b3a2')

      const lineLegendKeys = ['State-of-the-Art']

      const lineLegend = svg
        .selectAll('.lineLegend')
        .data(lineLegendKeys)
        .enter().append('g')
        .attr('class', 'lineLegend')
        .attr('transform', function (d, i) {
          return 'translate(' + (lWidth - xLegendOffset) + ',' + (yLegendOffset + (circleLegendKeys.length + i) * 20) + ')'
        })

      lineLegend.append('text').text(function (d) { return d })
        .attr('transform', 'translate(15,6)') // align texts with boxes

      lineLegend.append('rect')
        .attr('fill', 'steelblue')
        .attr('width', 10)
        .attr('height', 1.5)
    }
    drawChart()
  }, [data, screenWidth, width, height, xLabel, yLabel, xType, yType, isLowerBetter])

  return <div id='metriq-line-chart-container' />
}

export default SotaChart
