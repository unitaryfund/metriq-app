// QuantumLandscapeChart.js

import React from 'react'
import * as d3 from 'd3'
import '../viz-style.css'
import csv from '../progress.csv'

const fontType = 'Helvetica'
const smallLabelSize = 15 // font size in pixel
const mobileLabelSize = 11
const chartHeight = 180 // chart height,
const circleSize = 8
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
const colors = ['#ED1010', '#0D99FF', '#56E1C8', '#FFB800']
const domainIndex = {
  quantinuum: 0,
  ibmq: 1,
  rigetti: 2,
  other: 3
}
const breakpoint = 700
let isMobile = window.outerWidth < breakpoint
let svg, d

let areLabelsVisible = false
function onLabelSwitchClick () {
  areLabelsVisible = !areLabelsVisible
  refreshLabels()
}
let areLabelsArxiv = false
function onArxivSwitchClick () {
  areLabelsArxiv = !areLabelsArxiv
  refreshLabels()
}
let isScaleLinear = false
function onScaleSwitchClick () {
  isScaleLinear = !isScaleLinear
  refreshLabels()
}
function refreshLabels () {
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
  isScaleLinear = false,
  xName = 'tableDate', // the x column
  xAxisText = 'Date →',
  yName = 'metricValue', // the y column
  yAxisText = 'Quantum Volume  →',
  chartTarget = '#my_dataviz', // html target element to attach chart
  chartHeight = 600, // chart height
  marginTop = 40, // top margin, in pixels
  marginRight = 100, // right margin, in pixels
  marginBottom = 70, // bottom margin, in pixels
  xLabelShift = marginBottom - 40,
  marginLeft = 100, // left margin, in pixels
  rangeMult = 0.02,
  xScaleType = d3.scaleTime,
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

  // list of IDs of data with max values
  // maxData with only max objects

  let maxIDs = []
  let currentMaxValue = -1

  data.map((d) => {
    if (Number(d.metricValue) > currentMaxValue) {
      maxIDs = [...maxIDs, d.id]
      currentMaxValue = Number(d.metricValue)
    }

    return 0
  })

  const yScaleType = isScaleLinear ? d3.scaleLinear : d3.scaleLog

  const maxData = data.filter((d) => maxIDs.includes(d.id))
  maxData.map((d, i) => {
    if (i < maxData.length - 1) {
      d.nextX = maxData[i + 1][xName]
      d.nextY = maxData[i + 1][yName]
    }

    return 0
  })

  // define aesthetic mappings
  const x = (d) => d[xName]
  const y = (d) => d[yName]

  // width
  const chartWidth = d3.select(chartTarget).node().getBoundingClientRect().width
  if (isMobile) {
    marginLeft = 80
    marginRight = 50
  }

  // ranges
  const xRange = [marginLeft, chartWidth - marginRight] // [left, right]
  const yRange = [chartHeight - marginBottom, marginTop] // [bottom, top]

  // values
  const X = d3.map(data, x)
  const Y = d3.map(data, y)
  const I = d3.range(data.length)

  // domains
  const xDomain = [d3.min(X), d3.max(X)]
  const yDomain = [1, d3.max(Y) + d3.max(Y) * rangeMult]

  // scale
  const xScale = xScaleType(xDomain, xRange)
  const yScale = yScaleType(yDomain, yRange)

  // time axes formatter
  // For a less crowded x axis, especially if we increase fontsize for labels
  const tickInterval = d3.timeMonth.every(12)

  // axes
  const xAxis = d3.axisBottom(xScale).ticks(tickInterval)
  // Otherwise ticks label position in log scale must be declared manually
  const yAxis = isScaleLinear ? d3.axisLeft(yScale).tickFormat(d3.format('~s')) : d3.axisLeft(yScale)

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

  // initiate svg
  svg = d3
    .select(chartTarget)
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
        .attr('y', -50)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'end')
        .attr('font-size', `${smallLabelSize}px`)
        .text(yAxisText)
    )

  // max lines (h + v)
  svg
    .append('g')
    .selectAll('line')
    .data(maxData.slice(0, maxData.length - 1))
    .join('line')
    .attr('x1', (i) => xScale(x(i)) + circleSize)
    .attr('y1', (i) => yScale(y(i)))
    .attr('x2', (i) => xScale(i.nextX))
    .attr('y2', (i) => yScale(y(i)))
    .style('stroke', tooltipLineColor)
    .style('stroke-width', horizontalLineStrokeSize)
    .style('stroke-dasharray', tooltipLineStrokeTexture)
  svg
    .append('g')
    .selectAll('line')
    .data(maxData.slice(0, maxData.length - 1))
    .join('line')
    .attr('x1', (i) => xScale(i.nextX))
    .attr('y1', (i) => yScale(y(i)))
    .attr('x2', (i) => xScale(i.nextX))
    .attr('y2', (i) => yScale(i.nextY) + circleSize)
    .style('stroke', tooltipLineColor)
    .style('stroke-width', horizontalLineStrokeSize)
    .style('stroke-dasharray', tooltipLineStrokeTexture)

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
    .text((i) => d3.utcFormat('%B %Y')(x(i)))

  // tooltip hlines
  svg
    .append('g')
    .selectAll('line')
    .data(data)
    .join('line')
    .attr('x1', (i) => xScale(x(i)) - circleSize)
    .attr('y1', (i) => yScale(y(i)))
    .attr('x2', xScale(d3.min(X)))
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
    .attr('x', xScale(d3.min(X)) + tooltipLineTextBorder)
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
    .attr('fill', '#00000000')
    .selectAll('path')
    .data(I)
    .join('path')
    .attr('d', (i) => voronoi.renderCell(i))
    .attr('id', function (i) {
      return data[i].id
    })
    .attr('class', function (i) {
      return makeClass(data[i][xName], data[i][yName])
    })
  // .attr("centroid_x", (i) => d3.polygonCentroid(voronoi.cellPolygon(i))[0])
  // .attr("centroid_y", (i) => d3.polygonCentroid(voronoi.cellPolygon(i))[1])
  // .classed("voronoi", true)
    .on('mousemove touchstart', (e) =>
      mousemove(
        e,
        marginRight,
        xRange,
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
    .style('cursor', 'pointer')
    .style('stroke', (i) =>
      colors[domainIndex[i.provider]]
        ? colors[domainIndex[i.provider]]
        : colors[3]
    )
    .style('fill', (i) =>
      colors[domainIndex[i.provider]]
        ? colors[domainIndex[i.provider]]
        : colors[3]
    )
    .style('fill-opacity', (i) => circleOpacity.achieved)
    .attr('id', (i) => i.id)
    .attr('class', (i) => {
      return maxIDs.includes(i.id) ? 'haslabel' : null
    })
    .attr('class', (i) => makeClass(x(i), y(i)))
    .attr('submissionId', (i) => i.submissionId)
    .attr('label', (i) => {
      if (i.arXiv && areLabelsArxiv) { return `arXiv:${i.arXiv}` } else return i.platformName
    })
    .on('click', function () {
      if (!isMobile) {
        const submissionId = d3.select(this).attr('submissionId')
        window.open(`https://metriq.info/Submission/${submissionId}`)
      }
    })
    .on('mousemove touchstart', (e) =>
      mousemove(
        e,
        marginRight,
        xRange,
        data,
        colors,
        domainIndex,
        fontType,
        smallLabelSize
      )
    )

  // label
  d3.selectAll('circle').each(function (d, i) {
    const id = d3.select(this).attr('id')

    if (maxIDs.includes(id)) {
      const x = d3.select(`circle#${id}`).attr('cx')
      const y = d3.select(`circle#${id}`).attr('cy')

      const svgWidth = d3
        .select('#svgscatter')
        .node()
        .getBoundingClientRect().width

      const turnLabelBreakpoint = isMobile
        ? (svgWidth / 3) * 1.5
        : svgWidth / 3

      svg
        .append('text')
        .attr(
          'x',
          x > turnLabelBreakpoint
            ? Number(x) - xlabelDistance
            : Number(x) + xlabelDistance
        )
        .attr('y', Number(y))
        .attr('class', 'labeltohide')
        .style(
          'visibility',
          document.getElementById('labelSwitch').checked ? 'visible' : 'hidden'
        )
        .style(
          'font-size',
          isMobile ? `${mobileLabelSize}px` : `${smallLabelSize}px`
        )
        .style('font-family', fontType)
        .attr('text-anchor', x > turnLabelBreakpoint ? 'end' : 'start')
        .text(`${d3.select(`circle#${id}`).attr('label')}`)
    }
  })
}

function mousemove (
  e,
  marginRight,
  xRange,
  data,
  colors,
  domainIndex,
  fontType, // font size in pixel
  smallLabelSize,
  selectionRadius = 50,
  tooltipOffsetX = 0,
  tooltipOffsetY = 0,
  border = '1px',
  borderColor = 'black',
  padding = '5px',
  borderRadius = '5px',
  backgroundColor = '#fafafa',
  arrowSize = 8,
  turnTooltip = 0.6
) {
  const mouseX = e.pageX
  const mouseY = e.pageY

  const targetID = e.target.id
  const targetClass = e.target.className.baseVal

  const selectedCircle = d3
    .select(`circle#${targetID}`)
    .node()
    .getBoundingClientRect()

  const xPerc = (selectedCircle.x - xRange[0]) / (xRange[1] - marginRight)

  const circleX = selectedCircle.x + window.scrollX + tooltipOffsetX
  const circleXshifted = circleX + selectedCircle.width
  const circleY = selectedCircle.y + window.scrollY + tooltipOffsetY

  const mouseDist = Math.sqrt((circleX - mouseX) ** 2 + (circleY - mouseY) ** 2)

  const otherCircles = d3.selectAll(`circle.${targetClass}`)

  if (mouseDist <= selectionRadius) {
    d3.selectAll('line.selectedLine')
      .attr('class', null)
      .style('visibility', 'hidden')

    d3.selectAll('text.selectedText')
      .attr('class', null)
      .style('visibility', 'hidden')

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
        ${[...otherCircles._groups[0]]
          .map(
            (crcl) =>
              `<div style="font-size: 1.5em;">${crcl.__data__.platformName}</div>`
          )
          .join('')}
        ${d3.utcFormat('%B %d, %Y')(idData.tableDate)}<br>
        ${idData.methodName}<br>
        <a href="https://metriq.info/Submission/${
          idData.submissionId
        }" style="color: ${
          colors[domainIndex[idData.domain]]
        }; filter: brightness(0.85)">→ explore submission</a>
      </div>`
      )

    if (xPerc < turnTooltip) {
      d3.select('#scatter-tooltip')
        .style('right', null)
        .style('left', `${circleXshifted + arrowSize / 2}px`)
    } else {
      d3.select('#scatter-tooltip')
        .style('left', null)
        .style('right', `${window.innerWidth - circleX + arrowSize / 2}px`)
    }

    d3.select('#scatter-tooltip')
      // triangle
      .append('div')
      .attr('id', 'tooltip-triangle')
      .style('position', 'absolute  ')
      .style('content', '         ')
      .style('top', '50%')
      .style('left', `${xPerc < turnTooltip ? 0 : 100}%`)
      .style('transform', 'translateX(-50%) rotate(45deg)')
      .style('border', border)
      .style('border-style', 'solid')
      .style('margin-top', `-${arrowSize / 2}px`)
      .style('width', `${arrowSize}px`)
      .style('height', `${arrowSize}px`)
      .style(
        'border-color',
        xPerc < turnTooltip
          ? `transparent transparent ${borderColor} ${borderColor}`
          : `${borderColor} ${borderColor} transparent transparent`
      )
      .style('background-color', backgroundColor)
  } else {
    d3.select('#scatter-tooltip').style('visibility', 'hidden')

    d3.selectAll('line.selectedLine')
      .attr('class', null)
      .style('visibility', 'hidden')

    d3.selectAll('text.selectedText')
      .attr('class', null)
      .style('visibility', 'hidden')
  }
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

document
  .getElementById('isScaleLinearSwitch')
  .addEventListener('input', function () {
    redraw()
  })

document
  .getElementById('labelSwitch')
  .addEventListener('input', function () {
    redraw()
  })

document
  .getElementById('arXivSwitch')
  .addEventListener('input', function () {
    redraw()
  })

// Function to build legend
function legend (circleSizeFields = 8) {
  let multCoeff = 1
  if (isMobile) {
    multCoeff = 1.5
  }

  const chartTarget = '#legend-color' // html target element to attach chart
  const chartWidth = d3
    .select(chartTarget)
    .node()
    .getBoundingClientRect().width

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
    .style('stroke', colors[domainIndex.ibmq])
    .style('stroke-opacity', strokeOpacity.fieldLegend)
    .style('fill', colors[domainIndex.ibmq])
    .style('fill-opacity', circleOpacity.fieldLegend)

  // circle 1 label
  svg
    .append('text')
    .attr('x', circleSizeFields * 2 + 15)
    .attr('y', newY + 4)
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text('IBMQ')

  newY = newY + circleSizeFields + 20

  // circle 2
  svg
    .append('circle')
    .attr('stroke-width', strokeSize)
    .attr('cx', circleSizeFields)
    .attr('cy', newY)
    .attr('r', circleSizeFields)
    .style('stroke', colors[domainIndex.quantinuum])
    .style('stroke-opacity', strokeOpacity.fieldLegend)
    .style('fill', colors[domainIndex.quantinuum])
    .style('fill-opacity', circleOpacity.fieldLegend)

  // circle 2 label
  svg
    .append('text')
    .attr('x', circleSizeFields * 2 + 15)
    .attr('y', newY + 4)
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text('Quantinuum')

  newY = newY + circleSizeFields + 20

  // circle 3
  svg
    .append('circle')
    .attr('stroke-width', strokeSize)
    .attr('cx', circleSizeFields)
    .attr('cy', newY)
    .attr('r', circleSizeFields)
    .style('stroke', colors[domainIndex.rigetti])
    .style('stroke-opacity', strokeOpacity.fieldLegend)
    .style('fill', colors[domainIndex.rigetti])
    .style('fill-opacity', circleOpacity.fieldLegend)

  // circle 3 label
  svg
    .append('text')
    .attr('x', circleSizeFields * 2 + 15)
    .attr('y', newY + 4)
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text('Rigetti')

  newY = newY + circleSizeFields + 20

  // circle 4
  svg
    .append('circle')
    .attr('stroke-width', strokeSize)
    .attr('cx', circleSizeFields)
    .attr('cy', newY)
    .attr('r', circleSizeFields)
    .style('stroke', colors[domainIndex.other])
    .style('stroke-opacity', strokeOpacity.fieldLegend)
    .style('fill', colors[domainIndex.other])
    .style('fill-opacity', circleOpacity.fieldLegend)

  // circle 4 label
  svg
    .append('text')
    .attr('x', circleSizeFields * 2 + 15)
    .attr('y', newY + 4)
    .style('font-size', `${smallLabelSize}px`)
    .style('font-family', fontType)
    .text('Other')
}

function makeClass (x, y) {
  return `c${x - y}`
}

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
        </div>
      </div>
      <div id='cargo'>
        <div id='my_dataviz' />
        <div id='legend_guide'>
          <div>
            <div id='legend-switch' style='margin-top: 10px'>
              <label class='switch'>
                <input id='labelSwitch' type='checkbox' onClick={onLabelSwitchClick} />
                <span class='slider round' />
              </label>
              <span class='legendTitle'>Show labels</span>
            </div>
            <div id='legend-switch' style='margin-top: 10px'>
              <label class='switch'>
                <input id='arXivSwitch' type='checkbox' onClick={onArxivSwitchClick} />
                <span class='slider round' />
              </label>
              <span class='legendTitle'>Labels | ID</span>
            </div>
            <div id='legend-switch' style='margin-top: 10px'>
              <label class='switch'>
                <input id='isScaleLinearSwitch' type='checkbox' onClick={onScaleSwitchClick} />
                <span class='slider round' />
              </label>
              <span class='legendTitle'>Log | Linear</span>
            </div>
          </div>
          <div>
            <span class='legendTitle'>Providers</span>
            <div id='legend-color' style='margin-top: 10px' />
          </div>
          <div>
            <div id='legend-stroke' style='margin-top: 10px'>
              <button id='downloadButton' class='mybutton'>Download chart</button>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col text-left'>
          <p>This chart shows two things: (1) the Achieved series in blue gives what size quantum programs have been successfully run and (2) the Estimated series shows what size programs would be needed for advantage across different domains. Here we plot the size of a quantum program by the number of qubits and number of quantum operations.</p>
          <p>The shaded blue region indicates the qubit widths that can be simulated by state vector methods, up to about 50 qubits. This plot does not include clock speed, which is another important parameter to consider. Resource estimates are based on applications where performance can be proved. This is a high bar. Estimates may be pessimistic as many heuristics need to be developed in practice. Estimates may be optimistic as they haven't been run and so could have mistakes!</p>
          <p>If you have other data you would like to see added to this chart, please email <a href='mailto:metriq@unitary.fund'>metriq@unitary.fund</a>.</p>
        </div>
      </div>
    </span>
  )
}

export default QuantumLandscapeChart
