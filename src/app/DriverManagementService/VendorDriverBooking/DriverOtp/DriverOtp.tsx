'use client';
import React, { useState } from 'react';
import './DriverOtp.css';
import { SlHome } from "react-icons/sl";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { LuBookPlus } from "react-icons/lu";
import { useRouter, useSearchParams } from 'next/navigation';
import { IoChevronBackSharp } from 'react-icons/io5';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the Toast notifications
import { showToast } from "../../../DashBoard/customtoast/page";

const getCsrfToken = () => {
  const cookies = document.cookie.split('; ');
  const csrfTokenCookie = cookies.find(row => row.startsWith('csrftoken='));
  return csrfTokenCookie ? csrfTokenCookie.split('=')[1] : null; // Return null if not found
};

const DriverOtp = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const email = searchParams.get('email');  // Get email from URL query

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus the next input
      if (element.nextSibling) {
        (element.nextSibling as HTMLInputElement).focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        // Focus the previous input
        const target = e.target as HTMLInputElement;
        if (target.previousSibling) {
          (target.previousSibling as HTMLInputElement).focus();
        }
      } else {
        // Clear the current input
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    const enteredOtp = otp.join('');
    const csrfToken = getCsrfToken();
    const sessionKey = sessionStorage.getItem('session_key');
  
    if (!sessionKey) {
      showToast("error", "Session key is missing. Please request a new OTP.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(
        'https://drivermanagementservice-69668940637.asia-east1.run.app/api/driver-validate-otp/',
        { email, otp: enteredOtp, session_key: sessionKey },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken || '', // Include CSRF token
          },
          withCredentials: true, // Include cookies in the request
        }
      );
  
      if (response.status === 200) {
        showToast("success", "OTP validated successfully");
        router.push('/DriverManagementService/VendorDriverBooking/MyBooking');
      } else {
        setErrorMessage(response.data.error || 'Invalid OTP');
        showToast(response.data.error || "Invalid OTP", "error");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.error || 'Invalid OTP');
        showToast(error.response.data.error || "Invalid OTP", "error");
      } else {
        setErrorMessage('Network error. Please try again.');
        showToast("error", "Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">
          <button className="back-button" onClick={() => router.back()}>
            <IoChevronBackSharp size={20} /> {/* Back icon */}
          </button>
          <span className="welcome">Enter OTP to Start</span>
          <span className="oxiwheel">Please enter the 5-digit OTP sent to <br />the customer</span>
        </h1>
      </header>

      <div className="main">
        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-inputs">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="otp-input"
                value={otp[index]}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)} // Add this line
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Validating...' : 'Submit'}
          </button>
        </form>
      </div>
      <ToastContainer className="toast-container"/>

      <footer className="footer">
        <div className="footerItem">
          <SlHome className="footerIcon" />
          <p>Home</p>
        </div>
        <div className="footerItem" onClick={() => handleNavigation('/DriverManagementService/VendorDriverBooking/MyBooking')}>
          <LuBookPlus className="footerIcon" />
          <p>Booking</p>
        </div>
        <div className="footerItem">
          <IoNotificationsOutline className="footerIcon" />
          <p>Notification</p>
        </div>
        <div className="footerItem">
          <BsPerson className="footerIcon" />
          <p>Profile</p>
        </div>
      </footer>
    </div>
  );
};

export default DriverOtp;
