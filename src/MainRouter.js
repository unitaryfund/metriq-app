import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './views/Home'
import LogIn from './views/LogIn'
import Register from './views/Register'

const MainRouter = () => {
  return (
    <Router>
        <Route
            path="/"
            component={Home}
            exact
        />
        <Route
            path="/Login"
            component={LogIn}
            exact
        />
        <Route
            path="/Register"
            component={Register}
            exact
        />
    </Router>
  );
};

export default MainRouter;