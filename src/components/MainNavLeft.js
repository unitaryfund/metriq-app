import React from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const MainNavLeft = () =>
  <Nav className='metriq-navbar'>
    <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Tasks' className='metriq-navbar-text'>Tasks</Nav.Link>
    <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Methods' className='metriq-navbar-text'>Methods</Nav.Link>
    <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Platforms' className='metriq-navbar-text'>Platforms</Nav.Link>
    <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Tags' className='metriq-navbar-text'>Tags</Nav.Link>
    <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Submissions' className='metriq-navbar-text'>Submissions</Nav.Link>
    <NavDropdown title='About' active='true' className='metriq-navbar-text' alignRight>
      <NavDropdown.Item as={NavLink} activeClassName='active-navlink' to='/About'><p class='font-weight-bold'>About</p></NavDropdown.Item>
      <NavDropdown.Item as={NavLink} activeClassName='active-navlink' to='/Partners'><p class='font-weight-bold'>Partners</p></NavDropdown.Item>
      <NavDropdown.Item as={NavLink} activeClassName='active-navlink' to='/FAQ'><p class='font-weight-bold'>F.A.Q.</p></NavDropdown.Item>
      <NavDropdown.Item as={NavLink} activeClassName='active-navlink' to='/UserGuidelines'><p class='font-weight-bold'>User Guidelines</p></NavDropdown.Item>
    </NavDropdown>
  </Nav>

export default MainNavLeft
