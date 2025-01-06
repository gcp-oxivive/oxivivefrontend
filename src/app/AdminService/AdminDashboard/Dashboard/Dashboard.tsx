'use client'
import React, { useState, useEffect } from "react";
import Sidebar from "../../Sidebar/Sidebar"; // Sidebar imported
import "./Dashboard.css"; // Updated CSS import

const Dashboard: React.FC = () => {
  // Step 1: Add state for loading
  const [isLoading, setIsLoading] = useState(true);

  // Step 2: Simulate a delay (replace this with your actual data fetching)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 2 seconds (simulated)
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  // Step 3: Render spinner if loading, else render content
  return (
    <div className="dashboardContainer">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="mainContent">
        {/* Loading Spinner */}
        {isLoading ? (
          <div className="spinnerContainer">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <header className="header32">
              <h2>Hey, Person</h2>
              <p className="date">Thursday, October 23, 2024</p>
            </header>

            {/* Revenue Section */}
            <section className="revenueSection">
              <h1 className="revenueTitle">Revenue</h1>
            </section>

            {/* Balance and Cashflow Section */}
            <section className="balanceSection">
              {/* Balance Card */}
              <div className="balanceCard">
                <button className="moveMoneyButton">Move Money</button>
                <h3 className="balanceTitle">Balance</h3>
                <h1 className="balanceAmount">$90,925.02</h1>
                <div className="barChart">
                  <div className="yAxis">
                    {[120000, 80000, 40000, 20000, 10000, 0].map((value, index) => (
                      <span key={index} className="yAxisLabel">
                        {value.toLocaleString()}
                      </span>
                    ))}
                  </div>
                  <div className="barGroup">
                    {[
                      "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
                    ].map((month, index) => (
                      <div key={index} className="bar">
                        <div
                          className={`barFill ${
                            month === "JUN" ? "highlightedBar" : ""
                          }`}
                          style={{
                            height:
                              month === "JUN"
                                ? "150px"
                                : `${Math.random() * 120 + 30}px`,
                          }}
                        >
                          {month === "JUN" && (
                            <span className="barValue">59,550</span>
                          )}
                        </div>
                        <span className="month">{month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Updated Cashflow Card */}
              <div className="cashflowCard">
                {/* Header Section */}
                <div className="cashflowHeader">
                  <h3>Cashflow</h3>
                  <button className="viewMoreButton">View More</button>
                </div>

                {/* Amount */}
                <p className="cashflowAmount">6,528.22 USD</p>

                {/* Graph Section */}
                <div className="cashflowGraph">
                  {/* Green Line Graph */}
                  <div className="graphRow">
                    <div className="greenLine"></div>
                    <div className="graphDetails">
                      <p>
                        <span className="greenArrow">↑</span>
                        <span className="greenText">8,453.33 USD</span>
                        <span className="smallText">(3% in last month)</span>
                      </p>
                    </div>
                  </div>

                  {/* Orange Line Graph */}
                  <div className="graphRow">
                    <div className="orangeLine"></div>
                    <div className="graphDetails">
                      <p>
                        <span className="orangeArrow">↓</span>
                        <span className="orangeText">2,232.00 USD</span>
                        <span className="smallText">(1% in last month)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Updated User Activity Section */}
            <section className="userActivitySection">
              <div className="userActivityHeader">
                <h3>User Activity</h3>
              </div>

              <div className="lineChart">
                {/* Vertical Axis Labels */}
                <div className="yAxis">
                  {[0, 400, 800, 1200].map((value, index) => (
                    <span key={index} className="yAxisLabel">
                      {value === 1200 ? "1.2k" : value === 2000 ? "2k" : value}
                    </span>
                  ))}
                </div>

                {/* Graph Content */}
                <svg viewBox="0 0 600 200" className="graphSvg">
                  {/* Green Line */}
                  <path
                    d="M50,150 Q200,80 550,50"
                    stroke="#28a745"
                    fill="none"
                    strokeWidth="2"
                  />
                  {/* Orange Line */}
                  <path
                    d="M50,180 Q200,150 550,70"
                    stroke="#e69500"
                    fill="none"
                    strokeWidth="2"
                  />
                </svg>

                {/* Midpoint Details */}
                <div className="midPointDetails">
                  <p className="userText">4,566</p>
                  <p className="revenueText">340 USD</p>
                </div>

                {/* Horizontal Axis Labels */}
                <div className="xAxis">
                  <span className="xAxisLabel">Sept 3</span>
                  <span className="xAxisLabel">Sept 18</span>
                  <span className="xAxisLabel">Oct 3</span>
                </div>
              </div>
            </section>

            {/* Updated Transactions Section */}
            <section className="transactionsSection">
              <div className="transactionsHeader">
                <h3 className="recentTransactions">Recent Transactions</h3>
                <span className="refundTransfer">Refund Transfer</span>
                <div className="searchBar">
                  <input
                    type="text"
                    placeholder="Search transaction..."
                    className="searchInput"
                  />
                  <button className="searchButton">
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
              <table className="transactionTable">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>User</th>
                    <th>Card</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nov 02, 2024, 3:30 PM</td>
                    <td>Received</td>
                    <td>Person</td>
                    <td>***3454</td>
                    <td>200 USD</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
