"use client";
import React, { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import { BiArrowBack } from "react-icons/bi";
import './Vehiclerc.css';
import { useRouter } from "next/navigation";
import { showToast } from "@/app/VendorManagementService/customtoast/page";
  // Import the custom showToast function
import { ToastContainer, toast } from "react-toastify";

const Vehiclerc: React.FC = () => {
  const Router = useRouter();
  const [frontSide, setFrontSide] = useState<File | null>(null);
  const [backSide, setBackSide] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  useEffect(() => {
    // Load previews from localStorage if available
    const storedFront = localStorage.getItem("vehicleFrontSidePreview");
    const storedBack = localStorage.getItem("vehicleBackSidePreview");

    if (storedFront) setFrontPreview(storedFront);
    if (storedBack) setBackPreview(storedBack);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, side: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      if (side === 'front') {
        setFrontSide(file);
        setFrontPreview(previewUrl);
      } else {
        setBackSide(file);
        setBackPreview(previewUrl);
      }
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (frontSide && backSide) {
      // Convert files to base64 and save to local storage on submit
      const frontBase64 = await convertFileToBase64(frontSide);
      const backBase64 = await convertFileToBase64(backSide);

      localStorage.setItem("vehicleFrontSidePreview", frontPreview || "");
      localStorage.setItem("vehicleBackSidePreview", backPreview || "");
      localStorage.setItem("vehicleFrontFile", frontBase64);
      localStorage.setItem("vehicleBackFile", backBase64);
      localStorage.setItem("isVehicleRCUploaded", "true");

      showToast("Vehicle RC uploaded successfully!",'success');
      Router.push("/VendorManagementService/DocumentsVerifyPage");
    } else {
      alert("Please upload both sides of the Vehicle RC");
    }
  };

  return (
    <div className="container23">
      <ToastContainer className="toast-container"/>
      <div className="back-arrow">
        <BiArrowBack className="arrow-icon" onClick={() => Router.back()} />
      </div>

      <h1 className="header4">Vehicle RC</h1>
      <p className="instruction4">
        Make sure that all the data on your document is fully visible, glare-free, and not blurred.
      </p>
      <div className="imagePreview">
        <img 
          src="/images/vehiclerc.jpg" 
          alt="Vehicle RC Preview" 
          className="rcImage" 
        />
      </div>

      <div className="uploadContainer4">
        <div className="uploadBox4">
          <label htmlFor="upload-front" className="uploadLabel">
            {frontPreview ? (
              <img src={frontPreview} alt="Front side preview" className="previewImage" />
            ) : (
              <>
                <FiUpload className="uploadIcon" />
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
        <div className="uploadBox4">
          <label htmlFor="upload-back" className="uploadLabel">
            {backPreview ? (
              <img src={backPreview} alt="Back side preview" className="previewImage" />
            ) : (
              <>
                <FiUpload className="uploadIcon" />
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

      <button className="submitButton4" onClick={handleSubmit}>
        Done
      </button>
    </div>
  );
};

export default Vehiclerc;
