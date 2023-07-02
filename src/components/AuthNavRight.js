import React from 'react'
import { Button, Nav, NavDropdown } from 'react-bootstrap'
import axios from 'axios'
import config from './../config'
import ErrorHandler from './ErrorHandler'
import { Link } from 'react-router-dom'
import MainSearchBar from './MainSearchBar'

const handleOnClick = () => {
  axios.get(config.api.getUriPrefix() + '/logout')
    .then(() => { window.location.href = '/' })
    .catch(err => {
      window.alert('Error: ' + ErrorHandler(err) + '\nSorry, cannot logout. If error persists, clear your site cookies in your browser.')
    })
}

const AuthNavRight = () =>
  <Nav className='ml-auto metriq-navbar metriq-navbar-right'>
    <MainSearchBar />
    <NavDropdown title='Account' active='true' className='metriq-navbar-text' alignRight>
      <NavDropdown.Item as={Link} to='/Profile' eventKey='15'><p className='font-weight-bold'>Settings</p></NavDropdown.Item>
      <NavDropdown.Item as={Link} to='/AddSubmission' eventKey='16'><p className='font-weight-bold'>Add Submission</p></NavDropdown.Item>
      <NavDropdown.Item as={Link} to='/MySubmissions' eventKey='17'><p className='font-weight-bold'>My Submissions</p></NavDropdown.Item>
      <NavDropdown.Item as={Link} to='/Token' eventKey='18'><p className='font-weight-bold'>API Token</p></NavDropdown.Item>
      <NavDropdown.Item as={Link} to='/Password' eventKey='19'><p className='font-weight-bold'>Change password</p></NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={handleOnClick} eventKey='20'><p className='font-weight-bold'>Logout</p></NavDropdown.Item>
    </NavDropdown>
    <Nav.Link as={Link} to='/AddSubmission' eventKey='14'><Button variant='primary' className='metriq-navbar-button submit-button'>Submit</Button></Nav.Link>
  </Nav>

export default AuthNavRight
