'use client';
import React, { useState, useEffect } from 'react';
import './AdminPerson.css';
import Sidebar from '../Sidebar/page';

const AdminPerson = () => {
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    state: '',
    district: '',
    pincode: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editAdminId, setEditAdminId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customAlert, setCustomAlert] = useState({ visible: false, message: '', type: '' });



  const showAlert = (message, type) => {
    setCustomAlert({ visible: true, message, type });
    setTimeout(() => {
      setCustomAlert({ visible: false, message: '', type: '' });
    }, 3000); // Alert will disappear after 3 seconds
  };
  

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('https://adminservice-69668940637.asia-east1.run.app/api/adminperson/');
        if (response.ok) {
          const data = await response.json();
          setAdmins(data);
          setFilteredAdmins(data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredAdmins(admins);
    } else {
      const filtered = admins.filter((admin) =>
        admin.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredAdmins(filtered);
    }
  };

  const handleAddAdminClick = () => {
    setShowAddAdminForm(true);
    setEditMode(false);
    setFormValues({
      name: '',
      contact: '',
      email: '',
      address: '',
      state: '',
      district: '',
      pincode: '',
    });
  };

  const handleEditClick = (admin) => {
    setShowAddAdminForm(true);
    setEditMode(true);
    setEditAdminId(admin.admin_id);
    setFormValues(admin);
  };

  const handleDeleteClick = async (adminId) => {
    // if (!window.confirm('Are you sure you want to delete this admin?')) {
    //   return;
    // }

    try {
      const response = await fetch(`https://adminservice-69668940637.asia-east1.run.app/api/delete_superadmins/${adminId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedAdmins = admins.filter((admin) => admin.admin_id !== adminId);
        setAdmins(updatedAdmins);
        setFilteredAdmins(updatedAdmins);
        showAlert('Admin deleted successfully!', 'success');
      } else {
        showAlert('Failed to delete admin. Please try again.', 'error');
      }
    } catch (error) {
      showAlert('An error occurred while deleting the admin.' , 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.name.trim()) errors.name = 'Name is required';
    if (!formValues.contact.trim() || !/^\d{10}$/.test(formValues.contact))
      errors.contact = 'Valid contact number is required';
    if (!formValues.email.trim() || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formValues.email))
      errors.email = 'Valid email is required';
    if (!formValues.address.trim()) errors.address = 'Address is required';
    if (!formValues.state.trim()) errors.state = 'State is required';
    if (!formValues.district.trim()) errors.district = 'District is required';
    if (!formValues.pincode.trim() || !/^\d{6}$/.test(formValues.pincode))
      errors.pincode = 'Valid 6-digit pincode is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      try {
        const url = editMode
          ? `https://adminservice-69668940637.asia-east1.run.app/api/update_superadmins/${editAdminId}/`
          : 'https://adminservice-69668940637.asia-east1.run.app/api/superadmins/';
        const method = editMode ? 'PUT' : 'POST';
  
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        });
  
        if (response.ok) {
          const updatedAdmin = await response.json();
  
          if (editMode) {
            setAdmins(
              admins.map((admin) =>
                admin.admin_id === editAdminId ? updatedAdmin : admin
              )
            );
            setFilteredAdmins(
              filteredAdmins.map((admin) =>
                admin.admin_id === editAdminId ? updatedAdmin : admin
              )
            );
            showAlert('Data has been updated successfully!', 'success'); // Update success message
          } else {
            setAdmins([...admins, updatedAdmin]);
            setFilteredAdmins([...filteredAdmins, updatedAdmin]);
            showAlert('Data has been submitted successfully!', 'success'); // Add success message
          }
  
          setShowAddAdminForm(false);
          setEditMode(false);
          setFormValues({
            name: '',
            contact: '',
            email: '',
            address: '',
            state: '',
            district: '',
            pincode: '',
          });
          setFormErrors({});
        } else {
          const errorData = await response.json();
          showAlert(`Failed to save admin: ${JSON.stringify(errorData)}`, 'error');
        }
      } catch (error) {
        showAlert('An error occurred while saving the admin details.', 'error');
      }
    }
  };
  

  return (
    <div className="admin-person-container">
      <Sidebar />
      {customAlert.visible && (
      <div className={`custom-alert ${customAlert.type}`}>
        {customAlert.message}
      </div>
    )}
      <main className="content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <header>
              <div className="header-content">
                <div className="header-text">
                  <h2>{showAddAdminForm ? 'Add/Edit Admin Details' : 'Admin Persons'}</h2>
                  <p>
                    {showAddAdminForm
                      ? 'Fill the following details to add or edit person'
                      : 'The following table consists of Admins details'}
                  </p>
                </div>
                {!showAddAdminForm && (
                  <input
                    type="text"
                    placeholder="Search Admin"
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                )}
              </div>
            </header>

            {!showAddAdminForm && (
              <div className="actions">
                <button className="add-details-btn" onClick={handleAddAdminClick}>
                  + Add Admin
                </button>
              </div>
            )}

            {!showAddAdminForm && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Sl.No</th>
                    <th>Admin's Name</th>
                    <th>Contact No</th>
                    <th>Location</th>
                    <th>Edit Info</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin, index) => (
                    <tr key={admin.admin_id}>
                      <td>{index + 1}</td>
                      <td>{admin.name}</td>
                      <td>{admin.contact}</td>
                      <td>{`${admin.address}, ${admin.state}`}</td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEditClick(admin)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteClick(admin.admin_id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {showAddAdminForm && (
              <div className="add-admin-form">
                <h3>{editMode ? 'Edit Admin' : 'Add New Admin'}</h3>
                <form onSubmit={handleSubmit}>
                  {['name', 'contact', 'email', 'address', 'state', 'district', 'pincode'].map(
                    (field) => (
                      <div className="form-group" key={field}>
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                        <input
                          type="text"
                          name={field}
                          placeholder={`Enter ${field}`}
                          value={formValues[field]}
                          onChange={handleInputChange}
                        />
                        {formErrors[field] && <p className="error">{formErrors[field]}</p>}
                      </div>
                    )
                  )}
                  <div className="form-actions">
                    <button type="submit" className="save1-btn">
                      {editMode ? 'Update Admin' : 'Save Admin'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => setShowAddAdminForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPerson;
