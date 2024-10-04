import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react"; 

function Navigation() {
  const navigate = useNavigate();
  const { logout } = useAuth0(); 

  return (
    <Navbar bg="danger" expand="md">
      <Navbar.Brand href="/home">
        <img
          src="/public/SuperSaverLogo.png"
          width="50"
          alt="Super Saver Logo"
          className="logo mx-4"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="m-auto">
          <Nav.Link as={NavLink} to="/home">
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/products">
            Products
          </Nav.Link>
          <Nav.Link as={NavLink} to="/customers">
            Customers
          </Nav.Link>
          <Nav.Link as={NavLink} to="/shopping_cart">
            Shopping Cart
          </Nav.Link>
        </Nav>
        <Button variant="mx-4" onClick={() => logout({logoutParams: { returnTo: window.location.origin}})}>
          Logout
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;