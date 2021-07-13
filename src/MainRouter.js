import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import Home from './views/Home'
import LogIn from './views/LogIn'
import Register from './views/Register'
import Delete from './views/Delete'
import Forgot from './views/Forgot'
import Recover from './views/Recover'
import About from './views/About'
import Contact from './views/Contact'
import Profile from './views/Profile'
import Submissions from './views/Submissions'
import Token from './views/Token'

const MainRouter = (props) => {
  return (
    <Router>
      <Route
        exact
        path='/'
      >
        <Home isLoggedIn={props.isLoggedIn} />
      </Route>
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
        path='/Delete'
      >
        {!props.isLoggedIn ? <Redirect to='/' /> : <Delete onLogout={props.onLogout} />}
      </Route>
      <Route
        exact
        path='/Forgot'
        component={Forgot}
      />
      <Route
        exact
        path='/Recover/:username/:uuid'
        render={(p) => <Recover {...p} onLogin={props.onLogin} />}
      />
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
        path='/Submissions'
        component={Submissions}
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
