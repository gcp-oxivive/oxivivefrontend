'use client'
import React from 'react';
import './CompleteBooking.css';
import { IoLocationSharp } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillEyeInvisible } from 'react-icons/ai';
import { FaStar, FaDollarSign } from "react-icons/fa";
import { useRouter, useSearchParams } from 'next/navigation';

const CompleteBooking = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get('id');
  const bookingStatus = searchParams.get('status');
  const serviceType = searchParams.get('serviceType');
  const appointmentDate = searchParams.get('appointmentDate');
  const appointmentTime = searchParams.get('appointmentTime');
  const providerName = searchParams.get('name');
  const providerLocation = searchParams.get('location');
  const serviceprice = searchParams.get('service_price');

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className='container'>
      <header className='header-container'>
        <span className="back-arrow" onClick={handleBackClick}><IoIosArrowBack /></span>
        {/* <h1>Booking #{bookingId}</h1> */}
      </header>
      <main className='main-container'>
        <section className="service-item">
          <div>
            <p className="service-title">{serviceType}</p>
          </div>
          {/* <p className="service-price">$&nbsp;49</p> */}
        </section>
        <section className="job-info">
          <div className="job-header">
            {/* <p className="job-id">#{bookingId}</p> */}
            <span className="status">{bookingStatus}</span>
          </div>
          <p className="provider-name">{providerName}</p>
          {/* <p className="provider-company">GTPL Pvt. Ltd.</p> */}
          <p className="provider-address"><IoLocationSharp />{providerLocation}</p>
        </section>
        <section className="user-info">
          <div className="user-rating-header">
            <div>
              <p className="user-name">{providerName}</p>
            </div>
            <img src="/images/doctor.png" alt="User Avatar" className="user-avatar"/>
          </div>
          <p className="completion-time">Job Completed at {appointmentTime} on {appointmentDate}</p>
        </section>
        <section className="vendor-comment">
          <p>Vendor Comment</p>
          <span className="comment-text">Comment from vendor</span>
          <div className="password-eye-container">
            <h1>..............</h1>
            <AiFillEyeInvisible className="password-eye-icon" />
          </div>
        </section>
        <section className="order-summary">
          <p className="summary-title">Order Summary</p>
          <p className="summary-item">Subtotal <span>{serviceprice}</span></p>
          <p className="summary-item">Est. Tax <span>$12.00</span></p>
          <p className="summary-total">Total <span className="price"><FaDollarSign className="dollar-icon" />{serviceprice}</span></p>
          <p className="bill-info">We've sent a copy of this bill to your email id </p>
          <a href="mailto:support@rightjoy.com" className='support'>support@rightjoy.com</a>
        </section>
        <footer>
          <button className="feedback-button">Give Feedback</button>
        </footer>
      </main>
    </div>
  );
};

export default CompleteBooking;
