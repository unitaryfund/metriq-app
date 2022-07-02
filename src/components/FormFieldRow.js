import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import FormFieldValidator from './FormFieldValidator'
import FormFieldWideRow from './FormFieldWideRow'

const FormFieldRow = (props) => {
  const [value, setValue] = useState(props.defaultValue ? props.defaultValue : '')
  const [isValid, setIsValid] = useState(true)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  const handleOnFieldChange = (event) => {
    // For a regular input field, read field name and value from the event.
    const fieldName = event.target.name
    const fieldValue = (props.inputType === 'checkbox') ? event.target.checked : event.target.value
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

  const handleOnFieldBlur = (event) => {
    const fieldName = event.target.name
    const fieldValue = (props.inputType === 'checkbox') ? event.target.checked : event.target.value
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

  return (
    <FormFieldWideRow>
      <div className='row'>
        {props.tooltip &&
          <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>{props.tooltip}</Tooltip>}>
            <span htmlFor={props.inputName} className='col-md-3 form-field-label' dangerouslySetInnerHTML={{ __html: props.label }} />
          </OverlayTrigger>}
        {!props.tooltip &&
          <label htmlFor={props.inputName} className='col-md-3 form-field-label' dangerouslySetInnerHTML={{ __html: props.label }} />}
        <div className='col-md-6 '>
          {(props.inputType === 'textarea') &&
            <textarea
              id={props.inputName}
              name={props.inputName}
              className='form-control'
              rows={props.rows}
              cols={props.cols}
              placeholder={props.placeholder}
              value={value}
              onChange={handleOnFieldChange}
              onBlur={handleOnFieldBlur}
            >
              {props.value}
            </textarea>}
          {(props.inputType !== 'textarea') &&
            <input
              id={props.inputName}
              name={props.inputName}
              className='form-control'
              type={props.inputType}
              selected={props.defaultValue}
              value={props.value}
              checked={props.checked}
              onChange={handleOnFieldChange}
              onBlur={handleOnFieldBlur}
            />}
        </div>
        {props.imageUrl ? <Button variant='primary' onClick={() => setImagePreviewUrl(value)}>Preview</Button> : <FormFieldValidator invalid={!isValid} className='col-md-3' message={props.validatorMessage} />}
      </div>
      {imagePreviewUrl && isValid &&
        <FormFieldWideRow className='text-center'>
          <img src={imagePreviewUrl} alt='Submission thumbnail preview' className='submission-image' />
        </FormFieldWideRow>}
    </FormFieldWideRow>
  )
}

export default FormFieldRow
