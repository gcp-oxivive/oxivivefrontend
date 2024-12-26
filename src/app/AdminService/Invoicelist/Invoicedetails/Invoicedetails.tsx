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
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoice_id = searchParams.get("invoice_id");

  useEffect(() => {
    if (invoice_id) {
      fetch(`https://paymentandbillingservice-69668940637.asia-east1.run.app/api/invoice-details/?invoice_id=${invoice_id}`)
        .then((response) => response.json())
        .then((data) => setInvoiceData(data))
        .catch((error) => console.error("Error fetching invoice details:", error));
    }
  }, [invoice_id]);

  if (!invoiceData) {
    return <div>Loading...</div>;
  }

  const { vendor, issued_date, due_date, total, invoice_details, invoice_price } = invoiceData;
  const invoiceDetailsArray = invoice_details.split(",");
  const invoicePricesArray = invoice_price.split(",");

  return (
    <div className="invoice-page">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="invoice-content">
        {/* Header Section */}
        <div className="invoice-header1">
          <div className="header-left">
            <h1>{invoiceData.invoice_id}</h1>
            <p>{total} USD Paid at {issued_date}</p>
          </div>
          <div className="header-right">
            <div className="status-box paid">Paid</div>
          </div>
        </div>

        {/* Divider */}
        <hr className="divider" />

        {/* Payment Details Section */}
        <div className="border-2 rounded-lg border-gray-300 p-5 mt-5">
        <div className="payment-details4">
          <h2 className="payment-details5">Payment Batch October 2024</h2>
          <div className="details-grid3">
            <div>
              <p><strong>Name</strong>: {vendor.name}</p>
              <p><strong>Email</strong>: {vendor.email}</p>
              <p><strong>Mobile Number</strong>: {vendor.phone}</p>
              <p><strong>Location</strong>: {vendor.address}</p>
              <p><strong>Clinic Name</strong>: {vendor.clinic_name || vendor.wheel_name}</p>
            </div>
            <div>
              <p><strong>Invoice Number</strong>: {invoiceData.invoice_id}</p>
              <p><strong>Issued</strong>: {issued_date}</p>
              <p><strong>Due Date</strong>: {due_date}</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <table className="invoice-table0">
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {invoiceDetailsArray.map((item, index) => (
              <tr key={index}>
                <td>{item}</td>
                <td>{invoicePricesArray[index] || "0"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={1}><strong>Total</strong></td>
              <td><strong>{total}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
      </div>
    </div>
  );
};

export default Invoicedetails;
