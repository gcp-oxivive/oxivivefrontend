'use client';
import React, { useState, useCallback } from 'react';
import {
  FaHome, FaCartPlus, FaSignOutAlt,
} from 'react-icons/fa';
import { BiSolidBookAdd } from 'react-icons/bi';
import { MdManageAccounts, MdOutlineInventory, MdOutlinePeopleAlt } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { FaPeopleGroup } from 'react-icons/fa6';
import { IoMdPersonAdd } from 'react-icons/io';
import './Sidebar.css';

const Sidebar = () => {
  const router = useRouter();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const navigateWithPreload = useCallback((route) => {
    router.prefetch(route); // Prefetch the route
    router.push(route); // Navigate immediately
  }, [router]);

  const handleLogout = () => {
    console.log('User logged out');
    router.push('/AdminService/AdminDashboard/AccountPage');
  };

  return (
    <>
      <aside className="admin-sidebar">
        <div className="logo">
          <img src="/images/shot(1).png" alt="Logo" />
          <p>Super Admin</p>
        </div>
        <nav className="sidebar-icons">
          <div className="sidebar-icon" data-name="DashBoard">
            <FaHome onMouseEnter={() => router.prefetch('/AdminService/AdminDashboard/Dashboard')}
                    onClick={() => navigateWithPreload('/AdminService/AdminDashboard/Dashboard')} />
          </div>
          <div className="sidebar-icon" data-name="Invoice">
            <FaCartPlus onMouseEnter={() => router.prefetch('/AdminService/Invoicelist')}
                        onClick={() => navigateWithPreload('/AdminService/Invoicelist')} />
          </div>
          <div className="sidebar-icon" data-name="Booking">
            <BiSolidBookAdd onMouseEnter={() => router.prefetch('/AdminService/Booking/')}
                            onClick={() => navigateWithPreload('/AdminService/Booking/')} />
          </div>
          <div className="sidebar-icon" data-name="Vendor Approval">
            <FaPeopleGroup onMouseEnter={() => router.prefetch('/AdminService/AdminDashboard/')}
                           onClick={() => navigateWithPreload('/AdminService/AdminDashboard/')} />
          </div>
          <div className="sidebar-icon" data-name="Add Admin">
            <IoMdPersonAdd onMouseEnter={() => router.prefetch('/AdminService/AdminPerson/')}
                           onClick={() => navigateWithPreload('/AdminService/AdminPerson/')} />
          </div>
          <div className="sidebar-icon" data-name="Manage Service">
            <MdManageAccounts onMouseEnter={() => router.prefetch('/AdminService/AdminDashboard/ManageService/')}
                              onClick={() => navigateWithPreload('/AdminService/AdminDashboard/ManageService/')} />
          </div>
          <div className="sidebar-icon" data-name="Inventory">
            <MdOutlineInventory onMouseEnter={() => router.prefetch('/AdminService/Inventory/')}
                                onClick={() => navigateWithPreload('/AdminService/Inventory/')} />
          </div>
          <div className="sidebar-icon" data-name="Vendor">
            <MdOutlinePeopleAlt onMouseEnter={() => router.prefetch('/AdminService/VendorsList/')}
                                onClick={() => navigateWithPreload('/AdminService/VendorsList/')} />
          </div>
          <div className="sidebar-icon logout-icon" data-name="Logout">
            <FaSignOutAlt onClick={() => setShowLogoutPopup(true)} />
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
