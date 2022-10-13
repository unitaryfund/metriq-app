import React, { useState } from 'react'
import Table from 'react-bootstrap/Table'

const SortingTable = (props) => {
  const [sortKey, setSortKey] = useState('')
  const [sortDescending, setSortDescending] = useState(false)
  const [data, setData] = useState(props.data)

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDescending(!sortDescending)
    } else {
      setSortKey(key)
      setSortDescending(false)
    }

    const nData = data.sort((a, b) => {
      if (a[sortKey].toLowerCase() < b[sortKey].toLowerCase()) {
        return -1
      }
      if (a[sortKey].toLowerCase() > b[sortKey].toLowerCase()) {
        return 1
      }
      return 0
    })

    setData(nData)
  }

  const style = props.scrollX ? { 'overflow-x': true } : undefined

  return (
    <Table striped bordered hover responsive className={props.className} style={style}>
      {((props.showHeader === undefined) || (props.showHeader !== false)) &&
        <thead>
          <tr>{props.columns.map((item, id) => <th key={id} style={{ width: item.width }} onClick={() => handleSort(item.key)}>{item.title}</th>)}</tr>
        </thead>}
      <tbody>
        {data.map((row, id) => <tr key={id} className={props.rowClassName} onClick={() => props.onRowClick(row)}>{props.columns.map((col, id) => <td key={id}>{row[col.key]}</td>)}</tr>)}
      </tbody>
    </Table>
  )
}

export default SortingTable
