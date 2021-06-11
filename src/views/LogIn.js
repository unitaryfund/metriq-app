import axios from 'axios'
import React from 'react';
import { Link } from "react-router-dom"
import config from './../config';
import FormFieldInputRow from '../components/FormFieldRow';
import FormFieldValidator from '../components/FormFieldValidator';

const usernameMissingError  = 'Username cannot be blank.';
const passwordInvalidError  = 'Password is too short.';
const usernamePasswordMismatchError = 'Confirm does not match.';

const usernameValidRegex = /^(?!\s*$).+/;
const passwordValidRegex = /.{8,}/;

class LogIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isUsernamePasswordMatch: true
    };

    this.onChange                = this.onChange.bind(this);
    this.isUsernamePasswordMatch = this.isUsernamePasswordMatch.bind(this);
    this.isAllValid              = this.isAllValid.bind(this);
    this.handleSubmit            = this.handleSubmit.bind(this);
  }

  onChange(field, value) {
    // parent class change handler is always called with field name and value
    this.setState({[field]: value});
  }

  isUsernamePasswordMatch() {
    // TODO: Call to DB to see if this.state.username and 
    // this.state.password match.
  }

  isAllValid() {
    if (!usernameValidRegex.test(this.state.username)) {
      return false;
    }
    if (!passwordValidRegex.test(this.state.password)) {
      return false;
    }
    if (!this.isUsernamePasswordMatch()) {
      return false;
    }

    return true;
  }

  handleSubmit(event) {
    if (this.isAllValid()) {
      event.preventDefault();
      return;
    }

    axios.post(config.api.getUriPrefix() + '/login', this.state)
      .then(res => { alert(res.message); })
      .catch(err => { alert(err.message); });
    event.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <header>Test - LogIn</header>
        <form onSubmit={this.handleSubmit}>
          <FormFieldInputRow inputName="username" inputType="text" label="Username"
            validatorMessage={usernameMissingError}
            onChange={this.onChange}
            validRegex={usernameValidRegex}/>
          <FormFieldInputRow inputName="password" inputType="password" label="Password"
            validatorMessage={passwordInvalidError}
            onChange={this.onChange}
            validRegex={passwordValidRegex}/>
          <div className="row">
            <div className="col-md-3"/>
            <div className="col-md-6">
              <FormFieldValidator invalid={!this.state.isUsernamePasswordMatch} message={usernamePasswordMismatchError} />
            </div>
            <div className="col-md-3"/>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <input className="btn btn-primary" type="submit" value="Submit" />
            </div>
          </div>
        </form>
        <Link to="/Register">Create a new account</Link>
      </div>
    );
  }
}

export default LogIn;