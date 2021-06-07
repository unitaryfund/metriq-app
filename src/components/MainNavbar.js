import React from 'react';
import {
  Navbar
} from 'react-bootstrap';
import MainNav from "./MainNav";

const MainNavbar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <MainNav/>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MainNavbar;