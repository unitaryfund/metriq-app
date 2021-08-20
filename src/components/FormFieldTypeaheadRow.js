import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { Typeahead } from 'react-bootstrap-typeahead'
import FormFieldValidator from './FormFieldValidator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faInfoCircle)

class FormFieldTypeaheadRow extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: this.props.defaultValue ? this.props.defaultValue : ''
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

  handleOnFieldChange (input) {
    // for a regular input field, read field name and value from the event
    const fieldName = this.props.inputName
    const fieldValue = input
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
        <div className='col-md-3'>
          <label htmlFor={this.props.inputName}>{this.props.label}</label>
        </div>
        <Typeahead
          id={this.props.inputName}
          name={this.props.inputName}
          className='col-md-6'
          options={this.props.options}
          defaultSelected={[this.props.value ? this.props.value : '']}
          onChange={selected => this.handleOnFieldChange(selected[0])}
          onInputChange={(input, event) => this.handleOnFieldChange(input)}
          onBlur={this.handleOnFieldBlur}
        />
        <div className='col-md-3'>
          {this.props.tooltip &&
            <OverlayTrigger placement='top' overlay={props => <Tooltip {...props}>{this.props.tooltip}</Tooltip>}>
              <FontAwesomeIcon icon='info-circle' />
            </OverlayTrigger>}
          <FormFieldValidator invalid={this.state.invalid} message={this.props.validatorMessage} />
        </div>
      </div>
    )
  }
};

export default FormFieldTypeaheadRow
