'use client';
import React, { useState, useEffect } from 'react';
import { MdOutlineAddToPhotos } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import { CgRemoveR } from "react-icons/cg";
import { useRouter } from 'next/navigation';
import Sidebar from "../../Sidebar/Sidebar"; 
import './Manageservice.css';

// Define form data type
interface FormData {
  serviceName: string;
  description: string;
  price: string;
  serviceType: string;
  image: File | null;
}

interface Service {
  service_id: string;
  service: string;
  description: string;
  price: string;
  service_type: string;
  service_image: string;
}

const Manageservice: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    serviceName: '',
    description: '',
    price: '',
    serviceType: '',
    image: null,
  });
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const router = useRouter();

  // Fetch services from the backend when the component mounts
  const fetchServices = async () => {
    try {
      const response = await fetch('https://patientservice-69668940637.asia-east1.run.app/api/manage-service/');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data.reverse());
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false); // Set loading to false after the data is fetched
    }
  };
  

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle remove button click
  const handleRemove = async (service_id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://patientservice-69668940637.asia-east1.run.app/api/manage-service/${service_id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Service deleted successfully!");
        setServices((prevServices) =>
          prevServices.filter((service) => service.service_id !== service_id)
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to delete service: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("An error occurred while deleting the service.");
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prevData) => ({ ...prevData, image: e.target.files[0] }));
    }
  };

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter services based on search query
  const filteredServices = services.filter((service) =>
    service.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.price.toString().includes(searchQuery.toLowerCase()) ||
    service.service_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.image) {
      alert('Please fill data & upload an image.');
      return;
    }

    try {
      // Step 1: Upload image to Cloudinary
      const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dpysjcjbf/image/upload';
      const uploadPreset = 'documents_all';

      const imageFormData = new FormData();
      imageFormData.append('file', formData.image);
      imageFormData.append('upload_preset', uploadPreset);

      const cloudinaryResponse = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: imageFormData,
      });

      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryData.secure_url) {
        alert('Image upload failed.');
        return;
      }

      // Step 2: Send data to backend
      const backendData = {
        service: formData.serviceName,
        description: formData.description,
        price: formData.price,
        service_type: formData.serviceType,
        service_image: cloudinaryData.secure_url,
      };

      const backendResponse = await fetch('https://patientservice-69668940637.asia-east1.run.app/api/manage-service/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (backendResponse.ok) {
        alert('Service added successfully!');
        setFormData({
          serviceName: '',
          description: '',
          price: '',
          serviceType: '',
          image: null,
        });
        setShowModal(false);
        fetchServices();
      } else {
        alert('Failed to add service.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    }
  };

  const handleCardClick = (service: Service) => {
    const queryParams = new URLSearchParams({
      image: service.service_image,
      heading: service.service_type,
      price: service.price,
      service: service.service,
      description: service.description,
    });
    router.push(`/AdminService/AdminDashboard/ManageService/ManageServiceCard?${queryParams}`);
  };

  return (
  <div className="manage-service">
    <Sidebar />

    <main className="content">
      {loading ? (
        <div className="spinnerContainer">
        <div className="spinner"></div>
      </div>
      ) : (
        <>
          <header className="header0">
            <h2 className="page-title">Manage Service</h2>
            <input
              type="text"
              className="search-bar3"
              placeholder="Search services..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </header>

          <div className="actions">
            <button className="add-service-btn" onClick={() => setShowModal(true)}>
              <MdOutlineAddToPhotos className="add-icon" /> Add Service
            </button>
          </div>

          <section className="service-cards">
            {filteredServices.map((service) => (
              <div key={service.service_id} className="card2" onClick={() => handleCardClick(service)}>
                <div className="card-image">
                  <img src={service.service_image} alt={service.service} />
                  <h3 className="head1">{service.service_type}</h3>
                </div>

                <div className="card-content">
                  <p><strong>Service:</strong> {service.service}</p>
                  <p><strong>Description:</strong> {service.description}</p>
                  <p>
                    <strong>Price:</strong> <span style={{ color: 'red' }}>{service.price} Rs.</span>
                  </p>
                  <button
                    className="remove-btn"
                    onClick={(e) => { e.stopPropagation(); handleRemove(service.service_id); }}
                  >
                    <CgRemoveR className="remove-icon" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="heading5">Add New Service</h3>
            <form>
              <label>Service Name:</label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                placeholder="Enter service name"
              />
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter service description"
              ></textarea>
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
              />
              <label>Service Type:</label>
              <input
                type="text"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                placeholder="Enter service type"
              />
              <label>Upload Image:</label>
              <div className="upload-container">
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <IoCameraOutline className="camera-icon" />
                  {formData.image ? (
                    <span className="file-name">{formData.image.name}</span>
                  ) : (
                    <span className='place'>Upload Image</span>
                  )}
                </button>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleSubmit}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  </div>
);
};

export default Manageservice;
