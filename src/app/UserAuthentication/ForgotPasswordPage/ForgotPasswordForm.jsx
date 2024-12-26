"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the useRouter hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-regular-svg-icons';
import './ForgotPasswordForm.css';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoChevronBackSharp } from 'react-icons/io5';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [verificationErrorMessage, setVerificationErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [otpSent, setOtpSent] = useState('');
    const [enteredOtp, setEnteredOtp] = useState(''); // State to hold entered OTP

    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };



    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const mobileRegex = /^\d{10}$/;

            if (!emailRegex.test(emailOrMobile) && !mobileRegex.test(emailOrMobile)) {
                throw new Error('Please enter a valid email address or 10-digit mobile number.');
            }

            const response = await fetch('https://usermanagementservice-69668940637.asia-east1.run.app/usmapp/checkemail/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken'),
                 },


                body: JSON.stringify({ emailOrMobile }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('OTP sent to your email!');
                sessionStorage.setItem('session_key', data.session_key);
                setStep(2);
                setOtpSent(data.otp);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setPasswordErrorMessage(error.message);
        }
    };

    
    const getCsrfToken = () => {
    const cookies = document.cookie.split('; ');
    const csrfTokenCookie = cookies.find(row => row.startsWith('csrftoken='));
    return csrfTokenCookie ? csrfTokenCookie.split('=')[1] : null; // Return null if not found
};

      const handleVerification = async (e) => {
        e.preventDefault();
        try {
            const csrfToken = getCsrfToken();
            const sessionKey = sessionStorage.getItem('session_key');
            const response = await fetch('https://usermanagementservice-69668940637.asia-east1.run.app/usmapp/verifyotp/', {
                method: 'POST',
                credentials: 'include',  // Ensure cookies are included for session management
                headers: { 
                  'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken || '', 
                 },
                body: JSON.stringify({ otp: verificationCode,session_key: sessionKey })  // Send the entered OTP
            });
    
            const data = await response.json();
            console.log(data);  // Debugging
    
            if (response.ok) {
                alert('OTP verified successfully!');
                setStep(4);  // Proceed to password reset step
            } else {
                setVerificationErrorMessage(data.message || 'Invalid OTP.');
            }
        } catch (error) {
            console.error('Error:', error);
            setVerificationErrorMessage('Network error. Please try again.');
        }
    };    
const handleResetPassword = async (e) => {
    e.preventDefault();

    // Create the data object to be sent in the request body
    const requestData = {
        email_or_mobile: emailOrMobile,  // Identifying information
        new_password: newPassword       // New password
    };

    // Log the request body to the console
    console.log("Request body:", JSON.stringify(requestData));

    try {
        const response = await fetch('https://usermanagementservice-69668940637.asia-east1.run.app/usmapp/resetpassword/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),  // Include CSRF token if necessary
            },
            body: JSON.stringify(requestData), // Sending the body
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            const errorText = await response.text(); // Get the response as text if not OK
            console.error('Error response:', errorText);
            throw new Error(`Failed to reset password. Server responded with: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.success) {
            alert('Password reset successfully!');
            router.push('/UserAuthentication/LoginPage'); // Redirect to the login page
        } else {
            throw new Error(data.error || 'Failed to reset password.');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('There was an error resetting the password: ' + error.message);
    }
};


    const handleGoBack = () => {
        router.back(); // Navigates to the previous page
    };

    return (
        <div className="form-wrapper">
            {step === 1 && (
                <>
                    <div className="top-section">
                        <div className="logoContainer">
                        <button className="back-button" onClick={() => router.back()}>
                              <IoChevronBackSharp size={22} /> {/* Back icon */}
                          </button>
                            <div className="welcomeText">Forgot Password</div>
                        </div>
                    </div>

                    <div className="ForgotPasswordCard">
                        <h1 className="header">Forgot Password</h1>
                        <form onSubmit={handleSubmitEmail}>
                            <label className="red-label" htmlFor="emailOrMobile">Email or Mobile</label>
                            <input
                                id="emailOrMobile"
                                type="text"
                                placeholder="Email or Mobile"
                                value={emailOrMobile}
                                onChange={(e) => setEmailOrMobile(e.target.value)}
                                className="input"
                            />
                            <button type="submit" className="button">Submit</button>
                        </form>
                        {passwordErrorMessage && <p className="alert-error-email">{passwordErrorMessage}</p>}
                    </div>
                </>
            )}

            {step === 2 && (

                <>
                <div className="top-section">
                    <div className="logoContainer">
                    <button className="back-button-verify" onClick={() => router.back()}>
                              <IoChevronBackSharp size={22} /> {/* Back icon */}
                          </button>
                        <div className="welcomeText-verify">Verify</div>
                    </div>
                </div>
                <div className="ForgotPasswordCard">
                    <h2 className="header-verify">Verify Your Email</h2>
                    <p className="instruction-text">Enter the OTP Code sent to your E-mail id</p>
                    <form onSubmit={handleVerification}>
                    <div className="verification-inputs">
    {[...Array(4)].map((_, index) => (
        <input
            key={index}
            type="text"
            maxLength="1"
            className="otp-input"
            value={verificationCode[index] || ''}
            onChange={(e) => {
                const code = verificationCode.split('');
                code[index] = e.target.value;
                setVerificationCode(code.join(''));

                // Automatically move to the next input
                if (e.target.value && index < 3) {
                    const nextSibling = document.querySelector(
                        `.otp-input:nth-child(${index + 2})`
                    );
                    if (nextSibling) {
                        nextSibling.focus();
                    }
                }
            }}
            onKeyDown={(e) => {
                // Handle backspace to move to the previous input
                if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                    const prevSibling = document.querySelector(
                        `.otp-input:nth-child(${index})`
                    );
                    if (prevSibling) {
                        prevSibling.focus();
                    }
                }
            }}
            onFocus={(e) => e.target.select()} // Select the text when focused
        />
    ))}
</div>


                        <button type="submit" className="button-verify">Submit</button>
                    </form>
                    <p className="resend-text">Didn't receive the code? <a className='resend-link' onClick={handleSubmitEmail}>Resend</a></p>
                    {verificationErrorMessage && <p className="alert-error-verify">{verificationErrorMessage}</p>}
                </div>
                </>
            )}
            {step === 3 && (
                <div>
                    <h2 className="header-verify">Verify Your Mobile</h2>
                    <p className="instruction-text">Please enter the 4-digit code sent to your mobile number.</p>
                    <form onSubmit={handleVerification}>
                    <div className="verification-inputs">
    {[...Array(4)].map((_, index) => (
        <input
            key={index}
            type="text"
            maxLength="1"
            className="otp-input"
            value={verificationCode[index] || ''}
            onChange={(e) => {
                const code = verificationCode.split('');
                code[index] = e.target.value;
                setVerificationCode(code.join(''));

                // Automatically move to the next input
                if (e.target.value && index < 3) {
                    const nextSibling = document.querySelector(
                        `.otp-input:nth-child(${index + 2})`
                    );
                    if (nextSibling) {
                        nextSibling.focus();
                    }
                }
            }}
            onKeyDown={(e) => {
                // Handle backspace to move to the previous input
                if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                    const prevSibling = document.querySelector(
                        `.otp-input:nth-child(${index})`
                    );
                    if (prevSibling) {
                        prevSibling.focus();
                    }
                }
            }}
            onFocus={(e) => e.target.select()} // Select the text when focused
        />
    ))}
</div>


                        <button type="submit" className="button-verify">Verify</button>
                    </form>
                    <p className="resend-text">Didn't receive the code? <a href="#" className='resend-link'>Resend</a></p>
                    {verificationErrorMessage && <p className="alert-error-verify">{verificationErrorMessage}</p>}
                </div>
            )}
            {step === 4 && (
              
                <div>
                   <div className="top-section">
                    <div className="logoContainerPassword">
                    <button className="back-button" onClick={() => router.back()}>
                              <IoChevronBackSharp size={22} /> {/* Back icon */}
                          </button>
                        <div className="createpassword">Create New Password</div>
                    </div>
                </div>
                  <div className="CreatePasswordCard">
                    <h2 className="header-password">Create New Password</h2>
                    <form onSubmit={handleResetPassword}>
                        <div className="password-container">
                            <label className="new-password-label" htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input"
                            />
                            <span onClick={togglePasswordVisibility} className="password-toggle">
                                <FontAwesomeIcon icon={showPassword ?  faEye:faEyeSlash} />
                            </span>
                        </div>
                        {passwordErrorMessage && <p className="alert-error">{passwordErrorMessage}</p>}
                        <div className="password-container">
                            <label className="confirm-password-label" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input"
                                disabled={passwordErrorMessage !== ''}
                            />
                            <span onClick={toggleConfirmPasswordVisibility} className="password-toggle">
                                <FontAwesomeIcon icon={showConfirmPassword ? faEye:faEyeSlash} />
                            </span>
                        </div>
                        {confirmPasswordErrorMessage && <p className="alert-error">{confirmPasswordErrorMessage}</p>}
                        <button type="submit" className="button-password">Change Password</button>
                    </form>
                    {showSuccessMessage && (
                      <div className="alert-success">
                            Password has been successfully changed.
                        </div>
                    )}
                </div>
            </div>
            )}
        </div>
    );
};

export default ForgotPassword;