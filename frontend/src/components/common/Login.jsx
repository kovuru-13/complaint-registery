// src/components/common/Login.js
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Footer from './FooterC';

const API_BASE = process.env.REACT_APP_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_BASE}/login`, user); // ✅ lowercase '/login'
      alert('Successfully logged in');
      localStorage.setItem('user', JSON.stringify(data));
      switch (data.userType) {
        case 'Admin':
          navigate('/AdminHome');
          break;
        case 'Ordinary':
          navigate('/HomePage');
          break;
        case 'Agent':
          navigate('/AgentHome');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        alert("User doesn’t exist or invalid credentials");
      } else {
        console.error("Login error:", err);
      }
      navigate('/login');
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand>ComplaintCare</Navbar.Brand>
          <ul className="navbar-nav d-flex flex-row gap-3 mb-0">
            <li className="nav-item">
              <Link to="/" className="nav-link text-light">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link text-light">SignUp</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link text-light">Login</Link>
            </li>
          </ul>
        </Container>
      </Navbar>

      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-dark text-white">
                <div className="card-body p-5 text-center">
                  <h2 className="fw-bold mb-4">Login to Register a Complaint</h2>
                  <p className="text-white-50 mb-5">Enter your credentials below</p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label">Email</label>
                    </div>

                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        autoComplete="off"
                        required
                      />
                      <label className="form-label">Password</label>
                    </div>

                    <button className="btn btn-outline-light btn-lg px-5" type="submit">
                      Login
                    </button>
                  </form>

                  <div className="mt-4">
                    <p className="mb-0">
                      Don't have an account? <Link to="/signup" className="text-light">SignUp</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Login;
