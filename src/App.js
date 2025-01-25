import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Import star icons
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="logo">Spark-Review</div>
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
              Contact Us
            </NavLink>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/details" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);  // Set to 5 products per page

  const navigate = useNavigate(); // Add this to handle navigation

  // Fetch products on page load
  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Handle product click to navigate to the product details page
  const handleImageClick = (product) => {
    navigate("/details", { state: { product } });
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="app">
      <div className="heading-box">
        <h1>Product Reviews</h1>
        <p className="tagline">Inspire more people to buy with customer reviews and ratings.</p>
      </div>
      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}
      <div className="product-grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card" onClick={() => handleImageClick(product)}>
            <img src={product.image} alt={product.title} className="product-thumbnail" />
            <h3>{product.title}</h3>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}



// About Page Component
function About() {
  return (
    <div className="page about-page">
      <h2>About Us</h2>
      <p>
        Welcome to Spark Review, your trusted platform for honest and comprehensive product insights. We aim to empower
        customers to make informed decisions by providing reliable reviews, ratings, and detailed product information.
      </p>
      <p>
        At Spark Review, we believe that every purchase tells a story, and our mission is to inspire trust and confidence
        in every customer. Whether you're exploring trending items or seeking authentic recommendations, we're here to
        guide you every step of the way. Together, let's create a community where reviews spark smarter choices and brighter
        connections.
      </p>
    </div>
  );
}

// Contact Page Component
function Contact() {
  return (
    <div className="page contact-page">
      <h2>Contact Us</h2>
      <p>Email us at <a href="mailto:support@sparkreview.com">support@sparkreview.com</a> or call us at +1 234 567 890.</p>
      <p>We'd love to hear from you!</p>
    </div>
  );
}

// Product Details Page Component with Star Ratings
function ProductDetails() {
  const location = useLocation();
  const product = location.state?.product;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <FaStar key={`full-${index}`} color="#FFD700" />
          ))}
        {halfStar && <FaStarHalfAlt color="#FFD700" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <FaRegStar key={`empty-${index}`} color="#FFD700" />
          ))}
      </>
    );
  };

  if (!product) {
    return <p>No product details available.</p>;
  }

  return (
    <div className="details-page">
      <h2>{product.title}</h2>
      <img src={product.image} alt={product.title} className="details-product-image" />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>
        Rating: {renderStars(product.rating.rate)} ({product.rating.count} reviews)
      </p>
      <button onClick={() => window.history.back()} className="back-button">
        Go Back
      </button>
    </div>
  );
}

export default App;
