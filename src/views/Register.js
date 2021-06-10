import axios from 'axios'
import React from 'react';
import config from './../config';
import FormFieldInputRow from '../components/FormFieldRow';
import FormFieldValidator from '../components/FormFieldValidator';

const usernameMissingError  = 'Username cannot be blank.';
const emailBadFormatError   = 'Email is blank or invalid.';
const passwordInvalidError  = 'Password is too short.';
const passwordMismatchError = 'Confirm does not match.';

const usernameValidRegex = /^(?!\s*$).+/;
const emailValidRegex    = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordValidRegex = /.{8,}/;

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirm: ''
    };

    this.onChange     = this.onChange.bind(this)
    this.isAllValid   = this.isAllValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange(field, value, isValid) {
    // parent class change handler is always called with field name and value
    this.setState({[field]: value});
  }

  isPasswordMatch() {
    return !passwordValidRegex.test(this.state.password)
      || (this.state.password === this.state.passwordConfirm);
  }

  isAllValid() {
    if (!usernameValidRegex.test(this.state.username)) {
      return false;
    }
    if (!emailValidRegex.test(this.state.email)) {
      return false;
    }
    if (!passwordValidRegex.test(this.state.password)) {
      return false;
    }
    if (!passwordValidRegex.test(this.state.passwordConfirm)) {
      return false;
    }
    if (!this.isPasswordMatch()) {
      return false;
    }

    return true;
  }

  handleSubmit(event) {
    if (this.isAllValid()) {
      event.preventDefault();
      return;
    }

    axios.post(config.api.getUriPrefix() + '/register', this.state)
      .then(res => { alert(res.message); })
      .catch(err => { alert(err.message); });
    event.preventDefault();
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
            validRegex={emailValidRegex}/>
          <FormFieldInputRow inputId="password-input" label="Password"
            validatorMessage={passwordInvalidError}
            onChange={this.onChange}
            validRegex={passwordValidRegex}/>
          <FormFieldInputRow inputId="password-confirm-input" label="Password Confirm"
            validatorMessage={passwordInvalidError}
            onChange={this.onChange}
            validRegex={passwordValidRegex}/>
          <div className="row">
            <div className="col-md-3"/>
            <FormFieldValidator className="col-md-6" invalid={!this.isPasswordMatch()} message={passwordMismatchError} />
            <div className="col-md-3"/>
          </div>
          <div className="row">
            <div className="col-md-12 justify-content-center"/>
              <input className="btn btn-primary" type="submit" value="Submit" />
            </div>
        </form>
      </div>
    );
  }
}

export default Register;