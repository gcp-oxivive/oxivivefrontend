"use client"
import { useEffect, useState } from "react";
import React from "react";
import "./PaymentMethod.css";
import { useRouter } from 'next/navigation';
import { IoChevronBackSharp } from "react-icons/io5";

interface appointmentData {
  name: string;
  address: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  email: string;
  phone_number: string;
  oxiId: string;
}

// Razorpay configuration keys
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_41ch2lqayiGZ9X";

const PaymentMethod: React.FC = () => {
  const [vendorDetails, setVendorDetails] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appointmentData, setAppointmentData] = useState<any | null>(null); // Add state for appointmentData
  const [countdown, setCountdown] = useState<string>(""); // State for countdown
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const router = useRouter();

  // Fetch and parse appointmentData from localStorage
  useEffect(() => {
    const storedAppointmentData = localStorage.getItem("appointmentData");
    if (storedAppointmentData) {
      const parsedData = JSON.parse(storedAppointmentData);

      // Parse appointment date to ensure correct interpretation
      const appointmentDate = new Date(parsedData.appointmentDate)
        .toISOString()
        .split("T")[0];
      parsedData.appointmentDate = appointmentDate;

      setAppointmentData(parsedData);
    }
    console.log(storedAppointmentData, "storedAppointmentData");
  }, []);

  // Fetch vendor details when the component mounts
  useEffect(() => {
    const vendorId = localStorage.getItem("vendor_id");
    if (vendorId) {
      const fetchVendorDetails = async () => {
        try {
          const response = await fetch(
            `https://bookingservice-69668940637.asia-east1.run.app/api/user-vendor-details-service/${vendorId}/`
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch vendor details: ${response.statusText}`
            );
          }
          const data = await response.json();
          setVendorDetails(data[0] || null);
        } catch (err) {
          console.error("Error fetching vendor details:", err);
          setError("Failed to load vendor details");
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      };

      fetchVendorDetails();
    } else {
      console.warn("Vendor ID not found in localStorage");
      setError("Vendor ID is missing");
      setLoading(false); // Set loading to false if vendor ID is missing
    }
  }, []);

  console.log('VendorDetails', vendorDetails);

  useEffect(() => {
    if (appointmentData?.appointmentDate && appointmentData?.appointmentTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const appointmentDateTime = new Date(
          `${appointmentData.appointmentDate} ${appointmentData.appointmentTime}`
        );
        const diffMs = appointmentDateTime.getTime() - now.getTime();

        if (diffMs <= 0) {
          setCountdown("Appointment time has passed");
          clearInterval(interval);
        } else {
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          setCountdown(`In ${hours} Hours & ${minutes} Minutes`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [appointmentData]);

  const formatAppointmentTime = (date: string, time: string): string => {
    const [hour, minute, period] = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)?.slice(1) || [];
    const formattedHour = period?.toUpperCase() === "PM" && +hour < 12 ? +hour + 12 : +hour;
    const isoTime = `${formattedHour.toString().padStart(2, "0")}:${minute}:00`;

    const appointmentDateTime = new Date(`${date}T${isoTime}`);
    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata", // Ensure the time zone is consistent
    });

    return formatter.format(appointmentDateTime);
  };

  const parseAppointmentTime = (time: string): string | null => {
    // Check if time exists
    if (!time) return null;

    // Use a regular expression to match and parse `hh:mm AM/PM` format
    const timeRegex = /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/i;
    const match = time.match(timeRegex);

    if (!match) return null;

    let [_, hours, minutes, meridian] = match;
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    // Convert to 24-hour time
    if (meridian.toUpperCase() === "PM" && hours < 12) {
      hours += 12;
    }
    if (meridian.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    // Construct ISO string
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  };

  const handlePayment = async () => {
    // Load Razorpay's script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize Razorpay
      const options = {
        key: RAZORPAY_KEY_ID, // Razorpay Key ID
        amount: 100, // Amount in smallest currency unit (paise for INR)
        currency: "INR",
        name: "Oxivive Services",
        description: "Consultation Fee",
        image: "/images/shot(1).png",
        handler: (response: any) => {
          const paymentId = response.razorpay_payment_id;

          // Redirect to TickPage immediately
          router.push("/DashBoard/TickPage");

          // Fetch data from localStorage (appointment details, user details, etc.)
          const storedAppointmentData = localStorage.getItem("appointmentData");
          if (!storedAppointmentData) return;

          const appointmentData = JSON.parse(storedAppointmentData);
          console.log(appointmentData.appointmentTime, 'appointmentData')
          const vendorId = localStorage.getItem("vendor_id"); // Retrieve vendor_id
          // Collect all the necessary data
          const appointmentTime = parseAppointmentTime(appointmentData?.appointmentTime);
          if (!appointmentTime) {
            alert("Invalid appointment time format. Please check your input.");
            return;
          }

          const bookingData = {
            name: vendorDetails?.name,
            clinic_name: vendorDetails?.clinic_name || vendorDetails?.wheel_name || "N/A", // Save clinic_name or wheel_name
            address: appointmentData?.address,
            service_type: appointmentData?.serviceType, // Add selected_service here
            user: appointmentData?.oxiId,
            appointment_date: appointmentData?.appointmentDate,
            appointment_time: appointmentTime, // Use parsed appointment time
            payment_id: paymentId,
            booking_id: `OXI_${Math.floor(10000 + Math.random() * 90000)}`,  // Generate random booking ID
            payment_status: "completed",
            vendor_id: vendorId,
            booking_status: "upcoming",
            service_price: vendorDetails?.service_price
          };

          // Send booking data to backend API to save it in the database
          const saveBooking = async () => {
            try {
              const response = await fetch("https://bookingservice-69668940637.asia-east1.run.app/api/user-save-booking/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(bookingData),
              });
              const data = await response.json();

              if (response.ok) {
                // Redirect to TickPage on successful booking
                // router.push("/DashBoard/TickPage");
              } else {
                alert("Failed to save booking: " + data.message || "Error");
              }
            } catch (error) {
              if (error instanceof Error) {
                alert("Error while saving the booking: " + error.message);
              } else {
                alert("An unknown error occurred while saving the booking.");
              }
            }
          };

          saveBooking();
        },
        prefill: {
          name: "User Name", // Replace with user details
          email: "user@example.com",
          contact: "8978458745",
        },
        notes: {
          address: "Unnamed rd, veerampalem, Andhra Pradesh 560078, India",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        alert(`Payment Failed. Error: ${response.error.description}`);
      });

      rzp.open();

      const customStyles = `
      .razorpay-checkout-frame {
        width: 350px !important; /* Adjust the width to match the payment container */
        height: 500px !important; /* Adjust the height to match your container's height */
        max-width: 100% !important;
        margin: auto !important;
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        overflow: hidden !important; /* Hide overflow to prevent scrollbars */
      }

      .razorpay-checkout-frame iframe {
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        overflow: hidden !important; /* Hide overflow within iframe */
      }

      /* Ensure no scrollbars appear on the iframe (for WebKit browsers) */
      .razorpay-checkout-frame iframe::-webkit-scrollbar {
        display: none;
      }

      /* Also hide scrollbar on iframe for other browsers */
      .razorpay-checkout-frame iframe {
        scrollbar-width: none; /* Firefox */
      }
      `;
      const styleTag = document.createElement('style');
      styleTag.innerHTML = customStyles;
      document.head.appendChild(styleTag);
    };

    document.body.appendChild(script);
  };

  return (
    <div className="payment-method-container">
      {loading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          <h1 className="heading">Payment Method</h1>
          <button className="back-button4" onClick={() => router.back()}>
            <IoChevronBackSharp size={20} />
          </button>
          <div className="scrollable-content">
            <div className="clinic-details">
              <h2>Clinic Details</h2>
              <div className="clinic-info">
                <img
                  src={vendorDetails?.oxi_image1 || "https://via.placeholder.com/100"}  // Fallback to a default image if not available
                  alt="Clinic"
                  className="clinic-image"
                />
                <div className="clinic-details2">
                  <div className="clinic-info">
                    <strong>
                      {vendorDetails?.clinic_name
                        ? "Clinic name:"
                        : vendorDetails?.wheel_name
                          ? "Wheel name:"
                          : "Name:"}
                    </strong>
                    <span className="clinic-name">
                      {vendorDetails?.clinic_name || vendorDetails?.wheel_name}
                    </span>
                  </div>
                  <div className="clinic-info">
                    <strong>Phone:</strong> <span className="clinic-phone">{vendorDetails?.phone}</span>
                  </div>
                  <div className="clinic-info">
                    <strong>Address:</strong> <span className="clinic-address">{vendorDetails?.address}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="appointment-details">
              <h2 className="appoint-head">Appointment Time</h2>
              <div className="appointment-time-container">
                <span className="appointment-time">{appointmentData
                  ? formatAppointmentTime(appointmentData.appointmentDate, appointmentData.appointmentTime)
                  : "N/A"}</span>
                <div className="vertical-separator"></div>
                <div className="appointment-countdown">{countdown}</div>
              </div>
            </div>
            <div className="bill-details">
              <h2>Bill Details</h2>
              <div className="bill-item">
                <span>Consultation Fee</span>
                <span className="bill-item-p">₹ 1</span>
              </div>
              <div className="bill-item">
                <span>Service Fee & Tax</span>
                <span className="bill-item-p">
                  <span>49</span>
                  <span className="free-tag">FREE</span>
                </span>
              </div>
              <p className="free-booking">
                We care for you & provide a free booking
              </p>
            </div>
            <div className="total-payable">
              <div className="total-header">
                <h2 className="total-text">Total Payable</h2>
                <div className="service-price-container">
                  <span className="service-price">
                    ₹{vendorDetails?.service_price || "N/A"}
                  </span>
                </div>
              </div>
              <p className="saved-amount">
                You have saved 49 on this appointment
              </p>
            </div>
            <div className="safety-measures">
              <p className="safety-measures-heading">Safety measures followed by Clinic</p>
              <ul>
                <li> *Mask Mandatory</li>
                <li> *Temperature check at entrance</li>
                <li> *Sanitization of the visitors</li>
                <li> *Social distance maintained</li>
              </ul>
            </div>
            <button className="pay-now-button" onClick={handlePayment}>Pay Now</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentMethod;