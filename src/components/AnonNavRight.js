import React from 'react'
import { Button, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FaDiscord, FaGithub, FaTwitter } from 'react-icons/fa'
import logo from '../images/uf_logo.svg'
import MainSearchBar from './MainSearchBar'

const AnonNavRight = () =>
  <Nav className='ml-auto metriq-navbar metriq-navbar-right'>
    <Nav.Link href='https://unitary.foundation' eventKey='8'><img width='96px' src={logo} alt='Unitary Foundation logo' style={{ 'margin-top': '4px' }} /></Nav.Link>
    <Nav.Link href='https://twitter.com/MetriqInfo' eventKey='9'> <FaTwitter color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
    <Nav.Link href='http://discord.unitary.fund' eventKey='10'> <FaDiscord color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
    <Nav.Link href='https://github.com/unitaryfund/metriq-app' eventKey='11'> <FaGithub color={`${'white'}`} size={25} className='metriq-navbar-social-icon' /> </Nav.Link>
    <MainSearchBar />
    <Nav.Link as={Link} to='/Login' eventKey='12'><Button variant='outline-light' className='metriq-navbar-button'>Log In</Button></Nav.Link>
    <Nav.Link as={Link} to='/Login/AddSubmission' eventKey='13'><Button variant='primary' className='metriq-navbar-button submit-button'>Submit</Button></Nav.Link>
  </Nav>

export default AnonNavRight
