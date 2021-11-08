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

const AuthNavRight = (props) => {
  return (
    <Nav className='ml-auto metriq-navbar'>
      <NavDropdown title='Account' active='true' className='metriq-navbar-text' alignRight>
        <NavDropdown.Item href='/Profile'><p class='font-weight-bold'>Settings</p></NavDropdown.Item>
        <NavDropdown.Item href='/AddSubmission'><p class='font-weight-bold'>Add Submission</p></NavDropdown.Item>
        <NavDropdown.Item href='/Submissions'><p class='font-weight-bold'>My Submissions</p></NavDropdown.Item>
        <NavDropdown.Item href='/Token'><p class='font-weight-bold'>API Token</p></NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleOnClick}><p class='font-weight-bold'>Logout</p></NavDropdown.Item>
      </NavDropdown>
      <Nav.Link href='/AddSubmission'><Button variant='primary' className='metriq-navbar-button'>Submit</Button></Nav.Link>
    </Nav>
  )
}

export default AuthNavRight
