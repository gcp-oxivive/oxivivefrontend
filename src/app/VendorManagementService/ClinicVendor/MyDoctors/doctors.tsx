'use client';
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import './doctors.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter,useSearchParams } from 'next/navigation';

interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
  vendor: '';
}

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams=useSearchParams();
  const vendorId = searchParams.get('vendorId');
  
  const [setVendorId] = useState<string | null>(null);
  const [selectedFooter, setSelectedFooter] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', phone: '', imageUrl: '',email:'',vendor: vendorId || '' });
  const router = useRouter();

  useEffect(() => {
    fetchDoctors();
  }, []);

  // useEffect(() => {
  //   // Try to get vendorId from URL first
  //   const urlVendorId = searchParams.get('vendorId');
  //   if (urlVendorId) {
  //     setNewDoctor((prev) => ({ ...prev, vendor: urlVendorId })); // Set vendorId from URL
  //   } else {
  //     // Fallback to localStorage
  //     const storedVendorId = localStorage.getItem('vendor_id');
  //     if (storedVendorId) {
  //       setNewDoctor((prev) => ({ ...prev, vendor: storedVendorId })); // Set vendorId from localStorage
  //     }
  //   }
  // }, [searchParams]);

  useEffect(() => {
    const id = searchParams.get('vendorId') || localStorage.getItem('vendor_id');
    if (!id) {
        alert("Vendor ID is missing. Please log in again.");
        router.push('/login');
    } else {
        setNewDoctor((prev) => ({ ...prev, vendor: id }));
        localStorage.setItem('vendor_id', id); // Store it for consistency
    }
}, [searchParams]);



  
  


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewDoctor({ name: '', phone: '', imageUrl: '',email:'',vendor: vendorId || '' });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewDoctor({
        ...newDoctor,
        imageUrl: URL.createObjectURL(event.target.files[0])
      });
    }
  };

  const fetchDoctors = async () => {
    const vendorId = localStorage.getItem('vendor_id'); // Get vendor_id from localStorage

    if (!vendorId) {
        alert("Vendor ID is missing. Please log in again.");
        router.push('/login'); // Redirect to login if vendor_id is missing
        return;
    }
    setIsLoading(true);

    try {
        const response = await fetch(`https://doctormanagementservice-69668940637.asia-east1.run.app/api/doctors/list_doctors/?vendor=${vendorId}`);
        if (response.ok) {
            const data = await response.json();

            if (data.length === 0) {
                // Handle case where no data is found for the vendor
                alert("No doctors found for this vendor.");
            }

            const formattedDoctors = data.map((doctor: any) => ({
                id: doctor.doctor_id,
                name: doctor.name,
                phone: doctor.phone,
                imageUrl: doctor.profile_photo || 'https://via.placeholder.com/50',
            }));
            setDoctors(formattedDoctors); // Update state with filtered doctor list
        } else {
            console.error("Failed to fetch doctors. Status code:", response.status);
        }
    } catch (error) {
        console.error("Error fetching doctors:", error);
    }finally {
      setIsLoading(false); // Hide spinner
    }
};



  

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);
  const validateName = (name: string) => name.trim() !== '';

  const handleSave = async () => {
    
    
    if (!validateName(newDoctor.name)) {
        alert("Please enter a valid name.");
        return;
    }
    if (!validateEmail(newDoctor.email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!validatePhone(newDoctor.phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    try {
        let imageUrl = '';

        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('upload_preset', 'driver_images'); // Cloudinary preset

            const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dvxscrjk0/image/upload', {
                method: 'POST',
                body: formData,
            });

            if (cloudinaryResponse.ok) {
                const cloudinaryData = await cloudinaryResponse.json();
                imageUrl = cloudinaryData.secure_url;
            } else {
                alert("Failed to upload image. Please try again.");
                return;
            }
        }

        const doctorData = {
            name: newDoctor.name,
            email: newDoctor.email,
            phone: newDoctor.phone,
            profile_photo: imageUrl,
            vendor: newDoctor.vendor, // Include vendor_id
        };

        console.log('Payload to API:', doctorData);

        const response = await fetch('https://doctormanagementservice-69668940637.asia-east1.run.app/api/doctors/add_doctor/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(doctorData),
        });

        if (response.ok) {
            closeModal();
            fetchDoctors(); // Update the doctor list
            alert("Doctor saved successfully!");
        } else {
            const errorData = await response.json();
            alert(`Failed to save doctor: ${errorData.message || 'Please try again.'}`);
        }
    } catch (error) {
        console.log('Error occurred while saving doctor:', error);
        alert('An error occurred while saving the doctor. Please try again.');
    }
};


  // function handleFooterClick(arg0: string): void {
  //   throw new Error('Function not implemented.');
  // }

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

  return (
    <div className="doctors-container">
      <header className="doctors-header">
        <FaArrowLeft className="back-icon" onClick={() => router.push('/VendorManagementService/Vendors/WheelVendor/Clinic')}/>
        <h1>My Doctors</h1>
        <button className="add-button" onClick={openModal}>
          <FaPlus /> ADD
        </button>
      </header>

      <div className="doctor-list">
    <div className="doctor-headings1">
        <p>Name</p>
        <p>Phone no</p>
    </div>
    
    {isLoading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : doctors.length === 0 ? (
          <p className="no-data-message">No doctors available for this vendor.</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <img src={doctor.imageUrl} alt={doctor.name} className="doctor-image" />
              <div className="doctor-info">
                <p className="doctor-name">{doctor.name}</p>
                <p className="doctor-phone">{doctor.phone}</p>
              </div>
            </div>
          ))
        )}
      </div>


      <div className="doctors-footer">
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
                <img src={newDoctor.imageUrl || 'https://via.placeholder.com/100'} alt="Doctor" className="doctor-modal-image" />
                <FaPlus className="plus-icon" />
              </label>
              <input id="file-input" type="file" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>
            <div className="modal-fields">
              <label>Name:</label>
              <input type="text" value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} />
              <label>Email:</label>
              <input type="text" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} />
              <label>Phone Number:</label>
              <input type="text" value={newDoctor.phone} onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })} />
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

export default Doctors;
