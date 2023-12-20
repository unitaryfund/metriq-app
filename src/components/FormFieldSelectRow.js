import React, { useState, Suspense } from 'react'
import { Button } from 'react-bootstrap'
import FormFieldValidator from './FormFieldValidator'
const TooltipTrigger = React.lazy(() => import('./TooltipTrigger'))

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

  const [value, setValue] = useState(props.value
    ? props.value
    : (props.defaultValue
        ? props.defaultValue
        : options.length && !props.isNullDefault
          ? options[0].id
          : ''))
  if (props.value && props.value !== value) {
    setValue(props.value)
  }

  const handleOnFieldChange = (event) => {
    // For a regular input field, read field name and value from the event.
    const fieldName = event.target.name
    let fieldValue = (props.inputType === 'checkbox') ? event.target.checked : event.target.value
    if (props.inputType === 'select') {
      fieldValue = options[event.target.value]
    }
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
        <Suspense fallback={<div>Loading...</div>}>
          <TooltipTrigger message={props.tooltip}>
            <span
              htmlFor={props.inputName}
              className={`col col-md-3 form-field-label ${props.labelClass ? props.labelClass : ''}`}
              dangerouslySetInnerHTML={{ __html: props.label }}
            />
          </TooltipTrigger>
        </Suspense>}
      {!props.tooltip &&
        <label
          htmlFor={props.inputName}
          className={`col col-md-3 form-field-label ${props.labelClass ? props.labelClass : ''}`}
          dangerouslySetInnerHTML={{ __html: props.label }}
        />}
      <div className='col col-md-6'>
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
              {specialOptions.map((option, id) => <option key={id} value={id} className='bold'>{option.name}</option>)}
            </optgroup>}
          {commonOptions.length && commonOptions.map(option =>
            <option key={option.id} value={option.id} className='bold'>{option.name}</option>
          )}
        </select>
      </div>
      {props.onClickAdd && <Button variant='primary' className='submission-ref-button' onClick={() => props.onClickAdd(value || (options.length ? options[0].id : 0))} disabled={props.disabled}>Add</Button>}
      {props.onClickNew && <Button variant='primary' className='submission-ref-button' onClick={props.onClickNew} disabled={props.disabled}>New</Button>}
      {!props.onClickAdd && !props.onClickNew && <div className='col col-md-3'><Suspense fallback={<div>Loading...</div>}><FormFieldValidator message={props.validatorMessage} /></Suspense></div>}
    </div>
  )
}

export default FormFieldSelectRow
