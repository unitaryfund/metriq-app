import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import FormFieldValidator from './FormFieldValidator'
import TooltipTrigger from './TooltipTrigger'

const FormFieldSelectRow = (props) => {
  const options = props.options
  let specialOptions = []
  let commonOptions = []
  if (options.length && options[0].top !== undefined) {
    options.sort((a, b) => (a.top < b.top) ? 1 : -1)
    specialOptions = options.filter(x => x.top === 1)
    commonOptions = options.filter(x => x.top === 0)
  } else {
    commonOptions = options
  }

  const [value, setValue] = useState(props.defaultValue ? props.defaultValue : options[0].id)

  const handleOnFieldChange = (event) => {
    // For a regular input field, read field name and value from the event.
    const fieldName = event.target.name
    const fieldValue = (props.inputType === 'checkbox') ? event.target.checked : event.target.value
    if (fieldValue !== value) {
      if (props.onChange) {
        props.onChange(fieldName, fieldValue)
      }
      setValue(fieldValue)
    }
  }

  const handleOnFieldBlur = (event) => {
    const fieldName = event.target.name
    const fieldValue = (props.inputType === 'checkbox') ? event.target.checked : event.target.value
    if (fieldValue !== value) {
      if (props.onBlur) {
        props.onBlur(fieldName, fieldValue)
      }
      setValue(fieldValue)
    }
  }

  return (
    <div className='row'>
      {props.tooltip &&
        <TooltipTrigger message={props.tooltip}>
          <span
            htmlFor={props.inputName}
            className={props.labelClass ? 'col-md-3 form-field-label ' + props.labelClass : 'col-md-3 form-field-label'}
            dangerouslySetInnerHTML={{ __html: props.label }}
          />
        </TooltipTrigger>}
      {!props.tooltip &&
        <label
          htmlFor={props.inputName}
          className={props.labelClass ? 'col-md-3 form-field-label ' + props.labelClass : 'col-md-3 form-field-label'}
          dangerouslySetInnerHTML={{ __html: props.label }}
        />}
      <div className='col-md-6'>
        <select
          id={props.inputName}
          name={props.inputName}
          disabled={props.disabled}
          className='form-control'
          value={value}
          onChange={handleOnFieldChange}
          onBlur={handleOnFieldBlur}
        >
          {props.isNullDefault &&
            <option value=''>(None)</option>}
          {specialOptions.length &&
            <optgroup label={props.specialOptGrouplabel ? props.specialOptGrouplabel : 'Special'}>
              {specialOptions.map(option => <option key={option.id} value={option.id} className='bold'>{option.name}</option>)}
            </optgroup>}
          {commonOptions.length && commonOptions.map(option =>
            <option key={option.id} value={option.id} className='bold'>{option.name}</option>
          )}
        </select>
      </div>
      {props.onClickButton
        ? <Button variant='primary' onClick={() => props.onClickButton(value)} disabled={!value}>{props.buttonLabel ? props.buttonLabel : 'Add'}</Button>
        : <FormFieldValidator className='col-md-3' message={props.validatorMessage} />}
    </div>
  )
}

export default FormFieldSelectRow
