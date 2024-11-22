<template>
  <div v-show="isReady" class="product-card">
    <div v-if="product" class="product-content">
      <router-link 
        :to="{ name: 'ProductPage', params: { id: product.id } }" 
        class="product-link"
        v-if="product.id"
      >
        <div class="product-image">
          <img 
            :src="imageUrl" 
            :alt="product.name"
            @error="handleImageError"
          />
          <div class="product-name">
            <h3>{{ product.name }}</h3>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getImageUrl, DEFAULT_SHOE_IMAGE } from '@/utils/imageUtils';

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

.product-card:hover .product-image img {
  transform: scale(1.15);
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

.product-image {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-name {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(37, 99, 235, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: fit-content;
  display: inline-block;
}

.product-name h3 {
  color: white;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
}

@media (max-width: 768px) {
  .product-name {
    padding: 0.35rem 0.75rem;
  }

  .product-name h3 {
    font-size: 0.9rem;
  }
}
</style>
