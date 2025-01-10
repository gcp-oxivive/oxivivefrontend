"use client";
import React, { useEffect, useState } from 'react';
import './Document.css'; // External CSS for styling
import { FaIdBadge, FaBuilding, FaIdCard, FaUser } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import { TiTick } from 'react-icons/ti';
import axios from 'axios';
import { showToast } from "../customtoast/page";  // Import the custom showToast function
import { ToastContainer, toast } from "react-toastify";

const Document: React.FC = () => {
    const router = useRouter();
    const [isMedicalUploaded, setIsMedicalUploaded] = useState(false);
    const [isBuildingLicenceUploaded, setIsBuildingLicenceUploaded] = useState(false);
    const [isAadharUploaded, setIsAadharUploaded] = useState(false);
    const [isPancardUploaded, setIsPancardUploaded] = useState(false);
    const [isProfilePhotoUploaded, setIsProfilePhotoUploaded] = useState(false);
    const [isDrivingLicenceUploaded, setIsDrivingLicenceUploaded] = useState(false);
    const [isVehicleRCUploaded, setIsVehicleRCUploaded] = useState(false);
    const [selected_service, setSelected_Service] = useState<string | null>(null);
    const [price, setprice] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email:'',
        state: '',
        district: '',
        pincode: '',
        address: '',
        wheel_name: '',
        clinic_name: ''
    });
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('formData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        const serviceName = localStorage.getItem('selected_service');
        if (serviceName) {
            setSelected_Service(serviceName);
        }
    }, []);

    useEffect(() => {
        const price = localStorage.getItem("price");
        if (price) {
            setprice(price);
        }
    }, []);
    

    useEffect(() => {
        // Check document statuses on mount
        setIsMedicalUploaded(localStorage.getItem("isMedicalUploaded") === "true");
        setIsBuildingLicenceUploaded(localStorage.getItem("isBuildingLicenceUploaded") === "true");
        setIsAadharUploaded(localStorage.getItem("isAadharUploaded") === "true");
        setIsPancardUploaded(localStorage.getItem("isPancardUploaded") === "true");
        setIsProfilePhotoUploaded(localStorage.getItem("isProfilePhotoUploaded") === "true");
        setIsDrivingLicenceUploaded(localStorage.getItem("isDrivingLicenceUploaded") === "true");
        setIsVehicleRCUploaded(localStorage.getItem("isVehicleRCUploaded") === "true");

        // const cleanup = () => {
        //     localStorage.clear();
        // };

        // window.addEventListener("beforeunload", cleanup);
        // return () => {
        //     window.removeEventListener("beforeunload", cleanup);
        // };
    }, []);

    // Clear only uploaded images on page refresh
    useEffect(() => {
        const handleRefresh = () => {
            const imageKeys = [
                "isMedicalUploaded",
                "isBuildingLicenceUploaded",
                "isAadharUploaded",
                "isPancardUploaded",
                "isProfilePhotoUploaded",
                "isDrivingLicenceUploaded",
                "isVehicleRCUploaded",
                "medicalFrontFile",
                "medicalBackFile",
                "buildingFrontFile",
                "drivingFrontFile",
                "drivingBackFile",
                "vehicleFrontFile",
                "vehicleBackFile",
                "aadharFrontFile",
                "aadharBackFile",
                "panFrontFile",
                "panBackFile",
                "profilePhotoFile"
            ];
            imageKeys.forEach((key) => localStorage.removeItem(key));
        };

        window.addEventListener("beforeunload", handleRefresh);
        return () => {
            window.removeEventListener("beforeunload", handleRefresh);
        };
    }, []);

    useEffect(() => {
        let touchStartY = 0;
        let touchEndY = 0;
    
        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
        };
    
        const handleTouchMove = (e) => {
            touchEndY = e.touches[0].clientY;
        };
    
        const handleTouchEnd = () => {
            if (touchStartY > touchEndY + 50) { // Swipe up detected
                window.location.reload(); // Refresh the page
            }
        };
    
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
    
        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);
    

    useEffect(() => {
        if (
            isAadharUploaded &&
            isPancardUploaded &&
            isProfilePhotoUploaded &&
            (
                (selected_service === 'Oxi Clinic' && isMedicalUploaded && isBuildingLicenceUploaded) || 
                (selected_service === 'Oxi Wheel' && isDrivingLicenceUploaded && isVehicleRCUploaded)
            )
        ) {
            setIsSubmitEnabled(true);
        } else {
            setIsSubmitEnabled(false);
        }
    }, [isMedicalUploaded, isBuildingLicenceUploaded, isAadharUploaded, isPancardUploaded, isProfilePhotoUploaded, isDrivingLicenceUploaded, isVehicleRCUploaded, selected_service,price]);

    const handleMedicalClick = () => router.push('/VendorManagementService/DocumentsVerifyPage/MedicalLicence');
    const handleBuildingClick = () => router.push('/VendorManagementService/DocumentsVerifyPage/BuildingLicence');
    const handleAadharClick = () => router.push('/VendorManagementService/DocumentsVerifyPage/AadharPage');
    const handlePancardClick = () => router.push('/VendorManagementService/DocumentsVerifyPage/PancardPage');
    const handleProfileClick = () => router.push('/VendorManagementService/DocumentsVerifyPage/ProfilePhotoPage');
    const handleDrivingLicenceClick = () => router.push('/VendorManagementService/DocumentsVerifyPage/DrivingLicence');
    const handleVehicleRCClick = () => router.push('/VendorManagementService/DocumentsVerifyPage/VehicleRC');

    const uploadToCloudinary = async (fileString: string | null) => {
        if (!fileString) return null;

        const formData = new FormData();
        formData.append("file", fileString);
        formData.append("upload_preset", "documents_all");

        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/dpysjcjbf/image/upload", formData);
            return response.data.secure_url;
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            return null;
        }
    };

    const handleSubmit = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("state", formData.state);
        formDataToSend.append("district", formData.district);
        formDataToSend.append("pincode", formData.pincode);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("wheel_name", formData.wheel_name || "");
        formDataToSend.append("clinic_name", formData.clinic_name || "");
        

        const imageFields = [
            { key: "medical_front_side", localStorageKey: "medicalFrontFile" },
            { key: "medical_back_side", localStorageKey: "medicalBackFile" },
            { key: "building_front_side", localStorageKey: "buildingFrontFile" },
            { key: "driving_front_side", localStorageKey: "drivingFrontFile" },
            { key: "driving_back_side", localStorageKey: "drivingBackFile" },
            { key: "vehicle_rc_front_side", localStorageKey: "vehicleFrontFile" },
            { key: "vehicle_rc_back_side", localStorageKey: "vehicleBackFile" },
            { key: "aadhar_front_side", localStorageKey: "aadharFrontFile" },
            { key: "aadhar_back_side", localStorageKey: "aadharBackFile" },
            { key: "pan_front_side", localStorageKey: "panFrontFile" },
            { key: "pan_back_side", localStorageKey: "panBackFile" },
            { key: "profile_photo", localStorageKey: "profilePhotoFile" },
        ];

        for (const { key, localStorageKey } of imageFields) {
            const fileString = localStorage.getItem(localStorageKey);
            if (fileString) {
                const uploadedUrl = await uploadToCloudinary(fileString);
                if (uploadedUrl) {
                    formDataToSend.append(key, uploadedUrl);
                }
            }
        }

        formDataToSend.append("medical_licence_number", localStorage.getItem("licenceNumber") || "");

        const licenceEndDate = localStorage.getItem("licenceEndDate");
        if (licenceEndDate) {
            const formattedDate = new Date(licenceEndDate).toISOString().split("T")[0];
            formDataToSend.append("licence_end_date", formattedDate);
        }

        formDataToSend.append("driving_licence_number", localStorage.getItem("drivingLicenceNumber") || "");

        const dateOfBirth = localStorage.getItem("dateOfBirth");
        if (dateOfBirth) {
            const formattedDob = new Date(dateOfBirth).toISOString().split("T")[0];
            formDataToSend.append("date_of_birth", formattedDob);
        }
        console.log("Form data before submission:", formData);  // Log to check if pincode is there

        if (!formData.pincode) {
            alert("Pincode is required");
            return;
        }

        if (selected_service) {
            formDataToSend.append("selected_service", selected_service);
        } else {
            console.error("Selected service is missing");
            return;
        }

        const price = localStorage.getItem("price");
        if (price) {
            formDataToSend.append("service_price", price);  // Note: changed from "service_id" to "service"
        } else {
            console.error("price is missing in localStorage");
            alert("price is required");
            return;
        }
        try {
            const response = await axios.post("https://vendormanagementservice-69668940637.asia-east1.run.app/api/vendor-details/", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(formDataToSend)
            if (response.status === 201) {
                showToast("Documents uploaded successfully!",'success');
                localStorage.clear();
                router.push('/VendorManagementService/paymentPage/paymentSuccess');
            }
        } catch (error) {
            console.error("Error uploading documents:", error);
            showToast("Please upload all required documents.", 'error');
        }
    };
    
    useEffect(() => {
        router.prefetch('/VendorManagementService/DocumentsVerifyPage/VehicleRC');
    }, []);
    

    useEffect(() => {
        router.prefetch('/VendorManagementService/DocumentsVerifyPage/ProfilePhotoPage');
    }, []);

    return (
        <div className="document-container">
            <ToastContainer className="toast-container"/>
            <header className="header100">
                <BiArrowBack className="back-icon1" onClick={() => router.push('/VendorManagementService/SV/Service/Oxivive/Details')} />
                <h1>Upload documents</h1>
                <p>Quick & Simple Process</p>
            </header>

            <div className="content-container">
                <div className="document-cards">
                    {/* Medical Practitioner License */}
                    {selected_service === 'Oxi Clinic' && (
                        <div
                        className={`document-card ${isMedicalUploaded ? 'uploaded' : ''}`}
                        onClick={handleMedicalClick}
                    >
                        <FaIdBadge className="document-icon" />
                        <div className="document-info">
                            <div className="document-title-container">
                                <h2 className="document-title">Medical Practitioner License</h2>
                                {isMedicalUploaded && <TiTick className="tick-icon" />}
                            </div>
                            <p>Upload Medical Practitioner License</p>
                        </div>
                        <IoIosArrowForward className="arrow-icon3" />
                    </div>
                    
                    )}

                    {/* Building Permit & Licence */}
                    {selected_service === 'Oxi Clinic' && (
                        <div
                        className={`document-card ${isBuildingLicenceUploaded ? 'uploaded' : ''}`}
                        onClick={handleBuildingClick}
                    >
                        <FaBuilding className="document-icon" />
                        <div className="document-info">
                            <div className="title-container">
                                <h2 className="document-title">Building Permit & Licence</h2>
                                {isBuildingLicenceUploaded && <TiTick className="tick-icon3" />}
                            </div>
                            <p>Upload Building Permit & Licence</p>
                        </div>
                        <IoIosArrowForward className="arrow-icon3" />
                    </div>
                    
                    )}

                    {/* Aadhar Card */}
                    {selected_service && (
                        <div className={`document-card ${isAadharUploaded ? 'uploaded' : ''}`} onClick={handleAadharClick}>
                        <FaIdCard className="document-icon" />
                        <div className="document-info">
                            <div className="title-container">
                                <h2 className="document-title">Aadhar Card</h2>
                                {isAadharUploaded && <TiTick className="tick-icon2" />}
                            </div>
                            <p>Upload Aadhar Card</p>
                        </div>
                        <IoIosArrowForward className="arrow-icon3" />
                    </div>
                    
                    )}

                    {/* Pancard */}
                    {selected_service && (
    <div
        className={`document-card ${isPancardUploaded ? 'uploaded' : ''}`}
        onClick={handlePancardClick}
    >
        <FaIdCard className="document-icon" />
        <div className="document-info">
            <div className="title-and-tick">
                <h2 className="document-title">Pancard</h2>
                {isPancardUploaded && <TiTick className="tick-icon" />}
            </div>
            <p>Upload Pancard</p>
        </div>
        <IoIosArrowForward className="arrow-icon3" />
    </div>
)}


                    {/* Profile Photo */}
                    {selected_service && (
                        <div
                        className={`document-card ${isProfilePhotoUploaded ? 'uploaded' : ''}`}
                        onClick={handleProfileClick}
                    >
                        <FaUser className="document-icon" />
                        <div className="document-info">
                            <div className="title-with-tick">
                                <h2 className="document-title1">Profile Photo</h2>
                                {isProfilePhotoUploaded && <TiTick className="tick-icon1" />}
                            </div>
                            <p>Upload Profile Photo</p>
                        </div>
                        <IoIosArrowForward className="arrow-icon2" />
                    </div>
                    
                    )}

                    {/* Driving Licence */}
                    {selected_service === 'Oxi Wheel' && (
                        <div
                        className={`document-card ${isDrivingLicenceUploaded ? 'uploaded' : ''}`}
                        onClick={handleDrivingLicenceClick}
                    >
                        <FaIdCard className="document-icon" />
                        <div className="document-info">
                            <div className="document-title-container">
                                <h2 className="document-title">Driving Licence</h2>
                                {isDrivingLicenceUploaded && <TiTick className="tick-icon" />}
                            </div>
                            <p>Upload Driving Licence</p>
                        </div>
                        <IoIosArrowForward className="arrow-icon3" />
                    </div>
                    
                    )}

                    {/* Vehicle Registration Certificate */}
                    {selected_service === 'Oxi Wheel' && (
                        <div
                        className={`document-card ${isVehicleRCUploaded ? 'uploaded' : ''}`}
                        onClick={handleVehicleRCClick}
                    >
                        <FaIdCard className="document-icon" />
                        <div className="document-info">
                            <div className="document-title-container">
                                <h2 className="document-title">Vehicle RC</h2>
                                {isVehicleRCUploaded && <TiTick className="tick-icon" />}
                            </div>
                            <p>Upload Vehicle RC</p>
                        </div>
                        <IoIosArrowForward className="arrow-icon3" />
                    </div>


                    
                    )}

<button
                        onClick={handleSubmit}
                        disabled={!isSubmitEnabled}
                        className={`submit-btn ${isSubmitEnabled ? 'enabled' : 'disabled'}`}
                    >
                        Submit
                    </button>
                </div>
                

                
            </div>
        </div>
    );
};

export default Document;
