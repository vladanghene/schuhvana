<template>
    <aside class="sidebar">
      <h3>Filter by</h3>
      <div class="filter-category">
        <h4>Category</h4>
        <ul>
          <li v-for="category in categories" :key="category">
            <input
              type="checkbox"
              :value="category"
              v-model="selectedCategories"
              @change="applyFilter"
            />
            {{ category }}
          </li>
        </ul>
      </div>
  
      <div class="filter-price">
        <h4>Price Range</h4>
        <input
          type="range"
          v-model="priceRange"
          min="0"
          max="500"
          step="10"
          @change="applyFilter"
        />
        <p>Price: {{ priceRange }}</p>
      </div>
    </aside>
  </template>
  
  <script>
  export default {
    data() {
      return {
        categories: ['Sneakers', 'Running', 'Casual', 'Formal'],
        selectedCategories: [],
        priceRange: 100,
      };
    },
    methods: {
      applyFilter() {
        const filters = {
          categories: this.selectedCategories,
          priceRange: this.priceRange,
        };
        this.$emit('filter-changed', filters);
      },
    },
  };
  </script>
  
  <style scoped>
  .sidebar {
    padding: 1rem;
    background-color: #f4f4f4;
    border-right: 1px solid #ccc;
    min-width: 200px;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .filter-category,
  .filter-price {
    margin-bottom: 1.5rem;
  }
  
  .filter-category ul {
    list-style-type: none;
    padding: 0;
  }
  
  .filter-category li {
    margin-bottom: 0.5rem;
  }
  </style>