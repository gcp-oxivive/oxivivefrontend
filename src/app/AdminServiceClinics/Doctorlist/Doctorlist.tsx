"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/page";
import "./Doctorlist.css";

interface Doctor {
  id: number;
  name: string;
  phone: string;
  email: string | null; // Allow null values
  clinic: string | null; // Allow null values
}

const Doctorlist: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [location, setLocation] = useState<string>("Unknown"); // Default location
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const userDetails = localStorage.getItem("userDetails");
        let state = "Unknown"; // Default state
        if (userDetails) {
          const parsedDetails = JSON.parse(userDetails);
          state = parsedDetails.state || "Unknown";
          setLocation(state); // Set location in state
        }
  
        const response = await fetch("https://adminservice-oxiviveclinic-69668940637.asia-east1.run.app/api/doctors/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state }), // Send state in the request body
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };
  
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const normalizedName = doctor.name?.toLowerCase() || ""; // Ensure safety
    const normalizedPhone = doctor.phone || ""; // No transformation needed
    const normalizedEmail = doctor.email?.toLowerCase() || ""; // Ensure safety
    const normalizedClinic = doctor.clinic?.toLowerCase() || ""; // Ensure safety

    return (
      normalizedName.includes(normalizedQuery) ||
      normalizedPhone.includes(normalizedQuery) ||
      normalizedEmail.includes(normalizedQuery) ||
      normalizedClinic.includes(normalizedQuery)
    );
  });

  return (
    <div className="doctorlist-container">
      <Sidebar />
      <main className="doctorlist-content">
        {isLoading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <h1>Doctors List</h1>
            <p>The following table consists of doctors' details</p>
            <div className="header">
              {/* Location Button with dynamic location */}
              <button className="location-btn">
                <i className="location"></i> {location}
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
                  <th>Clinic Name</th> {/* Display clinic name */}
                  <th>Doctor's Name</th>
                  <th>Contact No</th>
                  <th>Email</th>
                  <th>Block this Info</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor, index) => (
                  <tr key={doctor.id}>
                    <td>{index + 1}</td>
                    <td>{doctor.clinic || "N/A"}</td> {/* Display "N/A" if null */}
                    <td>{doctor.name}</td>
                    <td>{doctor.phone}</td>
                    <td>{doctor.email || "N/A"}</td> {/* Display "N/A" if null */}
                    <td>
                      <button className="block-button">
                        <span>Block</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
};

export default Doctorlist;