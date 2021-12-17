import React from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'

const MainNavLeft = () => {
  return (
    <Nav className='metriq-navbar'>
      <Nav.Link href='/Tasks' className='metriq-navbar-text'>Tasks</Nav.Link>
      <Nav.Link href='/Methods' className='metriq-navbar-text'>Methods</Nav.Link>
      <Nav.Link href='/Tags' className='metriq-navbar-text'>Tags</Nav.Link>
      <NavDropdown title='About' active='true' className='metriq-navbar-text' alignRight>
        <NavDropdown.Item href='/About'><p class='font-weight-bold'>About</p></NavDropdown.Item>
        <NavDropdown.Item href='/FAQ'><p class='font-weight-bold'>F.A.Q.</p></NavDropdown.Item>
      </NavDropdown>
    </Nav>
  )
}

export default MainNavLeft
