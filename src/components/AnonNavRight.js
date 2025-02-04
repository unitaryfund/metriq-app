import React from 'react'
import { Button, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa'
import MainSearchBar from './MainSearchBar'

const AnonNavRight = () =>
  <Nav className='ml-auto metriq-navbar metriq-navbar-right'>
    <Nav.Link href='https://twitter.com/MetriqInfo' eventKey='8'> <FaTwitter color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
      <Nav.Link href='http://discord.unitary.fund' eventKey='9'> <FaDiscord color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
      <Nav.Link href='https://github.com/unitaryfund/metriq-app' eventKey='10'> <FaGithub color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
    <MainSearchBar />
    <Nav.Link as={Link} to='/Login' eventKey='11'><Button variant='outline-light' className='metriq-navbar-button'>Log In</Button></Nav.Link>
    <Nav.Link as={Link} to='/Login/AddSubmission' eventKey='12'><Button variant='primary' className='metriq-navbar-button submit-button'>Submit</Button></Nav.Link>
  </Nav>

export default AnonNavRight
