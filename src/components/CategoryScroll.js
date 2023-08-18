import React, { Suspense, useEffect, useState } from 'react'
import FormFieldWideRow from './FormFieldWideRow'
const CategoryItemBox = React.lazy(() => import('./CategoryItemBox'))

const CategoryScroll = (props) => {
  const [rows, setRows] = useState([])

  useEffect(() => {
    const rws = []
    for (let i = 0; i < props.items.length / 3; ++i) {
      const row = []
      for (let j = 0; j < 3; ++j) {
        if ((3 * i + j) >= props.items.length) {
          break
        }
        row.push(props.items[3 * i + j])
      }
      rws.push(row)
    }
    setRows(rws)
  }, [props.items])

  return (
    <div className='category-scroll'>
      <br />
      {props.heading &&
        <FormFieldWideRow>
          <h4 align='left'>{props.heading}</h4>
        </FormFieldWideRow>}
      <FormFieldWideRow>
        {!props.items.length &&
        (props.isLoading
          ? <p><b>Fetching items from server...</b></p>
          : <p><b>There are no approved items, yet.</b></p>)}
        {(props.items.length > 0) &&
          <Suspense fallback={<div>Loading...</div>}>
            <div className='row h-100'>
              <div className={'h-100' + (props.className ? (' ' + props.className) : ' col-lg-9 col')}>
                {rows.map((row, rid) => <div className='row' key={rid}>{row.map((item, id) => <CategoryItemBox item={item} key={3 * rid + id} isLoggedIn={props.isLoggedIn} type={props.type} />)}</div>)}
              </div>
            </div>
          </Suspense>}
      </FormFieldWideRow>
      <br />
    </div>
  )
}

export default CategoryScroll
