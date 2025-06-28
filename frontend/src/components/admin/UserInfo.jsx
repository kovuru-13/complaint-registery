import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import { Container } from 'react-bootstrap'
import Collapse from 'react-bootstrap/Collapse'
import Form from 'react-bootstrap/Form'
import Footer from '../common/FooterC'
import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_URL

const UserInfo = () => {
  const navigate = useNavigate()
  const [ordinaryList, setOrdinaryList] = useState([])
  const [toggle, setToggle] = useState({})
  const [updateUser, setUpdateUser] = useState({})

  // Handle input change per user
  const handleChange = (e, userId) => {
    const { name, value } = e.target
    setUpdateUser((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [name]: value,
      },
    }))
  }

  // Submit updated user info
  const handleSubmit = async (userId) => {
    const updatedFields = updateUser[userId] || {}
    if (!updatedFields.name && !updatedFields.email && !updatedFields.phone) {
      alert('At least one field needs to be filled')
      return
    }

    const originalUser = ordinaryList.find((u) => u._id === userId)
    const payload = {
      name: updatedFields.name || originalUser.name,
      email: updatedFields.email || originalUser.email,
      phone: updatedFields.phone || originalUser.phone,
    }

    if (!window.confirm('Are you sure you want to update the user?')) return

    try {
      await axios.put(`${API_BASE}/user/${userId}`, payload)
      alert('User updated successfully')
      const { data } = await axios.get(`${API_BASE}/OrdinaryUsers`)
      setOrdinaryList(data)
      setToggle((prev) => ({ ...prev, [userId]: false }))
      setUpdateUser((prev) => ({ ...prev, [userId]: {} }))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const getOrdinaryRecords = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/OrdinaryUsers`)
        setOrdinaryList(data)
      } catch (error) {
        console.error(error)
      }
    }
    getOrdinaryRecords()
  }, [])

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete the user?')) return
    try {
      await axios.delete(`${API_BASE}/OrdinaryUsers/${userId}`)
      setOrdinaryList((prev) => prev.filter((u) => u._id !== userId))
    } catch (error) {
      console.error(error)
    }
  }

  const handleToggle = (userId) => {
    setToggle((prev) => ({ ...prev, [userId]: !prev[userId] }))
  }

  return (
    <>
      <div className="body">
        <Container>
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
              {ordinaryList.length > 0 ? (
                ordinaryList.map((user) => {
                  const open = !!toggle[user._id]
                  return (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <Button
                          onClick={() => handleToggle(user._id)}
                          aria-controls={`collapse-${user._id}`}
                          aria-expanded={open}
                          className="mx-2"
                          variant="outline-warning"
                        >
                          Update
                        </Button>
                        <Collapse in={open}>
                          <div>
                            <Form
                              onSubmit={(e) => {
                                e.preventDefault()
                                handleSubmit(user._id)
                              }}
                              className="p-4"
                            >
                              <Form.Group className="mb-3" controlId={`formName-${user._id}`}>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                  name="name"
                                  value={updateUser[user._id]?.name || ''}
                                  onChange={(e) => handleChange(e, user._id)}
                                  type="text"
                                  placeholder="Enter name"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3" controlId={`formEmail-${user._id}`}>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                  name="email"
                                  value={updateUser[user._id]?.email || ''}
                                  onChange={(e) => handleChange(e, user._id)}
                                  type="email"
                                  placeholder="Enter email"
                                />
                              </Form.Group>
                              <Form.Group className="mb-3" controlId={`formPhone-${user._id}`}>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                  name="phone"
                                  value={updateUser[user._id]?.phone || ''}
                                  onChange={(e) => handleChange(e, user._id)}
                                  type="tel"
                                  placeholder="Enter phone number"
                                />
                              </Form.Group>
                              <Button size="sm" variant="outline-success" type="submit">
                                Submit
                              </Button>
                            </Form>
                          </div>
                        </Collapse>
                        <Button
                          onClick={() => deleteUser(user._id)}
                          className="mx-2"
                          variant="outline-danger"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="4">
                    <Alert variant="info" className="text-center m-0">
                      No Users to show
                    </Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
      </div>
      <Footer />
    </>
  )
}

export default UserInfo
