import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { NavLink, useNavigate } from 'react-router-dom'

import UserInfo from './UserInfo'
import AccordionAdmin from './AccordionAdmin'
import AgentInfo from './AgentInfo'

const AdminHome = () => {
  const navigate = useNavigate()
  const [activeComponent, setActiveComponent] = useState('dashboard')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const getData = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user && user.userType === 'admin') {
          setUserName(user.name)
        } else {
          navigate('/')
        }
      } catch (error) {
        console.log(error)
        navigate('/')
      }
    }
    getData()
  }, [navigate])

  const handleNavLinkClick = (componentName) => {
    setActiveComponent(componentName)
  }

  const LogOut = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container fluid>
          <Navbar.Brand>Hi Admin {userName}</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <NavLink
                className={`nav-link text-light ${activeComponent === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavLinkClick('dashboard')}
              >
                Dashboard
              </NavLink>
              <NavLink
                className={`nav-link text-light ${activeComponent === 'UserInfo' ? 'active' : ''}`}
                onClick={() => handleNavLinkClick('UserInfo')}
              >
                User
              </NavLink>
              <NavLink
                className={`nav-link text-light ${activeComponent === 'Agent' ? 'active' : ''}`}
                onClick={() => handleNavLinkClick('Agent')}
              >
                Agent
              </NavLink>
            </Nav>
            <Button onClick={LogOut} variant="outline-danger">
              Log out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="content p-3">
        {activeComponent === 'dashboard' && <AccordionAdmin />}
        {activeComponent === 'UserInfo' && <UserInfo />}
        {activeComponent === 'Agent' && <AgentInfo />}
      </div>
    </>
  )
}

export default AdminHome
