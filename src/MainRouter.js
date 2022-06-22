import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Home from './views/Home'
import LogIn from './views/LogIn'
import Register from './views/Register'
import Delete from './views/Delete'
import Forgot from './views/Forgot'
import Recover from './views/Recover'
import About from './views/About'
import Partners from './views/Partners'
import FAQ from './views/FAQ'
import Profile from './views/Profile'
import AddSubmission from './views/AddSubmission'
import Submissions from './views/Submissions'
import SubmissionsPublic from './views/SubmissionsPublic'
import Token from './views/Token'
import Password from './views/Password'
import Methods from './views/Methods'
import Tasks from './views/Tasks'
import Platforms from './views/Platforms'
import Tags from './views/Tags'
import Submission from './views/Submission'
import Method from './views/Method'
import Task from './views/Task'
import Platform from './views/Platform'
import NotFound from './views/NotFound'
import UserGuidelines from './views/UserGuidelines'

const MainRouter = (props) => {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path='/'
        >
          <Home isLoggedIn={props.isLoggedIn} />
        </Route>
        <Route
          exact
          path='/Methods'
        >
          <Methods isLoggedIn={props.isLoggedIn} />
        </Route>
        <Route
          exact
          path='/Tasks'
        >
          <Tasks isLoggedIn={props.isLoggedIn} />
        </Route>
        <Route
          exact
          path='/Platforms'
        >
          <Platforms isLoggedIn={props.isLoggedIn} />
        </Route>
        <Route
          exact
          path='/Tags'
        >
          <Tags isLoggedIn={props.isLoggedIn} />
        </Route>
        <Route
          exact
          path='/Login/:next'
          render={p => props.isLoggedIn ? <Redirect to={'/' + decodeURIComponent(p.match.params.next)} /> : <LogIn {...props} next={p.match.params.next} />}
        />
        <Route
          exact
          path='/Login'
        >
          {props.isLoggedIn ? <Redirect to='/' /> : <LogIn onLogin={props.onLogin} />}
        </Route>
        <Route
          exact
          path='/Register/:next'
          render={p => props.isLoggedIn ? <Redirect to={'/' + decodeURIComponent(p.match.params.next)} /> : <Register {...props} />}
        />
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
          {props.isLoggedIn ? <Delete isLoggedIn onLogout={props.onLogout} /> : <Redirect to='/Login' />}
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
          path='/Partners'
          component={Partners}
        />
        <Route
          exact
          path='/FAQ'
          component={FAQ}
        />
        <Route
          exact
          path='/UserGuidelines'
          component={UserGuidelines}
        />
        <Route
          exact
          path='/Profile'
          component={Profile}
        />
        <Route
          exact
          path='/AddSubmission'
          render={(p) => <AddSubmission {...p} isLoggedIn={props.isLoggedIn} />}
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
        <Route
          exact
          path='/Password'
          component={Password}
        />
        <Route
          exact
          path='/Tag/:tag'
          render={(p) => <Home {...p} onLogin={props.onLogin} />}
        />
        <Route
          exact
          path='/Submission/:id'
          render={(p) => <Submission {...p} isLoggedIn={props.isLoggedIn} onLogin={props.onLogin} />}
        />
        <Route
          exact
          path='/User/:userId/Submissions'
          render={(p) => <SubmissionsPublic {...p} isLoggedIn={props.isLoggedIn} onLogin={props.onLogin} />}
        />
        <Route
          exact
          path='/Method/:id'
          render={(p) => <Method {...p} isLoggedIn={props.isLoggedIn} onLogin={props.onLogin} />}
        />
        <Route
          exact
          path='/Task/:id'
          render={(p) => <Task {...p} isLoggedIn={props.isLoggedIn} onLogin={props.onLogin} />}
        />
        <Route
          exact
          path='/Platform/:id'
          render={(p) => <Platform {...p} isLoggedIn={props.isLoggedIn} onLogin={props.onLogin} />}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default MainRouter
