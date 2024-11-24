<template>
  <div class="size-selector">
    <div class="sizes-grid">
      <button
        v-for="size in availableSizes"
        :key="size"
        :class="{ 
          active: isSelected(size)
        }"
        @click="selectSize(size)"
        @mouseenter="startConversions(size)"
        @mouseleave="stopConversions(size)"
        class="size-button"
      >
        <div class="size-content">
          <span class="size-text">
            {{ getCurrentDisplay(size) }}
          </span>
        </div>
      </button>
    </div>

    <div class="size-guide">
      <button @click="toggleSizeGuide" class="size-guide-button">
        Size Guide
      </button>
      <div v-if="showSizeGuide" class="size-guide-modal">
        <div class="size-guide-content">
          <button class="close-button" @click="toggleSizeGuide">&times;</button>
          <h3>Size Guide</h3>
          <div class="size-chart">
            <p class="size-type">Size Type: {{ product.sizeType }}</p>
            <table>
              <thead>
                <tr>
                  <th v-for="scale in scaleOrder" :key="scale">{{ scale }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="size in availableSizes" :key="size">
                  <td v-for="scale in scaleOrder" :key="scale">
                    {{ scale === currentScale ? size : getConversions(size)[scale] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="measurement-tips">
            <h4>How to Measure</h4>
            <ol>
              <li>Measure in the afternoon (feet swell during the day)</li>
              <li>Wear socks you plan to wear with the shoes</li>
              <li>Measure both feet and use the larger measurement</li>
              <li>Stand while measuring for accurate size</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'SizeSelector',
  props: {
    product: {
      type: Object,
      required: true
    },
    selectedSize: {
      type: [Number, String],
      default: null
    },
    defaultScale: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      showSizeGuide: false,
      hoveredSize: null,
      conversionIndex: 0,
      conversionInterval: null,
      debug: false
    };
  },
  computed: {
    ...mapState('user', ['userPreferredScale']),
    ...mapGetters('products', ['getAvailableScales', 'getSizeConversions', 'getProductSizes']),
    
    currentScale() {
      return this.userPreferredScale;
    },

    availableSizes() {
      if (!this.product) return [];
      const sizes = this.getProductSizes(this.product);
      return sizes[this.currentScale] || sizes.EU || [];
    },

    scaleOrder() {
      return ['EU', 'US', 'UK', 'CM'];
    }
  },
  methods: {
    startConversions(size) {
      this.hoveredSize = size;
      // Start with current scale
      const scales = this.scaleOrder;
      this.conversionIndex = scales.indexOf(this.currentScale);
      
      // Clear any existing interval
      if (this.conversionInterval) {
        clearInterval(this.conversionInterval);
      }
      
      this.conversionInterval = setInterval(() => {
        // Move to next scale
        this.conversionIndex = (this.conversionIndex + 1) % scales.length;
      }, 2000);
    },
    stopConversions(size) {
      // Only stop if size is not selected and we're stopping hover on this size
      if (this.hoveredSize === size && !this.isSelected(size)) {
        this.hoveredSize = null;
        // Reset to current scale
        this.conversionIndex = this.scaleOrder.indexOf(this.currentScale);
        if (this.conversionInterval) {
          clearInterval(this.conversionInterval);
          this.conversionInterval = null;
        }
      }
    },
    getCurrentDisplay(size) {
      // If size is selected or being hovered, show cycling conversions
      if (this.isSelected(size) || this.hoveredSize === size) {
        const conversions = this.getConversions(size);
        const scale = this.scaleOrder[this.conversionIndex];
        
        if (scale && conversions && scale in conversions) {
          const value = conversions[scale];
          return `${scale}: ${value}`;
        }
      }
      
      // Otherwise show current scale value
      return this.getConversionValue(size);
    },
    selectSize(size) {
      // If clicking the same size, deselect it
      if (this.isSelected(size)) {
        this.$emit('update:selectedSize', null);
        // Clear conversion cycling
        this.stopConversions(size);
      } else {
        this.$emit('update:selectedSize', size);
        // Start cycling conversions for selected size
        this.startConversions(size);
      }
    },
    isSelected(size) {
      return String(this.selectedSize) === String(size);
    },
    getConversions(size) {
      const conversions = this.getSizeConversions(size, this.product);
      return conversions || { EU: size };
    },
    getConversionValue(size) {
      const conversions = this.getConversions(size);
      // If we have conversions and the target scale exists in them, use that
      if (conversions && this.currentScale in conversions) {
        const result = conversions[this.currentScale];
        return result;
      }
      // If we're in EU scale, return as number, otherwise as string
      return this.currentScale === 'EU' ? Number(size) : String(size);
    },
    toggleSizeGuide() {
      this.showSizeGuide = !this.showSizeGuide;
    }
  },
  beforeUnmount() {
    if (this.conversionInterval) {
      clearInterval(this.conversionInterval);
    }
    // Clean up any remaining state
    this.showSizeGuide = false;
    this.hoveredSize = null;
  }
};
</script>

<style scoped>
.size-selector {
  margin: 1rem 0;
}

.sizes-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-items: center;
}

.size-button {
  margin: 0.25rem;
  padding: 0.4rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-width: 4.5em;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.size-button:hover:not(.active) {
  border-color: #3b82f6;
  color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.size-button.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
  font-weight: 500;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}

.size-button.active:hover {
  background: #1d4ed8;
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.4);
}

.size-content {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  line-height: 1;
}

.size-text {
  font-size: 0.9rem;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.conversions {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
  white-space: nowrap;
  font-size: 0.8rem;
}

.conversions div {
  padding: 0.2rem 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.size-guide-button {
  background: none;
  border: none;
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 0.9rem;
}

.size-guide-button:hover {
  color: #3b82f6;
}

.size-guide-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.size-guide-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  line-height: 1;
  transition: color 0.2s;
}

.close-button:hover {
  color: #2563eb;
}

.size-chart {
  margin-top: 1rem;
}

.size-chart table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.size-chart th,
.size-chart td {
  padding: 0.75rem 1rem;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.size-chart th {
  background-color: #2563eb;
  color: white;
  font-weight: 500;
}

.size-chart tr:nth-child(even) {
  background-color: #f8fafc;
}

.size-chart tr:hover {
  background-color: #eff6ff;
}

.size-type {
  margin-bottom: 1rem;
  font-weight: 500;
  color: #4b5563;
}

.measurement-tips {
  margin-top: 2rem;
  padding: 1rem;
  background: #eff6ff;
  border-radius: 0.375rem;
  border: 1px solid #bfdbfe;
}

.measurement-tips h4 {
  color: #2563eb;
  margin-bottom: 0.5rem;
}

.measurement-tips ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.measurement-tips li {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.measurement-tips li::before {
  content: "•";
  color: #2563eb;
  position: absolute;
  left: 0.5rem;
}

@media (max-width: 640px) {
  .sizes-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 480px) {
  .sizes-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
