'use client';
import React, { useState, useEffect } from 'react';
import './Oxivive.css';
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from 'next/navigation';

const Oxivive: React.FC = () => {
    const [selected_service, setSelected_Service] = useState<string | null>(null);
    const [isProceedEnabled, setIsProceedEnabled] = useState<boolean>(false);
    const [isServiceClicked, setIsServiceClicked] = useState<boolean>(false);
    const router = useRouter();

    // Restore state from localStorage on page load
    useEffect(() => {
        const savedService = localStorage.getItem('selected_service');
        const savedServiceClicked = localStorage.getItem('isServiceClicked') === 'true';
        const savedProceedEnabled = localStorage.getItem('isProceedEnabled') === 'true';

        if (savedService) setSelected_Service(savedService);
        setIsServiceClicked(savedServiceClicked);
        setIsProceedEnabled(savedProceedEnabled);
    }, []);

    const handleBackClick = () => {
        router.back();
    };

    const handleServiceClick = () => {
        const newServiceClickedState = !isServiceClicked;
        setIsServiceClicked(newServiceClickedState);
        setIsProceedEnabled(newServiceClickedState);

        // Save state to localStorage
        localStorage.setItem('isServiceClicked', newServiceClickedState.toString());
        localStorage.setItem('isProceedEnabled', newServiceClickedState.toString());
    };

    const handleProceedClick = () => {
        // Save the selected service to localStorage before navigating
        if (selected_service) {
            localStorage.setItem('selected_service', selected_service);
        }

        router.push('/VendorManagementService/SV/Service/Oxivive/Details'); // Navigate to the next page
    };

    return (
        <div className="oxivive-container">
            <div className="oxivive-back">
                <button className="back-icon" onClick={handleBackClick}>
                    <BiArrowBack />
                </button>
            </div>
            <div className="oxivive-content">
                <img src="/images/check.jpg" alt="OxiWheel" className="oxivive-image" />
                <h2 className="oxivive-title">
                    To continue {selected_service} Vendor with OXIVIVE, please select an option
                </h2>
                <p className="oxivive-subtitle">
                    If you have multiple vehicles, proceed as {selected_service}.
                </p>
                <p className="oxivive-question">
                    What would you like to register as?
                </p>
                <button
                    className={`oxivive-option ${isServiceClicked ? 'service-clicked' : ''}`}
                    onClick={handleServiceClick}
                >
                    {selected_service}
                </button>
            </div>
            <button className="oxivive-proceed" disabled={!isProceedEnabled} onClick={handleProceedClick}>
                Save and Proceed
            </button>
        </div>
    );
};

export default Oxivive;
