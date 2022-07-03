import './App.css'
import config from './config'
import axios from 'axios'
import React, { useState } from 'react'
import MainNavbar from './components/MainNavbar'
import MainRouter from './MainRouter'
import SimpleReactFooter from './components/simple-react-footer/SimpleReactFooter'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  axios.get(config.api.getUriPrefix() + '/user')
    .then(res => {
      handleLogin()
    })
    .catch(err => {
      if (!err || !err.response || err.response.status === 401) {
        handleLogout()
      }
    })

  return (
    <div className='App'>
      <MainNavbar isLoggedIn={isLoggedIn} title='Community-driven Quantum Benchmarks' subtitle={<span><a href='/'>Submissions</a> show performance of <a href='/Methods/'>methods</a> against <a href='/Tasks/'>tasks</a></span>} />
      <MainRouter id='metriq-main-content' isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
      <div className='footer-shim' />
      <SimpleReactFooter
        title='metriq'
        description='Quantum computing benchmarks by community contributors'
        copyright='2021, 2022 Unitary Fund'
        discord='unitary.fund'
        github='unitaryfund'
        twitch='unitaryfund'
        twitter='unitaryfund'
        youtube='UCDbDLAzGRTHnhkoMMOX7D1A'
        linkedin='unitary-fund'
        backgroundColor='#212529'
        fontColor='#FFFFFF'
        iconColor='#FFFFFF'
        columns={[]}
      />
    </div>
  )
}

export default App
