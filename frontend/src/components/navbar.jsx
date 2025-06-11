import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Form,
  InputGroup,
  Button,
  Dropdown,
  Image
} from "react-bootstrap";
import "./navbar.css";
import axios from "axios";

const Navbar = ({ currUser, setCurrUser }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const profilePic =
    currUser?.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      currUser?.username || ""
    )}&background=6366f1&color=ffffff&bold=true`;

  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
      setCurrUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/listings?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  return (
    <BootstrapNavbar 
      expand="lg" 
      bg="white" 
      variant="light" 
      sticky="top"
      className="shadow-sm py-2 border-bottom custom-navbar"
    >
      <Container fluid className="px-4">
        {/* Brand with Globe and Plane */}
        <BootstrapNavbar.Brand 
          as={Link} 
          to="/listings" 
          className="fw-bold fs-2 d-flex align-items-center brand-logo"
        >
          <span className="gradient-text">DestiNEX</span>
        </BootstrapNavbar.Brand>

        {/* Toggle Button */}
        <BootstrapNavbar.Toggle 
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none custom-toggler"
        />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {/* Search Bar */}
          <Form 
            onSubmit={handleSearchSubmit}
            className="d-flex mx-auto my-3 my-lg-0 search-form"
          >
            <InputGroup className="search-input-group">
              <InputGroup.Text className="search-icon">
                <i className="fas fa-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search destinations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <Button 
                variant="primary" 
                type="submit"
                className="btn-search"
              >
                Search
              </Button>
            </InputGroup>
          </Form>

          {/* Navigation Items */}
          <Nav className="ms-auto align-items-center gap-2">
            {!currUser ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/signup" 
                  className="auth-link"
                >
                  Sign Up
                </Nav.Link>
                <Button 
                  as={Link} 
                  to="/login" 
                  className="auth-btn"
                >
                  Log In
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/listings/new" 
                  variant="outline-primary"
                  className="action-btn btn-outline-primary"
                >
                  <i className="fas fa-plus me-2"></i>
                  <span className="d-none d-md-inline">Add Place</span>
                  <span className="d-md-none">Add</span>
                </Button>

                <Button 
                  as={Link} 
                  to="/itinerary/new" 
                  className="action-btn btn-primary"
                >
                  <i className="fas fa-route me-2"></i>
                  <span className="d-none d-md-inline">Plan Trip</span>
                  <span className="d-md-none">Plan</span>
                </Button>

                {/* User Dropdown */}
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="link" 
                    id="user-dropdown"
                    className="user-dropdown d-flex align-items-center"
                  >
                    <Image
                      src={profilePic}
                      alt={currUser.username}
                      roundedCircle
                      width={35}
                      height={35}
                      className="profile-img"
                    />
                    <span className="d-none d-lg-inline ms-2 fw-medium text-dark user-info">
                      {currUser.username}
                      <br />
                      <small>Travel Explorer</small>
                    </span>
                    <i className="fas fa-chevron-down ms-2 dropdown-arrow"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="custom-dropdown">
                    <Dropdown.Item 
                      as={Link} 
                      to="/listings"
                      className="custom-dropdown-item"
                    >
                      <i className="fas fa-user me-2"></i>
                      My Profile
                    </Dropdown.Item>
                    <Dropdown.Item 
                      as={Link} 
                      to="/listings"
                      className="custom-dropdown-item"
                    >
                      <i className="fas fa-map-marker-alt me-2"></i>
                      My Destinations
                    </Dropdown.Item>
                    <Dropdown.Item 
                      as={Link} 
                      to="/itineraries"
                      className="custom-dropdown-item"
                    >
                      <i className="fas fa-suitcase-rolling me-2"></i>
                      My Trips
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      onClick={handleLogout}
                      className="custom-dropdown-item text-danger"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
