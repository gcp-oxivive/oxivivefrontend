'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VendorsList.css";
import { IoLocationSharp } from "react-icons/io5";
import Sidebar from '../Sidebar/page';

interface Vendor {
  name: string;
  selected_service: string;
  phone: number;
  district: string;
}

const VendorsList: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [selected_service, setSelectedService] = useState<string>("Oxi Clinic");
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true); // For initial loading
  const [isLoading, setIsLoading] = useState<boolean>(false); // For loading vendor data
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const cities = [
    { name: "Bengaluru", image: "/images/bang.png" },
    { name: "Kochi", image: "/images/koch.jpg" },
    { name: "Chennai", image: "/images/chen.jpg" },
    { name: "Hyderabad", image: "/images/hyd.png" },
    { name: "Gurgaon", image: "/images/chd.jpg" },
    { name: "Pune", image: "/images/pune.png" },
    { name: "Delhi-NCR", image: "/images/ncr.jpg" },
    { name: "Kolkata", image: "/images/kolk.jpg" },
    { name: "Mumbai", image: "/images/mumbai.jpg" },
    { name: "Ahmedabad", image: "/images/ahd.jpg" },
    { name: "All Cities", image: "/images/allcities.jpg" },
  ];

  useEffect(() => {
    // Simulate an initial page load delay
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setIsLoading(true); // Show spinner while loading vendors
    setError("");
    setVendors([]);
    setFilteredVendors([]);
    fetchVendors(city);
  };

  const handleServiceClick = (service: string) => {
    setSelectedService(service);
    filterVendorsByService(service);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    filterVendorsByService(selected_service, vendors, event.target.value);
  };

  const fetchVendors = async (city: string) => {
    try {
      const response = await axios.get<Vendor[]>(
        `https://adminservice-69668940637.asia-east1.run.app/api/vendorapp-vendordetails/?city=${city}`
      );
      const vendorsData = response.data;

      setVendors(vendorsData);

      if (vendorsData.length === 0) {
        setError("No vendors found for the selected city.");
      } else {
        filterVendorsByService(selected_service, vendorsData, searchQuery);
      }
    } catch (err) {
      setError("Failed to fetch vendors. Please try again later.");
    } finally {
      setIsLoading(false); // Hide the spinner after fetching vendors
    }
  };

  const filterVendorsByService = (
    service: string,
    vendorData: Vendor[] = vendors,
    query: string = searchQuery
  ) => {
    if (vendorData.length === 0) {
      setFilteredVendors([]);
      return;
    }

    const filteredByServiceAndCity = vendorData.filter(
      (vendor) =>
        vendor.selected_service === service &&
        vendor.district.toLowerCase().includes(selectedCity.toLowerCase())
    );

    const filtered = filteredByServiceAndCity.filter((vendor) =>
      vendor.name.toLowerCase().startsWith(query.toLowerCase())
    );

    setFilteredVendors(filtered);
  };

  useEffect(() => {
    if (selectedCity) {
      fetchVendors(selectedCity);
    }
  }, [selectedCity]);

  useEffect(() => {
    filterVendorsByService(selected_service, vendors, searchQuery);
  }, [selected_service, vendors, searchQuery]);

  return (
    <div className="container">
      <Sidebar />
      <main className="main">
        {isPageLoading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <header className="header2">
              <div className="header-content">
                <h2 className="header-title">Vendors List</h2>
                {selectedCity && (
                  <input
                    type="text"
                    placeholder="Search Vendor"
                    className="header-search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                )}
              </div>
            </header>

            <section className="popular-cities">
              <div className="search-container">
                <h3 className="section-title">POPULAR CITIES</h3>
              </div>
              <div className="cities-grid">
                {cities.map((city, index) => (
                  <div
                    key={index}
                    className={`city ${selectedCity === city.name ? "selected" : ""}`}
                    onClick={() => handleCityClick(city.name)}
                  >
                    <img src={city.image} alt={city.name} className="city-image" />
                    <p>{city.name}</p>
                  </div>
                ))}
              </div>
            </section>

            {!selectedCity ? (
              <p className="select-city-message">Select a City</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <>
                <div className="filters">
                  <span className="filter"><IoLocationSharp />{selectedCity}</span>
                  <div className="center-filters">
                    <span
                      className={`filter ${selected_service === "Oxi Clinic" ? "active" : ""}`}
                      onClick={() => handleServiceClick("Oxi Clinic")}
                    >
                      Oxi Clinic
                    </span>
                    <span
                      className={`filter ${selected_service === "Oxi Wheel" ? "active" : ""}`}
                      onClick={() => handleServiceClick("Oxi Wheel")}
                    >
                      Oxi Wheel
                    </span>
                  </div>
                </div>

                {isLoading ? (
                  <div className="spinner-container">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <table className="vendors-table">
                    <colgroup>
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '20%' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Vendors Name</th>
                        <th>Service</th>
                        <th>Contact No</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVendors.map((vendor, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{vendor.name}</td>
                          <td>{vendor.selected_service}</td>
                          <td>{vendor.phone}</td>
                          <td>{vendor.district}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default VendorsList;
