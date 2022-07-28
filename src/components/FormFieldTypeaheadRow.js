import React, { useState, useRef, Suspense } from 'react'
import { Button } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
const FormFieldValidator = React.lazy(() => import('./FormFieldValidator'))
const TooltipTrigger = React.lazy(() => import('./TooltipTrigger'))

const FormFieldTypeaheadRow = (props) => {
  const [value, setValue] = useState(props.defaultValue ? props.defaultValue : '')
  const [isValid, setIsValid] = useState(true)
  const typeahead = useRef(null)

  const handleOnFieldChange = (input) => {
    // For a regular input field, read field name and value from the event.
    const fieldName = props.inputName
    const fieldValue = input
    if (props.validRegex) {
      setIsValid(props.validRegex.test(fieldValue))
    }
    if (fieldValue !== value) {
      if (props.onChange) {
        props.onChange(fieldName, fieldValue)
      }
      setValue(fieldValue)
    }
  }

  const handleOnFieldBlur = (input) => {
    // For a regular input field, read field name and value from the event.
    const fieldName = props.inputName
    const fieldValue = input
    if (props.validRegex) {
      setIsValid(props.validRegex.test(fieldValue))
    }
    if (fieldValue !== value) {
      if (props.onBlur) {
        props.onBlur(fieldName, fieldValue)
      }
      setValue(fieldValue)
    }
  }

  const handleOnButtonClick = () => {
    if (typeahead) {
      typeahead.current.clear()
    }
    props.onClickAdd(value)
    setValue('')
  }

  return (
    <div className='row'>
      {props.tooltip &&
        <Suspense fallback={<div>Loading...</div>}>
          <TooltipTrigger message={props.tooltip}>
            <span htmlFor={props.inputName} className='col-md-3 form-field-label' dangerouslySetInnerHTML={{ __html: props.label }} />
          </TooltipTrigger>
        </Suspense>}
      {!props.tooltip &&
        <label htmlFor={props.inputName} className='col-md-3 form-field-label' dangerouslySetInnerHTML={{ __html: props.label }} />}
      <Typeahead
        ref={typeahead}
        inputProps={{
          id: props.inputId ? props.inputId : props.inputName,
          name: props.inputId ? props.inputId : props.inputName
        }}
        labelKey={props.labelKey ? props.labelKey : undefined}
        className='col-md-6'
        options={props.options}
        defaultSelected={[props.value ? props.value : '']}
        onChange={selected => {
          handleOnFieldChange(selected[0])
          if (props.onSelect) {
            props.onSelect(selected[0])
          }
        }}
        onInputChange={handleOnFieldChange}
        onBlur={handleOnFieldBlur}
      />
      {props.onClickAdd
        ? <Button variant='primary' onClick={handleOnButtonClick} disabled={!value}>{props.buttonLabel ? props.buttonLabel : 'Add'}</Button>
        : <Suspense fallback={<div>Loading...</div>}><FormFieldValidator invalid={!isValid} className='col-md-3' message={props.validatorMessage} /></Suspense>}
    </div>
  )
}

export default FormFieldTypeaheadRow
