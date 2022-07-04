import AnonNavRight from './AnonNavRight'
import AuthNavRight from './AuthNavRight'

const MainNavRight = (props) => (props.isLoggedIn) ? <AuthNavRight isLoggedIn /> : <AnonNavRight />

export default MainNavRight
