"use client";
import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import "./Buildinglicence.css"; 
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/VendorManagementService/customtoast/page";
  // Import the custom showToast function
import { ToastContainer, toast } from "react-toastify";

const Buildinglicence: React.FC = () => {
  const router = useRouter();
  const [frontSide, setFrontSide] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);

  // Load preview data from localStorage on mount
  useEffect(() => {
    const storedFront = localStorage.getItem("buildingFrontPreview");
    if (storedFront) setFrontPreview(storedFront);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFrontSide(file); // Set file to state for submission

      // Generate a URL for preview without saving to local storage yet
      const previewURL = URL.createObjectURL(file);
      setFrontPreview(previewURL);
    }
  };

  const handleSubmit = () => {
    if (frontSide) {
      const reader = new FileReader();

      // Save to localStorage only after the "Done" button is clicked
      reader.onload = () => {
        const base64String = reader.result as string;
        localStorage.setItem("buildingFrontFile", base64String); // Save base64 data for backend
        localStorage.setItem("buildingFrontPreview", frontPreview as string); // Save preview for consistent display
        localStorage.setItem("isBuildingLicenceUploaded", "true");

        showToast("File uploaded successfully!",'success');
        router.push("/VendorManagementService/DocumentsVerifyPage");
      };

      reader.readAsDataURL(frontSide); // Convert file to base64
    } else {
      alert("Please upload the front side of the Building Permit & Licence");
    }
  };

  return (
    <div className="container18">
      <ToastContainer className="toast-container"/>
      <div className="back-arrow">
        <BiArrowBack className="arrow-icon" onClick={() => router.back()} />
      </div>

      <h1 className="header1">Building Permit & Licence</h1>
      <p className="instruction">
        Make sure that all the data on your document is fully visible, glare-free, and not blurred.
      </p>

      <div className="imagePreview">
        <img
          src="/images/building.png"
          alt="Building Licence Preview"
          className="aadharImage"
        />
      </div>

      <div className="uploadContainer">
        <div className="uploadBox">
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
            onChange={handleFileChange}
            className="inputFile"
          />
        </div>
      </div>

      <button className="submitButton" onClick={handleSubmit}>
        Done
      </button>
    </div>
  );
};

export default Buildinglicence;
