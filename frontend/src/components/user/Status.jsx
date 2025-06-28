import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { Button, Spinner } from 'react-bootstrap';
import ChatWindow from '../common/ChatWindow';
import Collapse from 'react-bootstrap/Collapse';

const API_BASE = process.env.REACT_APP_API_URL;

const Status = () => {
  const [toggle, setToggle] = useState({});
  const [statusComplaints, setStatusComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);
    axios
      .get(`${API_BASE}/status/${user._id}`)
      .then((res) => setStatusComplaints(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (complaintId) => {
    setToggle((prev) => ({ ...prev, [complaintId]: !prev[complaintId] }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {statusComplaints.length > 0 ? (
          statusComplaints.map((complaint) => {
            const open = !!toggle[complaint._id];
            return (
              <div key={complaint._id} className="col-md-4 col-sm-6 mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Name: {complaint.name}</Card.Title>
                    <Card.Text>Address: {complaint.address}</Card.Text>
                    <Card.Text>City: {complaint.city}</Card.Text>
                    <Card.Text>State: {complaint.state}</Card.Text>
                    <Card.Text>Pincode: {complaint.pincode}</Card.Text>
                    <Card.Text>Comment: {complaint.comment}</Card.Text>
                    <Card.Text>Status: <strong>{complaint.status}</strong></Card.Text>

                    <Button
                      className="mb-2"
                      onClick={() => handleToggle(complaint._id)}
                      aria-controls={`collapse-${complaint._id}`}
                      aria-expanded={open}
                      variant="primary"
                      aria-label={`Toggle messages for complaint by ${complaint.name}`}
                    >
                      {open ? 'Hide Messages' : 'Message'}
                    </Button>

                    <Collapse in={open}>
                      <div id={`collapse-${complaint._id}`}>
                        <Card body className="mt-3">
                          <ChatWindow
                            key={complaint._id}
                            complaintId={complaint._id}
                            name={complaint.name}
                          />
                        </Card>
                      </div>
                    </Collapse>
                  </Card.Body>
                </Card>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <Alert variant="info">
              <Alert.Heading>No complaints to show</Alert.Heading>
              <p>You haven't submitted any complaints yet.</p>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default Status;
