import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import React, { useState } from 'react'
import config from './config'
import Home from './views/Home'
import LogIn from './views/LogIn'
import Register from './views/Register'
import Delete from './views/Delete'
import EditDetails from './views/EditDetails'
import Forgot from './views/Forgot'
import Recover from './views/Recover'
import About from './views/About'
import Partners from './views/Partners'
import FAQ from './views/FAQ'
import Profile from './views/Profile'
import AddSubmission from './views/AddSubmission'
import MySubmissions from './views/MySubmissions'
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
import MainNavbar from './components/MainNavbar'

const MainRouter = (props) => {
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
    <Router>
      <MainNavbar isLoggedIn={isLoggedIn} title='Community-driven Quantum Benchmarks' subtitle={<span><a href='/'>Submissions</a> show performance of <a href='/Methods/'>methods</a> on <a href='/Platforms/'>platforms</a> against <a href='/Tasks/'>tasks</a></span>} />
      <Switch>
        <Route
          exact
          path='/'
        >
          <Home isLoggedIn={isLoggedIn} />
        </Route>
        <Route
          exact
          path='/Trending'
        >
          <Home isLoggedIn={isLoggedIn} tabKey='Trending' />
        </Route>
        <Route
          exact
          path='/Popular'
        >
          <Home isLoggedIn={isLoggedIn} tabKey='Popular' />
        </Route>
        <Route
          exact
          path='/Latest'
        >
          <Home isLoggedIn={isLoggedIn} tabKey='Latest' />
        </Route>
        <Route
          exact
          path='/Methods'
        >
          <Methods isLoggedIn={isLoggedIn} />
        </Route>
        <Route
          exact
          path='/Tasks'
        >
          <Tasks isLoggedIn={isLoggedIn} />
        </Route>
        <Route
          exact
          path='/Platforms'
        >
          <Platforms isLoggedIn={isLoggedIn} />
        </Route>
        <Route
          exact
          path='/Tags'
        >
          <Tags isLoggedIn={isLoggedIn} />
        </Route>
        <Route
          exact
          path='/Login/:next'
          render={p => isLoggedIn ? <Redirect to={'/' + decodeURIComponent(p.match.params.next)} /> : <LogIn {...props} onLogin={handleLogin} next={p.match.params.next} />}
        />
        <Route
          exact
          path='/Login'
        >
          {isLoggedIn ? <Redirect to='/' /> : <LogIn onLogin={handleLogin} />}
        </Route>
        <Route
          exact
          path='/Register/:next'
          render={p => isLoggedIn ? <Redirect to={'/' + decodeURIComponent(p.match.params.next)} /> : <Register {...props} />}
        />
        <Route
          exact
          path='/Register'
        >
          {isLoggedIn ? <Redirect to='/' /> : <Register onLogin={handleLogin} />}
        </Route>
        <Route
          exact
          path='/Delete'
        >
          {isLoggedIn ? <Delete isLoggedIn onLogout={handleLogout} /> : <Redirect to='/Login' />}
        </Route>
        <Route
          exact
          path='/Forgot'
          component={Forgot}
        />
        <Route
          exact
          path='/Recover/:username/:uuid'
          render={(p) => <Recover {...p} onLogin={handleLogin} />}
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
          render={(p) => <AddSubmission {...p} isLoggedIn={isLoggedIn} />}
        />
        <Route
          exact
          path='/Submissions'
          component={MySubmissions}
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
          path='/EditDetails'
          component={EditDetails}
        />
        <Route
          exact
          path='/Tag/:tag'
          render={(p) => <Home {...p} onLogin={handleLogin} isTag />}
        />
        <Route
          exact
          path='/Tag/:tag/Trending'
          render={(p) => <Home {...p} onLogin={handleLogin} tabKey='Trending' />}
        />
        <Route
          exact
          path='/Tag/:tag/Popular'
          render={(p) => <Home {...p} onLogin={handleLogin} tabKey='Popular' />}
        />
        <Route
          exact
          path='/Tag/:tag/Latest'
          render={(p) => <Home {...p} onLogin={handleLogin} tabKey='Latest' />}
        />
        <Route
          exact
          path='/Submission/:id'
          render={(p) => <Submission {...p} isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
        />
        <Route
          exact
          path='/User/:userId/Submissions'
          render={(p) => <SubmissionsPublic {...p} isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
        />
        <Route
          exact
          path='/Method/:id'
          render={(p) => <Method {...p} isLoggedIn={isLoggedIn} onLogin={handleLogin} key={Math.random()} />}
        />
        <Route
          exact
          path='/Task/:id'
          render={(p) => <Task {...p} isLoggedIn={isLoggedIn} onLogin={handleLogin} key={Math.random()} />}
        />
        <Route
          exact
          path='/Platform/:id'
          render={(p) => <Platform {...p} isLoggedIn={isLoggedIn} onLogin={handleLogin} key={Math.random()} />}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default MainRouter
