import './App.css'
import config from './config'
import axios from 'axios'
import React from 'react'
import MainNavbar from './components/MainNavbar'
import MainRouter from './MainRouter'
import SimpleReactFooter from './components/simple-react-footer/SimpleReactFooter'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      userId: ''
    }

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount () {
    axios.get(config.api.getUriPrefix() + '/user')
      .then(res => {
        this.handleLogin()
      })
      .catch(err => {
        if (!err || !err.response || err.response.status === 401) {
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
        <MainNavbar isLoggedIn={this.state.isLoggedIn} title='Community-driven Quantum Benchmarks' subtitle={<span><a href='/'>Submissions</a> show performance of <a href='/Methods/'>methods</a> against <a href='/Tasks/'>tasks</a></span>} />
        <MainRouter id='metriq-main-content' isLoggedIn={this.state.isLoggedIn} onLogin={this.handleLogin} onLogout={this.handleLogout} />
        <SimpleReactFooter
          title='metriq'
          description='Quantum computing benchmarks by community contributors'
          copyright='2021 Unitary Fund'
          discord='unitary.fund'
          github='unitaryfund'
          twitch='unitaryfund'
          twitter='unitaryfund'
          youtube='UCDbDLAzGRTHnhkoMMOX7D1A'
          linkedin='unitary-fund'
          backgroundColor='#f8f9fa'
          columns={[]}
        />
      </div>
    )
  }
}

export default App
