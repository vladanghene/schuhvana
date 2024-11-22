<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="close">&times;</button>
        <div class="image-container">
          <button 
            v-if="hasPrevious" 
            class="nav-button prev" 
            @click="previousImage"
          >&lt;</button>
          <img :src="currentImage" :alt="imageAlt" />
          <button 
            v-if="hasNext" 
            class="nav-button next" 
            @click="nextImage"
          >&gt;</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { ref, computed } from 'vue';
import { getImageUrl } from '@/utils/imageUtils';

export default {
  name: 'ImageModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    images: {
      type: Array,
      required: true
    },
    currentIndex: {
      type: Number,
      required: true
    },
    imageAlt: {
      type: String,
      default: 'Product image'
    }
  },
  emits: ['close', 'update:currentIndex'],
  setup(props, { emit }) {
    const currentImage = computed(() => {
      if (!props.images.length) return '';
      return getImageUrl(props.images[props.currentIndex]);
    });

    const hasPrevious = computed(() => props.currentIndex > 0);
    const hasNext = computed(() => props.currentIndex < props.images.length - 1);

    const close = () => {
      emit('close');
    };

    const previousImage = () => {
      if (hasPrevious.value) {
        emit('update:currentIndex', props.currentIndex - 1);
      }
    };

    const nextImage = () => {
      if (hasNext.value) {
        emit('update:currentIndex', props.currentIndex + 1);
      }
    };

    return {
      currentImage,
      hasPrevious,
      hasNext,
      close,
      previousImage,
      nextImage
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
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: transparent;
}

.image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
}

.close-button {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: white;
  font-size: 32px;
  cursor: pointer;
  z-index: 1001;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 60px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.prev {
  left: -60px;
}

.next {
  right: -60px;
}

/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
