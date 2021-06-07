import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './views/Home'
import LogIn from './views/LogIn'

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
    </Router>
  );
};

export default MainRouter;