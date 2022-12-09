import React, { useState, useRef, Suspense } from 'react'
import { Button } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
const FormFieldValidator = React.lazy(() => import('./FormFieldValidator'))
const TooltipTrigger = React.lazy(() => import('./TooltipTrigger'))

const FormFieldTypeaheadRow = (props) => {
  const [value, setValue] = useState(props.defaultValue ? props.defaultValue : '')
  const [isValid, setIsValid] = useState(true)
  const typeahead = useRef(null)
  const coalescedId = props.inputId ? props.inputId : props.inputName

  // See https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string-in-javascript#answer-17772086
  const isString = (x) => (Object.prototype.toString.call(x) === '[object String]')

  const handleOnFieldChange = (input) => {
    // For a regular input field, read field name and value from the event.
    const fieldName = props.inputName
    const fieldValue = (input && input.name) ? input.name : input
    if (isString(fieldValue) && props.validRegex) {
      setIsValid(props.validRegex.test(fieldValue))
    }
    if (isString(fieldValue) && (fieldValue !== value)) {
      if (props.onChange) {
        props.onChange(fieldName, fieldValue)
      }
      setValue(fieldValue)
      setIsValid(true)
    }
  }

  const handleOnFieldBlur = (input) => {
    // For a regular input field, read field name and value from the event.
    const fieldName = props.inputName
    const fieldValue = (input && input.name) ? input.name : input
    if (isString(fieldValue) && props.validRegex) {
      setIsValid(props.validRegex.test(fieldValue))
    }
    if (isString(fieldValue) && (fieldValue !== value)) {
      if (props.onBlur) {
        props.onBlur(fieldName, fieldValue)
      }
      setValue(fieldValue)
      setIsValid(true)
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
            <span htmlFor={coalescedId} className={'col col-md-3 form-field-label' + (props.alignLabelRight ? ' text-right' : '')} dangerouslySetInnerHTML={{ __html: props.label }} />
          </TooltipTrigger>
        </Suspense>}
      {!props.tooltip &&
        <label htmlFor={coalescedId} className={'col col-md-3 form-field-label' + (props.alignLabelRight ? ' text-right' : '')} dangerouslySetInnerHTML={{ __html: props.label }} />}
      <Typeahead
        ref={typeahead}
        id={coalescedId}
        inputProps={{
          id: coalescedId,
          name: coalescedId
        }}
        labelKey={props.labelKey ? props.labelKey : undefined}
        className='col col-md-6'
        options={props.options}
        defaultSelected={[props.value ? props.value : '']}
        onChange={selected => {
          handleOnFieldChange(selected[0])
          if (props.onSelect) {
            props.onSelect(selected[0])
          }
          if (value && props.isClearedOnSelect) {
            if (typeahead) {
              typeahead.current.clear()
            }
            setValue('')
          }
        }}
        onInputChange={handleOnFieldChange}
        onBlur={handleOnFieldBlur}
        disabled={props.disabled}
      />
      {(!!props.onClickAdd && !props.onClickNew) && <Button variant='primary' className='submission-ref-button' onClick={handleOnButtonClick} disabled={props.disabled || !value}>{props.buttonLabel ? props.buttonLabel : 'Add'}</Button>}
      {!!props.onClickNew && <Button variant='primary' className='submission-ref-button' onClick={() => props.onClickNew(value)} disabled={props.disabled}>New</Button>}
      {(!props.onClickAdd && !props.onClickNew) && <div className='col col-md-3'><Suspense fallback={<div>Loading...</div>}><FormFieldValidator invalid={!isValid} message={props.validatorMessage} /></Suspense></div>}
    </div>
  )
}

export default FormFieldTypeaheadRow
