import React from 'react'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import { Button, Nav, NavDropdown } from 'react-bootstrap'
import axios from 'axios'
import config from './../config'
import ErrorHandler from './ErrorHandler'
import { Link } from 'react-router-dom'

const handleOnClick = () => {
  axios.get(config.api.getUriPrefix() + '/logout')
    .then(() => this.props.history.push('/'))
    .catch(err => {
      window.alert('Error: ' + ErrorHandler(err) + '\nSorry, cannot logout. If error persists, clear your site cookies in your browser.')
    })
}

const AuthNavRight = () =>
  <Nav className='ml-auto metriq-navbar'>
    <Nav.Link href='http://discord.unitary.fund'> <FaDiscord color={`${'black'}`} size={25} /> </Nav.Link>
    <Nav.Link href='https://github.com/unitaryfund/metriq-app'> <FaGithub color={`${'black'}`} size={25} /> </Nav.Link>
    <NavDropdown title='Account' active='true' className='metriq-navbar-text' alignRight>
      <NavDropdown.Item as={Link} to='/Profile'><p class='font-weight-bold'>Settings</p></NavDropdown.Item>
      <NavDropdown.Item as={Link} to='/AddSubmission'><p class='font-weight-bold'>Add Submission</p></NavDropdown.Item>
      <NavDropdown.Item as={Link} to='/MySubmissions'><p class='font-weight-bold'>My Submissions</p></NavDropdown.Item>
      <NavDropdown.Item as={Link} to='/Token'><p class='font-weight-bold'>API Token</p></NavDropdown.Item>
      <NavDropdown.Item as={Link} to='/Password'><p class='font-weight-bold'>Change password</p></NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={handleOnClick}><p class='font-weight-bold'>Logout</p></NavDropdown.Item>
    </NavDropdown>
    <Nav.Link as={Link} to='/AddSubmission'><Button variant='primary' className='metriq-navbar-button'>Submit</Button></Nav.Link>
  </Nav>

export default AuthNavRight
