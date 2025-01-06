// 'use client';
// import React, { useEffect, useState } from 'react';
// import './Service.css';
// import { BiArrowBack } from "react-icons/bi";
// import { useRouter } from 'next/navigation';

// interface Service {
//   service_id: string;
//   service: string;
//   description: string;
//   price: string;
//   service_type: string;
//   service_image: string;
// }

// const Service: React.FC = () => {
//   const router = useRouter();
//   const [services, setServices] = useState<Service[]>([]);

//   useEffect(() => {
//     // Fetch services from the backend
//     const fetchServices = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/api/services2/');

//         if (!response.ok) throw new Error('Failed to fetch services');
//         const data = await response.json();
//         setServices(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchServices();
//   }, []);

//   const handleServiceClick = (service: Service) => {
//     // Store the selected service in localStorage
//     localStorage.setItem('selected_service', JSON.stringify(service));

//     // Navigate to the next page
//     router.push(`/VendorManagementService/SV/Service/Oxivive`);
//   };

//   return (
//     <div className="service-container">
//       <div className="header">
//         <button className="back-button"><BiArrowBack /></button>
//         <div className="logo">
//           <img src="/images/circle.png" alt="Oxivive Logo" />
//         </div>
//         <h1 className="title">
//           <span className="welcome">Welcome to</span>
//           <span className="oxivive">Oxivive</span>
//         </h1>
//       </div>

//       <div className="service-selection">
//         <h2>Please select your service</h2>
//         <p>What specific service will you be providing?</p>
//         <div className="services">
//           {services.map(service => (
//             <div
//               key={service.service_id}
//               className="service-item"
//               onClick={() => handleServiceClick(service)}
//             >
//               <img src={service.service_image} alt={service.service} />
//               <p>{service.service}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Service;
"use client"
import React, { useEffect, useState } from 'react';
import './Service.css';
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from 'next/navigation'; 

const Service: React.FC = () => {
  const [services, setServices] = useState<any[]>([]); 
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://patientservice-69668940637.asia-east1.run.app/api/services2/');
        const data = await response.json();
        setServices(data); 
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (price: string, serviceName: string) => {
    localStorage.setItem('price', price);
    localStorage.setItem('selected_service', serviceName);
    router.push('/VendorManagementService/SV/Service/Oxivive');
  };

  const handleBackClick = () => {
    router.back();
};

  return (
    <div className="service-container">
      <div className="header123">
        <button className="backbutton123"><BiArrowBack onClick={handleBackClick}/></button>
        <div className="logo123">
          <img src="/images/circle.png" alt="Oxivive Logo" />
        </div>
        <h1 className="title123">
          <span className="welcome123">Welcome to</span>
          <span className="oxivive123">Oxivive</span>
        </h1>
      </div>

      <div className="service-selection">
        <h2>Please select your service</h2>
        <p>What specific service will you be providing?</p>
        <div className="services">
          {services.map(service => (
            <div
              className="service-item"
              key={service.service_id}
              onClick={() => handleServiceClick(service.price, service.service_type)}
            >
              <img src={service.service_image} alt={service.service_type} />
              <p>{service.service_type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
