import AnonNav from './AnonNav'
import AuthNav from './AuthNav'

const MainNav = (props) => {
  if (props.isLoggedIn) {
    return <AuthNav />
  }
  return <AnonNav />
}

export default MainNav
