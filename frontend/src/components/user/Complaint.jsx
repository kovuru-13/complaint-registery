import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;

const Complaint = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const initialComplaintState = {
    userId: user._id,
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: 'Pending',  // Defaulted
    comment: '',
  };

  const [userComplaint, setUserComplaint] = useState(initialComplaintState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserComplaint({ ...userComplaint, [name]: value });
  };

  const handleClear = () => {
    setUserComplaint(initialComplaintState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/Complaint/${user._id}`, userComplaint);
      alert('Your complaint has been sent!');
      handleClear();
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white complaint-box">
      <form onSubmit={handleSubmit} className="compliant-form row bg-dark">
        <div className="col-md-6 p-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            name="name"
            value={userComplaint.name}
            onChange={handleChange}
            type="text"
            className="form-control"
            id="name"
            required
          />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            name="address"
            value={userComplaint.address}
            onChange={handleChange}
            type="text"
            className="form-control"
            id="address"
            required
          />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="city" className="form-label">City</label>
          <input
            name="city"
            value={userComplaint.city}
            onChange={handleChange}
            type="text"
            className="form-control"
            id="city"
            required
          />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="state" className="form-label">State</label>
          <input
            name="state"
            value={userComplaint.state}
            onChange={handleChange}
            type="text"
            className="form-control"
            id="state"
            required
          />
        </div>

        <div className="col-md-6 p-3">
          <label htmlFor="pincode" className="form-label">Pincode</label>
          <input
            name="pincode"
            value={userComplaint.pincode}
            onChange={handleChange}
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            className="form-control"
            id="pincode"
            required
          />
        </div>

        {/* Status field hidden, but set automatically */}
        <input type="hidden" name="status" value={userComplaint.status} />

        <div className="col-12 p-3">
          <label htmlFor="comment" className="form-label">Description</label>
          <textarea
            name="comment"
            value={userComplaint.comment}
            onChange={handleChange}
            className="form-control"
            id="comment"
            rows="4"
            required
          />
        </div>

        <div className="text-center p-1 col-12">
          <button
            type="submit"
            className="mt-2 btn btn-success"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Complaint;
