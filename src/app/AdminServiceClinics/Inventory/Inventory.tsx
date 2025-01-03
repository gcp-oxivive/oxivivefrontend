'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For navigation
import "./Inventory.css";
import Sidebar from "../Sidebar/page";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Inventory = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    stock: "",
    product_price: "",
    product_image: null, // New field for image
  });
  const [isLoading, setIsLoading] = useState(true); // State for loading

  // Fetch existing inventory data from the backend
  useEffect(() => {
    fetch("https://inventorymanagementservice-69668940637.asia-east1.run.app/api/inventory/")
      .then((response) => response.json())
      .then((data) => {
        setInventory(data);
        setFilteredInventory(data); // Initialize filtered data
        setIsLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.error("Error fetching inventory:", err);
        setIsLoading(false); // Stop loading even if there's an error
      });
  }, []);

  const handleAddItemsClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, product_image: e.target.files[0] });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = null;

      // Upload the image to Cloudinary if provided
      if (formData.product_image) {
        const cloudinaryData = new FormData();
        cloudinaryData.append("file", formData.product_image);
        cloudinaryData.append("upload_preset", "Deepanshu Images");

        const cloudinaryResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dteb8cqso/image/upload",
          {
            method: "POST",
            body: cloudinaryData,
          }
        );

        const cloudinaryResult = await cloudinaryResponse.json();
        imageUrl = cloudinaryResult.secure_url; // Save the secure URL
      }

      // Send data to your backend
      const formDataToSend = {
        product_name: formData.product_name,
        stock: formData.stock,
        product_price: formData.product_price,
        product_image: imageUrl,
      };

      const response = await fetch("https://inventorymanagementservice-69668940637.asia-east1.run.app/api/inventory/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        alert(response.status === 200 ? "Product updated successfully!" : "Product added successfully!");

        // Fetch the updated inventory list
        const updatedInventory = await fetch("https://inventorymanagementservice-69668940637.asia-east1.run.app/api/inventory/")
          .then((res) => res.json())
          .catch((err) => {
            console.error("Error fetching updated inventory:", err);
            return inventory; // fallback to current inventory if fetching fails
          });

        setInventory(updatedInventory);
        setFilteredInventory(updatedInventory); // Update filtered inventory
        setFormData({ product_name: "", stock: "", product_price: "", product_image: null });
        setShowPopup(false);
      } else {
        console.error("Failed to add or update item");
      }
    } catch (error) {
      console.error("Error adding or updating item:", error);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = inventory.filter((item) =>
      item.product_name.toLowerCase().startsWith(searchTerm)
    );
    setFilteredInventory(filtered);
  };

  // Calculate dynamic numbers for stock section
  const lowStockItems = inventory.filter((item) => item.stock < 15);
  const itemCategoriesCount = inventory.length;

  return (
    <div className="inventory-container">
      <Sidebar />
      <main className="main-content1">
        {isLoading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <header className="header3">
              <h1>Recent Activity</h1>
              <input
                type="text"
                placeholder="Search by product name..."
                className="search-bar3"
                onChange={handleSearch}
              />
            </header>

            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="card1">
                <p className="count">{itemCategoriesCount}</p>
                <p>Total</p>
                <span>NEW ITEMS</span>
              </div>
              <div
                className="card1"
                onClick={() => router.push('/AdminServiceClinics/Inventorys')} // Navigate to the inventorys page
                style={{ cursor: 'pointer' }} // Makes the card look clickable
              >
                <p className="count">4</p>
                <p>Vendors</p>
                <span>NEW MESSAGE</span>
              </div>
              <div className="card1">
                <p className="count">1</p>
                <p>Vendor</p>
                <span>REFUNDS</span>
              </div>
            </div>

            <div className="content-section">
              <section className="inventory-table">
                <table>
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>Product Name</th>
                      <th>Stock</th>
                      <th>Product Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.product_name}</td>
                        <td>{item.stock}</td>
                        <td>{item.product_price} Rs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              <div className="side-panel">
                {/* Item Categories */}
                <div className="categories">
                  <h2>Item Categories List</h2>
                  <div className="icons-grid">
                    {inventory.map((item) => (
                      <div key={item.product_id} className="category-item">
                        <img src={item.product_image} alt={item.product_name} className="category-image" />
                        <p>{item.product_name}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    className="add-items"
                    onClick={handleAddItemsClick}
                  >
                    + Add Items
                  </button>
                </div>

                {/* Stock Numbers */}
                <div className="stock-numbers">
                  <h2>Stock Numbers</h2>
                  <p>
                    Low Stock Items:{" "}
                    {lowStockItems.length > 0 ? (
                      lowStockItems.map((item) => (
                        <span key={item._id}>
                          {item.product_name}: {item.stock}{" "}
                        </span>
                      ))
                    ) : (
                      <span className="highlight">0</span>
                    )}
                  </p>
                  <p>Item Categories: <span className="highlight">{itemCategoriesCount}</span></p>
                  <p>Refunded Items: <span className="highlight">2</span></p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {showPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Add New Item</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                Product Name:
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </label>
              <label>
                Stock:
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Enter stock"
                  required
                />
              </label>
              <label>
                Product Price:
                <input
                  type="text"
                  name="product_price"
                  value={formData.product_price}
                  onChange={handleInputChange}
                  placeholder="Enter product price"
                  required
                />
              </label>
              <label>
                Product Image:
                
                <div
                  className={`input-field upload-field ${
                    formData.product_image ? "has-image" : ""
                  }`}
                >
                  <label htmlFor="product-image">
                    <span className="camera-plus-icon">
                      <i className="fas fa-camera"></i>
                    </span>
                    {formData.product_image ? formData.product_image.name : "Upload Product Image"}
                  </label>
                  <input
                    type="file"
                    id="product-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }} 
                  />
                </div>
              </label>
              <button type="submit">Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
