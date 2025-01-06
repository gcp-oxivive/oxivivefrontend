"use client";
import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { BiArrowBack } from "react-icons/bi";
import "./Drivinglicence.css";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/VendorManagementService/customtoast/page";
  // Import the custom showToast function
import { ToastContainer, toast } from "react-toastify";

const DrivingLicence: React.FC = () => {
    const Router = useRouter();
    const [frontSide, setFrontSide] = useState<File | null>(null);
    const [backSide, setBackSide] = useState<File | null>(null);
    const [frontPreview, setFrontPreview] = useState<string | null>(null);
    const [backPreview, setBackPreview] = useState<string | null>(null);
    const [licenceNumber, setLicenceNumber] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");

    // Load data from localStorage on mount
    useEffect(() => {
        const storedFront = localStorage.getItem("drivingFrontFile");
        const storedBack = localStorage.getItem("drivingBackFile");
        const storedLicenceNumber = localStorage.getItem("drivingLicenceNumber");
        const storedDateOfBirth = localStorage.getItem("dateOfBirth");

        if (storedFront) setFrontPreview(storedFront);
        if (storedBack) setBackPreview(storedBack);
        if (storedLicenceNumber) setLicenceNumber(storedLicenceNumber);
        if (storedDateOfBirth) setDateOfBirth(storedDateOfBirth);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: string) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
    
            const reader = new FileReader();
            reader.onload = () => {
                const fileBase64 = reader.result as string;
                if (side === "front") {
                    setFrontSide(file);
                    setFrontPreview(fileBase64);
                } else {
                    setBackSide(file);
                    setBackPreview(fileBase64);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formattedValue = value.replace(/[^0-9\-\/]/g, "");
        setDateOfBirth(formattedValue);
    };

    // Handle driving licence number change with integer validation
    const handleLicenceNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers (integers)
        if (/^\d*$/.test(value)) {
            setLicenceNumber(value);
        }
    };

    const handleSubmit = () => {
        if (frontSide && backSide && licenceNumber && dateOfBirth) {
            // Save data in localStorage only when submit is clicked
            localStorage.setItem("drivingFrontFile", frontPreview || "");
            localStorage.setItem("drivingBackFile", backPreview || "");
            localStorage.setItem("drivingLicenceNumber", licenceNumber);
            localStorage.setItem("dateOfBirth", dateOfBirth);
            localStorage.setItem("isDrivingLicenceUploaded", "true"); // Update the status in localStorage

            showToast("Files uploaded successfully!",'success');
            Router.push("/VendorManagementService/DocumentsVerifyPage");
        } else {
            alert("Please complete all fields and upload both sides of the licence.");
        }
    };

    return (
        <div className="container19">
            <ToastContainer className="toast-container"/>
            <div className="back-arrow1">
                <BiArrowBack className="arrow-icon1" onClick={() => Router.back()} />
            </div>

            <h1 className="header3">Driving Licence</h1>
            <p className="instruction1">
                Make sure that all the data on your document is fully visible, glare-free,
                and not blurred.
            </p>

            <div className="imagePreview">
                <img
                    src="/images/vehiclerc.jpg"
                    alt="Driving Licence Preview"
                    className="dlImage"
                />
            </div>

            <div className="uploadContainer2">
                <div className="uploadBox1">
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
                        onChange={(e) => handleFileChange(e, "front")}
                        className="inputFile"
                    />
                </div>
                <div className="uploadBox1">
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
                        onChange={(e) => handleFileChange(e, "back")}
                        className="inputFile"
                    />
                </div>
            </div>

            <div className="inputFieldsContainer">
                <label className="formLabel">Driving Licence Number</label>
                <input
                    type="text"
                    placeholder="Enter Driving Licence Number"
                    className="inputField"
                    value={licenceNumber}
                    onChange={handleLicenceNumberChange}
                    pattern="\d*" // Ensures only digits can be entered
                    title="Please enter a valid Driving Licence Number (only integers)"
                />

                <label className="formLabel">Date of Birth</label>
                <input
                    type="date"
                    placeholder="Enter Date of Birth in Driving Licence"
                    className="inputField"
                    value={dateOfBirth}
                    onChange={handleDateOfBirthChange}
                />
            </div>

            <button className="submitButton1" onClick={handleSubmit}>
                Done
            </button>
        </div>
    );
};

export default DrivingLicence;
