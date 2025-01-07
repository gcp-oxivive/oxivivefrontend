"use client";
import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { CgProfile } from "react-icons/cg";
import { PiPlusCircleFill } from 'react-icons/pi';
import './Profilephoto.css';
import { useRouter } from "next/navigation";
import { showToast } from "@/app/VendorManagementService/customtoast/page";
import { ToastContainer, toast } from "react-toastify";
import imageCompression from 'browser-image-compression'; // Import the library

const ProfilePhoto: React.FC = () => {
  const Router = useRouter();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedProfilePreview = localStorage.getItem("profilePhotoPreview");
    if (storedProfilePreview) {
      setProfilePreview(storedProfilePreview);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }

      try {
        // Compress the image
        const options = {
          maxSizeMB: 0.5, // Compress to 0.5MB
          maxWidthOrHeight: 1920, // Maintain quality
        };
        const compressedFile = await imageCompression(file, options);
        const compressedFileURL = URL.createObjectURL(compressedFile);

        setProfileImage(compressedFile);
        setProfilePreview(compressedFileURL);
      } catch (error) {
        console.error("Image compression failed:", error);
        alert("Failed to compress the image. Please try again.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!profileImage) {
      alert('Please upload your profile photo');
      return;
    }

    setLoading(true); // Start loading indicator

    try {
      // Store preview in localStorage
      localStorage.setItem("profilePhotoPreview", profilePreview || "");
      localStorage.setItem("isProfilePhotoUploaded", "true"); // Mark as uploaded

      // Convert the compressed file to base64 and store it
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        localStorage.setItem("profilePhotoFile", base64String);

        showToast('Profile photo uploaded successfully!', 'success');
        Router.push("/VendorManagementService/DocumentsVerifyPage"); // Redirect to the verification page
      };
      reader.onerror = () => {
        alert("Error reading the file. Please try again.");
      };
      reader.readAsDataURL(profileImage);
    } catch (error) {
      alert("An error occurred while uploading. Please try again.");
      console.error(error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="container22">
      <ToastContainer className="toast-container"/>
      <div className="back-arrow">
        <FiArrowLeft className="arrow-icon" onClick={() => Router.back()} />
      </div>

      <h1 className="header1">Profile Photo</h1>

      <p className="instruction">
        Make sure your photo is entirely visible, glare-free and not blurred.
      </p>

      <div className="profileImageContainer">
        <label htmlFor="upload-profile" className="uploadLabel">
          {profilePreview ? (
            <img src={profilePreview} alt="Profile Preview" className="profileImage" />
          ) : (
            <div className="imagePlaceholder">
              <CgProfile className="profileIcon" />
              <PiPlusCircleFill className="plusIcon" />
            </div>
          )}
        </label>
        <input
          id="upload-profile"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="inputFile"
        />
      </div>

      <button
        className="submitButton"
        onClick={handleSubmit}
        disabled={loading} // Disable button during loading
      >
        {loading ? "Uploading..." : "Done"}
      </button>
    </div>
  );
};

export default ProfilePhoto;
