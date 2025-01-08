'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './profile.css';
import axios from 'axios';
import { FaCamera, FaArrowLeft, FaTimes, FaCloudUploadAlt , FaEdit } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'next/navigation';
import { faHome, faClipboardList, faBell, faUser } from '@fortawesome/free-solid-svg-icons';

const Profile: React.FC = () => {
  const router = useRouter();
  const [selectedFooter, setSelectedFooter] = useState('home');
  const [email, setEmail] = useState('');
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendor_id');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [oxiImage1, setOxiImage1] = useState('');
  const [oxiImage2, setOxiImage2] = useState('');
  const [availableslots, setAvailableslots] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const oxiFileInputRef1 = useRef<HTMLInputElement | null>(null);
  const oxiFileInputRef2 = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set the isEditing state from localStorage when the component mounts
    const savedEditingState = localStorage.getItem('isEditing');
    if (savedEditingState !== null) {
      setIsEditing(JSON.parse(savedEditingState));
    }

    if (vendorId) {
      const fetchVendorData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`https://clinicmanagementservice-69668940637.asia-east1.run.app/api/vendorapp-vendordetails/${vendorId}/`);
          const fetchedSlots = response.data.available_slots;
          setProfileImage(response.data.profile_photo);
          setEmail(response.data.email);
          setName(response.data.name);
          setPhone(response.data.phone);
          setOxiImage1(response.data.oxi_image1);
          setOxiImage2(response.data.oxi_image2);

          const savedSlots = localStorage.getItem('selectedSlots');
          if (savedSlots) {
            setAvailableslots(JSON.parse(savedSlots));
          } else {
            setAvailableslots(fetchedSlots);
          }
        } catch (error) {
          console.error('Error fetching vendor data:', error);
          setAvailableslots([]);
        }finally {
          setLoading(false); // Set loading to false after fetch, whether success or failure
        }
        
      };
      fetchVendorData();
    }
  }, [vendorId]);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'documents_all');
    formData.append('cloud_name', 'dpysjcjbf');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dpysjcjbf/image/upload',
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Cloudinary upload failed');
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadToCloudinary(file);
        setImage(uploadedUrl);
      } catch (error) {
        console.error('File upload failed:', error);
      }
    }
  };

  const handleFooterClick = (footer: string) => {
    setSelectedFooter(footer);
    if (footer !== 'profile') {
      localStorage.setItem('isEditing', JSON.stringify(false));
    }

    switch (footer) {
      case "home":
        router.push("/VendorManagementService/Vendors/WheelVendor/Wheel");
        break;
      case "bookings":
        router.push("/VendorManagementService/WheelVendor/MyBookings");
        break;
      case "notifications":
        router.push("/notifications");
        break;
      case "profile":
        router.push("/VendorManagementService/WheelVendor/profile");
        break;
      default:
        break;
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    localStorage.setItem('isEditing', JSON.stringify(!isEditing)); // Save the new editing state to localStorage
  };

  const handleOxiUploadClick = (fileInputRef: React.RefObject<HTMLInputElement>) => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    const vendorId = localStorage.getItem('vendor_id');

    if (!vendorId) {
      alert('Vendor ID is missing! Please try again.');
      return;
    }

    let uploadedOxiImage1 = oxiImage1;
    let uploadedOxiImage2 = oxiImage2;

    try {
      if (fileInputRef.current?.files?.[0]) {
        const profileFile = fileInputRef.current.files[0];
        const profileImageUrl = await uploadToCloudinary(profileFile);
        setProfileImage(profileImageUrl);
      }

      if (oxiFileInputRef1.current?.files?.[0]) {
        const oxiFile1 = oxiFileInputRef1.current.files[0];
        uploadedOxiImage1 = await uploadToCloudinary(oxiFile1);
      }

      if (oxiFileInputRef2.current?.files?.[0]) {
        const oxiFile2 = oxiFileInputRef2.current.files[0];
        uploadedOxiImage2 = await uploadToCloudinary(oxiFile2);
      }

      const savedSlots = JSON.parse(localStorage.getItem('selectedSlots') || '[]');
      const formattedSlots = JSON.stringify(savedSlots);

      const updatedData = {
        profile_photo: profileImage,
        name,
        email,
        phone,
        oxi_image1: uploadedOxiImage1,
        oxi_image2: uploadedOxiImage2,
        available_slots: formattedSlots,
      };

      const response = await axios.patch(
        `https://clinicmanagementservice-69668940637.asia-east1.run.app/api/vendorapp-vendordetails/${vendorId}/`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('Vendor details updated successfully!');

        const updatedResponse = await axios.get(
          `https://clinicmanagementservice-69668940637.asia-east1.run.app/api/vendorapp-vendordetails/${vendorId}/`
        );

        setProfileImage(updatedResponse.data.profile_photo);
        setEmail(updatedResponse.data.email);
        setName(updatedResponse.data.name);
        setPhone(updatedResponse.data.phone);
        setOxiImage1(updatedResponse.data.oxi_image1);
        setOxiImage2(updatedResponse.data.oxi_image2);
        setAvailableslots(JSON.parse(updatedResponse.data.available_slots || '[]'));

        setIsEditing(false);
        localStorage.setItem('isEditing', JSON.stringify(false)); // Save the new editing state to localStorage
      } else {
        alert('Failed to update vendor details. Please try again.');
      }
    } catch (error) {
      console.error('Error updating vendor details:', error);
      alert('An error occurred while updating vendor details.');
    }
  };

  const handleEditAvailableSlots = () => {
    if (!isEditingTime) {
      setIsEditingTime(true);
    } else {
      router.push(`/VendorManagementService/WheelVendor/Availableslots?vendor_id=${vendorId}`);
    }
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('oxi_id');
    sessionStorage.clear();
    router.push('/UserAuthentication/LoginPage');
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };
  

  return (
    
    <div className="profile-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="profile-header">
      <FaArrowLeft 
  className="arrow-icon1" 
  onClick={() => router.push('/VendorManagementService/Vendors/WheelVendor/Wheel')} 
/>

        <h2 className="profile-title">Profile</h2>
        <FaEdit
          className="edit-icon"
          onClick={handleEditClick}
          style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }}
        />
      </div>

      {/* Profile Image Section */}
<div className="profile-image-section">
  <div className="profile-image-wrapper">
    <img className="profile-image" src={profileImage} alt="Profile" />
    {/* Show the camera icon only in edit mode */}
    {isEditing && (
      <FaCamera className="camera-icon" onClick={handleCameraClick} />
    )}
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={(e) => handleFileChange(e, setProfileImage)}
      disabled={!isEditing} // Disable file input in non-edit mode
    />
  </div>
</div>


      <div className="profile-info">
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="name"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing} // Enable only in edit mode
            />
            {name && isEditing && (
              <FaTimes
                className="clear-icon"
                onClick={() => setName('')}
                style={{ color: 'red' }}
              />
            )}
          </div>
        </div>
        <div className="input-group email-group">
          <label htmlFor="email">Email</label>
          <div className="email-input-wrapper">
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing} // Enable only in edit mode
            />
            {email && isEditing && (
              <FaTimes
                className="clear-icon"
                onClick={() => setEmail('')}
                style={{ color: 'red' }}
              />
            )}
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="mobile">Mobile Number</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="mobile"
              placeholder="Enter your mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing} // Enable only in edit mode
            />
            {phone && isEditing && (
              <FaTimes
                className="clear-icon"
                onClick={() => setPhone('')}
                style={{ color: 'red' }}
              />
            )}
          </div>
        </div>

        {/* // Oxi Upload Section */}
<div className="oxi-upload-section">
  <div
    className={`oxi-upload-container ${
      isEditing ? "oxi-upload-editable" : "oxi-upload-disabled"
    }`}
    onClick={() => isEditing && handleOxiUploadClick(oxiFileInputRef1)}
  >
    <FaCloudUploadAlt 
      className="plus-icon"
      style={{
        color: isEditing ? "red" : "gray",
        fontSize: "24px",
      }}
    />
    {oxiImage1 ? (
      <img src={oxiImage1} alt="Oxi Upload 1" className="oxi-upload-image" />
    ) : (
      <div className="oxi-upload">
        <span>Oxi Image 1</span>
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      ref={oxiFileInputRef1}
      style={{ display: "none" }}
      onChange={(e) => handleFileChange(e, setOxiImage1)}
      disabled={!isEditing}
    />
  </div>
  <div
    className={`oxi-upload-container ${
      isEditing ? "oxi-upload-editable" : "oxi-upload-disabled"
    }`}
    onClick={() => isEditing && handleOxiUploadClick(oxiFileInputRef2)}
  >
    <FaCloudUploadAlt 
      className="plus-icon"
      style={{
        color: isEditing ? "red" : "gray",
        fontSize: "24px",
      }}
    />
    {oxiImage2 ? (
      <img src={oxiImage2} alt="Oxi Upload 2" className="oxi-upload-image" />
    ) : (
      <div className="oxi-upload">
        <span>Oxi Image 2</span>
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      ref={oxiFileInputRef2}
      style={{ display: "none" }}
      onChange={(e) => handleFileChange(e, setOxiImage2)}
      disabled={!isEditing}
    />
  </div>
</div>

{/* // Edit Time Section */}
<div className="input-group">
  <div className="time-label-container">
    <label htmlFor="availableslots">Time Slots</label>
    {isEditing && (
      <button className="edit-time-button" onClick={handleEditAvailableSlots}>
        Edit
      </button>
    )}
  </div>

  <div className="time-slots-grid1">
    {(Array.isArray(availableslots)
      ? availableslots
      : (availableslots || "").split(",")
    ).map((slot: string, index: React.Key | null | undefined) => (
      <button key={index} className="time-slot1">
        {slot.trim().replace(/["[\]]/g, "")} {/* Clean unwanted characters */}
      </button>
    ))}
  </div>
</div>

{/* Save Button */}
<div className="save-button-container">
  {isEditing ? (
    // Save Button in Editable Mode
    <button className="save-button3" onClick={handleSaveProfile}>
      Save
    </button>
  ) : (
    // Logout Button in Non-Editable Mode
    <button className="logout-button2" onClick={() => setShowLogoutPopup(true)}>
      Logout
    </button>
  )}
</div>
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
      
      {/* Footer with icons */}
      <div className="footer4">
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

export default Profile;
