'use client';
import React, { useState } from 'react';
import './AccountPage.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AccountPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !identifier) {
      setError('Email and Identifier (Username/Contact) are required.');
      return;
    }

    setIsLoading(true); // Start loading
    const payload = { email, identifier };

    try {
      const { data } = await axios.post('https://adminservice-69668940637.asia-east1.run.app/api/login/', payload);

      if (data.success) {
        const { usertype, user } = data;

        // Navigate immediately to avoid delay
        const navigateTo = usertype === 'SuperAdmin'
          ? '/AdminService/AdminDashboard/Dashboard/'
          : '/AdminServiceClinics/Dashboard/';
        router.push(navigateTo);

        // Store user details asynchronously
        setTimeout(() => {
          localStorage.setItem('userDetails', JSON.stringify({
            usertype,
            email: user.email,
            identifier: user.contact || user.username,
            admin_id: user.admin_id,
            state: user.state,
          }));
        }, 0); // Offload to the next tick
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setError('An error occurred while logging in.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="container1">
      <div className="leftSection">
        <div className="circleBackground">
          <div className="logoContainer1">
            <img src="/images/shot(1).png" alt="Oxivive Logo" className="logo1" />
            <h1 className="brand">Oxivive</h1>
          </div>
        </div>
        <p className="tagline">Where Science Meets Technology</p>
        <p className="description">
          At Oxivive, we're not just slowing down the aging process – we're smashing the clock and unlocking your body’s hidden potential with SHOT therapy.
        </p>
      </div>
      <div className="rightSection">
        <div className="formContainer">
          <h2 className="title">Log In to Your Account</h2>
          <form className="form" onSubmit={handleLogin}>
            <div className="inputGroup">
              <FaEnvelope className="icon3" />
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="inputGroup">
              <FaLock className="icon3" />
              <input
                type="text"
                placeholder="Password"
                className="input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <button type="submit" className="signupButton" disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
            {error && <p className="errorMessage">{error}</p>}
          </form>
          {isLoading && <div className="loadingSpinner">Loading...</div>}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
