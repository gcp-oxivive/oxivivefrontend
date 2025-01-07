"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './StartPage/HomePage.css';

function HomePage() {
  const router = useRouter();

  // Prefetch login page when the component loads
  useEffect(() => {
    router.prefetch('/UserAuthentication/LoginPage');
    router.prefetch('/UserAuthentication/SignupPage');
  }, [router]);

  const handleLoginClick = () => {
    router.push('/UserAuthentication/LoginPage'); // Navigate to LoginForm
  };

  const handleSignupClick = () => {
    router.push('/UserAuthentication/SignupPage'); // Navigate to SignupForm
  };

  return (
    <div className="container">
      <div className="button-section">
        <div className="logo-section">
          <img src="/images/shot.png" alt="Oxivive Shot Logo" className="logo" />
          <h1 className="brand-name">Oxivive</h1>
        </div>
        <div className="content-section">
          <h2>OXIVIVE - Where Science Meets Technology</h2>
        </div>
        <div className='button-container'>
          <button className="login-button" onClick={handleLoginClick}>
            Login
          </button>
          <button className="signup-button" onClick={handleSignupClick}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
