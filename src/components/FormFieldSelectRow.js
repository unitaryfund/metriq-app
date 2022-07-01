import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { Button } from 'react-bootstrap'

class FormFieldSelectRow extends React.Component {
  constructor (props) {
    super(props)

    const options = this.props.options
    if (options.length && options[0].top !== undefined) {
      options.sort((a, b) => (a.top < b.top) ? 1 : -1)
      const specialOptions = options.filter(x => x.top === 1)
      const commonOptions = options.filter(x => x.top === 0)

      this.state = {
        value: this.props.defaultValue ? this.props.defaultValue : '',
        specialOptions: specialOptions,
        commonOptions: commonOptions
      }
    } else {
      this.state = {
        value: this.props.defaultValue ? this.props.defaultValue : '',
        specialOptions: {},
        commonOptions: options
      }
    }

    this.handleOnFieldChange = this.handleOnFieldChange.bind(this)
    this.handleOnFieldBlur = this.handleOnFieldBlur.bind(this)
    this.isValidValue = this.isValidValue.bind(this)
  }

  isValidValue (value) {
    if (!this.props.validRegex) {
      return true
    }
    return this.props.validRegex.test(value)
  }

  handleOnFieldChange (event) {
    // For a regular input field, read field name and value from the event.
    const fieldName = event.target.name
    const fieldValue = event.target.value
    this.setState({ value: fieldValue })
    if (this.isValidValue(fieldValue)) {
      this.setState({ invalid: false })
    }
    this.props.onChange(fieldName, fieldValue)
  }

  handleOnFieldBlur (event) {
    this.setState({ invalid: !this.isValidValue(this.state.value) })
  }

  render () {
    return (
      <div className='row'>
        {this.props.tooltip &&
          <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>{this.props.tooltip}</Tooltip>}>
            <span htmlFor={this.props.inputName} className={this.props.labelClass ? 'col-md-3 form-field-label ' + this.props.labelClass : 'col-md-3 form-field-label'} dangerouslySetInnerHTML={{ __html: this.props.label }} />
          </OverlayTrigger>}
        {!this.props.tooltip &&
          <label htmlFor={this.props.inputName} className={this.props.labelClass ? 'col-md-3 form-field-label ' + this.props.labelClass : 'col-md-3 form-field-label'} dangerouslySetInnerHTML={{ __html: this.props.label }} />}
        <div className='col-md-6'>
          <select
            id={this.props.inputName}
            name={this.props.inputName}
            className='form-control'
            onChange={this.handleOnFieldChange}
            onBlur={this.handleOnFieldBlur}
            disabled={this.props.disabled}
            value={this.props.value}
          >
            {this.props.isNullDefault &&
              <option value=''>(None)</option>}
            {this.state.specialOptions.length &&
              <optgroup label={this.props.specialOptGrouplabel ? this.props.specialOptGrouplabel : 'Special'}>
                {this.state.specialOptions.map(option => <option key={option.id} value={option.id} className='bold'>{option.name}</option>)}
              </optgroup>}
            {this.state.commonOptions.length && this.state.commonOptions.map(option =>
              <option key={option.id} value={option.id} className='bold'>{option.name}</option>
            )}
          </select>
        </div>
        {this.props.onClickButton && <Button variant='primary' onClick={() => this.props.onClickButton(this.state.value)}>{this.props.buttonLabel ? this.props.buttonLabel : 'Add'}</Button>}
      </div>
    )
  }
};

export default FormFieldSelectRow
