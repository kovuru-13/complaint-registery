import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container } from 'react-bootstrap';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import Footer from '../common/FooterC';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;

const AgentInfo = () => {
  const navigate = useNavigate();
  const [agentList, setAgentList] = useState([]);
  const [toggle, setToggle] = useState({});
  const [updateAgents, setUpdateAgents] = useState({}); // store per-agent updates

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${API_BASE}/AgentUsers`);
      setAgentList(response.data);
    } catch (error) {
      console.error('Error fetching agent list:', error);
    }
  };

  const handleToggle = (agentId) => {
    setToggle((prev) => ({ ...prev, [agentId]: !prev[agentId] }));
    // Initialize form for this agent if not already set
    const agentData = agentList.find((a) => a._id === agentId);
    if (!updateAgents[agentId]) {
      setUpdateAgents((prev) => ({
        ...prev,
        [agentId]: {
          name: agentData.name || '',
          email: agentData.email || '',
          phone: agentData.phone || '',
        },
      }));
    }
  };

  const handleChange = (agentId, e) => {
    const { name, value } = e.target;
    setUpdateAgents((prev) => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (agentId) => {
    const updateData = updateAgents[agentId];
    if (!updateData.name && !updateData.email && !updateData.phone) {
      alert('At least one field needs to be filled');
      return;
    }
    if (!window.confirm('Are you sure you want to update this agent?')) return;

    try {
      await axios.put(`${API_BASE}/user/${agentId}`, updateData);
      alert('Agent updated successfully');
      fetchAgents();
      setToggle((prev) => ({ ...prev, [agentId]: false }));
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  };

  const deleteUser = async (agentId) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;

    try {
      await axios.delete(`${API_BASE}/AgentUsers/${agentId}`); // Assuming correct endpoint
      setAgentList((prev) => prev.filter((agent) => agent._id !== agentId));
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  return (
    <>
      <div className="body">
        <Container>
          {agentList.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {agentList.map((agent) => {
                  const open = toggle[agent._id] || false;
                  const formData = updateAgents[agent._id] || { name: '', email: '', phone: '' };
                  return (
                    <React.Fragment key={agent._id}>
                      <tr>
                        <td>{agent.name}</td>
                        <td>{agent.email}</td>
                        <td>{agent.phone}</td>
                        <td>
                          <Button
                            onClick={() => handleToggle(agent._id)}
                            aria-controls={`collapse-${agent._id}`}
                            aria-expanded={open}
                            className="mx-2"
                            variant="outline-warning"
                          >
                            Update
                          </Button>
                          <Button
                            onClick={() => deleteUser(agent._id)}
                            className="mx-2"
                            variant="outline-danger"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="4" style={{ padding: 0, border: 0 }}>
                          <Collapse in={open}>
                            <div id={`collapse-${agent._id}`} className="p-3 bg-light">
                              <Form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleSubmit(agent._id);
                                }}
                              >
                                <Form.Group className="mb-3" controlId={`name-${agent._id}`}>
                                  <Form.Label>Full Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange(agent._id, e)}
                                    placeholder="Enter name"
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId={`email-${agent._id}`}>
                                  <Form.Label>Email address</Form.Label>
                                  <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange(agent._id, e)}
                                    placeholder="Enter email"
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId={`phone-${agent._id}`}>
                                  <Form.Label>Phone</Form.Label>
                                  <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleChange(agent._id, e)}
                                    placeholder="Enter phone"
                                  />
                                </Form.Group>
                                <Button variant="success" size="sm" type="submit">
                                  Submit
                                </Button>
                              </Form>
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">
              <Alert.Heading>No Agents to show</Alert.Heading>
            </Alert>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default AgentInfo;
