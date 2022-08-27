import React, { Suspense } from 'react'
const AnonNavRight = React.lazy(() => import('./AnonNavRight'))
const AuthNavRight = React.lazy(() => import('./AuthNavRight'))

const MainNavRight = (props) =>
  <Suspense fallback={<div>Loading...</div>}>
    {(props.isLoggedIn) ? <AuthNavRight isLoggedIn /> : <AnonNavRight />}
  </Suspense>

export default MainNavRight
