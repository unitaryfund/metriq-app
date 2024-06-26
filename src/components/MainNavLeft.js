import React from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa'

const MainNavLeft = () => {
  return (
    <Nav className='metriq-navbar'>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Tasks' className='metriq-navbar-text' eventKey='1'>Tasks</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Methods' className='metriq-navbar-text' eventKey='2'>Methods</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/DataSets' className='metriq-navbar-text' eventKey='3'>Data Sets</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Platforms' className='metriq-navbar-text' eventKey='4'>Platforms</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Tags' className='metriq-navbar-text' eventKey='5'>Tags</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Submissions' className='metriq-navbar-text' eventKey='6'>Submissions</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Progress' className='metriq-navbar-text' eventKey='7'>Progress</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Sota' className='metriq-navbar-text' eventKey='8'>SOTA</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/QEDC' className='metriq-navbar-text' eventKey='9'>QED-C</Nav.Link>
      <Nav.Link as={NavLink} activeClassName='active-navlink' to='/VQA' className='metriq-navbar-text' eventKey='10'>VQA</Nav.Link>
      <NavDropdown id='metriq-navbar-dropdown' title='About' active='true' className='metriq-navbar-text' alignRight>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/About' eventKey='11'><p className='font-weight-bold'>About</p></NavDropdown.Item>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/Partners' eventKey='12'><p className='font-weight-bold'>Partners</p></NavDropdown.Item>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/FAQ' eventKey='13'><p className='font-weight-bold'>F.A.Q.</p></NavDropdown.Item>
        <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/UserGuidelines' eventKey='14'><p className='font-weight-bold'>User Guidelines</p></NavDropdown.Item>
      </NavDropdown>
      <span className='metriq-navbar-spacer' />
      <Nav.Link href='https://twitter.com/MetriqInfo' eventKey='15'> <FaTwitter color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
      <Nav.Link href='http://discord.unitary.fund' eventKey='16'> <FaDiscord color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
      <Nav.Link href='https://github.com/unitaryfund/metriq-app' eventKey='17'> <FaGithub color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
    </Nav>
  )
}

export default MainNavLeft
