import React from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'

const AuthNav = () => {
  return (
    <Nav className='ml-auto'>
      <Nav.Link href='/'>Home</Nav.Link>
      <NavDropdown title='Account' id='basic-nav-dropdown' alignRight>
        <NavDropdown.Item href='#action/3.1'>Settings</NavDropdown.Item>
        <NavDropdown.Item href='/Profile'>API Token</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href='#action/3.2'>Logout</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  )
}

export default AuthNav
