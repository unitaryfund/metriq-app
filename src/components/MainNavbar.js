import { Navbar } from 'react-bootstrap'
import MainNavLeft from './MainNavLeft'
import MainNavRight from './MainNavRight'
import logo from './../images/metriq_logo_primary_blue_inverted.png'

const MainNavbar = (props) => {
  return (
    <div>
      <Navbar className='metriq-navbar' expand='lg'>
        <Navbar.Brand href='/' className='metriq-navbar'>
          <Navbar.Collapse id='basic-navbar-nav'>
            <img src={logo} alt='logo' className='logo-image' />
          </Navbar.Collapse>
        </Navbar.Brand>
        <MainNavLeft isLoggedIn={props.isLoggedIn} />
        <Navbar.Collapse id='basic-navbar-nav' />
        <MainNavRight isLoggedIn={props.isLoggedIn} />
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
      </Navbar>
      <div className='metriq-navbar'>
        <h2>{props.title}</h2>
        <h4>{props.subtitle}</h4>
        <br />
      </div>
    </div>
  )
}

export default MainNavbar
