import React from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa'

const MainNavLeft = () => {
  return (
    <Nav className='metriq-navbar'>
      <NavDropdown id='metriq-navbar-dropdown' title='About' active='true' className='metriq-navbar-text' alignRight>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/About' eventKey='1'><p className='font-weight-bold'>About</p></NavDropdown.Item>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/Partners' eventKey='2'><p className='font-weight-bold'>Partners</p></NavDropdown.Item>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/FAQ' eventKey='3'><p className='font-weight-bold'>F.A.Q.</p></NavDropdown.Item>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/UserGuidelines' eventKey='4'><p className='font-weight-bold'>User Guidelines</p></NavDropdown.Item>
      </NavDropdown>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Trends' className='metriq-navbar-text' eventKey='5'>Trends</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Progress' className='metriq-navbar-text' eventKey='6'>Progress</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Data' className='metriq-navbar-text' eventKey='7'>Data</Nav.Link>
      <span className='metriq-navbar-spacer' />
      <Nav.Link href='https://twitter.com/MetriqInfo' eventKey='15'> <FaTwitter color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
      <Nav.Link href='http://discord.unitary.fund' eventKey='16'> <FaDiscord color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
      <Nav.Link href='https://github.com/unitaryfund/metriq-app' eventKey='17'> <FaGithub color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
    </Nav>
  )
}

export default MainNavLeft
