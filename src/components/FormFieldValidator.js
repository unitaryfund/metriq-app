import React from 'react';

const FormFieldValidator = (props) => {
    if (!props.invalid) {
        return <div className="hide"/>;
    }
    return (
        <h5 className="form-field-validator">
            *{props.message}
        </h5>
    );
};

export default FormFieldValidator;