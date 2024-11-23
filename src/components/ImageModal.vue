<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">&times;</button>
      
      <div class="image-container">
        <button 
          v-if="hasPrevious" 
          class="nav-button prev" 
          @click="previousImage"
        >&lt;</button>
        
        <img 
          :src="currentImage" 
          :alt="altText"
          @error="handleImageError" 
          class="main-image"
        />
        
        <button 
          v-if="hasNext" 
          class="nav-button next" 
          @click="nextImage"
        >&gt;</button>
      </div>

      <div v-if="showThumbnails && images.length > 1" class="thumbnails">
        <img 
          v-for="(img, index) in images" 
          :key="index"
          :src="getThumbnailUrl(img)"
          :alt="'Thumbnail ' + (index + 1)"
          :class="{ active: index === currentIndex }"
          @click="setCurrentImage(index)"
          @error="handleThumbnailError($event, index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getImageUrl, getThumbnailUrl, DEFAULT_IMAGE } from '@/utils/imageUtils';

export default {
  name: 'ImageModal',
  
  props: {
    show: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: () => []
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    showThumbnails: {
      type: Boolean,
      default: true
    },
    altText: {
      type: String,
      default: 'Product Image'
    }
  },

  setup(props, { emit }) {
    const currentIndex = ref(props.initialIndex);

    // Computed properties for navigation
    const hasPrevious = computed(() => currentIndex.value > 0);
    const hasNext = computed(() => currentIndex.value < props.images.length - 1);
    
    // Get current image URL with fallback
    const currentImage = computed(() => {
      if (!props.images.length) return DEFAULT_IMAGE;
      return getImageUrl(props.images[currentIndex.value]);
    });

    // Navigation methods
    const previousImage = () => {
      if (hasPrevious.value) {
        currentIndex.value--;
      }
    };

    const nextImage = () => {
      if (hasNext.value) {
        currentIndex.value++;
      }
    };

    const setCurrentImage = (index) => {
      if (index >= 0 && index < props.images.length) {
        currentIndex.value = index;
      }
    };

    // Event handlers
    const closeModal = () => {
      emit('close');
    };

    const handleImageError = (event) => {
      event.target.src = DEFAULT_IMAGE;
    };

    const handleThumbnailError = (event, index) => {
      event.target.src = DEFAULT_IMAGE;
      console.error(`Failed to load thumbnail ${index}`);
    };

    // Keyboard navigation
    const handleKeydown = (event) => {
      if (!props.show) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          previousImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          closeModal();
          break;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown);
    });

    return {
      currentIndex,
      currentImage,
      hasPrevious,
      hasNext,
      previousImage,
      nextImage,
      setCurrentImage,
      closeModal,
      handleImageError,
      handleThumbnailError,
      getThumbnailUrl
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1;
}

.image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.9);
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  overflow-x: auto;
  padding: 10px 0;
}

.thumbnails img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.thumbnails img.active {
  border-color: #4CAF50;
}

.thumbnails img:hover {
  border-color: #81C784;
}
</style>
