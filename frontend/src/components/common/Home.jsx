import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Image1 from '../../Images/Image1.png'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Footer from './FooterC'

const Home = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container className="d-flex justify-content-between align-items-center">
          <Navbar.Brand>ComplaintCare</Navbar.Brand>
          <ul className="navbar-nav d-flex flex-row gap-3 mb-0">
            <li className="nav-item">
              <Link to="/" className="nav-link text-light">
                Home
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/about" className="nav-link text-light">
                About
              </Link>
            </li> */}
            <li className="nav-item">
              <Link to="/signup" className="nav-link text-light">
                SignUp
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link text-light">
                Login
              </Link>
            </li>
          </ul>
        </Container>
      </Navbar>

      <Container className="home-container d-flex flex-column flex-md-row align-items-center justify-content-between py-5">
        <div className="left-side mb-4 mb-md-0">
          <img src={Image1} alt="Customer support illustration" className="img-fluid" />
        </div>
        <div className="right-side text-center text-md-start">
          <p>
            <span className="f-letter">Empower Your Team,</span>
            <br />
            <span className="s-letter"> Exceed Customer Expectations: Discover our</span>
            <br />
            <span className="t-letter">Complaint Management Solution</span>
          </p>
          <Link to="/login">
            <Button className="mt-3 register">Register Your Complaint</Button>
          </Link>
        </div>
      </Container>

      <Footer />
    </>
  )
}

export default Home
