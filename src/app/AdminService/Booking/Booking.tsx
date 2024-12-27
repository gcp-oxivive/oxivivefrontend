'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar/page";
import {
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';
import './Booking.css';

interface Booking {
  address: string;
  name: string;
  appointment_date: string;
  appointment_time: string;
  booking_status: string;
  phone_number: string | null;
  email: string | null;
  service_type: string; // Added service_type field
}

const Bookings: React.FC = () => {
  const [selectedClinic, setSelectedClinic] = useState<string>('Oxi Clinic');
  const [selectedStatus, setSelectedStatus] = useState<string>('Completed'); // Set default to 'Completed'
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch bookings data from the backend API
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://adminservice-69668940637.asia-east1.run.app/api/bookingapp-bookingservice/?clinic=${selectedClinic}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data);
      } catch (err: any) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedClinic]); // Re-fetch when the selected clinic changes

  // Filter bookings based on selected status and clinic
  const filteredBookings = bookings.filter((booking) => {
    const matchesClinic = booking.service_type === selectedClinic;
    if (!matchesClinic) return false;

    if (selectedStatus === 'History') {
      return (
        booking.booking_status.toLowerCase() === 'completed' ||
        booking.booking_status.toLowerCase() === 'cancel'
      );
    } else {
      return booking.booking_status.toLowerCase() === selectedStatus.toLowerCase();
    }
  });

  return (
    <div className="app">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Booking List */}
      <main className="booking-list">
        <header>
          <h1>Booking List</h1>
          <p>See the scheduled events from the calendar</p>
        </header>

        {/* Clinic Toggle Buttons */}
        <div className="clinic-toggle-container">
          <div className="clinic-toggle">
            <button
              className={selectedClinic === 'Oxi Clinic' ? 'active' : ''}
              onClick={() => setSelectedClinic('Oxi Clinic')}
            >
              Oxi Clinic
            </button>
            <button
              className={selectedClinic === 'Oxi Wheel' ? 'active' : ''}
              onClick={() => setSelectedClinic('Oxi Wheel')}
            >
              Oxi Wheel
            </button>
          </div>
        </div>

        {/* Status Toggle Buttons */}
        <div className="status-toggle-container">
          <div className="status-toggle">
            <button
              className={selectedStatus === 'Completed' ? 'active' : ''}
              onClick={() => setSelectedStatus('Completed')}
            >
              Completed
            </button>
            <button
              className={selectedStatus === 'Cancel' ? 'active' : ''}
              onClick={() => setSelectedStatus('Cancel')}
            >
              Cancelled
            </button>
            <button
              className={selectedStatus === 'History' ? 'active' : ''}
              onClick={() => setSelectedStatus('History')}
            >
              History
            </button>
          </div>
        </div>

        {/* Booking Cards */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredBookings.length > 0 ? (
          <div className="booking-cards">
            {filteredBookings.map((booking, index) => (
              <div className="booking-card" key={index}>
                {/* Booking Date */}
                <p className="booking-date">
                  <span className="booking-day">
                    {new Date(booking.appointment_date).toLocaleDateString(
                      'en-US',
                      { weekday: 'long' }
                    )}
                  </span>
                  <span className="booking-date-only">
                    {new Date(booking.appointment_date).toLocaleDateString(
                      'en-US',
                      { day: '2-digit' }
                    )}
                  </span>
                </p>

                {/* Booking Info */}
                <div className="booking-info">
                  <div className="booking-time">
                    <FaClock />
                    <span>Time: {booking.appointment_time}</span>
                  </div>
                  <div className="booking-location">
                    <FaMapMarkerAlt  />
                    <span>Address: {booking.address}</span>
                  </div>
                  <p className="booking-name">Name: {booking.name}</p>
                  <p
                    className={`booking-status ${booking.booking_status.toLowerCase()}`}
                  >
                    {booking.booking_status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='No-Bookings'>No bookings found for the selected filters.</p>
        )}
      </main>
    </div>
  );
};

export default Bookings;
