import { Navbar } from 'react-bootstrap'
import MainNav from './MainNav'
import logo from './../images/metriq_logo_primary_blue.png'
import uf_logo from './../images/unitary_fund_logo.png'

const MainNavbar = (props) => {
  return (
    <div>
      <Navbar bg='light' expand='lg'>
        <Navbar.Brand href='/' className='metriq-navbar'>
          <img src={logo} alt='logo' className='logo-image' />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <MainNav isLoggedIn={props.isLoggedIn} />
        </Navbar.Collapse>
        <Navbar.Brand href='https://unitary.fund/' className='metriq-navbar'>
          <img src={uf_logo} alt='uf_logo' className='logo-image' />
        </Navbar.Brand>
      </Navbar>
      <div className='bg-light metriq-navbar'>
        <h1>metriq</h1>
        <h5>Quantum Computing Benchmarks by community contributors</h5>
        <h6><a href='/'>Submissions</a> show performance of <a href='/Methods'>methods</a> against <a href='/Tasks'>tasks</a>.</h6>
        <h6>Questions? Email: <a href='mailto:metriq@unitary.fund'>metriq@unitary.fund</a></h6>
        <br />
      </div>
    </div>
  )
}

export default MainNavbar
