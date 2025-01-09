'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBackSharp } from "react-icons/io5";
import './Notify.css';

const Notify: React.FC = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        // Fetch notifications from local storage
        const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        setNotifications(storedNotifications);
    }, []);

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="notify-container">
            <div className="notification-header">
                <button className="back-button" onClick={handleBack}>
                    <IoChevronBackSharp className="icon-home" size={22} /> {/* Use the icon instead of text */}
                </button>
                <h1 className="notification-title">Notifications</h1>
            </div>

            {notifications.length > 0 ? (
                <ul className="notification-list">
                    {notifications.map((notification, index) => (
                        <li key={index} className={`notification ${notification.type}`}>
                            <p>{notification.message}</p>
                            <small>{new Date(notification.timestamp).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-notification">No notifications available.</p>
            )}
        </div>
    );
};

export default Notify;