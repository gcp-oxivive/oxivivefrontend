"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/page";
import "./Driverlist.css";

interface Driver {
  driver_id: number;
  name: string;
  phone: string;
  email: string; // Added email field
  wheel: string; // Wheel name field
}

const DriverList: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [location, setLocation] = useState("Mumbai"); // Default location

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        // Fetch admin details from localStorage
        const userDetails = localStorage.getItem("userDetails");
        let locationState = "Mumbai"; // Default location
        if (userDetails) {
          const parsedDetails = JSON.parse(userDetails);
          locationState = parsedDetails.state || "Mumbai";
          setLocation(locationState);
        }
  
        // Fetch drivers data based on location (state)
        const response = await fetch("https://adminservice-oxiviveclinic-69668940637.asia-east1.run.app/api/drivers/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: locationState }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };
  
    fetchDrivers();
  }, []);
  

  // Filter logic
  const filteredDrivers = drivers.filter((driver) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const normalizedName = driver.name?.toLowerCase() || "";

    return (
      normalizedName.startsWith(normalizedQuery) ||
      driver.phone.includes(normalizedQuery) ||
      driver.email?.toLowerCase().includes(normalizedQuery) ||
      driver.wheel?.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="driverlist-container">
      <Sidebar />
      <main className="driverlist-content">
        <h1>Drivers List</h1>
        <p>The following table consists of drivers' details</p>
        <div className="header">
          {/* Location Button with dynamic location */}
          <button className="location-btn">
            <i className="icon location-icon"></i> {location}
          </button>
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Wheel Name</th>
              <th>Driver's Name</th>
              <th>Contact No</th>
              <th>Email</th>
              <th>Block this Info</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver, index) => (
              <tr key={driver.driver_id}>
                <td>{index + 1}</td>
                <td>{driver.wheel || "N/A"}</td>
                <td>{driver.name}</td>
                <td>{driver.phone}</td>
                <td>{driver.email}</td>
                <td>
                  <button className="block-button">
                    <span>Block</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default DriverList;
