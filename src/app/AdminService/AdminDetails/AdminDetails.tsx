'use client';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './AdminDetails.css';
import Sidebar from '../Sidebar/page';

const AdminDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const profile_photo = searchParams.get('profile_photo');
  const selectedService = searchParams.get('selected_service');
  const address = searchParams.get('address');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const state = searchParams.get('state');
  const district = searchParams.get('district');
  const pincode = searchParams.get('pincode');
  const aadhar_front_side = searchParams.get('aadhar_front_side');
  const aadhar_back_side = searchParams.get('aadhar_back_side');
  const pan_front_side = searchParams.get('pan_front_side');
  const pan_back_side = searchParams.get('pan_back_side');
  const licence_end_date = searchParams.get('licence_end_date');
  const medical_front_side = searchParams.get('medical_front_side');
  const medical_back_side = searchParams.get('medical_back_side');
  const medical_licence_number = searchParams.get('medical_licence_number');
  const driving_front_side = searchParams.get('driving_front_side');
  const driving_back_side = searchParams.get('driving_back_side');
  const driving_licence_number = searchParams.get('driving_licence_number');
  const vehicle_rc_front_side = searchParams.get('vehicle_rc_front_side');
  const vehicle_rc_back_side = searchParams.get('vehicle_rc_back_side');

  if (!name) return <p>Loading...</p>;

  const handleApprove = async () => {
    try {
      await fetch(`https://adminservice-69668940637.asia-east1.run.app/api/vendorapp-vendordetails/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', email }),
      });
      alert('Approved successfully');
      router.push('/AdminService/AdminDashboard');
    } catch (error) {
      console.error(error);
      alert('Error approving the document');
    }
  };

  const handleReject = async () => {
    try {
      await fetch(`https://adminservice-69668940637.asia-east1.run.app/api/vendorapp-vendordetails/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', email }),
      });
      alert('Rejected successfully');
      router.push('/AdminService/AdminDashboard');
    } catch (error) {
      console.error(error);
      alert('Error rejecting the document');
    }
  };

  return (
    <div className="admin-details">
      <Sidebar/>
      
      <main className="content">
        <h2 className="page-title">Vendor Details</h2>

        <section className="vendor-info-page">
          <div className="profile">
            <img src={`${profile_photo}`} alt="Profile" className="profile-pic" />
            <div className="profile-details">
              <h3>{name}</h3>
              <p>{address}</p>
            </div>
          </div>

          <div className="info-details">
            <p><strong>Oxi Type:</strong> {selectedService}</p>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>State:</strong> {state}</p>
            <p><strong>District:</strong> {district}</p>
            <p><strong>Pincode:</strong> {pincode}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Email ID:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <div className="action-buttons">
            <button className="approve" onClick={handleApprove}>Approve</button>
            <button className="reject" onClick={handleReject}>Reject</button>
            </div>
          </div>

          <section className="documents">
            <h3>Aadhar Card</h3>
            <div className="document-row">
              <img src={`${aadhar_front_side}`} alt="Aadhar Front" />
              <img src={`${aadhar_back_side}`} alt="Aadhar Back" />
            </div>

            <h3>PAN Card</h3>
            <div className="document-row">
              <img src={`${pan_front_side}`} alt="PAN Front" />
              <img src={`${pan_back_side}`} alt="PAN Back" />
            </div>

            {selectedService === 'Oxi Clinic' && (
              <>
                <h3>Medical License</h3>
                <div className="document-row">
                  <p>
                    <img src={`${medical_front_side}`} alt="Medical Front" />
                    <span>Medical Licence Number:</span>
                    <span>{medical_licence_number}</span>
                  </p>
                  <p>
                    <img src={`${medical_back_side}`} alt="Medical Back" />
                    <span>Medical Licence Exp Date:</span>
                    <span>{licence_end_date}</span>
                    </p>
                </div>
              </>
            )}

            {selectedService === 'Oxi Wheel' && (
              <>
                <h3>Driving License</h3>
                <div className="document-row">
                <p>
                  <img src={`${driving_front_side}`} alt="Driving Front" />
                  <span>Driving Licence Number:</span>
                  <span>{driving_licence_number}</span>
                </p>
                  <p><img src={`${driving_back_side}`} alt="Driving Back" /></p>
                </div>

                <h3>Vehicle Registration</h3>
                <div className="document-row">
                  <p><img src={`${vehicle_rc_front_side}`} alt="Vehicle Front" /></p>
                  <p><img src={`${vehicle_rc_back_side}`} alt="Vehicle Back" /></p>
                </div>
              </>
            )}
          </section>
        </section>
      </main>
    </div>
  );
};

export default AdminDetails;
