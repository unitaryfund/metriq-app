import React from 'react'
import { Button, Nav, NavDropdown } from 'react-bootstrap'
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
    <Nav className='ml-auto metriq-navbar'>
      <Nav.Link href='/AddSubmission'><Button variant='primary'>Submit</Button></Nav.Link>
      <Nav.Link href='/' className='metriq-navbar-text'>Home</Nav.Link>
      <Nav.Link href='/Methods' className='metriq-navbar-text'>Methods</Nav.Link>
      <Nav.Link href='/Tasks' className='metriq-navbar-text'>Tasks</Nav.Link>
      <Nav.Link href='/Tags' className='metriq-navbar-text'>Tags</Nav.Link>
      <Nav.Link href='/About' className='metriq-navbar-text'>About</Nav.Link>
      <NavDropdown title='Account' id='basic-nav-dropdown' className='metriq-navbar-text' alignRight>
        <NavDropdown.Item href='/Profile'>Settings</NavDropdown.Item>
        <NavDropdown.Item href='/AddSubmission'>Add Submission</NavDropdown.Item>
        <NavDropdown.Item href='/Submissions'>My Submissions</NavDropdown.Item>
        <NavDropdown.Item href='/Token'>API Token</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleOnClick}>Logout</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  )
}

export default AuthNav
