import { Navbar } from 'react-bootstrap'
import MainNavLeft from './MainNavLeft'
import MainNavRight from './MainNavRight'
import logo from './../images/metriq_logo_primary_blue_inverted.png'
import { Link } from 'react-router-dom'

const MainNavbar = (props) =>
  <div>
    <Navbar collapseOnSelect className='metriq-navbar' expand='lg'>
      <Navbar.Brand as={Link} to='/' className='metriq-navbar'>
        <img src={logo} alt='Metriq logo' className='logo-image' />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <MainNavLeft isLoggedIn={props.isLoggedIn} />
        <MainNavRight isLoggedIn={props.isLoggedIn} />
      </Navbar.Collapse>
    </Navbar>
    <div className='metriq-navbar metriq-header'>
      <h2>{props.title}</h2>
      <h3>{props.subtitle}</h3>
      <br />
    </div>
  </div>

export default MainNavbar
