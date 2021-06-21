import './App.css'
import config from './config'
import axios from 'axios'
import React from 'react'
import MainNavbar from './components/MainNavbar'
import MainRouter from './MainRouter'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoggedIn: false
    }

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.checkLogin = this.checkLogin.bind(this)

    axios.get(config.api.getUriPrefix() + '/api/csrf-token')
      .then(res => {
        axios.defaults.headers.post['X-CSRF-Token'] = res.csrfToken
        this.checkLogin()
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.handleLogout()
        }
      })
  }

  checkLogin () {
    axios.get(config.api.getUriPrefix() + '/user')
      .then(res => {
        this.handleLogin()
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.handleLogout()
        }
      })
  }

  handleLogin () {
    this.setState({ isLoggedIn: true })
  }

  handleLogout () {
    this.setState({ isLoggedIn: false })
  }

  render () {
    return (
      <div className='App'>
        <MainNavbar isLoggedIn={this.state.isLoggedIn} />
        <MainRouter isLoggedIn={this.state.isLoggedIn} onLogin={this.handleLogin} onLogout={this.handleLogout} />
      </div>
    )
  }
}

export default App
