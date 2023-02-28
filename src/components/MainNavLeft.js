import React from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import FormFieldTypeaheadRow from '../components/FormFieldTypeaheadRow'

const MainNavLeft = () =>
  <Nav className='metriq-navbar'>
    <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Tasks' className='metriq-navbar-text'>Tasks</Nav.Link>
    <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Methods' className='metriq-navbar-text'>Methods</Nav.Link>
    <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Platforms' className='metriq-navbar-text'>Platforms</Nav.Link>
    <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Tags' className='metriq-navbar-text'>Tags</Nav.Link>
    <Nav.Link as={NavLink} activeClassName='active-navlink' to='/Submissions' className='metriq-navbar-text'>Submissions</Nav.Link>
    <NavDropdown title='About' active='true' className='metriq-navbar-text' alignRight>
      <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/About'><p className='font-weight-bold'>About</p></NavDropdown.Item>
      <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/Partners'><p className='font-weight-bold'>Partners</p></NavDropdown.Item>
      <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/FAQ'><p className='font-weight-bold'>F.A.Q.</p></NavDropdown.Item>
      <NavDropdown.Item as={NavLink} activeClassName='active-dropdown-navlink' to='/UserGuidelines'><p className='font-weight-bold'>User Guidelines</p></NavDropdown.Item>
    </NavDropdown>
    <div className='main-search-bar'>
      <FormFieldTypeaheadRow
        labelKey='name'
        inputName='name'
        label='Search'
        value=''
        alignLabelRight
      />
    </div>
  </Nav>

export default MainNavLeft
