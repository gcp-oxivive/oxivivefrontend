'use client';
import React, { useState } from 'react';
import { FaBookOpen, FaAmbulance, FaSignOutAlt, FaFileInvoice } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { MdSpaceDashboard, MdOutlineInventory } from "react-icons/md";
import { FaUserDoctor, FaPersonCirclePlus } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import './Sidebar.css';

const Sidebar = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const router = useRouter();

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const handleConfirmLogout = () => {
    console.log("User logged out");
    router.push('/AdminService/AdminDashboard/AccountPage');
  };

  return (
    <>
      <aside className="admin-sidebar">
        <div className="logo">
          <img src="/images/shot(1).png" alt="Logo" />
          <p>Admin</p>
        </div>
        <nav className="sidebar-icons">
          {/* Dashboard */}
          <div
            className="sidebar-icon"
            data-name="Dashboard"
          >
            <MdSpaceDashboard onClick={() => router.push('/AdminServiceClinics/Dashboard')}/>
          </div>

          {/* Booking List */}
          <div
            className="sidebar-icon"
            data-name="Bookinglist"
          >
            <FaBookOpen onClick={() => router.push('/AdminServiceClinics/Booking')}/>
          </div>

          {/* Vendor List */}
          <div
            className="sidebar-icon"
            data-name="Vendorlist"
          >
            <IoPeople onClick={() => router.push('/AdminServiceClinics/Vendorlist')}/>
          </div>

          {/* Inventory */}
          <div
            className="sidebar-icon"
            data-name="Inventory"
          >
            <MdOutlineInventory onClick={() => router.push('/AdminServiceClinics/Inventory')}/>
          </div>

          {/* Driver List */}
          <div
            className="sidebar-icon"
            data-name="Driverlist"
          >
            <FaAmbulance onClick={() => router.push('/AdminServiceClinics/Driverlist')}/>
          </div>

          {/* Doctor List */}
          <div
            className="sidebar-icon"
            data-name="Doctorlist"
          >
            <FaUserDoctor onClick={() => router.push('/AdminServiceClinics/Doctorlist')}/>
          </div>

          {/* Adding Vendor */}
          <div
            className="sidebar-icon"
            data-name="Adding Vendor"
          >
            <FaPersonCirclePlus onClick={() => router.push('/AdminServiceClinics/VendorDocument')}/>
          </div>

          {/* Logout */}
          <div
            className="sidebar-icon logout-icon"
            data-name="Logout"
          >
            <FaSignOutAlt onClick={handleLogoutClick}/>
          </div>
        </nav>
      </aside>

      {showLogoutPopup && (
        <div className="logout-popup">
          <div className="popup-content">
            <p>Are you sure you want to log out?</p>
            <div className="popup-buttons">
              <button className="confirm-button" onClick={handleConfirmLogout}>Log Out</button>
              <button className="cancel-button" onClick={handleCancelLogout}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
