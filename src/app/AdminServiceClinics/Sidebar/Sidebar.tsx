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

  const handleMouseEnter = (route) => {
    router.prefetch(route); // Prefetch the route when hovering over the icon
  };

  const navigateWithPreload = (route) => {
    router.push(route); // Navigate immediately
  };

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutPopup(false); // Close popup immediately
    // Clear any user data here if needed
    // For example: localStorage.clear();

    // Navigate to the logout page quickly
    router.replace('/AdminService/AdminDashboard/AccountPage');
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
            onMouseEnter={() => handleMouseEnter('/AdminServiceClinics/Dashboard')}
          >
            <MdSpaceDashboard onClick={() => navigateWithPreload('/AdminServiceClinics/Dashboard')} />
          </div>

          {/* Booking List */}
          <div
            className="sidebar-icon"
            data-name="Bookinglist"
            onMouseEnter={() => handleMouseEnter('/AdminServiceClinics/Booking')}
          >
            <FaBookOpen onClick={() => navigateWithPreload('/AdminServiceClinics/Booking')} />
          </div>

          {/* Vendor List */}
          <div
            className="sidebar-icon"
            data-name="Vendorlist"
            onMouseEnter={() => handleMouseEnter('/AdminServiceClinics/Vendorlist')}
          >
            <IoPeople onClick={() => navigateWithPreload('/AdminServiceClinics/Vendorlist')} />
          </div>

          {/* Inventory */}
          <div
            className="sidebar-icon"
            data-name="Inventory"
            onMouseEnter={() => handleMouseEnter('/AdminServiceClinics/Inventory')}
          >
            <MdOutlineInventory onClick={() => navigateWithPreload('/AdminServiceClinics/Inventory')} />
          </div>

          {/* Driver List */}
          <div
            className="sidebar-icon"
            data-name="Driverlist"
            onMouseEnter={() => handleMouseEnter('/AdminServiceClinics/Driverlist')}
          >
            <FaAmbulance onClick={() => navigateWithPreload('/AdminServiceClinics/Driverlist')} />
          </div>

          {/* Doctor List */}
          <div
            className="sidebar-icon"
            data-name="Doctorlist"
            onMouseEnter={() => handleMouseEnter('/AdminServiceClinics/Doctorlist')}
          >
            <FaUserDoctor onClick={() => navigateWithPreload('/AdminServiceClinics/Doctorlist')} />
          </div>

          {/* Adding Vendor */}
          <div
            className="sidebar-icon"
            data-name="Adding Vendor"
            onMouseEnter={() => handleMouseEnter('/AdminServiceClinics/VendorDocument')}
          >
            <FaPersonCirclePlus onClick={() => navigateWithPreload('/AdminServiceClinics/VendorDocument')} />
          </div>

          {/* Logout */}
          <div
            className="sidebar-icon logout-icon"
            data-name="Logout"
          >
            <FaSignOutAlt onClick={handleLogoutClick} />
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
