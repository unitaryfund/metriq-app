import React from 'react'

const FormFieldValidator = (props) =>
  <div className={`form-field-validator ${props.invalid ? '' : 'hide'}`}>
    *{props.message}
  </div>

export default FormFieldValidator
