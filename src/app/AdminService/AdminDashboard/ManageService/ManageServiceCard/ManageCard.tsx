'use client';
import React from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaHome, FaCartPlus, FaChartArea, FaSignOutAlt } from 'react-icons/fa';
import { BiSolidBookAdd } from 'react-icons/bi';
import { MdOutlinePeopleAlt, MdOutlineInventory, MdManageAccounts } from 'react-icons/md';
import { FaPeopleGroup } from 'react-icons/fa6';
import './ManageCard.css';

const ManageCard: React.FC = () => {
  return (
    <div className="manage-service">
      <aside className="manage-sidebar">
        <div className="logo-container">
          <img src="/images/shot.png" alt="Logo" className="logo-img" />
          <p className="logo-text">Super Admin</p>
        </div>

        <nav className="sidebar-icons">
          <div className="sidebar-icon" data-name="Admin">
            <FaHome />
          </div>
          <div className="sidebar-icon" data-name="Invoice">
            <FaCartPlus />
          </div>
          <div className="sidebar-icon" data-name="Booking">
            <BiSolidBookAdd />
          </div>
          <div className="sidebar-icon" data-name="Vendor Approval">
            <FaPeopleGroup />
          </div>
          <div className="sidebar-icon" data-name="Revenue">
            <FaChartArea />
          </div>
          <div className="sidebar-icon" data-name="Manage Service">
            <MdManageAccounts />
          </div>
          <div className="sidebar-icon" data-name="Inventory">
            <MdOutlineInventory />
          </div>
          <div className="sidebar-icon" data-name="Vendor">
            <MdOutlinePeopleAlt />
          </div>
          <div className="sidebar-icon logout-icon" data-name="Logout">
            <FaSignOutAlt />
          </div>
        </nav>
      </aside>

      <main className="content">
        <header className="header2">
          <h2 className="page-title">Manage Service</h2>
        </header>

        <div className="actions">
          <button className="add-service-btn">
            <IoMdAddCircleOutline className="add-icon" /> Add Service
          </button>
        </div>

        <section className="service-details">
        <div className="details-top">
  <div className="left-section">
    <img src="/images/oxi_clinic.jpg" alt="Oxi Clinic" className="service-image" />
    <h2 className="service-name">Oxi Clinic</h2>
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
    <p className="service-price"><strong>Service Price:</strong> <span className="price">2,000 Rs</span></p>
  </div>
</div>

          
          <div className="details-content">
            <div className="left-section">
              <p><strong>Service of:</strong> HYPERBARIC OXYGEN THERAPY (HBOT)</p>
              <p><strong>Description:</strong> Unleash your mind's potential with our cutting-edge anti-aging treatments. Hyperbaric Oxygen Therapy (HBOT) is a treatment in which a patient breathes air or varying amounts of oxygen while inside a pressurized chamber, the pressure being anything above 1 atmosphere.</p>
              <p><strong>Session Timing:</strong> 60 – 90 minute sessions</p>
              <h4 className='head4'>Need to do 40 sessions?:</h4>
              <ul className='ul2'>
                <li>1–5 sessions: Improve cellular energy.</li>
                <li>5–10 sessions: Typically used for acute injuries with soft tissue damage.</li>
                <li>10–20 sessions: More serious acute injuries or chronic injuries.</li>
                <li>20–40 sessions: Commonly used for major tissue damages and when new tissue is required.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManageCard;