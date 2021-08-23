import AnonNav from './AnonNav'
import AuthNav from './AuthNav'

const MainNav = (props) => {
  if (props.isLoggedIn) {
    return <AuthNav isLoggedIn />
  }
  return <AnonNav />
}

export default MainNav
