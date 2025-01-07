'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios'; // Import axios
import { FaBox } from 'react-icons/fa';
import { GoHome, GoShareAndroid } from "react-icons/go";
import { CiSearch, CiStar } from "react-icons/ci";
import { RxCalendar } from "react-icons/rx";
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { AiOutlineFileProtect } from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import { IoIosArrowForward } from "react-icons/io";
import { IoPersonOutline, IoChevronBackSharp } from "react-icons/io5";
import { LiaHandshakeSolid } from "react-icons/lia";
import './UserProfile.css';
import Footer from './Footer';

const UserProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oxiId = searchParams.get('oxi_id') || 'Unknown';
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profile_photo: '',
    oxiId: '',
  });
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [activeFooter, setActiveFooter] = useState('');

  // Fetch user data from the API or cache
  const fetchUserData = async (oxiId: string | undefined) => {
    const cachedData = JSON.parse(localStorage.getItem(`user_data_${oxiId}`) || '{}');
    if (cachedData.name) {
      setUserData(cachedData);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://usermanagementservice-69668940637.asia-east1.run.app/usmapp/usmapp-oxiusers/${oxiId}/`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setUserData({
          name: data.name,
          email: data.email,
          profile_photo: data.profile_photo || 'https://via.placeholder.com/50',
          oxiId: oxiId || 'Unknown',
        });
        localStorage.setItem(`user_data_${oxiId}`, JSON.stringify(data)); // Cache data
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    const storedOxiId = localStorage.getItem('oxi_id') || searchParams.get('oxi_id') || 'Unknown';
    console.log('oxi_id from localStorage or searchParams:', storedOxiId);
    fetchUserData(storedOxiId);
  }, []);
  
  

  const handleEditProfile = () => router.push(`/UserProfile/UserInfo`);
  const handleReferFriend = () => router.push('/UserProfile/ReferFriend');
  const handleFaq = () => router.push('/UserProfile/Faq');
  const handlePrivacy = () => router.push('/UserProfile/Privacy');
  const handleLogoutClick = () => setShowLogoutPopup(true);
  const handleCancelLogout = () => setShowLogoutPopup(false);

  const handleConfirmLogout = () => {
    localStorage.removeItem('toast_shown'); // Reset the flag
    localStorage.removeItem('oxi_id'); // Remove oxi_id from storage
    sessionStorage.clear(); // Clear session storage
    router.push('/UserAuthentication/LoginPage');
  };

  return (
    <div className="user-profile">
      {isLoading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="back-button22" onClick={() => router.push('/DashBoard/HomePage')}>
            <IoChevronBackSharp size={24} className="icon-profile" />
          </div>

          <div className="profile-header9">
            <img
              className="profile-image3"
              src={userData.profile_photo || 'https://via.placeholder.com/50'}
              alt="Profile"
              loading="lazy"
            />
            <h2 className="profile-name">{userData.name}</h2>
            <p className="profile-email">{userData.email}</p>
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>

          <div className="profile-menu">
            <p className="profile99">Profile</p>
            <ul className="profile-menu-list">
              <li>
                <div className="icon-container">
                  <LiaHandshakeSolid size={20} />
                </div>
                Register as a Partner
                <IoIosArrowForward style={{ marginLeft: 'auto' }} />
              </li>
              <li onClick={() => {
    const storedOxiId = localStorage.getItem('oxi_id') || searchParams.get('oxi_id');
    if (storedOxiId && storedOxiId !== 'Unknown') {
      router.push(`/Booking?oxi_id=${storedOxiId}`);
    } else {
      console.error('oxi_id is missing or invalid during navigation');
    }
  }}
  style={{ cursor: 'pointer' }}>
                
                <div className="icon-container">
                  <FaBox size={20} />
                </div>
                My Booking
                <IoIosArrowForward style={{ marginLeft: 'auto' }} />
              </li>
              <li>
                <div className="icon-container">
                  <IoMdHelpCircleOutline size={20} />
                </div>
                Help Center
                <IoIosArrowForward style={{ marginLeft: 'auto' }} />
              </li>
              <li onClick={handleReferFriend} style={{ cursor: 'pointer' }}>
                <div className="icon-container">
                  <GoShareAndroid size={20} />
                </div>
                Share & Earn
                <IoIosArrowForward style={{ marginLeft: 'auto' }} />
              </li>
              <li>
                <div className="icon-container">
                  <CiStar size={20} />
                </div>
                Rate us
                <IoIosArrowForward style={{ marginLeft: 'auto' }} />
              </li>
              <li onClick={handleFaq} style={{ cursor: 'pointer' }}>
                <div className="icon-container">
                  <BiMessageRoundedDetail size={20} />
                </div>
                FAQ's
                <IoIosArrowForward style={{ marginLeft: 'auto' }} />
              </li>
              <li onClick={handlePrivacy} style={{ cursor: 'pointer' }}>
                <div className="icon-container">
                  <AiOutlineFileProtect size={20} />
                </div>
                Privacy Policy
                <IoIosArrowForward style={{ marginLeft: 'auto' }} />
              </li>
              <li onClick={handleLogoutClick}>
                <div className="icon-container">
                  <MdLogout size={20} />
                </div>
                Logout
                <IoIosArrowForward style={{ marginLeft: 'auto' }} />
              </li>
            </ul>
          </div>

          {showLogoutPopup && (
            <div className="logout-popup">
              <div className="popup-content">
                <h1>Log out</h1>
                <p>Are you sure you want to logout?</p>
                <button className="logout-btn" onClick={handleConfirmLogout}>
                  Logout
                </button>
                <button className="cancel-btn" onClick={handleCancelLogout}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <Footer />
        </>
      )}
    </div>
  );
};

export default UserProfile;
