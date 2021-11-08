import React from 'react'
import { FaTwitter, FaGithub } from 'react-icons/fa'

import { Button, Nav } from 'react-bootstrap'

const AnonNavRight = () => {
  return (
    <Nav className='ml-auto metriq-navbar'>
      <Nav.Link href='https://twitter.com/unitaryfund'> <FaTwitter color={`${'black'}`} size={25} /> </Nav.Link>
      <Nav.Link href='https://github.com/unitaryfund'> <FaGithub color={`${'black'}`} size={25} /> </Nav.Link>
      <Nav.Link href='/Login' className='metriq-navbar-text'>Log In</Nav.Link>
      <Nav.Link href='/Login/AddSubmission'><Button variant='primary' className='metriq-navbar-button'>Submit</Button></Nav.Link>
    </Nav>
  )
}

export default AnonNavRight
