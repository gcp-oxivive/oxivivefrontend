"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Sidebar from "../../Sidebar/Sidebar";
import "./Invoiceunpaid.css";

interface InvoiceData {
  invoice_id: string;
  issued_date: string;
  due_date: string;
  total: string;
  invoice_details: string; // Comma-separated items
  invoice_price: string;   // Comma-separated prices
  vendor: {
    name: string;
    email: string;
    phone: string;
    address: string;
    clinic_name: string;
    wheel_name: string;
  };
}

const Invoiceunpaid: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  const invoice_id = searchParams.get("invoice_id");

  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (invoice_id) {
      fetch(`https://paymentandbillingservice-69668940637.asia-east1.run.app/api/invoice-details/?invoice_id=${invoice_id}`)
        .then((res) => res.json())
        .then((data) => setInvoiceData(data))
        .catch((err) => console.error("Error fetching invoice details:", err));
    }
  }, [invoice_id]);

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!invoiceData || !isRazorpayLoaded) {
      alert("Razorpay is not loaded yet. Please try again later.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_41ch2lqayiGZ9X",
      amount: parseInt(invoiceData.total) * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "Oxivive",
      description: `Payment for Invoice ${invoiceData.invoice_id}`,
      handler: async (response: any) => {
        // Capture Razorpay payment_id and send it to the backend
        try {
          const res = await fetch("https://paymentandbillingservice-69668940637.asia-east1.run.app/api/update-payment-status/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              invoice_id: invoiceData.invoice_id,
              status: "paid",
              payment_id: response.razorpay_payment_id, // Razorpay payment ID
            }),
          });

          if (res.ok) {
            alert("Payment successful and updated in backend!");
            router.push("/AdminService/Invoicelist");
          } else {
            console.error("Failed to update payment status:", await res.json());
          }
        } catch (err) {
          console.error("Error during payment status update:", err);
        }
      },
      prefill: {
        name: invoiceData.vendor.name,
        email: invoiceData.vendor.email,
        contact: invoiceData.vendor.phone,
      },
      notes: {
        address: invoiceData.vendor.address,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new (window as any).Razorpay(options);

    razorpay.on("payment.failed", async (response: any) => {
      alert("Payment failed!");
      // Update backend on payment failure
      try {
        const res = await fetch("https://paymentandbillingservice-69668940637.asia-east1.run.app/api/update-payment-status/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoice_id: invoiceData.invoice_id,
            status: "unpaid",
          }),
        });

        if (!res.ok) {
          console.error("Failed to update failed payment status:", await res.json());
        }
      } catch (err) {
        console.error("Error during payment failed status update:", err);
      }
    });

    razorpay.open();
  };

  if (!invoiceData) return <div>Loading...</div>;

  const { vendor, issued_date, due_date, total, invoice_details, invoice_price } = invoiceData;

  const invoiceDetailsArray = invoice_details && typeof invoice_details === "string" ? invoice_details.split(",") : [];
  const invoicePricesArray = invoice_price && typeof invoice_price === "string" ? invoice_price.split(",") : [];

  return (
    <div className="invoice-page">
      <Sidebar />
      <div className="invoice-content">
        <div className="invoice-header">
          <div className="header-left">
            <h1>{invoiceData.invoice_id}</h1>
            <p>{total} USD Unpaid as of {issued_date}</p>
          </div>
          <div className="header-right">
            <div className="status-box unpaid">UnPaid</div>
          </div>
        </div>

        <hr className="divider" />
        
        <div className="border-2 rounded-lg border-gray-300 p-5 mt-5">
        <div className="payment-details2">
          <h2 className="payment-details3">Payment Batch</h2>
          <div className="details-grid1">
            <div>
              <p><strong>Name</strong>: {vendor.name}</p>
              <p><strong>Email</strong>: {vendor.email}</p>
              <p><strong>Mobile Number</strong>: {vendor.phone}</p>
              <p><strong>Location</strong>: {vendor.address}</p>
              <p><strong>Service Name</strong>: {vendor.clinic_name || vendor.wheel_name}</p>
            </div>
            <div>
              <p><strong>Invoice Number</strong>: {invoiceData.invoice_id}</p>
              <p><strong>Issued Date</strong>: {issued_date}</p>
              <p><strong>Due Date</strong>: {due_date}</p>
            </div>
          </div>
        </div>

        <table className="invoice-table2">
          <thead>
            <tr>
              <th>INVOICE</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {invoiceDetailsArray.map((item, index) => (
              <tr key={index}>
                <td>{item}</td>
                <td>{invoicePricesArray[index] || "0"} </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={1}><strong>Total</strong></td>
              <td><strong>{total} </strong></td>
            </tr>
          </tfoot>
        </table>

        <div className="pay-now-section">
          <button className="pay-now-button" onClick={handlePayment}>
            Pay Now
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoiceunpaid;
