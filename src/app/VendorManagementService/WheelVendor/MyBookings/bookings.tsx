'use client';
import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClock, faClipboardList, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import "./bookings.css";
import axios from "axios";
import { useRouter,useSearchParams } from 'next/navigation';

const Bookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [selectedFooter, setSelectedFooter] = useState("home");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Get the search params
  const vendor_id = localStorage.getItem('vendor_id');

  useEffect(() => {
    const getWeekDates = () => {
      const dates = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);

        const day = nextDay.toLocaleDateString("en-US", { weekday: "short" });
        const month = nextDay.toLocaleDateString("en-US", { month: "short" });
        const dayNumber = nextDay.getDate();

        dates.push(`${day} ${month} ${dayNumber}`);
      }
      setWeekDates(dates);
    };

    // Set today's date as the default selected date
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  setSelectedDate(formattedToday);

    getWeekDates();

    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - new Date().getTime();

    const timer = setTimeout(() => {
      getWeekDates();
      setInterval(getWeekDates, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const params: any = { vendor_id }; // Use the vendor_id tied to the logged-in user
  
      // If there's a selected date, format it as YYYY-MM-DD and pass it to the API
      if (selectedDate) {
        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
        params.appointment_date = formattedDate;
        console.log("Fetching bookings for date:", formattedDate); // Debug log
      }
  
      const response = await axios.get("https://bookingservice-69668940637.asia-east1.run.app/api/my-bookings/", { params });
      setAllBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings(); // Fetch bookings whenever activeTab or selectedDate changes
  }, [activeTab, selectedDate]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // const handleDateClick = (date: string) => {
  //   setSelectedDate(date); // Update the selectedDate when a calendar date is clicked
  //   console.log("Selected date:", date); // Debug log
  // };


  const handleFooterClick = (footer: string) => {
    setSelectedFooter(footer);
  
    // Redirect to respective pages
    switch (footer) {
      case "home":
        router.push("/VendorManagementService/Vendors/WheelVendor/Wheel"); // Redirect to the home page
        break;
      case "bookings":
        router.push("/VendorManagementService/WheelVendor/MyBookings"); // Redirect to the bookings page
        break;
      case "notifications":
        router.push("/notifications"); // Redirect to the notifications page
        break;
      case "profile":
        router.push("/VendorManagementService/WheelVendor/profile"); // Redirect to the profile page
        break;
      default:
        break;
    }
  };

  const filteredBookings = allBookings.filter((booking) => {
    // Filter by status (activeTab)
    if (activeTab === "cancelled" && booking.booking_status !== "cancelled") return false;
    if (activeTab === "upcoming" && booking.booking_status !== "upcoming") return false;
  
    // Filter by selectedDate
    if (selectedDate) {
      const formattedSelectedDate = new Date(selectedDate).toISOString().split("T")[0];
      return booking.appointment_date === formattedSelectedDate;
    }
  
    return true; // If no date is selected, return all bookings matching the tab
  });
  
  const handleDateClick = (date: string) => {
    const today = new Date();
    const [day, month, dayNumber] = date.split(" ");
    const monthIndex = new Date(`${month} 1, ${today.getFullYear()}`).getMonth();
  
    // Create the selected date object in the local timezone
    const selectedFullDate = new Date(today.getFullYear(), monthIndex, parseInt(dayNumber));
  
    // Format the selected date as YYYY-MM-DD in the local timezone
    const formattedDate = `${selectedFullDate.getFullYear()}-${String(selectedFullDate.getMonth() + 1).padStart(2, '0')}-${String(selectedFullDate.getDate()).padStart(2, '0')}`;
  
    setSelectedDate(formattedDate);
    console.log("Selected date:", formattedDate); // Debug log
  };
  
  

  return (
    <div className="bookings-container0">
      <header className="header0">
        <FaArrowLeft className="back-icon" onClick={() => router.push('/VendorManagementService/Vendors/WheelVendor/Wheel')} />
        <h1>My Bookings</h1>
      </header>

      <div className="week-selection">
        {weekDates.map((date, index) => {
          const [day, month, dayNumber] = date.split(" ");
          const isSelected = selectedDate === `${new Date().getFullYear()}-${String(new Date(`${month} 1`).getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
          return (
            <div
              key={index}
              className={`week-day ${isSelected ? "selected" : ""}`}
              onClick={() => handleDateClick(date)} // Trigger date click and update state
            >
              <span className="day">{day}</span>
              <span className="month-date">
                <span className="month">{month}</span>
                <span className="day-number">{dayNumber}</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="tabs8">
        {["Upcoming", "Cancelled", "History"].map((tab) => (
          <div
            key={tab}
            className={`tab-item ${activeTab === tab.toLowerCase() ? "active" : ""}`}
            onClick={() => handleTabClick(tab.toLowerCase())}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="gray-section0">
        {loading ? (
          <p>Loading bookings...</p>
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((booking, index) => (
            <div className="booking-card" key={index}>
    {/* Header Section: Name and Status */}
    <div className="header-section">
        <h3 className="booking-service">{booking.name}</h3> {/* Display user name */}
        <div className="status-section">
            <span className="status">{booking.booking_status}</span>
        </div>
    </div>

    {/* Address Section: Address and Date-Time */}
    <div className="user-details-section">
    <p className="email">Email: {booking.email}</p>
    <p className="phone-number">Phone: {booking.phone_number}</p>
        <div className="date-time">
            <span className="date">{booking.appointment_date}</span>
            <span className="time">
                <FontAwesomeIcon icon={faClock} className="time-icon" /> {booking.appointment_time}
            </span>
        </div>
    </div>
</div>

          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </div>

      <div className="footer0">
        {[{ icon: faHome, label: 'Home', key: 'home' },
          { icon: faClipboardList, label: 'Bookings', key: 'bookings' },
          { icon: faBell, label: 'Notifications', key: 'notifications' },
          { icon: faUser, label: 'Profile', key: 'profile' }]
          .map(({ icon, label, key }) => (
            <div
              key={key}
              className={`footer-icon ${selectedFooter === key ? 'selected' : ''}`}
              onClick={() => handleFooterClick(key)}
            >
              <FontAwesomeIcon icon={icon} />
              <span>{label}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Bookings;
