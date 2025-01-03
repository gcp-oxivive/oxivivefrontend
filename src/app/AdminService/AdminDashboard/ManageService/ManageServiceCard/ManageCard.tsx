"use client"
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from "../../../Sidebar/Sidebar";
import './ManageCard.css';

const ManageCard: React.FC = () => {
  const searchParams = useSearchParams();
  const image = searchParams.get('image') || '/images/default.jpg'; // Fallback to a default image
  const heading = searchParams.get('heading') || 'Default Service';
  const price = searchParams.get('price') || '0'; // Default price
  const service = searchParams.get('service') || 'N/A'; // Default service
  const description = searchParams.get('description') || 'No description available'; // Default description

  return (
    <div className="manage-service">
      <Sidebar />
      <main className="managecontent">
        <header className="header2">
          <h2 className="page-title1">Manage Service</h2>
        </header>

        {/* <div className="actions">
          <button className="add-service-btn2">Add Service</button>
        </div> */}

        <section className="service-details">
          <div className="details-top">
            <div className="left-section">
              <img src={image} alt={heading} className="service-image" />
              <h2 className="service-name">{heading}</h2>
            </div>

            <div className="right-section">
              <h3 className="head6">Benefits:</h3>
              <ul className="benefits">
                <li>Increased oxygen perfusion</li>
                <li>Neovascularization (new blood vessel growth)</li>
                <li>Improved white blood cell function</li>
                <li>Enhanced healing factors</li>
                <li>Wound healing and new tissue generation</li>
              </ul>
              <p className="service-price">
                <strong>Service Price:</strong> <span className="price">{price} Rs</span>
              </p>
            </div>
          </div>

          <div className="details-content">
            <div className="left-section">
              <p>
                <strong>Service:</strong> {service}
              </p>
              <p>
                <strong>Description:</strong> {description}
              </p>
              <p>
                <strong>Session Timing:</strong> 60 – 90 minute sessions
              </p>
              <div className="sessions-container">
  <h4 className="sessions-heading">
    Need to do 40 sessions?: 
  </h4>
  <p className="sessions-content">
    1–5 sessions: Improve cellular energy.<br />
    5–10 sessions: Typically used for acute injuries with soft tissue damage.<br />
    10–20 sessions: More serious acute injuries or chronic injuries.<br />
    20–40 sessions: Commonly used for major tissue damages and when new tissue is required.
  </p>
</div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManageCard;

