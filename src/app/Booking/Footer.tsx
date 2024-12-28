'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { GoHome } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { RxCalendar } from "react-icons/rx";
import { BsPerson } from "react-icons/bs";

interface FooterProps {
    activeFooterIcon: string;
    setActiveFooterIcon: (icon: string) => void;
}

const Footer: React.FC<FooterProps> = ({ activeFooterIcon, setActiveFooterIcon }) => {
    const router = useRouter();

    const handleFooterIconClick = (icon: string) => {
        setActiveFooterIcon(icon);
        if (icon === 'home') {
            router.push('/DashBoard/HomePage');
        } else if (icon === 'search') {
            router.push('/DashBoard/SearchPage');
        } else if (icon === 'booking') {
            router.push(`/Booking`);
        } else if (icon === 'profile') {
            router.push('/UserProfile');
        }
    };

    const footerIconStyle = (icon: string) => ({
        color: activeFooterIcon === icon ? '#FC000E' : 'rgb(151, 147, 147)',
    });

    return (
        <div className="footer-section5">
            <div className="footer-icon" style={footerIconStyle('home')} onClick={() => handleFooterIconClick('home')}>
                <GoHome size={24} />
                <span className="footer-header" style={{ color: footerIconStyle('home').color }}>Home</span>
            </div>
            <div className="footer-icon" style={footerIconStyle('search')} onClick={() => handleFooterIconClick('search')}>
                <CiSearch size={24} />
                <span className="footer-header" style={{ color: footerIconStyle('search').color }}>Search</span>
            </div>
            <div className="footer-icon" style={footerIconStyle('booking')} onClick={() => handleFooterIconClick('booking')}>
                <RxCalendar size={24} />
                <span className="footer-header" style={{ color: footerIconStyle('booking').color }}>Booking</span>
            </div>
            <div className="footer-icon" style={footerIconStyle('profile')} onClick={() => handleFooterIconClick('profile')}>
                <BsPerson size={28} />
                <span className="footer-header" style={{ color: footerIconStyle('profile').color }}>Profile</span>
            </div>
        </div>
    );
};

export default Footer;
