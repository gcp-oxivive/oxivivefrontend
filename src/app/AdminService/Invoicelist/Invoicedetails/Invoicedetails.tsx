"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { MdOutlineFileDownload, MdKeyboardArrowDown } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import "./Invoicedetails.css";

interface Vendor {
  name: string;
  email: string;
  phone: string;
  address: string;
  clinic_name?: string;
  wheel_name?: string;
}

interface InvoiceDetails {
  invoice_id: string;
  issued_date: string;
  due_date: string;
  total: string;
  invoice_details: string;
  invoice_price: string;
  vendor: Vendor;
}

const Invoicedetails: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoice_id = searchParams.get("invoice_id");

  useEffect(() => {
    if (invoice_id) {
      fetch(`https://paymentandbillingservice-69668940637.asia-east1.run.app/api/invoice-details/?invoice_id=${invoice_id}`)
        .then((response) => response.json())
        .then((data) => {
          setInvoiceData(data);
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch((error) => {
          console.error("Error fetching invoice details:", error);
          setLoading(false); // Stop loading on error
        });
    }
  }, [invoice_id]);

  

  return (
    <div className="invoice-page">
      <Sidebar />

      <div className="invoice-content">
        {loading ? ( // Show spinner while loading
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="invoice-header1">
              <div className="header-left">
                <h1>{invoiceData?.invoice_id}</h1>
                <p>{invoiceData?.total} USD Paid at {invoiceData?.issued_date}</p>
              </div>
              <div className="header-right">
                <div className="status-box paid">Paid</div>
              </div>
            </div>

            <hr className="divider" />

            <div className="border-2 rounded-lg border-gray-300 p-5 mt-5">
              <div className="payment-details4">
                <h2 className="payment-details5">Payment Batch October 2024</h2>
                <div className="details-grid3">
                  <div>
                    <p><strong>Name</strong>: {invoiceData?.vendor.name}</p>
                    <p><strong>Email</strong>: {invoiceData?.vendor.email}</p>
                    <p><strong>Mobile Number</strong>: {invoiceData?.vendor.phone}</p>
                    <p><strong>Location</strong>: {invoiceData?.vendor.address}</p>
                    <p><strong>Clinic Name</strong>: {invoiceData?.vendor.clinic_name || invoiceData?.vendor.wheel_name}</p>
                  </div>
                  <div>
                    <p><strong>Invoice Number</strong>: {invoiceData?.invoice_id}</p>
                    <p><strong>Issued</strong>: {invoiceData?.issued_date}</p>
                    <p><strong>Due Date</strong>: {invoiceData?.due_date}</p>
                  </div>
                </div>
              </div>

              <table className="invoice-table0">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData?.invoice_details.split(",").map((item, index) => (
                    <tr key={index}>
                      <td>{item}</td>
                      <td>{invoiceData.invoice_price.split(",")[index] || "0"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={1}><strong>Total</strong></td>
                    <td><strong>{invoiceData?.total}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Invoicedetails;
