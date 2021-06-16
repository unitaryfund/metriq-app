import React from 'react'
import { Nav } from 'react-bootstrap'

const AnonNav = () => {
  return (
    <Nav className='ml-auto'>
      <Nav.Link href='/'>Home</Nav.Link>
      <Nav.Link href='/Login'>Log In</Nav.Link>
      <Nav.Link href='/About'>About</Nav.Link>
      <Nav.Link href='/Contact'>Contact</Nav.Link>
    </Nav>
  )
}

export default AnonNav
