import AnonNavRight from './AnonNavRight'
import AuthNavRight from './AuthNavRight'

const MainNavRight = (props) => {
  if (props.isLoggedIn) {
    return <AuthNavRight isLoggedIn />
  }
  return <AnonNavRight />
}

export default MainNavRight
