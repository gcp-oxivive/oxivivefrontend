"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Inventorys.css";
import Sidebar from "../Sidebar/page";
import { LuFilter } from "react-icons/lu";

const Inventorys = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [groupedRequests, setGroupedRequests] = useState({});
    const [filter, setFilter] = useState("Pending");
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(true); // New state to handle loading

    const dropdownRef = useRef(null); // Reference for the dropdown container

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleApproveButton = async (vendorId, productId) => {
        try {
            const response = await axios.post("https://inventorymanagementservice-69668940637.asia-east1.run.app/api/inventoryapp_inventorydetails/", {
                vendor_id: vendorId,
                product_id: productId,
                action: "approve",
            });

            if (response.data.message === "Request status updated successfully") {
                setGroupedRequests((prevGroupedRequests) => {
                    const updatedGroupedRequests = { ...prevGroupedRequests };
                    Object.keys(updatedGroupedRequests).forEach((date) => {
                        updatedGroupedRequests[date].requests = updatedGroupedRequests[date].requests.map((request) =>
                            request.vendor_identifier === vendorId && request.product_id === productId
                                ? { ...request, request_status: "Approved" }
                                : request
                        );
                    });
                    return updatedGroupedRequests;
                });
            }
        } catch (error) {
            console.error("Error approving request status:", error);
        }
    };

    const handleRejectButton = async (vendorId, productId) => {
        try {
            const response = await axios.post("https://inventorymanagementservice-69668940637.asia-east1.run.app/api/inventoryapp_inventorydetails/", {
                vendor_id: vendorId,
                product_id: productId,
                action: "reject",
            });

            if (response.data.message === "Request status updated successfully") {
                setGroupedRequests((prevGroupedRequests) => {
                    const updatedGroupedRequests = { ...prevGroupedRequests };
                    Object.keys(updatedGroupedRequests).forEach((date) => {
                        updatedGroupedRequests[date].requests = updatedGroupedRequests[date].requests.map((request) =>
                            request.vendor_identifier === vendorId && request.product_id === productId
                                ? { ...request, request_status: "Rejected" }
                                : request
                        );
                    });
                    return updatedGroupedRequests;
                });
            }
        } catch (error) {
            console.error("Error rejecting request status:", error);
        }
    };

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const response = await axios.get("https://inventorymanagementservice-69668940637.asia-east1.run.app/api/inventoryapp_inventorydetails/");
                const groupedData = response.data.reduce((acc, curr) => {
                    const { vendor_identifier, req_date } = curr;
                    const key = `${vendor_identifier}-${req_date}`; // Unique key for each vendor and date group
                    if (!acc[key]) {
                        acc[key] = {
                            vendor_identifier,
                            req_date,
                            vendor: curr.vendor,
                            location: curr.location,
                            requests: [],
                        };
                    }
                    acc[key].requests.push(curr);
                    return acc;
                }, {});
                setGroupedRequests(groupedData);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching inventory data:", error);
                setLoading(false); // Set loading to false in case of an error
            }
        };

        fetchInventoryData();
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const filteredRequests = Object.entries(groupedRequests).reduce((acc, [key, group]) => {
        const filtered = group.requests.filter((request) => {
            const isVendorMatching = request.vendor && request.vendor.toLowerCase().startsWith(searchTerm.toLowerCase());
            if (filter === "Pending") {
                return request.request_status === "Pending" && isVendorMatching;
            } else if (filter === "Approved") {
                return request.request_status === "Approved" && isVendorMatching;
            } else if (filter === "Rejected") {
                return request.request_status === "Rejected" && isVendorMatching;
            }
            return isVendorMatching;
        });

        if (filtered.length > 0) {
            acc[key] = { ...group, requests: filtered };
        }
        return acc;
    }, {});


    // Array of month names for the dropdown
    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    return (
        <div className="inventory-container">
            <Sidebar />
            <main className="main-content">
                {loading ? ( // Show spinner while loading
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        <header className="header1">
                            <h1>Recent Activity</h1>
                            <input
                                type="text"
                                placeholder="Search"
                                className="search-bar1"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </header>

                        <div className="filters-container">
                            <button
                                className={`filter-button ${filter === "Pending" ? "active" : ""}`}
                                onClick={() => setFilter("Pending")}
                            >
                                Pending
                            </button>
                            <button
                                className={`filter-button ${filter === "Approved" ? "active" : ""}`}
                                onClick={() => setFilter("Approved")}
                            >
                                Approved
                            </button>
                            <button
                                className={`filter-button ${filter === "Rejected" ? "active" : ""}`}
                                onClick={() => setFilter("Rejected")}
                            >
                                Rejected
                            </button>
                        </div>

                        <div className="card-container">
                            <div className="cards-header">
                                <div className="requests">
                                    <span>Requests</span>
                                </div>
                                <div className="filters1" onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
                                    <i className="filter-icon1"><LuFilter /></i>
                                    <span>Filters</span>
                                </div>
                            </div>
                            
                            {/* Dropdown for months */}
                            {isDropdownVisible && (
                                <div className="dropdown" ref={dropdownRef}>
                                    {months.map((month, index) => (
                                        <div key={index} className="dropdown-item">
                                            {month}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Dynamically Render Card Header Based on Filter */}
                            <div className="request-card card-header">
                                <div className="card-column">
                                    <span className="card-label">Items and Category</span>
                                </div>
                                
                                <div className="card-column">
                                    <span className="card-label">Status</span>
                                </div>
                                <div className="card-column">
                                    <span className="card-label">Request Time</span>
                                </div>
                                {/* Show this column only for Pending filter */}
                                {filter === "Pending" && (
                                    <div className="card-column">
                                        <span className="card-label">Send items to vendor</span>
                                    </div>
                                )}
                            </div>

                            {Object.entries(filteredRequests).map(([key, group]) => (
                                <div key={key} className="date-group">
                                    <h3 className="date-header">
                                        Vendor: <span className="vendor">{group.vendor}</span> |
                                        Location: <span className="location">{group.location}</span> |
                                        Date: <span className="date">{group.req_date}</span>
                                    </h3>
                                    {group.requests.map((request, index) => (
                                        <div className="request-card" key={index}>
                                            <div className="card-column1">
                                                <div className="product-info">
                                                    <span>{request.product_name}</span>
                                                    <span className="category">{request.request_quantity}</span>
                                                </div>
                                            </div>
                                            <div className="card-column1">
                                                <span className={`status ${request.request_status?.toLowerCase()}`}>
                                                    {request.request_status || "No Status"}
                                                </span>
                                            </div>
                                            <div className="card-column1">
                                                <span>{request.request_time}</span>
                                            </div>
                                            {filter === "Pending" && (
                                                <div className="card-column1">
                                                    <div className="button-container">
                                                        <button
                                                            className="action-button approve"
                                                            onClick={() =>
                                                                handleApproveButton(request.vendor_identifier, request.product_id)
                                                            }
                                                            disabled={request.request_status === "Approved"}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="action-button reject"
                                                            onClick={() =>
                                                                handleRejectButton(request.vendor_identifier, request.product_id)
                                                            }
                                                            disabled={request.request_status === "Rejected"}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Inventorys;
