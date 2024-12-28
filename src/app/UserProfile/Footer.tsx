import React, { useState } from 'react';
import { GoHome } from 'react-icons/go';
import { CiSearch } from 'react-icons/ci';
import { RxCalendar } from 'react-icons/rx';
import { BsPerson } from 'react-icons/bs';
import { useRouter } from 'next/navigation';

const Footer: React.FC = () => {
    const router = useRouter();
  const [activeFooterIcon, setActiveFooterIcon] = useState<string>('home');

  

  const footerIconStyle = (icon: string) => ({
    color: activeFooterIcon === icon ? '#FC000E' : 'rgb(151, 147, 147)',
  });

  const handleFooterIconClick = (icon: string) => {
    setActiveFooterIcon(icon); // Set active icon based on click
    const oxiId = localStorage.getItem('oxi_id') || 'Unknown';

    if (icon === 'home') {
      router.push('/DashBoard/HomePage');
    } else if (icon === 'search') {
      router.push('/DashBoard/SearchPage');
    } else if (icon === 'appointments') {
      router.push(`/Booking?oxi_id=${oxiId}`);
    } else if (icon === 'profile') {
      router.push(`/UserProfile`);
    }
  };

  return (
    <div className="footer-section1">
      <div className="footer-icon" style={footerIconStyle('home')} onClick={() => handleFooterIconClick('home')}>
        <GoHome size={24} />
        <span className="footer-header" style={{ color: footerIconStyle('home').color }}>Home</span>
      </div>
      <div className="footer-icon" style={footerIconStyle('search')} onClick={() => handleFooterIconClick('search')}>
        <CiSearch size={24} />
        <span className="footer-header" style={{ color: footerIconStyle('search').color }}>Search</span>
      </div>
      <div className="footer-icon" style={footerIconStyle('appointments')} onClick={() => handleFooterIconClick('appointments')}>
        <RxCalendar size={24} />
        <span className="footer-header" style={{ color: footerIconStyle('appointments').color }}>Bookings</span>
      </div>
      <div className="footer-icon" style={footerIconStyle('profile')} onClick={() => handleFooterIconClick('profile')}>
        <BsPerson size={24} />
        <span className="footer-header" style={{ color: footerIconStyle('profile').color }}>Profile</span>
      </div>
    </div>
  );
};

export default Footer;