import axios from 'axios'
import React from 'react';
import config from './../config';

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirm: ''
    };

    this.handleUsernameChange        = this.handleUsernameChange.bind(this);
    this.handleEmailChange           = this.handleEmailChange.bind(this);
    this.handlePasswordChange        = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
    this.handleValidation            = this.handleValidation.bind(this);
    this.handleSubmit                = this.handleSubmit.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handlePasswordConfirmChange(event) {
    this.setState({passwordConfirm: event.target.value});
  }

  handleValidation() {
    let errors = {};
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!this.state.email) {
      errors.email = 'Email is required.';
    }
    if (!re.test(this.state.email)) {
      errors.email = 'Invalid email format';
    }
    if (!this.state.username) {
      errors.username = 'Username cannot be blank';
    }
    if (this.state.password.length < 8) {
      errors.password = 'Password is too short.'
    }
    if (this.state.password !== this.state.passwordConfirm) {
      errors.password = 'Passwords do not match.'
    }

    return errors;
  }

  handleSubmit(event) {
    axios.post(config.api.getUriPrefix() + '/register', this.state)
      .then(res => { alert(res.message); })
      .catch(err => { alert(err.message); });
    event.preventDefault();
    let errors = this.handleValidation();
    if(errors.length === 0){
      // Validation successful.
      // TODO: Create JSON model from form
    } else {
      // Validation failure.
      // TODO: Right now, this just shows an alert of all the things that
      // failed--present this to the user in a "better" way?
      alert(JSON.stringify(errors));
    }
  }

  render() {
    return (
      <div className="container">
        <header>Test - Register</header>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <label htmlFor="username-input" className="col-md-3">Username:</label>
            <input id="username-input" className="col-md-9" type="text" value={this.state.username} onChange={this.handleUsernameChange} />
          </div>
          <div className="row">
            <label htmlFor="email-input" className="col-md-3">Email:</label>
            <input id="email-input" className="col-md-9" type="email" value={this.state.email} onChange={this.handleEmailChange} />
          </div>
          <div className="row">
            <label htmlFor="password-input" className="col-md-3">Password:</label>
            <input id="password-input" className="col-md-9" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
          </div>
          <div className="row">
            <label htmlFor="password-confirm-input" className="col-md-3">Password Confirmation:</label>
            <input id="password-confirm-input" className="col-md-9" type="password" value={this.state.passwordConfirm} onChange={this.handlePasswordConfirmChange} />
          </div>
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