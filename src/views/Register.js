import axios from 'axios'
import React from 'react';
import config from './../config';
import FormFieldInputRow from '../components/FormFieldRow';

const emailMissingError     = 'Email is required.';
const emailBadFormatError   = 'Email format is invalid.';
const usernameMissingError  = 'Username cannot be blank.';
const passwordInvalidError  = 'Password is too short.';
const passwordMismatchError = 'Confirm does not match.';

const usernameValidRegex = /^(?!\s*$).+/;

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirm: ''
    };

    this.onChange                      = this.onChange.bind(this)

    this.handleAllValidate             = this.handleAllValidate.bind(this);

    this.handleSubmit                  = this.handleSubmit.bind(this);
  }

  onChange(field, value) {
    // parent class change handler is always called with field name and value
    this.setState({[field]: value});
  }

  handleAllValidate() {
    let errors = {};
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!this.state.email) {
      errors.email = emailMissingError;
    }
    if (!re.test(this.state.email)) {
      errors.email = emailBadFormatError;
    }
    if (!this.state.username) {
      errors.username = usernameMissingError;
    }
    if (this.state.password.length < 8) {
      errors.password = passwordInvalidError;
    }
    if (this.state.password !== this.state.passwordConfirm) {
      errors.password = passwordMismatchError;
    }

    return errors;
  }

  handleSubmit(event) {
    axios.post(config.api.getUriPrefix() + '/register', this.state)
      .then(res => { alert(res.message); })
      .catch(err => { alert(err.message); });
    event.preventDefault();
    let errors = this.handleAllValidate();
    if(Object.keys(errors).length === 0){
      // Validation successful.
      // TODO: Create JSON model from form
    } else {
      // Validation failure.
      alert(JSON.stringify(errors));
    }
  }

  render() {
    return (
      <div className="container">
        <header>Test - Register</header>
        <form onSubmit={this.handleSubmit}>
          <FormFieldInputRow inputId="username-input" label="Username"
            validatorMessage={usernameMissingError}
            onChange={this.onChange}
            validRegex={usernameValidRegex}/>
          <FormFieldInputRow inputId="email-input" label="Email"
            validatorMessage={emailBadFormatError}
            onChange={this.onChange}
            validRegex={usernameValidRegex}/>
          <FormFieldInputRow inputId="password-input" label="Password"
            validatorMessage={passwordInvalidError}
            onChange={this.onChange}
            validRegex={usernameValidRegex}/>
          <FormFieldInputRow inputId="password-confirm-input" label="Password Confirm"
            validatorMessage={passwordMismatchError}
            onChange={this.onChange}
            validRegex={usernameValidRegex}/>
          <div className="row">
            <div className="col-md-3"/>
            <div className="col-md-9">
              <input className="btn btn-primary float-left" type="submit" value="Submit" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;