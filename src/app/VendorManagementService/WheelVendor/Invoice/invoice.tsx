"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faBell, faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './invoice.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { GrAdd } from "react-icons/gr";
import axios from 'axios';

const InvoicePage: React.FC = () => {
  const [selectedFooter, setSelectedFooter] = useState('home');
  const [selectedTab, setSelectedTab] = useState('invoice');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<{ id: number; name: string; price: string }[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<{ id: number; name: string; price: string }[]>([]);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fetch vendor ID from URL or localStorage
    const urlVendorId = searchParams.get('vendorId');
    if (urlVendorId) {
      setVendorId(urlVendorId);
    } else {
      const storedVendorId = localStorage.getItem('vendor_id');
      if (storedVendorId) {
        setVendorId(storedVendorId);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const serviceTypeParam = 'Oxi Wheel'; // Always fetch "Oxi Wheel"
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

        // Conditionally fetch based on the selected tab
        let response;
        if (selectedTab === 'invoice') {
          response = await axios.get('https://paymentandbillingservice-69668940637.asia-east1.run.app/api/invoices/', {
            params: { service_type: serviceTypeParam, date: todayString }, // Add date filter for today
          });
        } else if (selectedTab === 'history') {
          response = await axios.get('https://paymentandbillingservice-69668940637.asia-east1.run.app/api/invoices/', {
            params: { service_type: serviceTypeParam },
          });
        }

        setInvoices(response?.data || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchInvoices();
  }, [selectedTab]); // Trigger this effect whenever the selected tab changes

  const handleFooterClick = (footer: string) => {
    setSelectedFooter(footer);
  
    // Redirect to respective pages
    switch (footer) {
      case "home":
        router.push("/VendorManagementService/Vendors/WheelVendor/Wheel"); // Redirect to the home page
        break;
      case "bookings":
        router.push("/VendorManagementService/WheelVendor/MyBookings"); // Redirect to the bookings page
        break;
      case "notifications":
        router.push("/notifications"); // Redirect to the notifications page
        break;
      case "profile":
        router.push("/VendorManagementService/WheelVendor/profile"); // Redirect to the profile page
        break;
      default:
        break;
    }
  };
  const handleTabClick = (tab: string) => setSelectedTab(tab);

  const handleAddItem = () => setItems([...items, { id: items.length, name: '', price: '' }]);
  const handleItemChange = (id: number, field: string, value: string) =>
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  const validateItems = (itemList: { name: string; price: string }[]) => {
    return itemList.every((item) => item.name.trim() !== '' && item.price.trim() !== '');
  };

  const handleSave = () => {
    if (!validateItems(items)) {
      alert('Please ensure all items have a name and price before saving.');
      return;
    }
    setSavedItems([...savedItems, ...items]);
    setItems([]);
  };

  const handleRaiseClaim = async () => {
    const allItems = [...savedItems, ...items];
    if (allItems.length === 0) {
      alert('Please add at least one item before raising an invoice.');
      return;
    }
    if (!validateItems(allItems)) {
      alert('Please ensure all items have a name and price before raising an invoice.');
      return;
    }
    if (!vendorId) {
      alert('Vendor ID is not available. Please ensure it is set.');
      return;
    }
    if (!validateItems(savedItems)) {
      alert('Please ensure all saved items have a name and price before raising an invoice.');
      return;
    }
    if (savedItems.length === 0) {
      alert('Please save items before raising an invoice.');
      return;
    }

    const invoiceDetails = savedItems.map((item) => item.name).join(','); // Comma-separated names
    const invoicePrices = savedItems.map((item) => item.price).join(','); // Comma-separated prices
    const totalPrice = savedItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

    const serviceType = "Oxi Wheel";

    const data = {
      vendor_id: vendorId,
      invoice_details: invoiceDetails,
      invoice_price: invoicePrices,
      total: totalPrice,
      status: 'Unpaid',
      service_type: serviceType,
    };
    console.log('data',data);

    try {
      const response = await axios.post('https://paymentandbillingservice-69668940637.asia-east1.run.app/api/invoices/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setInvoices((prevInvoices) => [...prevInvoices, response.data]);
      setSavedItems([]);
      toggleModal();
      alert('Claim raised and data saved successfully!');
    } catch (error) {
      console.log('Error raising claim:', error.response ? error.response.data : error);
      alert('Failed to raise claim.');
    }
  };
  const filteredInvoices = invoices.filter(
    (invoice) =>
      selectedTab === 'invoice' ? invoice.status === 'Unpaid' : invoice.status === 'Paid'
  );

  return (
    <div className="invoice-container6">
      {/* Header Section */}
      <div className="header9">
        <button className="back-button1" onClick={() => router.push('/VendorManagementService/Vendors/WheelVendor/Wheel')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="title">Invoice</h1>
      </div>

      {/* Tab Navigation */}
      <div className="tabsp">
        <div className={`tab1 ${selectedTab === 'invoice' ? 'active' : ''}`} onClick={() => handleTabClick('invoice')}>
          Invoice
        </div>
        <div className={`tab1 ${selectedTab === 'history' ? 'active' : ''}`} onClick={() => handleTabClick('history')}>
          History
        </div>
      </div>

      {/* Invoice Cards */}
      {loading && <div className="spinner-overlay"><div className="spinner"></div></div>}

      {/* Invoice Cards */}
      <div className="new-invoice-card1">
        <div className="cards0">
          {filteredInvoices.map((invoice) => {
            const items = invoice.invoice_details ? invoice.invoice_details.split(',') : [];
            const prices = invoice.invoice_price ? invoice.invoice_price.split(',') : [];
            return (
              <div key={invoice.invoice_id} className="invoice-cards">
                <div className="invoice-info">
                  {items.map((item, index) => (
                    <div key={index} className="item-row">
                      <span className="item-name">{item}</span>
                      <span className="item-price">Rs {prices[index] ? prices[index] : '0'}</span>
                    </div>
                  ))}
                  <div className="total-row">
                    <span className="total-label">Total:</span>
                    <span className="total-price">Rs {invoice.total || '0'}</span>
                  </div>
                  <div className={`status ${invoice.status ? invoice.status.toLowerCase() : ''}`}>
                    {invoice.status || 'Unknown'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="new-invoice-buttons" onClick={toggleModal}>
          <GrAdd size={25} />
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-x-modal" onClick={toggleModal}>
              &times;
            </button>
            <h2>Create New Invoice</h2>

            {savedItems.length > 0 && (
              <div className="saved-items-section">
                <h3>Saved Items</h3>
                <ul className="saved-items-list">
                  {savedItems.map((item, index) => (
                    <li key={index} className="saved-item">
                      <span className="item-name">{item.name}</span> - <span className="item-price"> Rs {item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className="add-item-button" onClick={handleAddItem}>
              Add Item
            </button>

            <div className="items-container">
              {items.map((item) => (
                <div key={item.id} className="item-row">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Item Price"
                    value={item.price}
                    onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
              <button className="raise-claim-button" onClick={handleRaiseClaim}>
                Raise Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="footerd">
        <div className={`footer-icon ${selectedFooter === 'home' ? 'selected' : ''}`} onClick={() => handleFooterClick('home')}>
          <FontAwesomeIcon icon={faHome} />
          <span>Home</span>
        </div>
        <div className={`footer-icon ${selectedFooter === 'bookings' ? 'selected' : ''}`} onClick={() => handleFooterClick('bookings')}>
          <FontAwesomeIcon icon={faClipboardList} />
          <span>Bookings</span>
        </div>
        <div className={`footer-icon ${selectedFooter === 'notifications' ? 'selected' : ''}`} onClick={() => handleFooterClick('notifications')}>
          <FontAwesomeIcon icon={faBell} />
          <span>Notifications</span>
        </div>
        <div className={`footer-icon ${selectedFooter === 'profile' ? 'selected' : ''}`} onClick={() => handleFooterClick('profile')}>
          <FontAwesomeIcon icon={faUser} />
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
