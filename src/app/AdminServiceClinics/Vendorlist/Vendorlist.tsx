"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/page";
import "./Vendorlist.css";
import axios from "axios";

const Vendorlist = () => {
  const [vendors, setVendors] = useState([]); // All vendors
  const [filteredVendors, setFilteredVendors] = useState([]); // Filtered vendors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState("Oxi Clinic");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Mumbai"); // Default location

  // Fetch location and vendors on component mount
  useEffect(() => {
    // Fetch admin details from localStorage
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      const parsedDetails = JSON.parse(userDetails);
      setLocation(parsedDetails.state || "Mumbai"); // Set state as location
    }

    // Fetch vendors
    axios
      .get("https://adminservice-oxiviveclinic-69668940637.asia-east1.run.app/api/adminservice-vendordetails/")
      .then((response) => {
        const approvedVendors = response.data.filter(
          (vendor) => vendor.document_status === "approved"
        );
        setVendors(approvedVendors);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Re-run filtering when vendors, selectedService, searchQuery, or location change
  useEffect(() => {
    const filteredData = vendors.filter(
      (vendor) =>
        vendor.selected_service === selectedService && // Filter by service
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) && // Filter by search query
        vendor.state?.toLowerCase() === location.toLowerCase() // Filter by state (location button)
    );
    setFilteredVendors(filteredData);
  }, [vendors, selectedService, searchQuery, location]);

  const handleServiceChange = (service) => {
    setSelectedService(service);
  };

  if (loading) {
    return (
      <div className="vendorlist-container">
        <Sidebar />
        <div className="content">
          {/* Add a spinner here */}
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="vendorlist-container">
      <Sidebar />
      <div className="content">
        {/* <h2 className="title">Vendors List</h2> */}
        <div className="header4">
          {/* Location Button with dynamic location */}
          <button className="location-btn2">
            <i className="location"></i> {location}
          </button>
          <h2 className="title">Vendors List</h2>
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="tabs">
          <button
            className={`tab ${selectedService === "Oxi Clinic" ? "active" : ""}`}
            onClick={() => handleServiceChange("Oxi Clinic")}
          >
            Oxi Clinic
          </button>
          <button
            className={`tab ${selectedService === "Oxi Wheel" ? "active" : ""}`}
            onClick={() => handleServiceChange("Oxi Wheel")}
          >
            Oxi Wheel
          </button>
        </div>
        <div className="table-container">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Vendors Name</th>
                <th>Phone No</th>
                <th>Address</th>
                <th>Block Info</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor, index) => (
                  <tr key={vendor.id}>
                    <td>{index + 1}</td>
                    <td>{vendor.name}</td>
                    <td>{vendor.phone}</td>
                    <td>{vendor.address}</td>
                    <td>
                      <button className="block-btn">
                        <i className="block"></i> Block
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    No approved vendors available for {selectedService} in{" "}
                    {location}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Vendorlist;
