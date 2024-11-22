<template>
  <div v-show="isReady" class="product-card">
    <div v-if="product" class="product-content">
      <router-link 
        :to="{ name: 'ProductPage', params: { id: product.id } }" 
        class="product-link"
        v-if="product.id"
      >
        <div class="image-container">
          <img 
            :src="imageUrl" 
            :alt="product.name"
            @error="handleImageError"
          />
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="price">${{ product.price }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getImageUrl, DEFAULT_SHOE_IMAGE } from '@/utils/imageUtils';
import { useStore } from 'vuex';

export default {
  name: 'SingleProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const isReady = ref(false);
    const imageUrl = ref('');
    const imageLoadError = ref(false);

    const processImageUrl = (url) => {
      if (!url || imageLoadError.value) {
        return DEFAULT_SHOE_IMAGE;
      }
      return getImageUrl(url);
    };


    };

    const initializeComponent = () => {
      try {
        imageUrl.value = processImageUrl(props.product?.image);
        isReady.value = true;
      } catch (error) {
        console.error('Error initializing product card:', error);
        imageUrl.value = DEFAULT_SHOE_IMAGE;
        isReady.value = true;
      }
    };

    const handleImageError = (e) => {
      console.warn(`Failed to load image: ${props.product?.image}`);
      imageLoadError.value = true;
      if (e.target) {
        e.target.src = DEFAULT_SHOE_IMAGE;
      }
    };

    onMounted(() => {
      initializeComponent();
    });

    return {
      isReady,
      imageUrl,
      imageLoadError,
      handleImageError
    };
  }
};
</script>

<style scoped>
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #d0d0d0;
}

.product-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.image-container {
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative;
  overflow: hidden;
  background: #f8f8f8;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .image-container img {
  transform: scale(1.05);
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
  background: white;
}

.product-info h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
}

.price {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
}

@media (max-width: 768px) {
  .product-info {
    padding: 1rem;
  }

  .product-info h3 {
    font-size: 1rem;
  }

  .price {
    font-size: 1.1rem;
  }
}
</style>
