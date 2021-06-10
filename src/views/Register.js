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
      passwordConfirm: '',
      isPasswordMatch: true
    };

    this.onChange                = this.onChange.bind(this);
    this.onChangePassword        = this.onChangePassword.bind(this);
    this.onChangePasswordConfirm = this.onChangePasswordConfirm.bind(this);
    this.isPasswordMatch         = this.isPasswordMatch.bind(this);
    this.isAllValid              = this.isAllValid.bind(this);
    this.handleSubmit            = this.handleSubmit.bind(this);
  }

  onChange(field, value) {
    // parent class change handler is always called with field name and value
    this.setState({[field]: value});
  }

  onChangePassword(field, value) {
    // parent class change handler is always called with field name and value
    this.onChange(field, value);
    this.setState({ isPasswordMatch: this.isPasswordMatch(value, this.state.passwordConfirm) });
  }

  onChangePasswordConfirm(field, value) {
    // parent class change handler is always called with field name and value
    this.onChange(field, value);
    this.setState({ isPasswordMatch: this.isPasswordMatch(this.state.password, value) });
  }

  isPasswordMatch(password, passwordConfirm) {
    return !passwordValidRegex.test(password) || (password === passwordConfirm);
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
          <FormFieldInputRow inputName="username" inputType="text" label="Username"
            validatorMessage={usernameMissingError}
            onChange={this.onChange}
            validRegex={usernameValidRegex}/>
          <FormFieldInputRow inputName="email" inputType="email" label="Email"
            validatorMessage={emailBadFormatError}
            onChange={this.onChange}
            validRegex={emailValidRegex}/>
          <FormFieldInputRow inputName="password" inputType="password" label="Password"
            validatorMessage={passwordInvalidError}
            onChange={this.onChangePassword}
            validRegex={passwordValidRegex}/>
          <FormFieldInputRow inputName="passwordConfirm" inputType="password" label="Password Confirm"
            validatorMessage={passwordInvalidError}
            onChange={this.onChangePasswordConfirm}
            validRegex={passwordValidRegex}/>
          <div className="row">
            <div className="col-md-3"/>
            <div className="col-md-6">
              <FormFieldValidator invalid={!this.state.isPasswordMatch} message={passwordMismatchError} />
            </div>
            <div className="col-md-3"/>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <input className="btn btn-primary" type="submit" value="Submit" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;