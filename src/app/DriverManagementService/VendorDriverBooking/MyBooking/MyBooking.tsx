"use client";
import React, { useState, useEffect } from 'react';
import { MdAccessTime } from "react-icons/md";
import { SlHome } from "react-icons/sl";
import { LuBookPlus } from "react-icons/lu";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import './MyBooking.css';
import { useRouter } from 'next/navigation';


interface Booking {
  name: string;
  address: string;
  phone_number: string;
  email: string;
  timeLeft: string;
  booking_status: 'pending' | 'completed' | 'cancelled';
  appointment_date: string; // e.g., "2024-11-20"
  appointment_time: string; // e.g., "10:30:00"
  oxi_id: string;
}

interface Error {
  message: string;
}

const MyBooking: React.FC = () => {
  const router = useRouter();
  const currentDate = new Date();
  
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'cancelled' | 'history'>('bookings');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mostRecentBooking, setMostRecentBooking] = useState<Booking | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<{ email: string; phone_number: string }>({
    email: '',
    phone_number: '',
  });
  
  useEffect(() => {
    // Check if window object is available (i.e., we are on the client-side)
    if (typeof window !== 'undefined') {
      const storedDriverId = localStorage.getItem('driver_id');
      setDriverId(storedDriverId);
    }
  }, []); // Empty dependency array to run this only once after component mounts


  const handleProfileClick = () => {
    router.push(`/DriverManagementService/VendorDriverBooking/DriverProfile?driver_id=${driverId}`);
};

const handleBookingClick = () => {
  router.push(`/DriverManagementService/VendorDriverBooking/MyBooking/`);
};


useEffect(() => {
  // Check if window object is available (i.e., we are on the client-side)
  if (typeof window !== 'undefined') {
    const storedUserId = localStorage.getItem('user_id'); // Fetch user_id from localStorage
    if (storedUserId) {
      fetchUserDetails(storedUserId); // Pass the user_id for fetching details
    } else {
      console.log("user_id is not available in localStorage.");
    }
  }
}, []); // Empty dependency array to run this only once after component mounts

// Fetch user details based on user_id
const fetchUserDetails = async (userId: string) => {
  try {
    console.log("Fetching user details for user_id:", userId);
    
    const response = await fetch(`https://drivermanagementservice-69668940637.asia-east1.run.app/api/user-details/${userId}`); // Modify API endpoint accordingly
    
    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }
    
    const userDetails = await response.json();
    console.log("Fetched user details:", userDetails);
    
    // Store the fetched details in state
    setUserDetails(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('https://drivermanagementservice-69668940637.asia-east1.run.app/api/user-booking-details/');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Fetched bookings data:', result);

      if (Array.isArray(result) && result.length > 0) {
        // Store the user_id from the booking response to localStorage
        const userId = result[0]?.user_id; // Assuming user_id exists in the booking details
        if (userId) {
          localStorage.setItem('user_id', userId); // Store user_id in localStorage
          console.log('Stored user_id in localStorage:', userId);
          // Sort bookings by appointment date and time
          const sortedBookings = result.sort((a: Booking, b: Booking) => {
            const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
            const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
            return dateA.getTime() - dateB.getTime();
          });

          setBookings(sortedBookings);

          // Determine the most recent booking that is within the allowed range
          const now = new Date();
          const timeThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds
          const recentBooking = sortedBookings.find((booking) => {
            const bookingTime = new Date(`${booking.appointment_date}T${booking.appointment_time}`).getTime();
            return (
              booking.booking_status === 'completed' &&
              bookingTime >= now.getTime() - timeThreshold && // Appointment is not too far in the past
              bookingTime <= now.getTime() + timeThreshold // Appointment is near or upcoming
            );
          });

          setMostRecentBooking(recentBooking || null);
        }
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError((error as Error).message);
    }
  };

  fetchData();
}, []);


  const handleBackClick = () => {
    router.back();
  };

  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const closeBookingDetails = () => {
    setSelectedBooking(null);
  };

  const openDriverMap = (booking: Booking) => {
    router.push(`/DriverManagementService/VendorDriverBooking/DriverMap?location=${booking.address}&email=${userDetails.email}`);
  };
  

  const completeRide = () => {
    if (selectedBooking) {
      const updatedBookings = bookings.map((booking, index) => {
        if (booking === selectedBooking) {
          return { ...booking, booking_status: 'completed' as 'completed' };
        } else if (bookings[index - 1] && bookings[index - 1].booking_status === 'completed' && booking.booking_status === 'cancelled') {
          return { ...booking, booking_status: 'active' as 'pending' | 'completed' | 'cancelled' };
        }
        return booking;
      });
      setBookings(updatedBookings);
      closeBookingDetails();
    }
  };


  const cancelBooking = (booking: Booking) => {
    const updatedBookings = bookings.map((b) =>
      b === booking ? { ...b, booking_status: 'cancelled' as 'cancelled' } : b
    );
    setBookings(updatedBookings);
    setActiveTab('cancelled'); // Switch to the Cancelled tab
  };

  // Filter bookings based on the active tab
const filteredBookings = bookings.filter((booking) => {
  const appointmentDate = new Date(`${booking.appointment_date}T${booking.appointment_time}`);
  const now = new Date();

  if (activeTab === 'bookings') {
    const isTodayOrTomorrow = appointmentDate >= new Date(new Date().setHours(0, 0, 0, 0)) &&
      appointmentDate < new Date(new Date().setDate(new Date().getDate() + 2));
    return (
      isTodayOrTomorrow &&
      booking.booking_status !== 'cancelled' &&
      appointmentDate >= now // Show only upcoming or current bookings
    );
  }

  if (activeTab === 'cancelled') {
    return booking.booking_status === 'cancelled';
  }

  if (activeTab === 'history') {
    return (
      booking.booking_status === 'completed' ||
      (appointmentDate < now && booking.booking_status !== 'cancelled') // Past bookings
    );
  }

  return false;
});

// Sort bookings for the bookings tab by appointment date and time
if (activeTab === 'bookings') {
  filteredBookings.sort((a, b) => {
    const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
    const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
    return dateA.getTime() - dateB.getTime();
  });
}

const firstEligibleBooking = activeTab === 'bookings' ? filteredBookings[0] : null;
  return (
    <>
      <div className="myBookingContainer">
        <div className="heading">
          <BiArrowBack className="backArrow" onClick={handleBackClick} />
          <h1 className="myBookingsTitle">My Bookings</h1>
        </div>
        <div className="tabs">
          <span className={`tab ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>Bookings</span>
          <span className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`} onClick={() => setActiveTab('cancelled')}>Cancelled</span>
          <span className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</span>
        </div>

        <div className="greyBackground">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <div className="bookingContainer" key={index} onClick={() => openBookingDetails(booking)}>
                <div className="bookingDetails">
                  <div className="bookingInfo">
                    <h2>{booking.name}</h2>
                    <p>{booking.address}</p>
                    <p>{userDetails.phone_number}</p>
                    <p>{userDetails.email}</p> 
                  </div>
                  <div className="bookingActions">
                  {booking.booking_status !== 'cancelled' && activeTab !== 'history' && (
  <button
    className="cancelButton"
    onClick={(e) => {
      e.stopPropagation(); // Prevent triggering the booking details modal
      cancelBooking(booking);
    }}
  >
                        Cancel
                      </button>
                    )}
                    <p className="date">{booking.appointment_date}</p>
                    <p className="timeLeft"> {booking.appointment_time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No bookings available.</p>
          )}
        </div>

        {selectedBooking && (
          <div className="modalOverlay" onClick={closeBookingDetails}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ color: '#FC000E', textAlign: 'center', fontSize: '24px' }}>{selectedBooking.name}</h2>
              <div className="modalDetails">
                <div className="modalInfo">
                  <FaMapMarkerAlt color="#FC000E" size={18} />
                  <p>{selectedBooking.address}</p>
                </div>
                <div className="modalInfo">
                  <FaPhoneAlt color="#FC000E" size={18} />
                  <p>{userDetails.phone_number}</p>
                </div>
                <div className="modalInfo">
                  <p><strong>Email:</strong> {userDetails.email}</p>
                </div>

                

                <div className="modalButtons">

                 <button
    onClick={() => openDriverMap(selectedBooking)}
    style={{ backgroundColor: selectedBooking === firstEligibleBooking ? '#FC000E' : '#CCCCCC' }}
    disabled={selectedBooking !== firstEligibleBooking}
  >
    Start
  </button>

  <button
    onClick={completeRide}
    style={{ backgroundColor: selectedBooking === firstEligibleBooking ? '#FC000E' : '#CCCCCC' }}
    disabled={selectedBooking !== firstEligibleBooking}
  >
    OTP
  </button>

                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="footer">
          <div className="footerItem">
            <SlHome className="footerIcon" />
            <p>Home</p>
          </div>
          <div className="footerItem"  onClick={handleBookingClick} >
            <LuBookPlus className="footerIcon" />
            <p>Booking</p>
          </div>
          <div className="footerItem">
            <IoNotificationsOutline className="footerIcon" />
            <p>Notification</p>
          </div>
          <div className="footerItem" onClick={handleProfileClick}>
            <BsPerson className="footerIcon" />
            <p>Profile</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MyBooking;
