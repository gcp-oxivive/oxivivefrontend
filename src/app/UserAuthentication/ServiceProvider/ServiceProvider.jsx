'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ServiceProvider.css';

const ServiceProvider = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    mobile_number: '',
    address: '',
    gst_number: '',
    pan_number: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);  // New state for form submission
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile_number' && value.length > 10) return;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password: 8+ chars, upper, lower, number, symbol';
    }

    if (!formData.mobile_number) {
      newErrors.mobile_number = 'Mobile number is required';
    } else if (formData.mobile_number.length !== 10) {
      newErrors.mobile_number = 'Mobile number must be 10 digits';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.gst_number.trim()) {
      newErrors.gst_number = 'GST number is required';
    } else if (formData.gst_number.length !== 15) {
      newErrors.gst_number = 'GST number must be 15 characters long';
    }

    if (!formData.pan_number.trim()) {
      newErrors.pan_number = 'PAN number is required';
    } else if (formData.pan_number.length !== 10) {
      newErrors.pan_number = 'PAN number must be 10 characters long';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    const requestData = {
        name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.mobile_number,
        address: formData.address,
        gst_number: formData.gst_number,
        pan_number: formData.pan_number,
    };

    console.log('Request Data:', requestData); // Log request payload

    try {
        const response = await fetch('https://usermanagementservice-69668940637.asia-east1.run.app/usmapp/serviceprovider/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            console.log('Form submitted successfully'); // Debugging log
            setIsSubmitted(true); // Set submission success state
            setFormData({
                full_name: '',
                email: '',
                password: '',
                mobile_number: '',
                address: '',
                gst_number: '',
                pan_number: '',
            });
            setErrors({});
        } else if (response.status === 400) {
            const errorData = await response.json(); // Log the error response
            console.error('Validation Errors:', errorData);
            setErrors(errorData); // Display errors below fields
        } else {
            console.error('Error creating account:', response.statusText);
            alert('Error creating account. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save data. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="submission-confirmation">
        {/* Tick Icon */}
        <img 
          src="/images/tick.png" 
          alt="Success" 
          className="tick-icon" 
        />
  
        {/* Document Submitted Successfully Text */}
        <h2 className="submission-success">Document Submitted Successfully!</h2>
  
        {/* Wait for Approval Text */}
        <p className="wait-approval">Wait for approval</p>
  
        {/* Back Button */}
        <button
          className="back-button"
          onClick={() => router.push('/UserAuthentication/LoginPage')}
        >
          Back
        </button>
      </div>
    );
  }   

  return (
    <div className="signup-container">
      <div className="top-section">
        <div className="logoContainer">
          <img src="/images/shot(1).png" alt="Logo" className="logo" />
          <h1 className="welcomeText">Oxivive</h1>
        </div>
      </div>
      <div className="signup-card">
        <h2 className="service-provider-title">CREATE NEW ACCOUNT</h2>
        <form className="service-provider-form" onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="input-container">
            <input
              type="text"
              name="full_name"
              placeholder="Full name"
              className="service-provider-input"
              value={formData.full_name}
              onChange={handleInputChange}
            />
            {errors.full_name && (
              <span className="error-message">{errors.full_name}</span>
            )}
          </div>

          {/* Email Input */}
          <div className="input-container">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="service-provider-input"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Password Input with Visibility Toggle */}
          <div className="input-container">
            <div className="service-provider-password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                className="service-provider-input-password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Mobile Number Input */}
          <div className="input-container">
            <input
              type="tel"
              name="mobile_number"
              placeholder="Mobile number"
              className="service-provider-input"
              value={formData.mobile_number}
              onChange={handleInputChange}
              maxLength={10}
            />
            {errors.mobile_number && (
              <span className="error-message">{errors.mobile_number}</span>
            )}
          </div>

          {/* Address Input */}
          <div className="input-container">
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="service-provider-input"
              value={formData.address}
              onChange={handleInputChange}
            />
            {errors.address && (
              <span className="error-message">{errors.address}</span>
            )}
          </div>

          {/* GST Number Input */}
          <div className="input-container">
            <input
              type="text"
              name="gst_number"
              placeholder="GST number"
              className="service-provider-input"
              value={formData.gst_number}
              onChange={handleInputChange}
            />
            {errors.gst_number && (
              <span className="error-message">{errors.gst_number}</span>
            )}
          </div>

          {/* PAN Number Input */}
          <div className="input-container">
            <input
              type="text"
              name="pan_number"
              placeholder="PAN number"
              className="service-provider-input"
              value={formData.pan_number}
              onChange={handleInputChange}
            />
            {errors.pan_number && (
              <span className="error-message">{errors.pan_number}</span>
            )}
          </div>

          {/* Button Container */}
          <div className="service-provider-button-container">
            <button
              type="button"
              className="service-provider-button-prev"
              onClick={() => router.push('/UserAuthentication/SignupPage')}
            >
              &#x276E; PREVIEW
            </button>
            <button type="submit" className="service-provider-button-next">
              NEXT &#x276F;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceProvider;
