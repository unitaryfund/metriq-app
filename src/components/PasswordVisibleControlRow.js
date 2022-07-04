import React, { useState } from 'react'

const PasswordVisibleControlRow = (props) => {
  const [value, setValue] = useState(props.defaultValue ? props.defaultValue : '')

  const handleOnFieldChange = (event) => {
    // For a regular input field, read field name and value from the event.
    const fieldName = event.target.name
    const fieldValue = event.target.checked
    if (fieldValue !== value) {
      if (props.onChange) {
        props.onChange(fieldName, fieldValue)
      }
      setValue(fieldValue)
    }
  }

  return (
    <div className='row'>
      <div className='col text-center'>
        <input
          id={props.inputName}
          name={props.inputName}
          checked={props.defaultValue}
          className='password-visible-checkbox'
          type='checkbox'
          onChange={handleOnFieldChange}
        />&nbsp;
        <label htmlFor={props.inputName}>Show Password</label>
      </div>
    </div>
  )
}

export default PasswordVisibleControlRow
