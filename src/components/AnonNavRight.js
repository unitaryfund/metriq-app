import React from 'react'
import { Button, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import MainSearchBar from './MainSearchBar'

const AnonNavRight = () =>
  <Nav className='ml-auto metriq-navbar metriq-navbar-right'>
    <MainSearchBar />
    <Nav.Link as={Link} to='/Login' eventKey='13'><Button variant='outline-light' className='metriq-navbar-button'>Log In</Button></Nav.Link>
    <Nav.Link as={Link} to='/Login/AddSubmission' eventKey='14'><Button variant='primary' className='metriq-navbar-button'>Submit</Button></Nav.Link>
  </Nav>

export default AnonNavRight
