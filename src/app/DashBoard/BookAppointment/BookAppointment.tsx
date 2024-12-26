"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoChevronBackSharp } from 'react-icons/io5';
import './BookAppointment.css';

const BookAppointment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams?.get("vendor_id"); // Extract vendor_id from URL params
  const oxiId = searchParams?.get("oxi_id") || localStorage.getItem("oxi_id"); // Get oxi_id from query params or local storage
  const today = new Date();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [clinicData, setClinicData] = useState<any | null>(null); // Store clinic data
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<{ serviceType: string; oxiId: string; phone_number: string; email: string;} | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (vendorId) {
      const fetchClinicDetails = async () => {
        try {
          const response = await fetch(`https://bookingservice-69668940637.asia-east1.run.app/api/user-vendor-appointment-details/${vendorId}/`);
          if (!response.ok) throw new Error("Failed to fetch clinic details");
          const data = await response.json();
          setClinicData(data);
        } catch (err: any) {
          console.error("Error fetching clinic details:", err.message);
        }
      };

      fetchClinicDetails();
    }

    // Retrieve selected_service from localStorage (set during ClinicSearch)
    const service = localStorage.getItem("selected_service");
    if (service) {
      setSelectedService(service);
    }

    const savedData = localStorage.getItem('selectedData');
    if (savedData) {
      setSelectedData(JSON.parse(savedData));
    }

    const todayIndex = weekDates.findIndex(date => {
      const todayDate = today.getDate();
      return date.day === todayDate;
    });

    if (todayIndex !== -1) {
      setSelectedDay(todayIndex);
    }
  }, [vendorId]); // Re-run when vendorId changes

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const generateWeekDates = () => {
    const weekDates = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      weekDates.push({
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
        monthIndex: date.getMonth(), // Add monthIndex
        weekDay: date.toLocaleString('default', { weekday: 'short' }),
      });
    }
    return weekDates;
  };
  

  const weekDates = generateWeekDates();

  const handleProceed = () => {
    if (selectedDay === null || selectedSlot === null) {
      setShowError(true);
      setIsModalOpen(true);
    } else {
      setShowError(false);
      setIsModalOpen(true);
    }

    
  };

  const handleContinue = () => {
    if (selectedDay !== null && selectedSlot !== null) {
      // Construct the selected date in ISO format
      const selectedDate = new Date(
        today.getFullYear(),
        weekDates[selectedDay].monthIndex,
        weekDates[selectedDay].day
      ).toISOString().split('T')[0];
     


      // Store the selected date in localStorage
    localStorage.setItem('selectedAppointmentDate', selectedDate);
    console.log('Selected Date Data:', weekDates[selectedDay]);
    console.log('selectedAppointmentDate', selectedDate);


      const appointmentData = {
        clinic_name: clinicData?.clinic_name || "N/A",
        wheel_name: clinicData?.wheel_name || "N/A",
        address: clinicData?.address || "N/A",
        serviceType: selectedService || "N/A", // Add selected_service here
        oxiId: oxiId || "N/A",
        vendorId: vendorId || "N/A", // Include vendor_id
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        service_price: clinicData?.service_price || "N/A", // Add service_price
      };

      if (vendorId) {
        localStorage.setItem('vendor_id', vendorId);
      }
  
      // Store appointment data in local storage
      localStorage.setItem('appointmentData', JSON.stringify(appointmentData));
      
      

      // Redirect to the payment page
      window.location.href = '/DashBoard/PaymentMethod';
    }
    setIsModalOpen(false);
  };
  



  const handleDaySelect = (index: number) => {
    setSelectedDay(index);
    setSelectedSlot(null);
  };

  return (
    <div className="appointment-container">
      <div className="header">
        <button className="back-button4" onClick={() => router.back()}>
          <IoChevronBackSharp size={20} />
        </button>
        <h1>Oxivive Services</h1>
      </div>

      {clinicData && (
        <div className="services">
          <div className="service">
          <p className="clinic-name4">
      {selectedService === "Oxi Clinic"
        ? clinicData?.clinic_name
        : selectedService === "Oxi Wheel"
        ? clinicData?.wheel_name
        : "Unknown Service"}

{clinicData?.service_price && (
    <span className="service-price"> - INR{clinicData.service_price}</span>
  )}
    </p>
            <p className='clinic-address4'>{clinicData.address}</p>
            <p><span className="amount">{clinicData.serviceType}</span></p>
          </div>
        </div>
      )}

      <div className="appointment-dates">
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

      <div className="time-slots">
  {Array.isArray(clinicData?.available_slots) && clinicData.available_slots.length > 0 ? (
    <>
      {/* Render Morning Slot Category only if there are available AM slots */}
      {clinicData.available_slots.some((slot: string) => slot.endsWith("AM")) && (
        <div className="slot-category">
          <h4>Morning</h4>
          <div className="slots">
            {clinicData.available_slots
              .filter((slot: string) => slot.endsWith("AM"))
              .map((slot: string, index: number) => {
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

      {/* Render Afternoon Slot Category only if there are available PM slots */}
      {clinicData.available_slots.some((slot: string) => slot.endsWith("PM")) && (
        <div className="slot-category">
          <h4>Afternoon</h4>
          <div className="slots">
            {clinicData.available_slots
              .filter((slot: string) => slot.endsWith("PM"))
              .map((slot: string, index: number) => {
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
    <p>No available slots found.</p>
  )}
</div>




      <div className="total-payment">
        <button className="proceed-button" onClick={handleProceed}>Proceed</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            ref={modalRef}
          >
            <h1 className='modal-header'>Confirmation</h1>
            {showError ? (
              <p><strong>Please select the date and time.</strong></p>
            ) : (
              <>
              {/* Dynamically determine the label for Name */}
          <p>
            <strong>
              {clinicData?.clinic_name ? "Clinic Name:" : "Wheel Name:"}
            </strong>{" "}
            {clinicData?.clinic_name || clinicData?.wheel_name || "Fetching..."}
          </p>
          {/* Dynamically determine the label for Address */}
          <p>
            <strong>
              {clinicData?.clinic_name ? "Clinic Address:" : "Wheel Address:"}
            </strong>{" "}
            {clinicData?.address || "Fetching address..."}
          </p>
                <p><strong>Time:</strong> {selectedSlot || "N/A"}</p>
                <p><strong>Date:</strong> {weekDates[selectedDay!].weekDay}, {weekDates[selectedDay!].day} {weekDates[selectedDay!].month} {today.getFullYear()}</p>
              </>
            )}
            <div className="modal-buttons">
              <button className="modal-button" onClick={handleContinue}>Continue</button>
              <button className="modal-button cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
