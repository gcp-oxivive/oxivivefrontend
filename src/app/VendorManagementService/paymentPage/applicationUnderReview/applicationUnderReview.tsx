'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import './applicationUnderReview.css';

const ApplicationUnderReview: React.FC = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/UserAuthentication/SignupPage'); // Redirect to the homepage
  };

  return (
    <div className="application-under-review">
      <img src="/images/review.png" alt="Application Under Review" className="review-image" />
      <p className="review-text">Your application is under review.</p>
      <p className="review-text-below">Approval is in progress.</p>
      <button className="back-to-home-btn" onClick={handleBackToHome}>
        Back to Homepage
      </button>
    </div>
  );
};

export default ApplicationUnderReview;
