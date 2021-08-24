import React from 'react'
import { Button, Nav } from 'react-bootstrap'

const AnonNav = () => {
  return (
    <Nav className='ml-auto'>
      <Nav.Link href='/Login/AddSubmission'><Button variant='primary'>Submit</Button></Nav.Link>
      <Nav.Link href='/'>Home</Nav.Link>
      <Nav.Link href='/Methods'>Methods</Nav.Link>
      <Nav.Link href='/Tasks'>Tasks</Nav.Link>
      <Nav.Link href='/Tags'>Tags</Nav.Link>
      <Nav.Link href='/Login'>Log In</Nav.Link>
      <Nav.Link href='/About'>About</Nav.Link>
      <Nav.Link href='/Contact'>Contact</Nav.Link>
    </Nav>
  )
}

export default AnonNav
