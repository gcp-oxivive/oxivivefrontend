'use client';
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import './staff.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter,useSearchParams } from 'next/navigation';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  vendor: '';
}

const Staff: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams=useSearchParams();
  const vendorId = searchParams.get('vendorId');
  const [selectedFooter, setSelectedFooter] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', phone: '', imageUrl: '', email:'',vendor: vendorId || '' });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '', imageUrl: '' });
  const router = useRouter();

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleFooterClick = (footer: string) => {
    setSelectedFooter(footer);
  
    // Redirect to respective pages
    switch (footer) {
      case "home":
        router.push("/VendorManagementService/Vendors/WheelVendor/Clinic"); // Redirect to the home page
        break;
      case "bookings":
        router.push("/VendorManagementService/ClinicVendor/MyBookings"); // Redirect to the bookings page
        break;
      case "notifications":
        router.push("/notifications"); // Redirect to the notifications page
        break;
      case "profile":
        router.push("/VendorManagementService/ClinicVendor/profile"); // Redirect to the profile page
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Try to get vendorId from URL first
    const urlVendorId = searchParams.get('vendorId');
    if (urlVendorId) {
      setNewStaff((prev) => ({ ...prev, vendor: urlVendorId })); // Set vendorId from URL
    } else {
      // Fallback to localStorage
      const storedVendorId = localStorage.getItem('vendor_id');
      if (storedVendorId) {
        setNewStaff((prev) => ({ ...prev, vendor: storedVendorId })); // Set vendorId from localStorage
      }
    }
  }, [searchParams]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewStaff({ name: '', phone: '', imageUrl: '', email:'', vendor: vendorId || '' });
    setErrors({ name: '', email: '', phone: '', imageUrl: '' });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewStaff({
        ...newStaff,
        imageUrl: URL.createObjectURL(event.target.files[0]),
      });
      setErrors((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://doctormanagementservice-69668940637.asia-east1.run.app/api/staff/list_cstaff/?vendor=${vendorId}`);
      if (response.ok) {
        const data = await response.json();
        const formattedStaff = data.map((staff: any) => ({
          id: staff.staff_id,
          name: staff.name,
          phone: staff.phone,
          imageUrl: staff.profile_photo || 'https://via.placeholder.com/50',
        }));
        setStaff(formattedStaff);
      } else {
        console.log('Failed to fetch staff');
      }
    } catch (error) {
      console.log('Error fetching staff:', error);
    }finally {
      setIsLoading(false); // Hide loader
    }
  };

  const validateInputs = () => {
    const errors: { name: string; email: string; phone: string; imageUrl: string } = { name: '', email: '', phone: '', imageUrl: '' };
    if (!newStaff.name.trim()) errors.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStaff.email)) errors.email = 'Invalid email address.';
    if (!/^\d{10}$/.test(newStaff.phone)) errors.phone = 'Phone number must be 10 digits.';
    if (!newStaff.imageUrl) errors.imageUrl = 'Profile image required.';
    setErrors(errors);
    return Object.values(errors).every((error) => error === '');
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    try {
      let imageUrl = '';

      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('upload_preset', 'driver_images');

        const cloudinaryResponse = await fetch(
          'https://api.cloudinary.com/v1_1/dvxscrjk0/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (cloudinaryResponse.ok) {
          const cloudinaryData = await cloudinaryResponse.json();
          imageUrl = cloudinaryData.secure_url;
        } else {
          console.log('Failed to upload image to Cloudinary');
          alert('Failed to upload image. Please try again.');
          return;
        }
      }

      const staffData = {
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        profile_photo: imageUrl,
        vendor: newStaff.vendor,
      };

      const response = await fetch('https://doctormanagementservice-69668940637.asia-east1.run.app/api/staff/add_staff/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffData),
      });

      if (response.ok) {
        closeModal();
        fetchStaff();
        alert('Staff saved successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to save staff: ${errorData.message || 'Please check the details and try again.'}`);
      }
    } catch (error) {
      alert('An error occurred while saving the staff. Please try again.');
    }
  };

  return (
    <div className="staff-container">
      <header className="staff-header">
        <FaArrowLeft className="back-icon" onClick={() => router.push('/VendorManagementService/Vendors/WheelVendor/Clinic')} />
        <h1>My Staff</h1>
        <button className="add-button" onClick={openModal}>
          <FaPlus /> ADD
        </button>
      </header>

      <div className="staff-list">
        <div className="staff-headings1">
        <p>Profile</p>
          <p>Name</p>
          <p>Phone no</p>
        </div>

        {isLoading ? (
          <div className="spinner5"></div>
        ) : (
          staff.map((member) => (
            <div key={member.id} className="staff-card">
              <LazyLoadImage src={member.imageUrl} alt={member.name} className="staff-image" />
              <div className="staff-info">
                <p className="staff-name">{member.name}</p>
                <p className="staff-phone">{member.phone}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="staff-footer">
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

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="image-upload">
              <label htmlFor="file-input">
              <LazyLoadImage src={newStaff.imageUrl || 'https://via.placeholder.com/100'} alt="Staff" className="staff-modal-image" />
                <FaPlus className="plus-icon" />
              </label>
              <input id="file-input" type="file" onChange={handleImageUpload} style={{ display: 'none' }} />
              {errors.imageUrl && <p className="error-text3">{errors.imageUrl}</p>}
            </div>
            <div className="modal-fields">
              <label>Name:</label>
              <input type="text" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
              {errors.name && <p className="error-text1">{errors.name}</p>}
              <label>Email:</label>
              <input type="text" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} />
              {errors.email && <p className="error-text1">{errors.email}</p>}
              <label>Phone Number:</label>
              <input type="text" value={newStaff.phone} onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} />
              {errors.phone && <p className="error-text1">{errors.phone}</p>}
            </div>
            <div className="modal-footer">
              <button className="modal-close" onClick={closeModal}>Close</button>
              <button className="modal-save" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
