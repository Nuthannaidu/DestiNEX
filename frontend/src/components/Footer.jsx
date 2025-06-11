/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

const Footer = () => (
  <footer className="footer pt-5 pb-3 mt-auto">
    <Container>
      <Row className="footer-main align-items-start">
        {/* Brand Section */}
        <Col lg={4} md={12} className="mb-4 footer-brand">
          <div className="brand-name mb-2">DestiNEX</div>
          <div className="brand-tagline mb-4">
            Building innovative solutions that transform the way you work and live.
          </div>
          <div className="social-links mb-3">
            <a href="#" className="social-link"><FaFacebookF /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaLinkedinIn /></a>
          </div>
        </Col>

        {/* Quick Links */}
        <Col lg={2} md={4} sm={6} className="mb-4 footer-section">
          <div className="section-title">Quick Links</div>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </Col>

        {/* Support */}
        <Col lg={2} md={4} sm={6} className="mb-4 footer-section">
          <div className="section-title">Support</div>
          <ul className="footer-links">
            <li><a href="/help">Help Center</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </Col>

        {/* Newsletter */}
        <Col lg={4} md={12} className="mb-4 newsletter-section">
          <div className="section-title">Stay Updated</div>
          <div className="newsletter-text mb-2">
            Subscribe to our newsletter for the latest updates and exclusive offers.
          </div>
 <Form className="newsletter-form d-flex">
            <Form.Control
              type="email"
              placeholder="Enter your email"
              className="newsletter-input me-2"
            />
            <Button type="submit" className="newsletter-btn">
              Subscribe
            </Button>
          </Form>


        </Col>
      </Row>

      {/* Footer Bottom */}
      <Row className="footer-bottom-content mt-4 pt-3 border-top">
        <Col md={6} className="copyright">
          <p>© 2025 DestiNEX. All rights reserved.</p>
        </Col>
        <Col md={6} className="text-md-end legal-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/cookies">Cookies</a>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
