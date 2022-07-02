import React from 'react'
import CategoryItemBox from './CategoryItemBox'
import FormFieldWideRow from './FormFieldWideRow'

const CategoryScroll = (props) =>
  <div className='container'>
    {props.heading &&
      <FormFieldWideRow>
        <b>{props.heading}</b>
      </FormFieldWideRow>}
    <FormFieldWideRow>
      {!props.items.length && <p><b>There are no approved items, yet.</b></p>}
      {(props.items.length > 0) &&
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
        </div>}
    </FormFieldWideRow>
    <br />
  </div>

export default CategoryScroll
