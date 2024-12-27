'use client'
import React, { useEffect, useState } from 'react';
import { FaHome, FaCartPlus, FaSignOutAlt } from 'react-icons/fa';
import { BiSolidBookAdd } from 'react-icons/bi';
import { MdManageAccounts, MdOutlineInventory, MdOutlinePeopleAlt } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { FaPeopleGroup } from "react-icons/fa6";
import { IoMdPersonAdd } from "react-icons/io";
import './Sidebar.css';

const Sidebar = () => {
  const router = useRouter();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Prefetch critical routes when the component mounts
  useEffect(() => {
    router.prefetch('/AdminService/AdminDashboard/Dashboard');
    router.prefetch('/AdminService/Invoicelist');
    router.prefetch('/AdminService/Booking/');
    router.prefetch('/AdminService/AdminDashboard/');
    router.prefetch('/AdminService/AdminPerson/');
    router.prefetch('/AdminService/AdminDashboard/ManageService/');
    router.prefetch('/AdminService/Inventory/');
    router.prefetch('/AdminService/VendorsList/');
  }, [router]);

  const handleLogout = () => {
    console.log("User logged out");
    router.push('/AdminService/AdminDashboard/AccountPage');
  };

  const navigateWithPreload = (route) => {
    router.push(route); // Navigate directly
  };

  return (
    <>
      <aside className="admin-sidebar">
        <div className="logo">
          <img src="/images/shot(1).png" alt="Logo" />
          <p>Super Admin</p>
        </div>
        <nav className="sidebar-icons">
          <div className="sidebar-icon" data-name="DashBoard" >
            <FaHome onClick={() => navigateWithPreload('/AdminService/AdminDashboard/Dashboard')}/>
          </div>
          <div className="sidebar-icon" data-name="Invoice" >
            <FaCartPlus onClick={() => navigateWithPreload('/AdminService/Invoicelist')}/>
          </div>
          <div className="sidebar-icon" data-name="Booking" >
            <BiSolidBookAdd onClick={() => navigateWithPreload('/AdminService/Booking/')}/>
          </div>
          <div className="sidebar-icon" data-name="Vendor Approval" >
            <FaPeopleGroup onClick={() => navigateWithPreload('/AdminService/AdminDashboard/')}/>
          </div>
          <div className="sidebar-icon" data-name="Add Admin" >
            <IoMdPersonAdd onClick={() => navigateWithPreload('/AdminService/AdminPerson/')}/>
          </div>
          <div className="sidebar-icon" data-name="Manage Service" >
            <MdManageAccounts onClick={() => navigateWithPreload('/AdminService/AdminDashboard/ManageService/')}/>
          </div>
          <div className="sidebar-icon" data-name="Inventory" >
            <MdOutlineInventory onClick={() => navigateWithPreload('/AdminService/Inventory/')}/>
          </div>
          <div className="sidebar-icon" data-name="Vendor" >
            <MdOutlinePeopleAlt onClick={() => navigateWithPreload('/AdminService/VendorsList/')}/>
          </div>
          <div
            className="sidebar-icon logout-icon"
            data-name="Logout"
            
          >
            <FaSignOutAlt onClick={() => setShowLogoutPopup(true)}/>
          </div>
        </nav>
      </aside>
      {showLogoutPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Are you sure you want to log out?</p>
            <div className="popup-buttons">
              <button onClick={handleLogout} className="logout-btn">Log Out</button>
              <button onClick={() => setShowLogoutPopup(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
