"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoChevronBackSharp } from 'react-icons/io5';
import './Appointment.css';

const Appointment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const appointment_date = searchParams.get('date');
  

  const vendorId = searchParams?.get("vendor_id");

  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [bookingData, setSelectedData] = useState<{ service_type: string; address: string; name: string; user_id: string; booking_id: string; phone_number: string; email: string; } | null>(null);

  const [availableSlots, setAvailableSlots] = useState<any[]>([]); // Dynamically fetched available slots
  const modalRef = useRef(null);

  useEffect(() => {
    if (vendorId) {
      const fetchAvailableSlots = async () => {
        try {
          const response = await fetch(`https://bookingservice-69668940637.asia-east1.run.app/api/vendor-available-slots/${vendorId}/`);
          if (!response.ok) throw new Error("Failed to fetch available slots");
          const data = await response.json();
          console.log("Fetched available slots:", data.available_slots); // Debugging log
          setAvailableSlots(data.available_slots || []);
        } catch (error) {
          console.error("Error fetching available slots:", error.message);
        }
      };

      fetchAvailableSlots();
    }
  }, [vendorId]);

  // Load data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem('bookingData');
    if (savedData) {
      console.log("Selected Data from localStorage:", JSON.parse(savedData)); // Debugging log
      setSelectedData(JSON.parse(savedData));
    }
  }, []);

  // Update the current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Generate the dates for the upcoming week
  const generateWeekDates = () => {
    const weekDates = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      weekDates.push({
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
        weekDay: date.toLocaleString('default', { weekday: 'short' }),
      });
    }
    return weekDates;
  };

  const weekDates = generateWeekDates();

  // Check if a time slot is in the past
  const isPastTime = (slotTime: string, isMorning: boolean) => {
    if (selectedDay === 0) {
      const currentDateTime = new Date();
      const [slotHour, slotMinutes] = slotTime.split(':').map(Number);
      const slotDateTime = new Date(currentDateTime);

      if (isMorning) {
        slotDateTime.setHours(slotHour, slotMinutes, 0);
      } else {
        const adjustedHour = slotHour === 12 ? 12 : slotHour + 12;
        slotDateTime.setHours(adjustedHour, slotMinutes, 0);
      }

      return slotDateTime < currentDateTime;
    }
    return false;
  };
  

  // Handle proceeding with the booking (show modal if not selected)
  const handleProceed = () => {
    if (selectedDay === null || selectedSlot === null) {
      setShowError(true);
      setIsModalOpen(true);
    } else {
      setShowError(false);
      setIsModalOpen(true);
    }
  };

  const userId = bookingData?.user_id || ""; // Replace with actual user_id if different

  const handleContinue = async () => {
    if (selectedDay !== null && selectedSlot !== null) {
      const selectedDateObj = new Date(today); // Clone today's date
      selectedDateObj.setDate(today.getDate() + selectedDay); // Adjust to selected day
      const selectedDate = selectedDateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
      // Ensure selectedSlot has the expected format before using split
      if (selectedSlot) {
        let start = '';
        let end = '';
  
        // Check if selectedSlot contains a range (e.g., "06:00 AM - 07:00 AM")
        if (selectedSlot.includes('-')) {
          [start, end] = selectedSlot.split('-').map(s => s.trim()); // Trim whitespace
        } else {
          // If no range, treat the selectedSlot as a single time
          start = selectedSlot;
          end = selectedSlot; // Use the same time for start and end
        }
  
        // Ensure both start and end are defined
        if (start && end) {
          const timePeriod = end.includes('AM') || end.includes('PM') ? end : start; // Handle case when end is not in AM/PM format
  
          // Convert time string (e.g., "06:00 PM") to 24-hour format
          const [hours, minutes] = timePeriod.split(':');
          let [hour, minute] = [parseInt(hours, 10), parseInt(minutes, 10)];
          const isPM = timePeriod.includes('PM');
  
          if (isPM && hour !== 12) hour += 12; // Convert PM times
          if (!isPM && hour === 12) hour = 0; // Convert 12 AM to 00 hours
  
          const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  
          const BookingData = {
            booking_id: bookingData?.booking_id,
            appointmentDate: selectedDate,
            appointmentTime: formattedTime, // Send the time in 24-hour format
          };
  
          console.log("Payload sent to API:", BookingData); // Debugging log
  
          try {
            const response = await fetch(`https://bookingservice-69668940637.asia-east1.run.app/api/update-booking/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(BookingData),
            });
  
            const result = await response.json();
            console.log("API Response:", result); // Debugging log
  
            if (response.ok) {
              router.push(`/Booking?oxi_id=${userId}`);
            } else {
              console.error(result.error);
            }
          } catch (error) {
            console.error('Error updating booking:', error);
          }
        } else {
          console.error("Invalid selectedSlot format:", selectedSlot);
        }
      } else {
        console.error("selectedSlot is undefined or empty");
      }
  
      setIsModalOpen(false);
    }
  };
  
  
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // When the user clicks on a date
const handleDaySelect = (index: number) => {
  setSelectedDay(index); // Update the selected date index
  setSelectedSlot(null); // Reset the selected time slot when the date changes
};

// Use effect to set the selected day based on appointment_date
useEffect(() => {
  if (appointment_date) {
    const selectedDate = new Date(appointment_date); // Convert passed date to a Date object
    const matchedIndex = weekDates.findIndex((date) => {
      const weekDate = new Date(today);
      weekDate.setDate(today.getDate() + weekDates.indexOf(date)); // Calculate the correct date
      return (
        weekDate.getDate() === selectedDate.getDate() &&
        weekDate.getMonth() === selectedDate.getMonth() &&
        weekDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    if (matchedIndex !== -1 && selectedDay === null) {
      setSelectedDay(matchedIndex); // Automatically set the correct index only once
    }
  }
}, [appointment_date, weekDates, today, selectedDay]);






  const startDrag = (e) => {
    e.preventDefault();
    const modalElement = modalRef.current;
    let initialY = e.clientY || e.touches[0].clientY;

    const onDrag = (event) => {
      const currentY = event.clientY || event.touches[0].clientY;
      const offset = currentY - initialY;

      if (modalElement && offset < 0) { // Only allow upward drag
        modalElement.style.transform = `translateY(${offset}px)`;
      }
    };

    const endDrag = () => {
      if (modalElement) modalElement.style.transform = `translateY(0)`;
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchmove", onDrag);
      document.removeEventListener("touchend", endDrag);
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", endDrag);
  };

  return (
    <div className="appointment-container1">
      <div className="header2">
        <button className="back-button1" onClick={() => router.back()}>
          <IoChevronBackSharp size={20} /> {/* Back icon */}
        </button>
        <h1>Oxivive Services</h1>
      </div>

      {/* Conditionally render selected service */}
      <div className="services3">
        {bookingData?.service_type === 'Oxi Clinic' && (
          <div className="service3">
            <p>Oxi Clinic</p>
            <p><span className="amount">INR 49</span></p>
          </div>
        )}
        {bookingData?.service_type === 'Oxi wheel' && (
          <div className="service3">
            <p>Oxi Wheel</p>
            <p><span className="amount">$ 29</span></p>
          </div>
        )}
      </div>

      <div className="appointment-dates1">
        <h2>Appointment</h2>
        <div className="date-picker-container">
          <div className="date-picker">
            {weekDates.map((date, index) => (
              <button
                key={index}
                className={`date-button ${selectedDay === index ? 'selected' : ''}`}
                onClick={() => handleDaySelect(index)}
              >
                <p className="date-number">{date.day}</p>
                <p className="date-weekday">{date.weekDay}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="time-slots1">
        <h3>Available Time Slots</h3>
        <div className="slots">
          {Array.isArray(availableSlots) && availableSlots.length > 0 ? (
            <>
              {/* Render AM Slots */}
              {availableSlots.some((slot) => slot.endsWith("AM")) && (
                <div className="slot-category">
                  <h4>Morning</h4>
                  <div className="slots">
                    {availableSlots
                      .filter((slot) => slot.endsWith("AM"))
                      .map((slot, index) => {
                        const slotTime = new Date(`${today.toDateString()} ${slot}`);
                        const isDisabled = selectedDay === 0 && slotTime <= new Date();
                        return (
                          <button
                            key={index}
                            className={`slot-button ${selectedSlot === slot ? 'selected' : ''}`}
                            onClick={() => setSelectedSlot(slot)}
                            disabled={isDisabled || selectedDay === null}
                          >
                            {slot}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
              {/* Render PM Slots */}
              {availableSlots.some((slot) => slot.endsWith("PM")) && (
                <div className="slot-category">
                  <h4>Afternoon/Evening</h4>
                  <div className="slots">
                    {availableSlots
                      .filter((slot) => slot.endsWith("PM"))
                      .map((slot, index) => {
                        const slotTime = new Date(`${today.toDateString()} ${slot}`);
                        const isDisabled = selectedDay === 0 && slotTime <= new Date();
                        return (
                          <button
                            key={index}
                            className={`slot-button ${selectedSlot === slot ? 'selected' : ''}`}
                            onClick={() => setSelectedSlot(slot)}
                            disabled={isDisabled || selectedDay === null}
                          >
                            {slot}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>No available slots for this day.</p>
          )}
        </div>
      </div>

      <div className="total-payment">
        <button className="proceed-button1" onClick={handleProceed}>Proceed</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
        <div
          className="modal-content"
          ref={modalRef}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <h1 className="modal-header">Confirmation</h1>
          {showError ? (
            <p><strong>Please select the date and time.</strong></p>
          ) : (
            <>
              {/* Display user details */}
              <p><strong>Name:</strong> {bookingData?.name || "N/A"}</p>
              <p><strong>Address:</strong> {bookingData?.address || "Fetching address..."}</p>
      
              {/* Display appointment date and time */}
              <p><strong>Time:</strong> {selectedSlot}</p>
              <p><strong>Date:</strong> {weekDates[selectedDay]?.day} {weekDates[selectedDay]?.month} {today.getFullYear()}</p>
            </>
          )}
          <div className="modal-buttons">
            <button className="modal-button cancel" onClick={handleCloseModal}>Cancel</button>
            {!showError && <button className="modal-button continue" onClick={handleContinue}>Continue</button>}
          </div>
        </div>
      </div>
      
      )}
    </div>
  );
};

export default Appointment;
