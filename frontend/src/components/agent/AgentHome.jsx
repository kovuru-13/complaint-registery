import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Card from 'react-bootstrap/Card'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Alert from 'react-bootstrap/Alert'
import Collapse from 'react-bootstrap/Collapse'
import ChatWindow from '../common/ChatWindow'
import Footer from '../common/FooterC'

const API_BASE = process.env.REACT_APP_API_URL

const AgentHome = () => {
  const style = { marginTop: '66px' }
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [toggle, setToggle] = useState({})
  const [agentComplaintList, setAgentComplaintList] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
          const { _id, name } = user
          setUserName(name)

          const { data } = await axios.get(`${API_BASE}/allcomplaints/${_id}`)

          // Normalize structure (flatten _doc)
          const formattedComplaints = data.map((item) => ({
            ...item._doc,
            name: item.name,
            address: item.address,
            city: item.city,
            state: item.state,
            pincode: item.pincode,
            comment: item.comment,
          }))

          setAgentComplaintList(formattedComplaints)
        } else {
          navigate('/')
        }
      } catch (error) {
        console.error('Error fetching complaints:', error)
      }
    }

    getData()
  }, [navigate])

  const handleStatusChange = async (complaintId) => {
    try {
      await axios.put(`${API_BASE}/complaint/${complaintId}`, {
        status: 'completed',
      })

      // Update state locally
      setAgentComplaintList((prevList) =>
        prevList.map((complaint) =>
          complaint.complaintId === complaintId
            ? { ...complaint, status: 'completed' }
            : complaint
        )
      )
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleToggle = (complaintId) => {
    setToggle((prev) => ({
      ...prev,
      [complaintId]: !prev[complaintId],
    }))
  }

  const LogOut = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <>
      <div className="body">
        <Navbar className="text-white" bg="dark" expand="lg">
          <Container fluid>
            <Navbar.Brand className="text-white">
              Hi Agent {userName}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >
                <NavLink to="#" style={{ textDecoration: 'none' }} className="text-white">
                  View Complaints
                </NavLink>
              </Nav>
              <Button onClick={LogOut} variant="outline-danger">
                Log out
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div
          className="container"
          style={{ display: 'flex', flexWrap: 'wrap', margin: '20px' }}
        >
          {agentComplaintList.length > 0 ? (
            agentComplaintList.map((complaint, idx) => {
              const id = complaint.complaintId
              const open = toggle[id] || false

              return (
                <Card key={idx} style={{ width: '18rem', margin: '15px' }}>
                  <Card.Body>
                    <Card.Title>
                      <b>Name:</b> {complaint.name}
                    </Card.Title>
                    <Card.Text>
                      <b>Address:</b> {complaint.address}
                    </Card.Text>
                    <Card.Text>
                      <b>City:</b> {complaint.city}
                    </Card.Text>
                    <Card.Text>
                      <b>State:</b> {complaint.state}
                    </Card.Text>
                    <Card.Text>
                      <b>Pincode:</b> {complaint.pincode}
                    </Card.Text>
                    <Card.Text>
                      <b>Comment:</b> {complaint.comment}
                    </Card.Text>
                    <Card.Text>
                      <b>Status:</b> {complaint.status}
                    </Card.Text>

                    {complaint.status !== 'completed' && (
                      <Button
                        onClick={() => handleStatusChange(id)}
                        variant="primary"
                      >
                        Mark as Completed
                      </Button>
                    )}

                    <Button
                      onClick={() => handleToggle(id)}
                      aria-controls={`collapse-${id}`}
                      aria-expanded={open}
                      className="mx-3"
                      variant="secondary"
                    >
                      Message
                    </Button>

                    <Collapse in={open} dimension="width">
                      <div id={`collapse-${id}`}>
                        <Card
                          body
                          style={{ width: '250px', marginTop: '12px' }}
                        >
                          <ChatWindow
                            key={id}
                            complaintId={id}
                            name={userName}
                          />
                        </Card>
                      </div>
                    </Collapse>
                  </Card.Body>
                </Card>
              )
            })
          ) : (
            <Alert variant="info">
              <Alert.Heading>No complaints to show</Alert.Heading>
            </Alert>
          )}
        </div>
      </div>
      <Footer style={style} />
    </>
  )
}

export default AgentHome
