import axios from 'axios'
import { useEffect } from 'react'
import './App.css'
import MainNavbar from './components/MainNavbar'
import config from './config'
import MainRouter from './MainRouter'

const App = () => {
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get(config.api.getUriPrefix() + '/api/csrf-token')
      axios.defaults.headers.post['X-CSRF-Token'] = data.csrfToken
    }
    getCsrfToken()
  }, [])
  return (
    <div className='App'>
      <MainNavbar />
      <MainRouter />
    </div>
  )
}

export default App
