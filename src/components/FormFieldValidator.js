import React from 'react'

const FormFieldValidator = (props) => {
  const active = props.invalid
  return (
    <div className={`form-field-validator ${active ? '' : 'hide'}`}>
      *{props.message}
    </div>
  )
}

export default FormFieldValidator
