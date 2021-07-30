import React from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import axios from 'axios'
import config from './../config'
import ErrorHandler from './ErrorHandler'

const handleOnClick = () => {
  axios.get(config.api.getUriPrefix() + '/logout')
    .then(res => {
      window.location.href = '/'
    })
    .catch(err => {
      window.alert('Error: ' + ErrorHandler(err) + '\nSorry, cannot logout. If error persists, clear your site cookies in your browser.')
    })
}

const AuthNav = (props) => {
  return (
    <Nav className='ml-auto'>
      <Nav.Link href='/'>Home</Nav.Link>
      <Nav.Link href='/Methods'>Methods</Nav.Link>
      <Nav.Link href='/Tasks'>Tasks</Nav.Link>
      <Nav.Link href='/Tags'>Tags</Nav.Link>
      <NavDropdown title='Account' id='basic-nav-dropdown' alignRight>
        <NavDropdown.Item href='/Profile'>Settings</NavDropdown.Item>
        <NavDropdown.Item href='/Submissions'>My Submissions</NavDropdown.Item>
        <NavDropdown.Item href='/Token'>API Token</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleOnClick}>Logout</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  )
}

export default AuthNav
