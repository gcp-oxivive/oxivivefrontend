"use client";
import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { BiArrowBack } from "react-icons/bi";
import "./Medicallicence.css";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/VendorManagementService/customtoast/page";
  // Import the custom showToast function
import { ToastContainer, toast } from "react-toastify";

const Medicallicence: React.FC = () => {
    const router = useRouter();
    const [frontSide, setFrontSide] = useState<File | null>(null);
    const [backSide, setBackSide] = useState<File | null>(null);
    const [frontPreview, setFrontPreview] = useState<string | null>(null);
    const [backPreview, setBackPreview] = useState<string | null>(null);
    const [licenceNumber, setLicenceNumber] = useState("");
    const [licenceEndDate, setLicenceEndDate] = useState("");

    // Load preview data and fields from localStorage on mount
    useEffect(() => {
        const storedFrontPreview = localStorage.getItem("medicalFrontPreview");
        const storedBackPreview = localStorage.getItem("medicalBackPreview");
        const storedLicenceNumber = localStorage.getItem("licenceNumber");
        const storedLicenceEndDate = localStorage.getItem("licenceEndDate");

        if (storedFrontPreview) setFrontPreview(storedFrontPreview);
        if (storedBackPreview) setBackPreview(storedBackPreview);
        if (storedLicenceNumber) setLicenceNumber(storedLicenceNumber);
        if (storedLicenceEndDate) setLicenceEndDate(storedLicenceEndDate);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: string) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const previewURL = URL.createObjectURL(file);

            // Update preview image
            if (side === "front") {
                setFrontSide(file);
                setFrontPreview(previewURL);
            } else {
                setBackSide(file);
                setBackPreview(previewURL);
            }
        }
    };

    const handleLicenceNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLicenceNumber(e.target.value.replace(/[^0-9]/g, ""));
    };

    const handleLicenceEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLicenceEndDate(e.target.value);
    };

    const handleSubmit = () => {
        if (frontSide && backSide && licenceNumber && licenceEndDate) {
            const readerFront = new FileReader();
            const readerBack = new FileReader();

            // Read the front side image as base64
            readerFront.onload = () => {
                const frontBase64 = readerFront.result as string;
                localStorage.setItem("medicalFrontFile", frontBase64);
                localStorage.setItem("medicalFrontPreview", frontPreview as string);
            };
            readerFront.readAsDataURL(frontSide);

            // Read the back side image as base64
            readerBack.onload = () => {
                const backBase64 = readerBack.result as string;
                localStorage.setItem("medicalBackFile", backBase64);
                localStorage.setItem("medicalBackPreview", backPreview as string);
            };
            readerBack.readAsDataURL(backSide);

            // Save the other fields after reading the images
            localStorage.setItem("licenceNumber", licenceNumber);
            localStorage.setItem("licenceEndDate", licenceEndDate);
            localStorage.setItem("isMedicalUploaded", "true");

            showToast("Files and data uploaded successfully!", 'success');
            router.push("/VendorManagementService/DocumentsVerifyPage");
        } else {
            alert("Please complete all fields and upload both sides of the licence.");
        }
    };

    return (
        <div className="container20">
            <ToastContainer className="toast-container"/>
            <div className="back-arrow">
                <BiArrowBack className="arrow-icon" onClick={() => router.back()} />
            </div>

            <h1 className="header1">Medical Practitioner Licence</h1>
            <p className="instruction">
                Make sure that all the data on your document is fully visible, glare-free,
                and not blurred.
            </p>

            <div className="imagePreview">
                <img
                    src="/images/vehiclerc.jpg"
                    alt="Medical Practitioner Licence Preview"
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
                        onChange={(e) => handleFileChange(e, "front")}
                        className="inputFile"
                    />
                </div>
                <div className="uploadBox">
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
                <label className="formLabel">Medical Practitioner Licence Number</label>
                <input
                    type="text"
                    placeholder="Medical Practitioner Licence Number"
                    className="inputField"
                    value={licenceNumber}
                    onChange={handleLicenceNumberChange}
                />

                <label className="formLabel">Licence End Date</label>
                <input
                    type="date"
                    className="inputField"
                    value={licenceEndDate}
                    onChange={handleLicenceEndDateChange}
                />
            </div>

            <button className="submitButton" onClick={handleSubmit}>
                Done
            </button>
        </div>
    );
};

export default Medicallicence;
