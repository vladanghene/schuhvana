<template>
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-text">
          <h1 class="hero-title">Find Your Perfect Pair</h1>
          <p class="hero-description">
            Discover the latest trending sneakers and timeless classics at Schuhvana.
          </p>
          <router-link to="/shop" class="cta-button">Shop Now</router-link>
        </div>
      </div>
    </section>
  </template>

  <script>
  export default {
    name: "HeroSection",
  };
  </script>

<style scoped>
  .hero-section {
    background-image: url('../assets/images/hero-image.jpg'); /* Adjust path based on your directory structure */
    background-size: 80%;
    background-position: center;
    background-repeat: no-repeat;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative; /* Position relative for overlay */
    padding: 100px 20px; /* Add padding for more vertical space */
  }

  .hero-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1; /* Ensure the overlay sits below the text */
  }
  
.hero-content {
  color: white; 
  text-align: center;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.9); /* Make the background even darker */
  padding: 30px;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 2.5rem; /* Increase font size for better readability */
  margin-bottom: 15px;
}

.hero-content p {
  font-size: 1.2rem; /* Increase paragraph size */
  margin-bottom: 20px;
}

.hero-content button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem; /* Slightly larger button font */
  margin-top: 15px;
}

.hero-content button:hover {
  background-color: #0056b3;
}
  .hero-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    padding: 20px;
  }

  .hero-text {
    max-width: 50%;
  }
  
  .hero-content button {
    background-color: #007bff; /* Ensure button stands out */
    color: white; /* Make button text white */
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

  .hero-title {
    font-size: 48px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  .hero-description {
    font-size: 18px;
    margin-bottom: 30px;
    color: #666;
  }

  .cta-button {
    padding: 10px 30px;
    font-size: 18px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }

  .cta-button:hover {
    background-color: #0056b3;
  }

  .hero-image img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }
  </style>