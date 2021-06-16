import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './views/Home'
import LogIn from './views/LogIn'
import Register from './views/Register'
import About from './views/About'
import Contact from './views/Contact'

const MainRouter = () => {
  return (
    <Router>
      <Route
        path='/'
        component={Home}
        exact
      />
      <Route
        path='/Login'
        component={LogIn}
        exact
      />
      <Route
        path='/Register'
        component={Register}
        exact
      />
      <Route
        path='/About'
        component={About}
        exact
      />
      <Route
        path='/Contact'
        component={Contact}
        exact
      />
    </Router>
  )
}

export default MainRouter
