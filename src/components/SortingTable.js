import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Table from 'react-bootstrap/Table'
import { Button } from 'react-bootstrap'

const SortingTable = (props) => {
  const [data, setData] = useState(props.data)
  const [trigger, setTrigger] = useState(Math.random())
  const [sortKey, setSortKey] = useState('')
  const [sortDescending, setSortDescending] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(props.isCollapsible)

  useEffect(() => {
    if (props.data !== data) {
      setData(props.data)
    }
  }, [props.data, data])

  const handleSort = (key) => {
    let desc = sortDescending
    if (key === sortKey) {
      desc = !desc
    } else {
      desc = false
      setSortKey(key)
    }
    setSortDescending(desc)

    const nData = props.data.sort((a, b) => {
      const aStr = a[key] ? (isNaN(a[key]) ? (moment(a[key], 'M/D/YYYY', true).isValid() ? new Date(a[key]) : a[key].toLowerCase()) : a[key]) : ''
      const bStr = b[key] ? (isNaN(b[key]) ? (moment(b[key], 'M/D/YYYY', true).isValid() ? new Date(b[key]) : b[key].toLowerCase()) : b[key]) : ''
      if (aStr < bStr) {
        return desc ? 1 : -1
      }
      if (aStr > bStr) {
        return desc ? -1 : 1
      }
      return 0
    })

    setData(nData)
    setTrigger(Math.random())
  }

  const style = props.scrollX ? { 'overflow-x': true } : undefined

  return (
    <span>
      <Table striped bordered hover responsive className={props.className} style={style}>
        {((props.showHeader === undefined) || (props.showHeader !== false)) &&
          <thead>
            <tr>{props.columns.map((item, id) => <th key={id} style={{ width: item.width }} onClick={() => handleSort(item.key)}>{item.title}</th>)}</tr>
          </thead>}
        <tbody key={trigger}>
          {(isCollapsed ? data.slice(0, 10) : data).map((row, id) => <tr key={id} className={props.rowClassName} onClick={props.onRowClick ? () => props.onRowClick(row) : undefined}>{props.columns.map((col, id) => <td key={id}>{row[col.key]}</td>)}</tr>)}
        </tbody>
      </Table>
      {props.isCollapsible && (data.length > 10) && isCollapsed && <Button variant='primary' aria-label='See all results' onClick={() => setIsCollapsed(false)}>See all {props.collapseLabelNoun}</Button>}
      {props.isCollapsible && (data.length > 10) && !isCollapsed && <Button variant='primary' aria-label='See fewer results' onClick={() => setIsCollapsed(true)}>See fewer {props.collapseLabelNoun}</Button>}
    </span>
  )
}

export default SortingTable
