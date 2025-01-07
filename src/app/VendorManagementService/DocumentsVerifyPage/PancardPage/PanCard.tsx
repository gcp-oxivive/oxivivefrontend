"use client";
import React, { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import { BiArrowBack } from "react-icons/bi";
import './PanCard.css';
import { useRouter } from "next/navigation";
import { showToast } from "@/app/VendorManagementService/customtoast/page"; // Import the custom showToast function
import { ToastContainer, toast } from "react-toastify";
import imageCompression from "browser-image-compression"; // Import the image compression library

const PanCard: React.FC = () => {
  const Router = useRouter();
  const [frontSide, setFrontSide] = useState<File | null>(null);
  const [backSide, setBackSide] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  useEffect(() => {
    // Load previews from localStorage if available
    const storedFront = localStorage.getItem("pancardFrontSidePreview");
    const storedBack = localStorage.getItem("pancardBackSidePreview");

    if (storedFront) setFrontPreview(storedFront);
    if (storedBack) setBackPreview(storedBack);
  }, []);

  // Helper function to compress the image
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1, // Limit the file size to 1MB
      maxWidthOrHeight: 1024, // Limit the image dimensions
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, side: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const compressedFile = await compressImage(file); // Compress the image
      const previewUrl = URL.createObjectURL(compressedFile);

      if (side === 'front') {
        setFrontSide(compressedFile);
        setFrontPreview(previewUrl);
      } else {
        setBackSide(compressedFile);
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
      // Compress files before converting to base64
      const compressedFront = await compressImage(frontSide);
      const compressedBack = await compressImage(backSide);

      // Convert compressed files to base64 and save to local storage
      const frontBase64 = await convertFileToBase64(compressedFront);
      const backBase64 = await convertFileToBase64(compressedBack);

      localStorage.setItem("pancardFrontSidePreview", frontPreview || "");
      localStorage.setItem("pancardBackSidePreview", backPreview || "");
      localStorage.setItem("panFrontFile", frontBase64);
      localStorage.setItem("panBackFile", backBase64);
      localStorage.setItem("isPancardUploaded", "true");

      showToast("Pan Card uploaded successfully!", 'success');
      Router.push("/VendorManagementService/DocumentsVerifyPage");
    } else {
      alert("Please upload both sides of the Pan card");
    }
  };

  return (
    <div className="container21">
      <ToastContainer className="toast-container"/>
      <div className="back-arrow">
        <BiArrowBack className="arrow-icon" onClick={() => Router.back()}/>
      </div>

      <h1 className="header1">Pan Card</h1>
      <p className="instruction">
        Make sure that all the data on your document is fully visible, glare-free, and not blurred.
      </p>
      <div className="imagePreview">
        <img 
          src="/images/pancardpic.jpg" 
          alt="Pan Card Preview" 
          className="aadharImage" 
        />
      </div>

      <div className="uploadContainer3">
        <div className="uploadBox3">
          <label htmlFor="upload-front" className="uploadLabel">
            {frontPreview ? (
              <img src={frontPreview} alt="Front side preview" className="previewImage" />
            ) : (
              <>
                <FiUpload className="uploadIcon3" />
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
        <div className="uploadBox3">
          <label htmlFor="upload-back" className="uploadLabel">
            {backPreview ? (
              <img src={backPreview} alt="Back side preview" className="previewImage" />
            ) : (
              <>
                <FiUpload className="uploadIcon3" />
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

      <button className="submitButton3" onClick={handleSubmit}>
        Done
      </button>
    </div>
  );
};

export default PanCard;
