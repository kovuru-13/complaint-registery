import React, { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Dropdown from 'react-bootstrap/Dropdown'
import Alert from 'react-bootstrap/Alert'
import Footer from '../common/FooterC'
import axios from 'axios'

const API_BASE = 'http://localhost:3000'

const AccordionAdmin = () => {
  const [complaintList, setComplaintList] = useState([])
  const [agentList, setAgentList] = useState([])

  useEffect(() => {
    const getComplaints = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/status`)
        setComplaintList(data)
      } catch (error) {
        console.log(error)
      }
    }

    const getAgents = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/AgentUsers`)
        setAgentList(data)
      } catch (error) {
        console.log(error)
      }
    }

    getComplaints()
    getAgents()
  }, [])

  const handleSelection = async (agentId, complaintId, status, agentName) => {
    try {
      await axios.get(`${API_BASE}/AgentUsers/${agentId}`)
      const assignedComplaint = { agentId, complaintId, status, agentName }
      await axios.post(`${API_BASE}/assignedComplaints`, assignedComplaint)
      setComplaintList(complaintList.filter(c => c._id !== complaintId))
      alert(`Complaint assigned to ${agentName}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Accordion className='accordian' alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Users Complaints</Accordion.Header>
          <Accordion.Body style={{ background: 'aliceblue' }}>
            <div style={{ display: "flex", flexWrap: "wrap", margin: "20px" }}>
              {complaintList.length > 0 ? (
                complaintList.map((complaint, idx) => {
                  const isCompleted = complaint.status === "completed"
                  return (
                    <Card key={idx} style={{ width: '15rem', margin: '0 10px 15px 0' }}>
                      <Card.Body style={{ textAlign: 'center' }}>
                        <Card.Title>Title: {complaint.title}</Card.Title>
                        <div style={{ fontSize: '14px', marginTop: '20px' }}>
                          <Card.Text>Description: {complaint.description}</Card.Text>
                          <Card.Text>Status: {complaint.status}</Card.Text>
                        </div>
                        {!isCompleted && (
                          <Dropdown className='mt-2'>
                            <Dropdown.Toggle variant="warning" id="dropdown-basic">
                              Assign
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {agentList.map((agent, i) => (
                                <Dropdown.Item
                                  key={i}
                                  onClick={() =>
                                    handleSelection(agent._id, complaint._id, complaint.status, agent.name)
                                  }
                                >
                                  {agent.name}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
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
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Agents</Accordion.Header>
          <Accordion.Body style={{ background: 'aliceblue' }}>
            <div style={{ display: "flex", flexWrap: "wrap", margin: "20px" }}>
              {agentList.length > 0 ? (
                agentList.map((agent, idx) => (
                  <Card key={idx} style={{ width: '22rem', margin: '0 10px 15px 0' }}>
                    <Card.Body>
                      <Card.Title>Name: {agent.name}</Card.Title>
                      <Card.Text>Email: {agent.email}</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">
                  <Alert.Heading>No Agents to show</Alert.Heading>
                </Alert>
              )}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Footer />
    </div>
  )
}

export default AccordionAdmin
