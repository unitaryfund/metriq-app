import AnonNavLeft from './AnonNavLeft'
import AuthNavLeft from './AuthNavLeft'

const MainNavLeft = (props) => {
  if (props.isLoggedIn) {
    return <AuthNavLeft isLoggedIn />
  }
  return <AnonNavLeft />
}

export default MainNavLeft
