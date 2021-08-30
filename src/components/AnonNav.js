import React from 'react'
import { Button, Nav } from 'react-bootstrap'

const AnonNav = () => {
  return (
    <Nav className='ml-auto metriq-navbar'>
      <Nav.Link href='/Login/AddSubmission'><Button variant='primary'>Submit</Button></Nav.Link>
      <Nav.Link href='/' className='metriq-navbar-text'>Home</Nav.Link>
      <Nav.Link href='/Methods' className='metriq-navbar-text'>Methods</Nav.Link>
      <Nav.Link href='/Tasks' className='metriq-navbar-text'>Tasks</Nav.Link>
      <Nav.Link href='/Tags' className='metriq-navbar-text'>Tags</Nav.Link>
      <Nav.Link href='/Login' className='metriq-navbar-text'>Log In</Nav.Link>
      <Nav.Link href='/About' className='metriq-navbar-text'>About</Nav.Link>
    </Nav>
  )
}

export default AnonNav
