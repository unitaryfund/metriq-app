// QuantumLandscapeChart.js

import React from 'react'
import * as d3 from 'd3'
import '../viz-style.css'
import csv from '../progress.csv'

const fontType = 'Helvetica'
const smallLabelSize = 12 // font size in pixel
const chartHeight = 180 // chart height,
const circleSize = 15
const circleSizeFields = 8
const strokeSize = '1.5px'
const circleOpacity = {
  fieldLegend: 0.7,
  achieved: 0.5,
  estimated: 0.1
}
const strokeOpacity = {
  fieldLegend: 0,
  achieved: 1,
  estimated: 0.7
}
const strokeTexture = {
  achieved: '',
  estimated: '5, 2'
}
const colors = ['#0D99FF', '#FFB800', '#ED1010', '#56E1C8']
const domainIndex = {
  'Quantum supremacy': 0,
  Cryptography: 1,
  Finance: 2,
  'Physics simulation': 3
  // Match a number for each domain -> corresponding color
}
const breakpoint = 1250
let isMobile = window.outerWidth < breakpoint
let svg, d

let areLabelsVisible = false
function onSwitchClick () {
  areLabelsVisible = !areLabelsVisible
  if (areLabelsVisible) {
    showLabels()
  } else {
    hideLabels()
  }
}

function showLabels () {
  [...document.getElementsByClassName('labeltohide')].forEach((el) => {
    el.style.visibility = 'visible'
  })
}

function hideLabels () {
  [...document.getElementsByClassName('labeltohide')].forEach((el) => {
    el.style.visibility = 'hidden'
  })
}

// Function to draw scatterplot
function scatterplot (
  data,
  xName = 'num_gates', // the x column
  xAxisText = 'Logical Operations [n] →',
  yName = 'num_qubits', // the y column
  yAxisText = 'Qubits [n]  →',
  chartTarget = '#my_dataviz', // html target element to attach chart
  chartHeight = 600, // chart height
  marginTop = 40, // top margin, in pixels
  marginRight = 100, // right margin, in pixels
  marginBottom = 70, // bottom margin, in pixels
  xLabelShift = marginBottom - 40,
  marginLeft = 100, // left margin, in pixels
  rangeMult = 0.5,
  xScaleType = d3.scaleLog,
  yScaleType = d3.scaleLog,
  horizontalLineColor = 'black',
  horizontalLineStrokeSize = '1px',
  horizontalLineStrokeTexture = '8, 4',
  tooltipLineStrokeTexture = '1 1',
  tooltipLineColor = '#bbbbbb',
  tooltipLineTextBorder = 2.5,
  hLineIntercept = 50,
  hLineText = '↓ Everything below this line can be simulated with a classical computer',
  xlabelDistance = 19,
  ylabelDistance = 23
) {
  data = data
    .filter(
      (d) =>
        !isNaN(d[xName]) && d[xName] > 0 && !isNaN(d[yName]) && d[yName] > 0
    )
    .map(function (obj, index) {
      return { ...obj, id: `ID_${index + 1}` }
    })

  // define aesthetic mappings
  const x = (d) => d[xName]
  const y = (d) => d[yName]

  // width
  const chartWidth = document.getElementById('my_dataviz').getBoundingClientRect().width
  if (isMobile) {
    marginLeft = 60
    marginRight = 60
  }

  // ranges
  const xRange = [marginLeft, chartWidth - marginRight] // [left, right]
  const yRange = [chartHeight - marginBottom, marginTop] // [bottom, top]

  // values
  const X = d3.map(data, x)
  const Y = d3.map(data, y)
  const I = d3.range(data.length)

  // domains
  const xDomain = [1, d3.max(X) + d3.max(X) * rangeMult]
  const yDomain = [1, d3.max(Y) + d3.max(Y) * rangeMult]

  // scale
  const xScale = xScaleType(xDomain, xRange)
  const yScale = yScaleType(yDomain, yRange)

  // axes
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  // voronoi generator
  const dataForVoronoi = d3.map(I, (i) => [xScale(X[i]), yScale(Y[i])])
  const voronoiRange = [xRange[0], yRange[1], xRange[1], yRange[0]]
  const voronoi = d3.Delaunay.from(dataForVoronoi).voronoi(voronoiRange)

  // generate tooltip
  d3
    .select('body')
    .append('div')
    .attr('id', 'scatter-tooltip')
    .style('position', 'absolute')
    // .style("font-size", `${fontSize}px`)
    .style('transition', '0.1s')
  // .style("border-color", accentColor);

  // initiate svg
  svg = d3
    .select(chartTarget)
    .on('mouseout touchend', (e) =>
      redraw()
    )
    .append('svg')
    .attr('viewBox', [0, 0, chartWidth, chartHeight])
    .attr('id', 'svgscatter')
    .attr('style', 'max-width: 100%')

  // append x axis
  svg
    .append('g')
    .attr('transform', `translate(0,${chartHeight - marginBottom})`)
    .attr('class', 'xaxis')
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .call(xAxis)
    .call((g) =>
      g
        .append('text')
        .attr('x', chartWidth - marginRight)
        .attr('y', marginBottom - 4)
        .attr('transform', `translate(0,${-xLabelShift})`)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'end')
        .text(xAxisText)
    )

  // append y axis
  svg
    .append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .attr('class', 'yaxis')
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .call(yAxis)
    .call((g) =>
      g
        .append('text')
        .attr('transform', 'rotate(270)')
        .attr('x', -marginTop)
        .attr('y', -40)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'end')
        .attr('font-size', `${smallLabelSize}px`)
        .text(yAxisText)
    )

  // horizontal line
  svg
    .append('g')
    .attr('transform', `translate(${marginLeft}, ${yScale(hLineIntercept)})`)
    .append('line')
    .attr('x2', chartWidth - marginRight - marginLeft)
    .style('stroke', horizontalLineColor)
    .style('stroke-width', horizontalLineStrokeSize)
    .style('stroke-dasharray', horizontalLineStrokeTexture)

  // horizontal line text
  svg
    .append('text')
    .attr('x', chartWidth - marginRight)
    .attr('y', yScale(hLineIntercept) + smallLabelSize)
    .attr('class', 'htext')
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .attr('fill', 'currentColor')
    .attr('text-anchor', 'end')
    .text(hLineText)

  setTimeout(() => {
    if (isMobile) {
      svg.selectAll('.htext').call(wrap, 150)
    }
  }, 0)

  // tooltip vlines
  svg
    .append('g')
    .selectAll('line')
    .data(data)
    .join('line')
    .attr('x1', (i) => xScale(x(i)))
    .attr('y1', (i) => yScale(y(i)) + circleSize)
    .attr('x2', (i) => xScale(x(i)))
    .attr('y2', yScale(1))
    .attr('id', (i) => i.id)
    .style('visibility', 'hidden')
    .style('stroke', tooltipLineColor)
    .style('stroke-width', horizontalLineStrokeSize)
    .style('stroke-dasharray', tooltipLineStrokeTexture)

  // tooltip vline text
  svg
    .append('g')
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('x', (i) => xScale(x(i)) + tooltipLineTextBorder)
    .attr('y', yScale(1) - tooltipLineTextBorder)
    .attr('id', (i) => i.id)
    .style('visibility', 'hidden')
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text((i) => d3.format('.2s')(x(i)))

  // tooltip hlines
  svg
    .append('g')
    .selectAll('line')
    .data(data)
    .join('line')
    .attr('x1', (i) => xScale(x(i)) - circleSize)
    .attr('y1', (i) => yScale(y(i)))
    .attr('x2', xScale(1))
    .attr('y2', (i) => yScale(y(i)))
    .attr('id', (i) => i.id)
    .style('visibility', 'hidden')
    .style('stroke', tooltipLineColor)
    .style('stroke-width', horizontalLineStrokeSize)
    .style('stroke-dasharray', tooltipLineStrokeTexture)

  // tooltip hline text
  svg
    .append('g')
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('x', xScale(1) + tooltipLineTextBorder)
    .attr('y', (i) => yScale(y(i)) - tooltipLineTextBorder)
    .attr('id', (i) => i.id)
    .style('visibility', 'hidden')
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text((i) => d3.format('.2s')(y(i)))

  // voronoi grid
  svg
    .append('g')
    .attr('stroke', 'none')
    .attr('fill', 'none')
    .selectAll('path')
    .data(I)
    .join('path')
    .attr('d', (i) => voronoi.renderCell(i))
    .style('fill', '#00000000')
    .attr('id', function (i) {
      return data[i].id
    })
    .attr('centroid_x', (i) => d3.polygonCentroid(voronoi.cellPolygon(i))[0])
    .attr('centroid_y', (i) => d3.polygonCentroid(voronoi.cellPolygon(i))[1])
    .attr('class', 'voronoi')
    .on('mousemove touchstart', (e) =>
      mousemove(
        e,
        data,
        colors,
        domainIndex,
        fontType,
        smallLabelSize
      )
    )

  // append circles
  svg
    .append('g')
    .attr('stroke-width', strokeSize)
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', (i) => xScale(x(i)))
    .attr('cy', (i) => yScale(y(i)))
    .attr('r', circleSize)
    .style('stroke', (i) => colors[domainIndex[i.domain]])
    .style('fill', (i) => colors[domainIndex[i.domain]])
    .style('stroke-opacity', (i) =>
      i.achieved === 'true' ? strokeOpacity.achieved : strokeOpacity.estimated
    )
    .style('stroke-dasharray', (i) =>
      i.achieved === 'true' ? strokeTexture.achieved : strokeTexture.estimated
    )
    .style('fill-opacity', (i) =>
      i.achieved === 'true' ? circleOpacity.achieved : circleOpacity.estimated
    )
    .attr('id', (i) => i.id)
    .attr('label', (i) => i.task_name)
    .attr('submission_id', (i) => i.submission_id)
    .on('click', function () {
      if (!isMobile) {
        const submissionId = d3.select(this).attr('submission_id')
        window.open(`https://metriq.info/Submission/${submissionId}`)
      }
    })
    .on('mousemove touchstart', (e) =>
      mousemove(
        e,
        data,
        colors,
        domainIndex,
        fontType,
        smallLabelSize
      )
    )
    .style('cursor', 'pointer')

  // label placement
  d3.selectAll('.voronoi').each(function (d, i) {
    const id = d3.select(this).attr('id')

    const x = d3.select(`circle#${id}`).attr('cx')
    const y = d3.select(`circle#${id}`).attr('cy')
    const centroidX = d3.select(this).attr('centroid_x')
    const centroidY = d3.select(this).attr('centroid_y')

    // 0 up, 1 right, 2 down, 3 left
    const direction =
      (Math.round((Math.atan2(centroidY - y, centroidX - x) / Math.PI) * 2) +
        4) %
      4

    const xShift =
      direction === 0 ? xlabelDistance : direction === 2 ? -xlabelDistance : 0
    const yShift =
      direction === 1 ? ylabelDistance : direction === 3 ? -ylabelDistance : 0

    svg
      .append('text')
      .attr('x', Number(x) + xShift)
      .attr('y', Number(y) + yShift + 3)
      .attr('class', 'labeltohide')
      .style('font-size', `${smallLabelSize}px`)
      .style('font-family', fontType)
      .style('visibility', 'hidden')
      .attr(
        'text-anchor',
        direction === 2 ? 'end' : direction === 0 ? 'start' : 'middle'
      )
      .text(`${d3.select(`circle#${id}`).attr('label')}`)
  })
};

function mousemove (
  e,
  data,
  colors,
  domainIndex,
  fontType, // font size in pixel
  smallLabelSize,
  tooltipOffsetX = 0,
  tooltipOffsetY = 0,
  border = '1px',
  borderColor = 'black',
  padding = '5px',
  borderRadius = '5px',
  backgroundColor = '#fafafa',
  arrowSize = 8
) {
  d3.select('circle.selected').attr('class', null).attr('stroke', 'none')

  d3.selectAll('line.selectedLine')
    .attr('class', null)
    .style('visibility', 'hidden')

  d3.selectAll('text.selectedText')
    .attr('class', null)
    .style('visibility', 'hidden')

  const targetID = e.target.id

  const selectedCircle = d3
    .select(`circle#${targetID}`)
    .node()
    .getBoundingClientRect()
  const circleX =
    selectedCircle.x + selectedCircle.width + window.scrollX + tooltipOffsetX
  const circleY = selectedCircle.y + window.scrollY + tooltipOffsetY

  d3.selectAll(`line#${targetID}`)
    .attr('class', 'selectedLine')
    .style('visibility', 'visible')

  d3.selectAll(`text#${targetID}`)
    .attr('class', 'selectedText')
    .style('visibility', 'visible')

  const idData = data.filter((d) => d.id === targetID)[0]

  d3.select('#scatter-tooltip')
    // Main tooltip
    .style('visibility', 'visible')
    .style('top', `${circleY}px`)
    .style('left', `${circleX + arrowSize / 2}px`)
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .style('border', border)
    .style('border-style', 'solid')
    .style('border-color', borderColor)
    .style('border-radius', borderRadius)
    .style('padding', padding)
    .style('background-color', backgroundColor)
    .style(
      'transform',
      `translateY(-50%) translateY(${selectedCircle.width / 2}px)`
    )
    .html(
      `
      <div>
        <div style="color: ${
          colors[domainIndex[idData.domain]]
        }; filter: brightness(0.85);">${idData.domain}</div>
        <div style="font-size: 1.5em;">${idData.task_name}</div>
        ${idData.reference}<br>
        ${idData.year}<br>
        <a href="https://metriq.info/Submission/${
          idData.submission_id
        }" style="color: ${
        colors[domainIndex[idData.domain]]
      }; filter: brightness(0.85)">→ explore submission</a>
      </div>`
    )
    // triangle
    .append('div')
    .attr('id', 'tooltip-triangle')
    .style('position', 'absolute  ')
    .style('content', '         ')
    .style('top', '50%')
    .style('left', '0%')
    .style('transform', 'translateX(-50%) rotate(45deg)')
    .style('border', border)
    .style('border-style', 'solid')
    .style('margin-top', `-${arrowSize / 2}px`)
    .style('width', `${arrowSize}px`)
    .style('height', `${arrowSize}px`)
    .style(
      'border-color',
      `transparent transparent ${borderColor} ${borderColor}`
    )
    .style('background-color', backgroundColor)
}

function wrap (text, wrapWidth) {
  text.each(function () {
    const text = d3.select(this)
    const words = text.text().split(/\s+/).reverse()
    let word
    let line = []
    const y = text.attr('y')
    const x = text.attr('x')
    const dy = 1
    let tspan = text
      .text(null)
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', `${dy}em`)
    let currentY = y
    while ((word = words.pop())) {
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node().getComputedTextLength() > wrapWidth) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        currentY = Number(currentY) + 15
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', String(currentY))
          .attr('dy', dy + 'em')
          .text(word)
      }
    }
  })
  return 0
}

function buildFirstSection (multCoeff) {
  const chartTarget = '#legend-stroke'
  const node = document.getElementById('legend-stroke') // html target element to attach chart
  const chartWidth = node.getBoundingClientRect().width

  // initiate svg
  svg = d3
    .select(chartTarget)
    .append('svg')
    .attr('viewBox', [0, 0, chartWidth * multCoeff, chartHeight])
    .attr('id', 'svglegend')
    .style('width', '100%')

  let newY = circleSize + 10

  // circle 1
  svg
    .append('circle')
    .attr('stroke-width', strokeSize)
    .attr('cx', circleSize + 1)
    .attr('cy', newY)
    .attr('r', circleSize)
    .style('stroke', 'gray')
    .style('fill', 'gray')
    .style('stroke-opacity', strokeOpacity.achieved)
    .style('fill-opacity', circleOpacity.achieved)

  // circle 1 label
  svg
    .append('text')
    .attr('x', circleSize * 2 + 15)
    .attr('y', newY + 2)
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text('Achieved')

  newY = newY + circleSize * 3

  // circle 2
  svg
    .append('circle')
    .attr('stroke-width', strokeSize)
    .attr('cx', circleSize + 1)
    .attr('cy', newY)
    .attr('r', circleSize)
    .style('stroke', 'gray')
    .style('fill', 'gray')
    .style('stroke-opacity', strokeOpacity.estimated)
    .style('stroke-dasharray', strokeTexture.estimated)
    .style('fill-opacity', circleOpacity.estimated)

  // circle 2 label
  svg
    .append('text')
    .attr('x', circleSize * 2 + 15)
    .attr('y', newY + 2)
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text('Estimated')
};

function buildSecondSection (multCoeff) {
  const chartTarget = '#legend-color'
  const node = document.getElementById('legend-color') // html target element to attach chart
  const chartWidth = node.getBoundingClientRect().width

  // initiate svg
  svg = d3
    .select(chartTarget)
    .append('svg')
    .attr('viewBox', [0, 0, chartWidth * multCoeff, chartHeight])
    .attr('id', 'svglegend')
    .style('width', '100%')

  let newY = circleSizeFields + 10

  // circle 1
  svg
    .append('circle')
    .attr('stroke-width', strokeSize)
    .attr('cx', circleSizeFields)
    .attr('cy', newY)
    .attr('r', circleSizeFields)
    .style('stroke', colors[domainIndex['Quantum supremacy']])
    .style('stroke-opacity', strokeOpacity.fieldLegend)
    .style('fill', colors[domainIndex['Quantum supremacy']])
    .style('fill-opacity', circleOpacity.fieldLegend)

  // circle 1 label
  svg
    .append('text')
    .attr('x', circleSizeFields * 2 + 15)
    .attr('y', newY + 4)
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text('Quantum supremacy')

  newY = newY + circleSizeFields + 20

  // circle 2
  svg
    .append('circle')
    .attr('stroke-width', strokeSize)
    .attr('cx', circleSizeFields)
    .attr('cy', newY)
    .attr('r', circleSizeFields)
    .style('stroke', colors[domainIndex['Physics simulation']])
    .style('stroke-opacity', strokeOpacity.fieldLegend)
    .style('fill', colors[domainIndex['Physics simulation']])
    .style('fill-opacity', circleOpacity.fieldLegend)

  // circle 2 label
  svg
    .append('text')
    .attr('x', circleSizeFields * 2 + 15)
    .attr('y', newY + 4)
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text('Physics simulation')

  newY = newY + circleSizeFields + 20

  // circle 3
  svg
    .append('circle')
    .attr('stroke-width', strokeSize)
    .attr('cx', circleSizeFields)
    .attr('cy', newY)
    .attr('r', circleSizeFields)
    .style('stroke', colors[domainIndex.Cryptography])
    .style('stroke-opacity', strokeOpacity.fieldLegend)
    .style('fill', colors[domainIndex.Cryptography])
    .style('fill-opacity', circleOpacity.fieldLegend)

  // circle 3 label
  svg
    .append('text')
    .attr('x', circleSizeFields * 2 + 15)
    .attr('y', newY + 4)
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text('Cryptography')

  newY = newY + circleSizeFields + 20

  // circle 4
  svg
    .append('circle')
    .attr('stroke-width', strokeSize)
    .attr('cx', circleSizeFields)
    .attr('cy', newY)
    .attr('r', circleSizeFields)
    .style('stroke', colors[domainIndex.Finance])
    .style('stroke-opacity', strokeOpacity.fieldLegend)
    .style('fill', colors[domainIndex.Finance])
    .style('fill-opacity', circleOpacity.fieldLegend)

  // circle 4 label
  svg
    .append('text')
    .attr('x', circleSizeFields * 2 + 15)
    .attr('y', newY + 4)
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text('Finance')
};

function redraw () {
  isMobile = window.outerWidth < breakpoint
  d3.select('#svgscatter').remove()
  d3.select('#scatter-tooltip').remove()
  d3.selectAll('#svglegend').remove()
  scatterplot(d)
  if (isMobile) {
    d3.selectAll('.htext').call(wrap, 150)
  }
  legend()
}

// Function to build legend
function legend (circleSizeFields = 8) {
  let multCoeff = 1
  if (isMobile) {
    multCoeff = 1.5
  } // resize svg legend on mobile

  buildFirstSection(multCoeff)
  buildSecondSection(multCoeff)
};

function QuantumLandscapeChart () {
  React.useEffect(() => {
  // Draw scatterplot from data
    d3.csv(csv, (_d) => ({
      num_qubits: +_d.num_qubits,
      num_gates: +_d.num_gates,
      achieved: _d.achieved,
      domain: _d.domain,
      task_name: _d.task_name,
      reference: _d.reference,
      year: _d.year,
      submission_id: _d.submission_id
    })).then((_d) => {
      d = _d
      scatterplot(_d)
      legend()
      window.onresize = redraw
    })
  })

  return (
    <span>
      <div className='row'>
        <div className='col text-left'>
          <h4 align='left'>Quantum Computers: What We Need and What We Have</h4>
          <br />
          <p>This chart shows two things: (1) the Achieved series in blue gives what size quantum programs have been successfully run and (2) the Estimated series shows what size programs would be needed for advantage across different domains. Here we plot the size of a quantum program by the number of qubits and number of quantum operations.</p>
          <p>The shaded blue region indicates the qubit widths that can be simulated by state vector methods, up to about 50 qubits. This plot does not include clock speed, which is another important parameter to consider. Resource estimates are based on applications where performance can be proved. This is a high bar. Estimates may be pessimistic as many heuristics need to be developed in practice. Estimates may be optimistic as they haven't been run and so could have mistakes!</p>
          <p>If you have other data you would like to see added to this chart, please email <a href='mailto:metriq@unitary.fund'>metriq@unitary.fund</a>.</p>
          <br />
        </div>
      </div>
      <div id='cargo'>
        <div id='my_dataviz' />
        <div id='legend_guide'>
          <div>
            <span class='legendTitle'>Status</span>
            <div id='legend-stroke' />
          </div>
          <div>
            <span class='legendTitle'>Fields</span>
            <div id='legend-color' />
          </div>
          <div>
            <span class='legendTitle'>Show labels</span>
            <div id='legend-switch'>
              <label class='switch'>
                <input type='checkbox' onClick={onSwitchClick} />
                <span class='slider round' />
              </label>
            </div>
          </div>
        </div>
      </div>
    </span>
  )
}

export default QuantumLandscapeChart
