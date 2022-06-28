import React from 'react'
import { Button } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { Typeahead } from 'react-bootstrap-typeahead'
import FormFieldValidator from './FormFieldValidator'

class FormFieldTypeaheadRow extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: this.props.defaultValue ? this.props.defaultValue : ''
    }

    this.typeahead = null;

    this.handleOnFieldChange = this.handleOnFieldChange.bind(this)
    this.handleOnFieldBlur = this.handleOnFieldBlur.bind(this)
    this.handleOnButtonClick = this.handleOnButtonClick.bind(this)
    this.isValidValue = this.isValidValue.bind(this)
  }

  isValidValue (value) {
    if (!this.props.validRegex) {
      return true
    }
    return this.props.validRegex.test(value)
  }

  handleOnFieldChange (input) {
    // for a regular input field, read field name and value from the event
    const fieldName = this.props.inputName
    const fieldValue = input
    this.setState({ value: fieldValue })
    if (this.isValidValue(fieldValue)) {
      this.setState({ invalid: false })
    }
    if (this.props.inputName) {
      this.props.onChange(fieldName, fieldValue)
    }
  }

  handleOnFieldBlur (event) {
    this.setState({ invalid: !this.isValidValue(this.state.value) })
  }

  handleOnButtonClick () {
    const value = this.state.value
    if (this.typeahead) {
      const typeahead = this.typeahead.getInstance()
      typeahead.clear()
      typeahead.focus()
    }
    this.setState({ value: ''})
    this.props.onClickButton(value)
  }

  render () {
    return (
      <div className='row'>
        {this.props.tooltip &&
          <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>{this.props.tooltip}</Tooltip>}>
            <span htmlFor={this.props.inputName} className='col-md-3 form-field-label' dangerouslySetInnerHTML={{ __html: this.props.label }} />
          </OverlayTrigger>}
        {!this.props.tooltip &&
          <label htmlFor={this.props.inputName} className='col-md-3 form-field-label' dangerouslySetInnerHTML={{ __html: this.props.label }} />}
        <Typeahead
          ref={(ref) => this.typeahead = ref}
          id={this.props.inputName}
          name={this.props.inputName}
          labelKey={this.props.labelKey ? this.props.labelKey : undefined}
          className='col-md-6'
          options={this.props.options}
          defaultSelected={[this.props.value ? this.props.value : '']}
          onChange={selected => {
            this.handleOnFieldChange(selected[0])
            if (this.props.onSelect) {
              this.props.onSelect(selected[0])
            }
          }}
          onInputChange={(input, event) => this.handleOnFieldChange(input)}
          onBlur={this.handleOnFieldBlur}
        />
        {this.props.onClickButton ? <Button variant='primary' onClick={this.handleOnButtonClick} disabled={!this.state.value}>{this.props.buttonLabel ? this.props.buttonLabel : 'Add'}</Button> : <FormFieldValidator invalid={this.state.invalid} className='col-md-3' message={this.props.validatorMessage} />}
        <FormFieldValidator invalid={this.state.invalid} className='col-md-3' message={this.props.validatorMessage} />
      </div>
    )
  }
};

export default FormFieldTypeaheadRow
