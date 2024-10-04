import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const Login: React.FC = () => {
  const [error, setError] = useState("");
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      await loginWithRedirect();
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error(error);
    }
  };

  if (isAuthenticated) {
    navigate("/home");
    return null; // 
  }

  return (
    <>
      <Navbar bg="danger" expand="md">
        <Navbar.Brand href="/">
          <img
            src="/public/SuperSaverLogo.png"
            width="50"
            alt="Super Saver Logo"
            className="logo mx-4"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
      </Navbar>
      <div className="container mt-5">
        <h1 className="text-center">Welcome to Super Savers!</h1>
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Button onClick={handleLogin} variant="primary w-100">
          Login with Auth0
        </Button>
        <Link to="/addcustomers">
          <Button variant="outline-secondary m-4">Sign-Up Today!</Button>
        </Link>
      </div>
    </>
  );
};

export default Login;