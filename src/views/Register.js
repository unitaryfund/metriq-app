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

  handleSubmit(event) {
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