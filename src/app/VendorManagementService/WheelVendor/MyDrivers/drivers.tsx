'use client';
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import './drivers.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter ,useSearchParams} from 'next/navigation';

interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  vendor: '';
}

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams=useSearchParams();
  const vendorId = searchParams.get('vendor_id');
  const [selectedFooter, setSelectedFooter] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorIds, setvendorIds] = useState('');
  const [newDriver, setNewDriver] = useState({ name: '', email: '', phone: '', imageUrl: '',vendor: vendorId || '' });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '', imageUrl: '' });
  const router = useRouter();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const urlVendorId = searchParams.get('vendor_id');
  console.log('urlvendorId',urlVendorId);
  
  useEffect(() => {
    if (urlVendorId) {
      setNewDriver((prev) => ({ ...prev, vendor: urlVendorId }));
    } else {
      const storedVendorId = localStorage.getItem('vendor_id');
      if (storedVendorId) {
        setNewDriver((prev) => ({ ...prev, vendor: storedVendorId }));
        
      }
    }
  }, [searchParams]);
  

  const fetchDrivers = async () => {
    setIsLoading(true);
    const vendorId = newDriver.vendor; // Current vendor_id from state
    console.log("Vendor ID being used for fetching:", vendorId);
  
    if (!vendorId) {
      console.error("Vendor ID is missing. Cannot fetch drivers.");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`https://drivermanagementservice-69668940637.asia-east1.run.app/api/drivers/?vendor_id=${urlVendorId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched drivers:", data); // Log the fetched data for debugging
        const formattedDrivers = data.map((driver: any) => ({
          id: driver.id,
          name: driver.name,
          phone: driver.phone,
          imageUrl: driver.profile_photo || 'https://via.placeholder.com/50',
        }));
        setDrivers(formattedDrivers);
      } else {
        console.error("Failed to fetch drivers:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }finally {
      setIsLoading(false); // End loading
    }
  };
  
  
  

  const handleFooterClick = (footer: string) => {
    setSelectedFooter(footer);
  
    // Redirect to respective pages
    switch (footer) {
      case "home":
        router.push("/VendorManagementService/Vendors/WheelVendor/Wheel"); // Redirect to the home page
        break;
      case "bookings":
        router.push("/VendorManagementService/WheelVendor/MyBookings"); // Redirect to the bookings page
        break;
      case "notifications":
        router.push("/notifications"); // Redirect to the notifications page
        break;
      case "profile":
        router.push("/VendorManagementService/WheelVendor/profile"); // Redirect to the profile page
        break;
      default:
        break;
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewDriver({ name: '', email: '', phone: '', imageUrl: '' ,vendor: vendorId || ''});
    setErrors({ name: '', email: '', phone: '', imageUrl: '' });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewDriver({
        ...newDriver,
        imageUrl: URL.createObjectURL(event.target.files[0]),
      });
      setErrors((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const validateInputs = () => {
    const errors: { name: string; email: string; phone: string; imageUrl: string } = { name: '', email: '', phone: '', imageUrl: '' };
    if (!newDriver.name.trim()) errors.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newDriver.email)) errors.email = 'Invalid email address.';
    if (!/^\d{10}$/.test(newDriver.phone)) errors.phone = 'Phone number must be 10 digits.';
    if (!newDriver.imageUrl) errors.imageUrl = 'Profile image required.';
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

        const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dvxscrjk0/image/upload', {
          method: 'POST',
          body: formData,
        });

        if (cloudinaryResponse.ok) {
          const cloudinaryData = await cloudinaryResponse.json();
          imageUrl = cloudinaryData.secure_url;
        } else {
          alert('Failed to upload image. Please try again.');
          return;
        }
      }

      const driverData = { ...newDriver, profile_photo: imageUrl };

      const response = await fetch('https://drivermanagementservice-69668940637.asia-east1.run.app/api/drivers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driverData),
      });

      if (response.ok) {
        closeModal();
        fetchDrivers();
        alert('Driver saved successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to save driver: ${errorData.message || 'Please check the details and try again.'}`);
      }
    } catch (error) {
      alert('An error occurred while saving the driver. Please try again.');
    }
  };
  
  

  return (
    <div className="drivers-container">
      <header className="drivers-header8">
        <FaArrowLeft className="back-icon8" onClick={() => router.push('/VendorManagementService/Vendors/WheelVendor/Wheel')}/>
        <h1>My Drivers</h1>
        <button className="add-button" onClick={openModal}>
          <FaPlus /> ADD
        </button>
      </header>

      {isLoading ? (
        <div className="spinner-container8">
          <div className="spinner8"></div>
        </div>
      ) : (
        <div className="driver-list">
          <div className="driver-headings">
          <p>Profile</p>
            <p>Name</p>
            <p>Phone no</p>
          </div>
          {drivers.map((driver) => (
            <div key={driver.id} className="driver-card">
              <img src={driver.imageUrl} alt={driver.name} className="driver-image" />
              <div className="driver-info">
                <p className="driver-name">{driver.name}</p>
                <p className="driver-phone">{driver.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="drivers-footer">
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
            <div className="image-upload1">
              <label htmlFor="file-input">
                <img src={newDriver.imageUrl || 'https://via.placeholder.com/100'} alt="Driver" className="driver-modal-image" />
                <FaPlus className="plus-icon" />
              </label>
              <input id="file-input" type="file" onChange={handleImageUpload} style={{ display: 'none' }} />
              {errors.imageUrl && <p className="error-text0">{errors.imageUrl}</p>}
            </div>
            <div className="modal-fields">
              <label>Name:</label>
              <input type="text" value={newDriver.name} onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })} />
              {errors.name && <p className="error-text">{errors.name}</p>}
              <label>Email:</label>
              <input type="text" value={newDriver.email} onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })} />
              {errors.email && <p className="error-text">{errors.email}</p>}
              <label>Phone Number:</label>
              <input type="text" value={newDriver.phone} onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })} />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
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

export default Drivers;
