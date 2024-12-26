'use client';
import React, { useState, useEffect } from 'react';
import './CancelBooking.css';
import { IoIosArrowBack } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import { useRouter, useSearchParams } from 'next/navigation';

const CancelBooking = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Retrieve booking details from URL query parameters
  const id = searchParams.get('id') || '#524587';
  const bookingid = searchParams.get('booking_id');
  const user_id = searchParams.get('oxi_id');
  const serviceType = searchParams.get('serviceType') || 'oxiwheel';
  const appointmentDate = searchParams.get('appointmentDate') || 'N/A';
  const appointmentTime = searchParams.get('appointmentTime') || 'N/A';
  const name = searchParams.get('name') || 'Tyrone Mitchell';
  const location = searchParams.get('location') || '1534 Single Street, USA';
  const [bookingData, setSelectedData] = useState<{ service_type: string; address: string; name: string; user_id: string; booking_id: string; phone_number: string; email: string; } | null>(null);
  useEffect(() => {
    const savedData = localStorage.getItem('bookingData');
    if (savedData) {
      console.log("Selected Data from localStorage:", JSON.parse(savedData)); // Debugging log
      setSelectedData(JSON.parse(savedData));
    }
  }, []);

  const [timeLeft, setTimeLeft] = useState('');

  // Calculate the time left for the appointment
  useEffect(() => {
    if (appointmentDate !== 'N/A' && appointmentTime !== 'N/A') {
      const bookingDateTime = new Date(`${appointmentDate} ${appointmentTime}`);
      const interval = setInterval(() => {
        const now = new Date();
        const timeDiff = bookingDateTime - now;

        if (timeDiff > 0) {
          const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
          setTimeLeft(`${hours}h ${minutes}m left`);
        } else {
          setTimeLeft('Time has passed');
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [appointmentDate, appointmentTime]);

  const handleBackClick = () => {
    router.back();
  };

  const userId = bookingData?.user_id || "";

  // Function to handle cancel booking
  const handleCancelBooking = async () => {
    try {
      // Send the booking `id` in the body to specify which booking to cancel
      const response = await fetch(`https://bookingservice-69668940637.asia-east1.run.app/api/bookingapp-bookingservice/${user_id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingid, status: 'cancel' }), // send `id` and update status to 'Cancelled'
      });

      if (response.ok) {
        alert("Booking status updated to 'Cancelled'");
        router.push(`/Booking?oxi_id=${userId}`);
      } else {
        alert("Failed to cancel booking. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className='cancel-booking-container'>
      <header className="cancel-booking-header">
        <span className="cancel-booking-back-arrow" onClick={handleBackClick}><IoIosArrowBack /></span>
      </header>

      <main className='cancel-booking-main-container'>
        <section className="cancel-booking-item">
          <h2>{serviceType}</h2>
          <span className="cancel-booking-price"><FaRupeeSign />49</span>
        </section>

        <div className="cancel-booking-details">
          <p>{name}</p>
          <p className='location'><IoLocationSharp />{location}</p>
          <p className='date'>Appointment Date: {appointmentDate}</p>
          <p className='time'>Appointment Time: {appointmentTime}</p>
          <p className="time-left">Time Remaining: {timeLeft}</p>
        </div>

        <div className="cancel-booking-cancellation-policy">
          <h3>Cancellation Policy</h3>
          <p>If you cancel less than 2 hours before your booking, you may be charged a cancellation fee up to the full amount of the services booked.</p>
        </div>

        <footer className="cancel-booking-footer">
          <h3>Order Summary</h3>
          <div className="cancel-booking-summary">
            <p>Subtotal<span><FaRupeeSign />156.00</span></p>
            <p>Est. Tax<span><FaRupeeSign />12.00</span></p>
          </div>
          <p className='cancel-booking-total'>Total<span><FaRupeeSign />168.00</span></p>
        </footer>
        <button className="cancel-booking-button" onClick={handleCancelBooking}>Cancel Booking</button>
      </main>
    </div>
  );
};

export default CancelBooking;
