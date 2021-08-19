import { Navbar } from 'react-bootstrap'
import MainNav from './MainNav'

const MainNavbar = (props) => {
  return (
    <Navbar bg='light' expand='lg'>
      <Navbar.Brand href='/' className='navbar-title'>metriq</Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <MainNav isLoggedIn={props.isLoggedIn} />
      </Navbar.Collapse>
    </Navbar>
  )
}

export default MainNavbar
