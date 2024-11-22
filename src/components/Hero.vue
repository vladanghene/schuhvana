<template>
  <section class="hero">
    <div class="hero-content">
      <h1>Step into Greatness</h1>
      <p>Discover premium Nike footwear for every passion</p>
      <router-link to="/category/all" class="cta-button">
        Shop Now
      </router-link>
    </div>
    <div class="hero-image">
      <img src="/assets/images/products/nike/air-force-1/af1-1.jpg" alt="Featured Shoe">
    </div>
  </section>
</template>

<script>
export default {
  name: 'Hero'
}
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 4rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  border-radius: 12px;
  margin-bottom: 3rem;
  overflow: hidden;
  min-height: 400px;
}

.hero-content {
  flex: 1;
  padding-right: 2rem;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.hero-content p {
  font-size: 1.25rem;
  color: #4a4a4a;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #1a1a1a;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #333;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  transform: rotate(-15deg) scale(1.2);
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.2));
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    padding: 2rem;
    text-align: center;
  }

  .hero-content {
    padding-right: 0;
    margin-bottom: 2rem;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-image img {
    transform: rotate(-15deg) scale(1);
  }
}
</style>
