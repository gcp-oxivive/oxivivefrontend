"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Invoicelist.css";
import { useRouter } from "next/navigation";

interface Invoice {
  invoice_id: string;
  vendor?: {
    email: string;
  };
  service_type: string;
  issued_date: string;
  total: number;
  status: string;
}

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/invoices/")
      .then((response) => response.json())
      .then((data) => {
        setInvoices(data);
        setFilteredInvoices(data);
      })
      .catch((error) => console.error("Error fetching invoices:", error));
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [filter, invoices, searchTerm]);

  const filterInvoices = () => {
    let result = invoices;

    // Filter by status
    if (filter === "paid") {
      result = result.filter((invoice) => invoice.status === "Paid");
    } else if (filter === "unpaid") {
      result = result.filter((invoice) => invoice.status === "Unpaid");
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter((invoice) =>
        [
          invoice.invoice_id,
          invoice.vendor?.email || "", // Ensure vendor.email is checked safely
          invoice.service_type,
          invoice.status,
        ]
          .some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredInvoices(result);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "status-paid";
      case "Unpaid":
        return "status-unpaid";
      case "In Process":
        return "status-in-process";
      default:
        return "";
    }
  };

  const getCountByStatus = (status: "paid" | "unpaid") => {
    return invoices.filter(
      (invoice) => invoice.status.toLowerCase() === status
    ).length;
  };

  const handleRowClick = (invoice: Invoice) => {
    if (invoice.status === "Paid") {
      router.push(`/AdminService/Invoicelist/Invoicedetails?invoice_id=${invoice.invoice_id}`);
    } else if (invoice.status === "Unpaid") {
      router.push(`/AdminService/Invoicelist/Invoiceunpaid?invoice_id=${invoice.invoice_id}`);
    }
  };

  return (
    <div className="invoice-page">
      <Sidebar />
      <div className="invoice-content">
        <div className="invoice-header">
          <h1>Invoice Lists</h1>
        </div>
        <div className="invoice-tabs">
          <div className="invoice-tab1">
            <button className="tab-button" onClick={() => setFilter("all")}>
              All ({invoices.length})
            </button>
            <button className="tab-button" onClick={() => setFilter("paid")}>
              Paid ({getCountByStatus("paid")})
            </button>
            <button className="tab-button" onClick={() => setFilter("unpaid")}>
              Unpaid ({getCountByStatus("unpaid")})
            </button>
          </div>
          <div className="invoice-filters">
            <input
              type="text"
              className={`search-input ${isSearchActive ? "search-active" : ""}`}
              placeholder="Search"
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>INVOICE NUMBER #</th>
              <th>EMAIL</th>
              <th>SERVICE TYPE</th>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr
                key={invoice.invoice_id}
                onClick={() => handleRowClick(invoice)}
              >
                <td className="invoice-number">
                  <a href="#">{invoice.invoice_id}</a>
                </td>
                <td>{invoice.vendor_email || "N/A"}</td>
                <td>{invoice.service_type}</td>
                <td>{invoice.issued_date}</td>
                <td>{invoice.total} USD</td>
                <td className={getStatusClass(invoice.status)}>
                  {invoice.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
