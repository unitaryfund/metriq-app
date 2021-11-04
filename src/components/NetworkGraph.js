// NetworkGraph.js
// from http://bl.ocks.org/jose187/4733747

import React, { useEffect } from 'react'
import * as d3 from 'd3'

function NetworkGraph (props) {
  const { data, width, height } = props

  useEffect(() => {
    function drawChart () {
      d3.select('#metriq-network-graph-container')
        .select('svg')
        .remove()

      // set the dimensions and margins of the graph

      // append the svg object to the body of the page
      const svg = d3.select('#metriq-network-graph-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      const force = d3.forceSimulation(data.nodes)
        .alpha(0.01)
        .alphaDecay(0)
        .force('charge', d3.forceManyBody())
        .force('link', d3.forceLink(data.links))
        .force('center', d3.forceCenter(width / 2, height / 2))

      const link = svg.selectAll('.link')
        .data(data.links)
        .enter().append('line')
        .attr('class', 'link')
        .style('stroke-width', function (d) { return Math.sqrt(d.weight) })

      function dragged1 (event, d) {
        d.fx = event.x
        d.fy = event.y
      }

      const node = svg.selectAll('.node')
        .data(data.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .call(d3.drag().on('drag', dragged1))

      node.append('circle')
        .attr('r', '5')

      node.append('text')
        .attr('dx', 12)
        .attr('dy', '.35em')
        .text(function (d) { return d.name })

      force.on('tick', function () {
        link.attr('x1', function (d) { return d.source.x })
          .attr('y1', function (d) { return d.source.y })
          .attr('x2', function (d) { return d.target.x })
          .attr('y2', function (d) { return d.target.y })
        node.attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
      })
    }
    drawChart()
  }, [data, width, height])

  return <div id='metriq-network-graph-container' />
}

export default NetworkGraph
