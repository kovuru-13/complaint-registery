import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../common/FooterC';
import Complaint from '../user/Complaint';
import Status from '../user/Status';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('Complaint');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getData = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          navigate('/');
          return;
        }

        const user = JSON.parse(storedUser);
        setUserName(user?.name || 'User');
      } catch (error) {
        console.error('Invalid user data:', error);
        navigate('/');
      }
    };

    getData();
  }, [navigate]);

  const handleNavLinkClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <h1 className="navbar-brand text-light">Hi, {userName}</h1>
          <div className="mt-2 navbar-collapse text-light">
            <ul className="navbar-nav me-auto mb-lg-0">
              <li className="nav-item mb-2">
                <button
                  className={`nav-link btn btn-link text-light ${activeComponent === 'Complaint' ? 'fw-bold' : ''}`}
                  onClick={() => handleNavLinkClick('Complaint')}
                >
                  Complaint Register
                </button>
              </li>
              <li className="nav-item mb-2">
                <button
                  className={`nav-link btn btn-link text-light ${activeComponent === 'Status' ? 'fw-bold' : ''}`}
                  onClick={() => handleNavLinkClick('Status')}
                >
                  Status
                </button>
              </li>
            </ul>
          </div>
          <button className="btn btn-danger" onClick={handleLogout}>
            LogOut
          </button>
        </div>
      </nav>

      <div className="body">
        <div className="container py-3">
          {activeComponent === 'Complaint' && <Complaint />}
          {activeComponent === 'Status' && <Status />}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
