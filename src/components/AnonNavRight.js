import React from 'react'
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa'
import { Button, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const AnonNavRight = () =>
  <Nav className='ml-auto metriq-navbar'>
    <Nav.Link href='https://twitter.com/MetriqInfo'> <FaTwitter color={`${'black'}`} size={25} eventKey='10' /> </Nav.Link>
    <Nav.Link href='http://discord.unitary.fund'> <FaDiscord color={`${'black'}`} size={25} eventKey='11' /> </Nav.Link>
    <Nav.Link href='https://github.com/unitaryfund/metriq-app'> <FaGithub color={`${'black'}`} size={25} eventKey='12' /> </Nav.Link>
    <Nav.Link as={Link} to='/Login' className='metriq-navbar-text' eventKey='13'>Log In</Nav.Link>
    <Nav.Link as={Link} to='/Login/AddSubmission' eventKey='14'><Button variant='primary' className='metriq-navbar-button'>Submit</Button></Nav.Link>
  </Nav>

export default AnonNavRight
