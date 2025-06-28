// src/components/common/SignUp.js
import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Footer from './FooterC';

const API_BASE = process.env.REACT_APP_API_URL;

const SignUp = () => {
  const [title, setTitle] = useState("Select User");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    userType: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleTitle = (role) => {
    setTitle(role);
    setUser((prev) => ({ ...prev, userType: role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.userType) {
      alert("Please select a user type.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/signup`, user); // ✅ lowercase
      alert("Record submitted successfully!");
      setUser({
        name: "",
        email: "",
        password: "",
        phone: "",
        userType: ""
      });
      setTitle("Select User");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        alert("User already exists.");
      } else {
        alert("Something went wrong while registering.");
      }
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

      <section className="gradient-custom py-5">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-dark text-white">
                <div className="card-body p-5 text-center">
                  <h2 className="fw-bold mb-4">Sign Up to Register Complaints</h2>
                  <p className="text-white-50 mb-4">Enter your details below</p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label">Full Name</label>
                    </div>

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
                        required
                      />
                      <label className="form-label">Password</label>
                    </div>

                    <div className="form-outline form-white mb-4">
                      <input
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label">Mobile No.</label>
                    </div>

                    <div className="form-outline form-white mb-4">
                      <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-user-type">
                          {title}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleTitle("Ordinary")}>Ordinary</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleTitle("Admin")}>Admin</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleTitle("Agent")}>Agent</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      <label className="form-label mt-2">Select User Type</label>
                    </div>

                    <button
                      className="btn btn-outline-light btn-lg px-5 mt-3"
                      type="submit"
                      disabled={!user.userType}
                    >
                      Register
                    </button>
                  </form>

                  <div className="mt-4">
                    <p className="mb-0">
                      Already have an account? <Link to="/login" className="text-light">Login</Link>
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

export default SignUp;
