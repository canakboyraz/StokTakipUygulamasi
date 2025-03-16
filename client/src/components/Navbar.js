import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { FaHome, FaBoxOpen, FaClipboardList, FaBoxes, FaHistory } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">Stok Takip</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
              className="d-flex align-items-center"
            >
              <FaHome className="me-1" /> Ana Sayfa
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/stock-entry" 
              active={location.pathname === '/stock-entry'}
              className="d-flex align-items-center"
            >
              <FaBoxOpen className="me-1" /> Stok Giriş
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/stock-view" 
              active={location.pathname === '/stock-view'}
              className="d-flex align-items-center"
            >
              <FaClipboardList className="me-1" /> Stok Görüntüle
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/stock-out" 
              active={location.pathname === '/stock-out'}
              className="d-flex align-items-center"
            >
              <FaBoxes className="me-1" /> Stok Çıkış
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/stock-out-history" 
              active={location.pathname === '/stock-out-history'}
              className="d-flex align-items-center"
            >
              <FaHistory className="me-1" /> Stok Çıkış Geçmişi
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar; 