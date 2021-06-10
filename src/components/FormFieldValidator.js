import React from 'react';

const FormFieldValidator = (props) => {
    if (!props.invalid) {
        return <div className="hide"/>;
    }
    return (
        <div className="form-field-validator">
            *{props.message}
        </div>
    );
};

export default FormFieldValidator;