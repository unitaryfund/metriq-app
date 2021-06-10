import React from 'react';

class FormFieldInputRow extends React.Component {

    constructor (props) {
        super(props);

        this.onFieldChange = this.onFieldChange.bind(this);
    }

    onFieldChange(event) {
        // for a regular input field, read field name and value from the event
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.props.onChange(fieldName, fieldValue);
    }

    render () {
        return (
            <div className="row">
                <label htmlFor={this.props.inputId} className="col-md-3">{this.props.label}</label>
                <input id={this.props.inputId} className="col-md-9" type="text" value={this.props.value} onChange={this.onFieldChange} />
            </div>
        );
    }
};

export default FormFieldInputRow;