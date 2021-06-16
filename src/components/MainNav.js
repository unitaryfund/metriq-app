import React from 'react'
import AnonNav from './AnonNav'
import AuthNav from './AuthNav'

const MainNav = (props) => {
  const isLoggedIn = props.isLoggedIn
  if (isLoggedIn) {
    return <AuthNav />
  }
  return <AnonNav />
}

export default MainNav
