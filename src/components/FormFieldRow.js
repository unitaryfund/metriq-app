import React from 'react';
import FormFieldValidator from './FormFieldValidator';

class FormFieldInputRow extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            value: ''
        };

        this.onFieldChange = this.onFieldChange.bind(this);
        this.onFieldBlur   = this.onFieldBlur.bind(this);
        this.isValidValue  = this.isValidValue.bind(this);
    }

    isValidValue(value) {
        return this.props.validRegex.test(value);
    }

    onFieldChange(event) {
        // for a regular input field, read field name and value from the event
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.setState({ value: fieldValue });
        this.setState({ invalid: !this.isValidValue(fieldValue) });
        this.props.onChange(fieldName, fieldValue);
    }

    onFieldBlur(event) {
        this.setState({ invalid: !this.isValidValue(this.state.value) });
    }

    render () {
        return (
            <div className="row">
                <label htmlFor={this.props.inputId} className="col-md-3">{this.props.label}</label>
                <input id={this.props.inputId} className="col-md-6" type={this.props.inputType} value={this.props.value} onChange={this.onFieldChange} onBlur={this.onFieldBlur} />
                <FormFieldValidator invalid={this.state.invalid} className="col-md-3" message={this.props.validatorMessage}/>
            </div>
        );
    }
};

export default FormFieldInputRow;