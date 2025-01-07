"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // For extracting query params
import "./DriverProfile.css";
import { SlHome } from "react-icons/sl";
import { FaRegAddressBook } from "react-icons/fa";
import { IoNotificationsOutline, IoChevronBackSharp } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { LuBookPlus } from "react-icons/lu";
import { useRouter } from "next/navigation";

const DriverProfile: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const driverId = searchParams.get("driver_id"); // Get driver_id from query params

  const [driverDetails, setDriverDetails] = useState({
    name: "",
    email: "",
    phone: "",
    profile_photo: "https://via.placeholder.com/150", // Default image
  });
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State to toggle the popup

  const handleBookingClick = () => {
    router.push(`/DriverManagementService/VendorDriverBooking/MyBooking/`);
  };

  const handleLogoutConfirm = () => {
    // Clear session data or tokens
    localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem("driver_id");
    localStorage.removeItem("oxi_id");

    console.log("User logged out"); // Debugging line
    router.push(`/UserAuthentication/LoginPage`);
  };

  useEffect(() => {
    if (driverId) {
      console.log(`Fetching driver details for ID: ${driverId}`); // Debugging line
      fetch(
        `https://drivermanagementservice-69668940637.asia-east1.run.app/api/profile-driver-details/?driver_id=${driverId}`
      )
        .then((response) => {
          console.log(`API Response: ${response.status}`); // Debugging line
          if (!response.ok) {
            throw new Error("Failed to fetch driver details");
          }
          return response.json();
        })
        .then((data) => {
          setDriverDetails({
            name: data.name,
            email: data.email,
            phone: data.phone,
            profile_photo: data.profile_photo || "https://via.placeholder.com/150",
          });
        })
        .catch((error) => {
          console.error(error.message);
        })
        .finally(() => {
          setIsLoading(false); // Stop loading spinner
        });
    }
  }, [driverId]);

  const handleBackClick = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <div className="container">
      {isLoading ? (
        // Show spinner while loading
        <div className="loading-spinner"></div>
      ) : (
        <div className="driver-profile">
          <button className="back-button" onClick={handleBackClick}>
            <IoChevronBackSharp className="back-icon" />
          </button>
          <h1>Profile</h1>
          <div className="profile-photo">
            <img
              src={driverDetails.profile_photo}
              alt="Profile"
              className="profile-img"
            />
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          <div className="profile-details">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={driverDetails.name} readOnly />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={driverDetails.email} readOnly />

            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" value={driverDetails.phone} readOnly />

            {/* Logout Button */}
            <button
              className="logout-button"
              onClick={() => setShowLogoutPopup(true)}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footerItem">
          <SlHome className="footerIcon" />
          <p>Home</p>
        </div>
        <div className="footerItem" onClick={handleBookingClick}>
          <LuBookPlus className="footerIcon" />
          <p>Booking</p>
        </div>
        <div className="footerItem">
          <IoNotificationsOutline className="footerIcon" />
          <p>Notification</p>
        </div>
        <div className="footerItem">
          <BsPerson className="footerIcon" />
          <p>Profile</p>
        </div>
      </footer>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="logout-popup">
          <p>Are you sure you want to log out?</p>
          <div className="popup-buttons">
            <button className="confirm-logout" onClick={handleLogoutConfirm}>
              Logout
            </button>
            <button
              className="cancel-logout"
              onClick={() => setShowLogoutPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverProfile;
