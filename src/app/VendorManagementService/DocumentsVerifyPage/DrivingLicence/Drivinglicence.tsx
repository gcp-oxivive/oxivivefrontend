"use client";
import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { BiArrowBack } from "react-icons/bi";
import "./Drivinglicence.css";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/VendorManagementService/customtoast/page";  // Import the custom showToast function
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

    // Resize image before storing in localStorage
    const resizeImage = (file: File, maxWidth: number, maxHeight: number) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                        const width = img.width * scale;
                        const height = img.height * scale;
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.8); // 0.8 to compress image
                        resolve(resizedDataUrl);
                    }
                };
                img.src = event.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, side: string) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Resize image before storing
            const resizedImage = await resizeImage(file, 500, 500); // Limit size to 500x500 pixels
            if (side === "front") {
                setFrontSide(file);
                setFrontPreview(resizedImage);
            } else {
                setBackSide(file);
                setBackPreview(resizedImage);
            }
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

            showToast("Files uploaded successfully!", 'success');
            Router.push("/VendorManagementService/DocumentsVerifyPage");
        } else {
            alert("Please complete all fields and upload both sides of the licence.");
        }
    };

    return (
        <div className="container19">
            <ToastContainer className="toast-container" />
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
