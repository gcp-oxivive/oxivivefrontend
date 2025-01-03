'use client'
import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Sidebar from "../Sidebar/page";
import { FaShareAlt, FaDownload } from 'react-icons/fa'; // Importing icons

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay to show the spinner
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />

      {/* Main Content */}
      <div className={styles.mainContent}>
        {loading ? (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className={styles.header}>
              <h1>Dashboard</h1>
              <div className={styles.actions}>
                <button className={styles.shareButton}>
                  <FaShareAlt style={{ marginRight: '8px' }} /> Share
                </button>
                <button className={styles.exportButton}>
                  <FaDownload style={{ marginRight: '8px' }} /> Export
                </button>
              </div>
            </div>

            {/* Revenue Cards */}
            <div className={styles.revenueCards}>
              <div className={`${styles.card} ${styles.activeCard}`}>
                <h2>Oxi Clinic</h2>
                <p>$9,027.01</p>
              </div>
              <div className={styles.card}>
                <h2>Oxi Wheel</h2>
                <p>$12,027.01</p>
              </div>
              <div className={styles.card}>
                <h2>Oxi Gym</h2>
                <p>$6,027.01</p>
              </div>
              <div className={`${styles.card} ${styles.totalCard}`}>
                <h2>Total Revenue</h2>
                <p>$28,027.01</p>
              </div>
            </div>

            {/* Performance Section */}
            <div className={styles.performanceSection}>
              <div className={styles.overallPerformance}>
                <h3>Overall Performance</h3>
                <div className={styles.performanceDetails}>
                  Oxi Clinic <span>$9,027.01</span>
                </div>
                <div className={styles.performanceChart}>
                  {/* Vertical Labels */}
                  <div className={styles.verticalLabels}>
                    <span>120k</span>
                    <span>80k</span>
                    <span>40k</span>
                    <span>20k</span>
                    <span>10k</span>
                    <span>0</span>
                  </div>
                  {/* Bars */}
                  <div className={styles.barsContainer}>
                    <div className={styles.bar} style={{ height: "20%" }}></div>
                    <div className={styles.bar} style={{ height: "30%" }}></div>
                    <div className={styles.bar} style={{ height: "50%" }}></div>
                    <div className={styles.bar} style={{ height: "70%" }}></div>
                    <div className={styles.bar} style={{ height: "40%" }}></div>
                    <div className={styles.bar} style={{ height: "80%" }}></div>
                    <div className={styles.bar} style={{ height: "50%" }}></div>
                    <div className={styles.bar} style={{ height: "90%" }}></div>
                    <div className={styles.bar} style={{ height: "60%" }}></div>
                    <div className={styles.bar} style={{ height: "70%" }}></div>
                    <div className={styles.bar} style={{ height: "40%" }}></div>
                  </div>
                  {/* Horizontal Labels */}
                  <div className={styles.horizontalLabels}>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                  </div>
                </div>
              </div>

              {/* Total Services Section */}
              <div className={styles.totalServices}>
                <h3>Total Services</h3>
                <ul>
                  <li>
                    <span>Oxi Clinic:</span> <span>55</span>
                  </li>
                  <li>
                    <span>Oxi Wheel:</span> <span>84</span>
                  </li>
                  <li>
                    <span>Oxi Gym:</span> <span>25</span>
                  </li>
                  <li>
                    <span>Total:</span> <span>164</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Updated User Activity Section */}
            <div className={styles.userActivitySection}>
              <div className={styles.userActivityGraph}>
                <h3>User Activity</h3>
                <p>This Month</p>
                <div className={styles.graph}>
                  <svg className={styles.graphCurve} viewBox="0 0 100 100">
                    {/* Curved Graph Path */}
                    <path
                      d="M10 80 C 25 60, 40 50, 50 30 C 60 10, 70 40, 90 20"
                      stroke="#FF6B6B"
                      strokeWidth="2"
                      fill="transparent"
                    />
                  </svg>
                  {/* Graph Labels (Dates) */}
                  <div className={styles.graphLine}>
                    <span>Sep 3</span>
                    <span>Sep 18</span>
                    <span>Oct 3</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
