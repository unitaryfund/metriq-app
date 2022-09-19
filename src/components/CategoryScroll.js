import React, { Suspense } from 'react'
import FormFieldWideRow from './FormFieldWideRow'
const CategoryItemBox = React.lazy(() => import('./CategoryItemBox'))

const CategoryScroll = (props) =>
  <div className='container'>
    <br />
    {props.heading &&
      <FormFieldWideRow>
        <b>{props.heading}</b>
      </FormFieldWideRow>}
    <FormFieldWideRow>
      {!props.items.length &&
        (props.isLoading
          ? <p><b>Fetching items from server...</b></p>
          : <p><b>There are no approved items, yet.</b></p>)}
      {(props.items.length > 0) &&
        <Suspense fallback={<div>Loading...</div>}>
          <div className='task'>
            <div className='row h-100'>
              <div className='col-md col h-100'>
                <table className='task-method-item'>
                  <tbody>
                    {props.items.map((item, index) => <CategoryItemBox item={item} key={index} isLoggedIn={props.isLoggedIn} type={props.type} />)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Suspense>}
    </FormFieldWideRow>
    <br />
  </div>

export default CategoryScroll
