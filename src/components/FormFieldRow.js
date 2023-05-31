import React, { useEffect, useState, Suspense } from 'react'
import { Button } from 'react-bootstrap'
import LatexRender from './LatexRender'
const FormFieldValidator = React.lazy(() => import('./FormFieldValidator'))
const FormFieldWideRow = React.lazy(() => import('./FormFieldWideRow'))
const TooltipTrigger = React.lazy(() => import('./TooltipTrigger'))

const FormFieldRow = (props) => {
  const [value, setValue] = useState(props.value)
  const [checked, setChecked] = useState(props.checked ? props.checked : false)
  const [isValid, setIsValid] = useState((props.isValidatedOnStart && props.validRegex) ? props.validRegex.test(props.value) : true)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [latexMode, setLatexMode] = useState(false)

  useEffect(() => { setValue(props.value) }, [props.value])

  const handleOnFieldChange = (event) => {
    // For a regular input field, read field name and value from the event.
    const fieldName = event.target.name
    let fieldValue = false
    if (props.inputType === 'checkbox') {
      fieldValue = event.target.checked
      setChecked(event.target.checked)
    } else {
      fieldValue = event.target.value
    }
    if (props.validRegex) {
      setIsValid(props.validRegex.test(fieldValue))
    }
    if (props.onChange) {
      props.onChange(fieldName, fieldValue)
    }
    setValue(fieldValue)
  }

  const handleOnFieldBlur = (event) => {
    const fieldName = event.target.name
    const fieldValue = (props.inputType === 'checkbox') ? event.target.checked : event.target.value
    if (props.validRegex) {
      setIsValid(props.validRegex.test(fieldValue))
    }
    if (props.onBlur) {
      props.onBlur(fieldName, fieldValue)
    }
    setValue(fieldValue)
    setLatexMode(/\$(.*?)\$/.test(fieldValue))
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
      <div className='col-md-6 '>
        {(props.inputType === 'textarea') &&
          (latexMode 
            ? <LatexRender text={value} /> 
            : <textarea
              id={props.inputName}
              name={props.inputName}
              className='form-control'
              rows={props.rows}
              cols={props.cols}
              placeholder={props.placeholder}
              value={value}
              onChange={handleOnFieldChange}
              onBlur={handleOnFieldBlur}
              onFocus={() => setLatexMode(false)}
              disabled={props.disabled}
            >
              {props.value}
            </textarea>
          )
        }
        {(props.inputType !== 'textarea') &&
          (latexMode 
            ? <LatexRender text={value} /> 
            : <input
              id={props.inputName}
              name={props.inputName}
              className='form-control'
              type={props.inputType}
              selected={props.defaultValue}
              value={value}
              checked={checked}
              onChange={handleOnFieldChange}
              onBlur={handleOnFieldBlur}
              onFocus={() => setLatexMode(false)}
              disabled={props.disabled}
            />
          )
        }
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        {props.imageUrl && <Button variant='primary' onClick={() => setImagePreviewUrl(value)}>Preview</Button>}
        <FormFieldValidator invalid={!isValid} className='col-md-3' message={props.validatorMessage} />
        {imagePreviewUrl && isValid &&
          <FormFieldWideRow className='text-center'>
            <img src={imagePreviewUrl} alt='Submission thumbnail preview' className='submission-image' />
          </FormFieldWideRow>}
      </Suspense>
    </div>
  )
}

export default FormFieldRow
