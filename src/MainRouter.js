import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import Home from './views/Home'
import LogIn from './views/LogIn'
import Register from './views/Register'
import About from './views/About'
import Contact from './views/Contact'
import Profile from './views/Profile'
import Token from './views/Token'

const MainRouter = (props) => {
  return (
    <Router>
      <Route
        exact
        path='/'
        component={Home}
      />
      <Route
        exact
        path='/Login'
      >
        {props.isLoggedIn ? <Redirect to='/' /> : <LogIn onLogin={props.onLogin} />}
      </Route>
      <Route
        exact
        path='/Register'
      >
        {props.isLoggedIn ? <Redirect to='/' /> : <Register onLogin={props.onLogin} />}
      </Route>
      <Route
        exact
        path='/About'
        component={About}
      />
      <Route
        exact
        path='/Contact'
        component={Contact}
      />
      <Route
        exact
        path='/Profile'
        component={Profile}
      />
      <Route
        exact
        path='/Token'
        component={Token}
      />
    </Router>
  )
}

export default MainRouter
