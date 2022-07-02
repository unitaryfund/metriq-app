import React from 'react'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import { Button, Nav } from 'react-bootstrap'

const AnonNavRight = () =>
  <Nav className='ml-auto metriq-navbar'>
    <Nav.Link href='http://discord.unitary.fund'> <FaDiscord color={`${'black'}`} size={25} /> </Nav.Link>
    <Nav.Link href='https://github.com/unitaryfund/metriq-app'> <FaGithub color={`${'black'}`} size={25} /> </Nav.Link>
    <Nav.Link href='/Login' className='metriq-navbar-text'>Log In</Nav.Link>
    <Nav.Link href='/Login/AddSubmission'><Button variant='primary' className='metriq-navbar-button'>Submit</Button></Nav.Link>
  </Nav>

export default AnonNavRight
