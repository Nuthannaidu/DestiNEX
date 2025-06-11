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
  InputGroup,
  Spinner,
  ProgressBar
} from 'react-bootstrap';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import './Signup.css';

const Signup = ({ setCurrUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (e.target.name === 'password') calculatePasswordStrength(e.target.value);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthVariant = () => {
    if (passwordStrength <= 25) return 'danger';
    if (passwordStrength <= 50) return 'warning';
    if (passwordStrength <= 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { username, email, password } = formData;
      const res = await axios.post(
        'http://localhost:5000/signup',
        { username, email, password },
        { withCredentials: true }
      );

      setCurrUser(res.data.user);
      navigate('/listings');
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Signup failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <Container className="signup-page d-flex align-items-center justify-content-center py-5">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} xxl={5}>
          <Card className="signup-card shadow">
            <Card.Header className="signup-header text-center">
              <h2 className="app-title">Create Account</h2>
              <p className="app-subtitle">Join us and start exploring</p>
            </Card.Header>

            <Card.Body className="px-4 py-3">
              {error && <Alert variant="danger" className="error-alert">{error}</Alert>}

              <div className="mb-3">
                <GoogleButton
                  onClick={handleGoogleSignup}
                  label="Sign up with Google"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="divider mb-4 text-center text-muted position-relative">
                <span className="bg-white px-3 position-relative z-1">OR</span>
              </div>

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaUser /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      minLength={3}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaLock /></InputGroup.Text>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                    <InputGroup.Text
                      onClick={togglePasswordVisibility}
                      className="password-toggle"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                  </InputGroup>
                  {formData.password && (
                    <div className="mt-2">
                      <ProgressBar
                        variant={getPasswordStrengthVariant()}
                        now={passwordStrength}
                        className="mb-1"
                      />
                      <small className={`text-${getPasswordStrengthVariant()}`}>
                        Password strength: {getPasswordStrengthText()}
                      </small>
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaShieldAlt /></InputGroup.Text>
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <InputGroup.Text
                      onClick={toggleConfirmPasswordVisibility}
                      className="password-toggle"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4" controlId="termsCheck">
                  <Form.Check
                    required
                    label={
                      <span>
                        I agree to the <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>
                      </span>
                    }
                  />
                </Form.Group>

                <Button type="submit" className="w-100 signup-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Form>
            </Card.Body>

            <Card.Footer className="text-center">
              <small className="text-muted">
                Already have an account?{' '}
                <Button variant="link" onClick={() => navigate('/login')} className="p-0">
                  Sign In
                </Button>
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
