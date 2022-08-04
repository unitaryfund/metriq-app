import React from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const MainNavLeft = () =>
  <Nav className='metriq-navbar'>
    <Nav.Link as={Link} to='/Tasks' className='metriq-navbar-text'>Tasks</Nav.Link>
    <Nav.Link as={Link} to='/Methods' className='metriq-navbar-text'>Methods</Nav.Link>
    <Nav.Link as={Link} to='/Platforms' className='metriq-navbar-text'>Platforms</Nav.Link>
    <Nav.Link as={Link} to='/Tags' className='metriq-navbar-text'>Tags</Nav.Link>
    <Nav.Link as={Link} to='/Discover' className='metriq-navbar-text'>Discover</Nav.Link>
    <NavDropdown title='About' active='true' className='metriq-navbar-text' alignRight>
      <NavDropdown.Item as={Link} to='/About'><p class='font-weight-bold'>About</p></NavDropdown.Item>
      <NavDropdown.Item as={Link} to='/Partners'><p class='font-weight-bold'>Partners</p></NavDropdown.Item>
      <NavDropdown.Item as={Link} to='/FAQ'><p class='font-weight-bold'>F.A.Q.</p></NavDropdown.Item>
      <NavDropdown.Item as={Link} to='/UserGuidelines'><p class='font-weight-bold'>User Guidelines</p></NavDropdown.Item>
    </NavDropdown>
  </Nav>

export default MainNavLeft
