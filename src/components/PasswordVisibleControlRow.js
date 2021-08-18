import React from 'react'

class PasswordVisibleControlRow extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: this.props.defaultValue ? this.props.defaultValue : ''
    }

    this.handleOnFieldChange = this.handleOnFieldChange.bind(this)
  }

  handleOnFieldChange (event) {
    // For a regular input field, read field name and value from the event.
    const fieldName = event.target.name
    const fieldValue = event.target.checked
    this.setState({ value: fieldValue })
    this.props.onChange(fieldName, fieldValue)
  }

  render () {
    return (
      <div className='row'>
        <div className='col text-center'>
          <input
            id={this.props.inputName}
            name={this.props.inputName}
            className='password-visible-checkbox'
            type='checkbox'
            checked={this.props.defaultValue}
            onChange={this.handleOnFieldChange}
          />&nbsp;
          <label htmlFor={this.props.inputName}>Show Password</label>
        </div>
      </div>
    )
  }
}

export default PasswordVisibleControlRow
