import React from 'react';
import {
  Nav
} from 'react-bootstrap';

const AnonNav = () => {
  return (
    <Nav className="ml-auto">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/login">Sign In</Nav.Link>
    </Nav>
  );
};

export default AnonNav;