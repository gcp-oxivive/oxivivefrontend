"use client";
import React, { useState, useEffect } from 'react';
import { FiUpload, FiArrowLeft } from 'react-icons/fi';
import './Aadhar.css';
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/VendorManagementService/customtoast/page";
  // Import the custom showToast function
import { ToastContainer, toast } from "react-toastify";

const Aadhar: React.FC = () => {
  const Router = useRouter();
  const [frontSide, setFrontSide] = useState<File | null>(null);
  const [backSide, setBackSide] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  useEffect(() => {
    const storedFront = localStorage.getItem("aadharFrontPreview");
    const storedBack = localStorage.getItem("aadharBackPreview");

    if (storedFront) setFrontPreview(storedFront);
    if (storedBack) setBackPreview(storedBack);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileURL = URL.createObjectURL(file);
  
      if (side === 'front') {
        setFrontSide(file);
        setFrontPreview(fileURL);
        localStorage.setItem("aadharFrontPreview", fileURL); // Store only the file URL
      } else {
        setBackSide(file);
        setBackPreview(fileURL);
        localStorage.setItem("aadharBackPreview", fileURL); // Store only the file URL
      }
    }
  };
  


  const handleSubmit = () => {
    if (frontSide && backSide) {
      localStorage.setItem("isAadharUploaded", "true");
      showToast('Files uploaded successfully!', 'success');
      Router.push("/VendorManagementService/DocumentsVerifyPage");
    } else {
      alert('Please upload both sides of the Aadhar card');
    }
  };

  return (
    <div className="container17">
      <ToastContainer className="toast-container"/>
      <div className="back-arrow">
        <BiArrowBack className="arrow-icon" onClick={() => Router.back()}/>
      </div>

      <h1 className="header1">Aadhar Card</h1>

      <p className="instruction">
        Make sure that all the data on your document is fully visible, glare-free and not blurred
      </p>
      <div className="imagePreview">
                <img
                    src="/images/vehiclerc.jpg"
                    alt="Medical Practitioner Licence Preview"
                    className="aadharImage"
                />
            </div>

      <div className="uploadContainer1">
        <div className="uploadBox1">
          <label htmlFor="upload-front" className="uploadLabel">
            {frontPreview ? (
              <img src={frontPreview} alt="Front Preview" className="previewImage" />
            ) : (
              <>
                <FiUpload className="uploadIcon1" />
                <span>Upload front side</span>
              </>
            )}
          </label>
          <input
            id="upload-front"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'front')}
            className="inputFile"
          />
        </div>
        <div className="uploadBox1">
          <label htmlFor="upload-back" className="uploadLabel">
            {backPreview ? (
              <img src={backPreview} alt="Back Preview" className="previewImage" />
            ) : (
              <>
                <FiUpload className="uploadIcon1" />
                <span>Upload back side</span>
              </>
            )}
          </label>
          <input
            id="upload-back"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'back')}
            className="inputFile"
          />
        </div>
      </div>

      <button className="submitButton5" onClick={handleSubmit}>
        Done
      </button>
    </div>
  );
};

export default Aadhar;
