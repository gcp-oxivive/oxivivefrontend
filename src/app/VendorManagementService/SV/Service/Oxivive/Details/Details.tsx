'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BiArrowBack } from "react-icons/bi";
import './Details.css';

const Details = () => {
  const router = useRouter();
  const [selected_service, setSelected_Service] = useState<string | null>(null);
  const [price, setprice] = useState<string | null>(null);

  useEffect(() => {
    const serviceName = localStorage.getItem('selected_service');
    const price = localStorage.getItem('price'); // Retrieve service_id
    console.log(serviceName, price);
    setSelected_Service(serviceName);
    setprice(price);

    console.log('Service ID:', price); // Optionally log serviceId
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    district: '',
    pincode: '',
    address: '',
    wheel_name: '',
    clinic_name: ''
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const allFieldsFilled = Object.entries(formData).every(([field, value]) => {
      if (
        (selected_service === 'Oxi Wheel' && field === 'wheel_name') ||
        (selected_service === 'Oxi Clinic' && field === 'clinic_name') ||
        !['wheel_name', 'clinic_name'].includes(field)
      ) {
        return value.trim() !== '';
      }
      return true;
    });
    setIsFormValid(allFieldsFilled && emailIsValid);
  }, [formData, selected_service]);

  const handleBackClick = () => {
    router.back();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validation rules
    let validatedValue = value;

    if (name === 'name' || name === 'state' || name === 'district' || name === 'wheel_name' || name === 'clinic_name') {
      validatedValue = value.replace(/[^a-zA-Z\s]/g, ''); // Allows only letters and spaces
    } else if (name === 'address') {
      validatedValue = value.replace(/[^a-zA-Z\s,]/g, ''); // Allows letters, spaces, and commas
    } else if (name === 'phone') {
      validatedValue = value.replace(/[^0-9]/g, '').slice(0, 10); // Only digits, max 10 characters
    } else if (name === 'pincode') {
      validatedValue = value.replace(/[^0-9]/g, '').slice(0, 6); // Only digits, max 6 characters
    } else if (name === 'email') {
      validatedValue = value; // No character restrictions, validate format later
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: validatedValue
    }));
  };

  const handleContinue = () => {
    if (isFormValid) {
      localStorage.setItem('formData', JSON.stringify(formData));
      router.push('/VendorManagementService/DocumentsVerifyPage');
    }
  };

  return (
    <div className="container123">
      <div className="details-back">
        <button className="back-icon" onClick={handleBackClick}>
          <BiArrowBack />
        </button>
      </div>

      <h2 className="heading1">Add your {selected_service} details</h2>
      <p className="subtext1">Fill all the details properly</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        {Object.entries(formData).map(([field, value]) => {
          if (
            (selected_service === 'Oxi Wheel' && field === 'wheel_name') ||
            (selected_service === 'Oxi Clinic' && field === 'clinic_name') ||
            (!['wheel_name', 'clinic_name'].includes(field))
          ) {
            return (
              <div className="form-group" key={field}>
                <label
                  htmlFor={field}
                  className={value ? 'focused-label' : ''}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  id={field}
                  name={field}
                  value={value}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field}`}
                  className={`input ${value ? 'input-focused' : ''}`}
                />
              </div>
            );
          }
          return null;
        })}
      </form>

      <button
        onClick={handleContinue}
        type="button"
        className={`submit-btn1 ${isFormValid ? '' : 'disabled-btn'}`}
        disabled={!isFormValid}
      >
        Continue
      </button>
    </div>
  );
};

export default Details;
