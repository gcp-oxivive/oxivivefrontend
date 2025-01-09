'use client';
import React, { useState, useEffect } from 'react';
import './Wheel.css';
import {  FaRegBell, FaRegAddressBook, FaFileInvoiceDollar, FaCarAlt,FaUsers } from 'react-icons/fa';
import { BsGraphUpArrow } from 'react-icons/bs';
import { MdInventory } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faBell, faUser, } from '@fortawesome/free-solid-svg-icons';

const Wheel = () => {
  const router = useRouter();
  const [selectedFooter, setSelectedFooter] = useState('home'); // Define selectedFooter in state
  const [notificationCount, setNotificationCount] = useState(0); // State to hold the notification count

  // useEffect to fetch notification count from localStorage
  useEffect(() => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]'); // Retrieve notifications from localStorage
    setNotificationCount(notifications.length); // Update notification count
  }, []); // Empty dependency array to run on component mount

  const handleFooterClick = (section: string) => {
    setSelectedFooter(section); // Update the selected footer section
    const vendorId = localStorage.getItem('vendor_id');
    if (section === 'home') {
      router.push('/VendorManagementService/Vendors/WheelVendor/Wheel');
    } else if (section === 'bookings') {
      router.push('/VendorManagementService/WheelVendor/MyBookings');
    } else if (section === 'notifications') {
      router.push('/VendorManagementService/WheelVendor/Notify');
    } else if (section === 'profile') {
      router.push(`/VendorManagementService/WheelVendor/profile?vendor_id=${vendorId}`);
    }
  };

  

  const vendorId = localStorage.getItem('vendor_id'); // Retrieve vendor_id from local storage

  const handleDriverCardClick = () => {
    console.log('Navigating with Vendor ID:', vendorId);
    router.push(`/VendorManagementService/WheelVendor/MyDrivers?vendor_id=${vendorId}`);
};

const handleStaffCardClick = () => {
  console.log('Navigating with Vendor ID:', vendorId);
  router.push(`/VendorManagementService/WheelVendor/MyStaff?vendor_id=${vendorId}`);
};

const handleInvoiceCardClick = () => {
  console.log('Navigating with Vendor ID:', vendorId);
  router.push(`/VendorManagementService/WheelVendor/Invoice?vendor_id=${vendorId}`);
};

  return (
    <div className="container55">
      <header className="header9">
        <div className="logoContaine">
          <img src="/images/shot(1).png" alt="OxiWheel Logo" className="logo9" />
        </div>
        <h1 className="title01">
          <span className="welcome99">Welcome to</span>
          <span className="oxiwheel99">Oxi Wheel</span>
        </h1>
        <FaRegBell className="notificationIcon" onClick={() => router.push('/VendorManagementService/WheelVendor/Notify')} />
          {notificationCount > 0 && (
            <span className="notificationCount">{notificationCount}</span> // Display notification count if greater than 0
          )}
      </header>

      <div className="main">
        <div className="grid1">
          {/* <div className="card" onClick={() => router.push('/VendorManagementService/WheelVendor/WheelPerformance')}>
            <BsGraphUpArrow className="cardIcon" />
            <p className="label">Dashboard</p>
          </div> */}
          <div className="card" onClick={() => router.push('/VendorManagementService/WheelVendor/MyBookings')}>
            <FaRegAddressBook className="cardIcon" />
            <p className="label">Bookings</p>
          </div>
          <div className="card" onClick={() => router.push(`/VendorManagementService/WheelVendor/Inventory?vendor_id=${vendorId}`)}>
            <MdInventory className="cardIcon" />
            <p className="label">Inventory</p>
          </div>
          <div className="card" onClick={handleInvoiceCardClick}>
            <FaFileInvoiceDollar className="cardIcon" />
            <p className="label">Invoice</p>
          </div>
          <div className="card" onClick={handleDriverCardClick}>
            <FaCarAlt className="cardIcon" />
            <p className="label">Driver's</p>
          </div>
          <div className="card" onClick={handleStaffCardClick}>
            <FaUsers className="cardIcon" />
            <p className="label">Staff</p>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="Wheel-footer">
        <div className={`footer-icon ${selectedFooter === 'home' ? 'selected' : ''}`} onClick={() => handleFooterClick('home')}>
          <FontAwesomeIcon icon={faHome} />
          <span>Home</span>
        </div>
        <div className={`footer-icon ${selectedFooter === 'bookings' ? 'selected' : ''}`} onClick={() => handleFooterClick('bookings')}>
          <FontAwesomeIcon icon={faClipboardList} />
          <span>Bookings</span>
        </div>
        <div className={`footer-icon ${selectedFooter === 'notifications' ? 'selected' : ''}`} onClick={() => handleFooterClick('notifications')}>
          <FontAwesomeIcon icon={faBell} />
          <span>Notifications</span>
        </div>
        <div className={`footer-icon ${selectedFooter === 'profile' ? 'selected' : ''}`} onClick={() => handleFooterClick('profile')}>
          <FontAwesomeIcon icon={faUser} />
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default Wheel;
