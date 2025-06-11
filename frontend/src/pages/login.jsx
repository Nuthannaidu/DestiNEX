import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleButton from 'react-google-button';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup
} from 'react-bootstrap';
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaPlane,
  FaShieldAlt,
  FaExclamationCircle
} from 'react-icons/fa';
import './Login.css';

const Login = ({ setCurrUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setError('');
    setIsLoading(true);
    setValidated(true);

    try {
      const res = await axios.post('http://localhost:5000/login', formData, {
        withCredentials: true
      });
      setCurrUser(res.data.user);
      navigate('/listings');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <Container className="login-page d-flex align-items-center justify-content-center py-5">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} xxl={5}>
          <Card className="login-card shadow">
            <Card.Header className="text-center login-header">
              <FaPlane size={32} className="text-primary mb-2" />
              <h2 className="app-title">Welcome Back</h2>
              <p className="app-subtitle">Sign in to continue your journey</p>
            </Card.Header>

            <Card.Body className="px-4 py-3">
              {error && (
                <Alert variant="danger" className="error-alert d-flex align-items-center">
                  <FaExclamationCircle className="me-2" />
                  {error}
                </Alert>
              )}

              <div className="mb-3">
                <GoogleButton
                  onClick={handleGoogleLogin}
                  label="Sign in with Google"
                  style={{ width: '100%' }}
                  className="google-signin-btn"
                />
              </div>

              <div className="divider mb-4 text-center text-muted position-relative">
                <span className="bg-white px-3 position-relative z-1">OR</span>
              </div>

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">
                    <FaUser className="me-2" />
                    Email
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="form-input"
                      required
                    />
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label">
                    <FaLock className="me-2" />
                    Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="form-input"
                      required
                      minLength={6}
                    />
                    <InputGroup.Text
                      onClick={togglePasswordVisibility}
                      className="password-btn"
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    Password must be at least 6 characters long.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check
                    type="checkbox"
                    id="remember"
                    label="Remember me"
                    className="remember-check"
                  />
                  <a href="/forgot-password" className="forgot-link">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="signin-btn w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <small className="text-muted">
                  <FaShieldAlt className="me-1" />
                  Your credentials are encrypted securely
                </small>
              </div>
            </Card.Body>

            <Card.Footer className="text-center py-3">
              <small className="text-muted">
                Don't have an account?{' '}
                <a href="/signup" className="signup-link">
                  Sign up here
                </a>
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
