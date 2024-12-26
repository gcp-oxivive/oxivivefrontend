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
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "unpaid">("all");
  const router = useRouter();

  useEffect(() => {
    fetch("https://paymentandbillingservice-69668940637.asia-east1.run.app/api/invoices/")
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
          invoice.vendor_email || "",
          invoice.service_type,
          invoice.status,
          invoice.issued_date, // Filter by date
          invoice.total.toString(), // Convert amount to string for searching
        ].some((field) =>
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

  const handleTabClick = (tab: "all" | "paid" | "unpaid") => {
    setFilter(tab);
    setActiveTab(tab);
  };

  return (
    <div className="invoice-page">
      <Sidebar />
      <div className="invoice-content">
        <div className="invoice-header0">
          <h1>Invoice Lists</h1>
        </div>
        <div className="invoice-tabs">
          <div className="invoice-tab1">
            <button
              className={`tab-button ${activeTab === "all" ? "active" : ""}`}
              onClick={() => handleTabClick("all")}
            >
              All ({invoices.length})
            </button>
            <button
              className={`tab-button ${activeTab === "paid" ? "active" : ""}`}
              onClick={() => handleTabClick("paid")}
            >
              Paid ({getCountByStatus("paid")})
            </button>
            <button
              className={`tab-button ${activeTab === "unpaid" ? "active" : ""}`}
              onClick={() => handleTabClick("unpaid")}
            >
              Unpaid ({getCountByStatus("unpaid")})
            </button>
          </div>
          <div className="invoice-filters">
            <input
              type="text"
              className={`search-input ${isSearchActive ? "search-active" : ""}`}
              placeholder="Search anything.."
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>
        </div>
        <table className="invoice-table">
          <thead>
            <tr className="border-2 border-gray-400">
              <th>INVOICE NUMBER</th>
              <th>EMAIL</th>
              <th>SERVICE TYPE</th>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <div className="h-[25px]"></div>
          <tbody className="mt-6 border-2 border-gray-400">
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
                <td>{invoice.total}</td>
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
