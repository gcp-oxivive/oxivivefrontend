'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './SignupForm.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  pincode?: string;
  panNumber?: string;
  profilePhoto?: string;
  apiError?: string;
}

const SignupForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const [panNumber, setPanNumber] = useState<string>('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoName, setProfilePhotoName] = useState<string>(''); // For displaying the file name
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const router = useRouter();

  const togglePasswordVisibility = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    return strongPasswordPattern.test(password);
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phoneNumber);
  };

  const validatePincode = (pincode: string): boolean => {
    const pincodePattern = /^\d{6}$/;
    return pincodePattern.test(pincode);
  };

  const validatePanNumber = (panNumber: string): boolean => {
    const panPattern = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
    return panPattern.test(panNumber);
  };

  const handleNumberInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    e.target.name === 'phoneNumber' ? setPhoneNumber(value) : setPincode(value);
  };

  const handlePanInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toUpperCase();
    setPanNumber(value);
  };

  const handleProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setProfilePhoto(file);
    setProfilePhotoName(file ? file.name : ''); // Set the file name for display
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const validationErrors: ValidationErrors = {};

    // Validate form inputs
    if (!name) validationErrors.name = 'Name is required.';
    if (!email || !validateEmail(email)) validationErrors.email = 'Invalid email address.';
    if (!password || !validatePassword(password)) {
      validationErrors.password = 'Required 8 characters, including numbers, @#!$';
    }
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) validationErrors.phoneNumber = 'Phone number must be exactly 10 digits.';
    if (!pincode || !validatePincode(pincode)) validationErrors.pincode = 'Pincode must be exactly 6 digits.';
    if (!panNumber || !validatePanNumber(panNumber)) validationErrors.panNumber = 'Invalid PAN number format.';
    if (!profilePhoto) validationErrors.profilePhoto = 'Profile photo is required.';

    setErrors(validationErrors);

    // Proceed only if no validation errors
    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone_number', phoneNumber);
      formData.append('pincode', pincode);
      formData.append('pan_number', panNumber);
     

      // Set gst_number and address to null
      formData.append('gst_number', '');
      formData.append('address', '');

      try {
        // Upload image to Cloudinary
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', profilePhoto as Blob);
        cloudinaryFormData.append('upload_preset', 'signup image'); // Replace with your actual preset
        const uploadResponse = await axios.post(
          'https://api.cloudinary.com/v1_1/ddtfd7o0h/image/upload',
          cloudinaryFormData
        );
        const photoUrl = uploadResponse.data.secure_url;

        // Add Cloudinary URL to the form data
        formData.append('profile_photo', photoUrl);

        // Submit to your backend
        const response = await axios.post('https://usermanagementservice-69668940637.asia-east1.run.app/usmapp/Oxi/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccessMessage('Signup successful!');
        console.log('Signup successful:', response.data);

        setTimeout(() => {
          router.push('/UserAuthentication/LoginPage');
        }, 2000);
      } catch (error: any) {
        console.error('Error signing up:', error.response?.data || error.message);
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        } else {
          setErrors({ apiError: 'Failed to sign up. Please try again later.' });
        }
      }
    }
  };

  const handleGoogleSignUp = (): void => {
    const userEmail = prompt('Enter your Google email:', 'example@gmail.com');
    if (userEmail) {
      setEmail(userEmail);
      alert(`Google sign-up successful! Your email: ${userEmail}`);
    }
  };

  const handleSignInClick = (): void => {
    router.push('/UserAuthentication/LoginPage');
  };

  return (
    <div className="signup-container">
      <div className="logoContainer">
        <img src="/images/shot(1).png" alt="Logo" className="logo21" />
        <h1 className="welcomeText">Oxivive</h1>
      </div>
      <div className="signup-card">
        <h2 className="service-provider-title">Sign up</h2>
        {successMessage && <p className="alert-success">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-field">
          <label htmlFor="name" style={{ color: '#c1bebe' }}>Name</label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="input-field">
          <label htmlFor="email" style={{ color: '#c1bebe' }}>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          
          <div className="input-field password-field">
          <label htmlFor="password" style={{ color: '#c1bebe' }}>Password</label>
            <div className="password-wrapper">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
              </span>
            </div>
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="input-field">
          <label htmlFor="phoneNumber" style={{ color: '#c1bebe' }}>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              maxLength={10}
              value={phoneNumber}
              onChange={handleNumberInput}
            />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
          </div>
          <div className="input-field">
          <label htmlFor="pincode" style={{ color: '#c1bebe' }}>Pincode</label>
            <input
              type="tel"
              name="pincode"
              placeholder="Pincode"
              maxLength={6}
              value={pincode}
              onChange={handleNumberInput}
            />
            {errors.pincode && <span className="error">{errors.pincode}</span>}
          </div>
          <div className="input-field">
          <label htmlFor="panNumber" style={{ color: '#c1bebe' }}>PAN Number</label>
            <input
              type="text"
              placeholder="PAN Number"
              maxLength={10}
              value={panNumber}
              onChange={handlePanInput}
              pattern="[A-Z]{5}\d{4}[A-Z]{1}"
            />
            {errors.panNumber && <span className="error">{errors.panNumber}</span>}
          </div>
          <div className="input-field upload-field">
          
            <label htmlFor="profile-photo" >
              
              <span className="camera-plus-icon">
                <i className="fas fa-camera"></i>
              </span> {profilePhotoName ? profilePhotoName : "Upload Profile Photo"}
            </label>
            <input
              type="file"
              id="profile-photo"
              onChange={handleProfilePhotoChange}
              style={{ display: 'none' }} // Hide the default input
            />
           
            {errors.profilePhoto && <span className="error">{errors.profilePhoto}</span>}
          </div>
          {errors.apiError && <span className="error">{errors.apiError}</span>}


          <button type="submit" className='submit-button'>Sign Up</button>
          <p className="sign-in-link">
            Already have an account?{' '}
            <span className="sign-in-button" onClick={handleSignInClick}>
              Sign in
            </span>
          </p>
          <a className="service-provider-link" onClick={() => router.push('/VendorManagementService/SV/Service/')}>Service Provider</a>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
