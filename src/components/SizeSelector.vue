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
          <Transition name="fade" mode="out-in">
            <span :key="currentScale + size" v-if="isSelected(size) || hoveredSize === size" class="size-text">
              {{ currentScale }}: {{ getConversionValue(size) }}
            </span>
            <span v-else class="size-text">
              {{ size }}
            </span>
          </Transition>
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
            <table>
              <thead>
                <tr>
                  <th>US</th>
                  <th>UK</th>
                  <th>EU</th>
                  <th>CM</th>
                  <th>IN</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="size in availableSizes" :key="size">
                  <td>{{ size }}</td>
                  <td>{{ getConversions(size).UK }}</td>
                  <td>{{ getConversions(size).EU }}</td>
                  <td>{{ getConversions(size).CM }}</td>
                  <td>{{ getConversions(size).IN }}</td>
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
    }
  },
  data() {
    return {
      showSizeGuide: false,
      currentConversionIndex: 0,
      conversionInterval: null,
      currentScale: 'US',
      hoveredSize: null,
      scaleOrder: ['US', 'UK', 'EU', 'CM', 'IN'],
      selectedInterval: null,
      debug: false // For debugging purposes
    };
  },
  computed: {
    availableSizes() {
      const sizes = this.$store.getters['products/getProductSizes'](this.product);
      return sizes.US || [];
    }
  },
  watch: {
    // Debug watcher to track state changes
    hoveredSize(newVal, oldVal) {
      if (this.debug) console.log('hoveredSize changed:', oldVal, '->', newVal);
    },
    currentScale(newVal, oldVal) {
      if (this.debug) console.log('currentScale changed:', oldVal, '->', newVal);
    },
    selectedSize: {
      immediate: true,
      handler(newSize) {
        if (newSize) {
          this.startSelectedCycle(newSize);
        } else {
          this.clearSelectedInterval();
        }
      }
    }
  },
  methods: {
    startConversions(size) {
      if (this.debug) console.log('startConversions called for size:', size);
      
      // Don't start hover cycle if size is selected
      if (this.isSelected(size)) return;
      
      // Don't start if already cycling for this size
      if (this.hoveredSize === size && this.conversionInterval) {
        if (this.debug) console.log('Already cycling for size:', size);
        return;
      }
      
      // Clear any existing hover interval
      this.clearConversionInterval();
      
      // Set initial state for hover
      this.hoveredSize = size;
      this.currentConversionIndex = 0;
      this.currentScale = this.scaleOrder[0];
      
      if (this.debug) console.log('Starting hover interval for size:', size);
      
      // Start new hover interval
      this.conversionInterval = setInterval(() => {
        if (!this.hoveredSize || this.isSelected(this.hoveredSize)) {
          if (this.debug) console.log('Clearing hover interval');
          this.clearConversionInterval();
          return;
        }
        
        this.currentConversionIndex = (this.currentConversionIndex + 1) % this.scaleOrder.length;
        this.currentScale = this.scaleOrder[this.currentConversionIndex];
        
        if (this.debug) console.log('Hover interval tick:', this.currentScale);
      }, 2000);
    },
    stopConversions(size) {
      if (this.debug) console.log('stopConversions called for size:', size);
      
      // Don't stop if this size is selected
      if (this.isSelected(size)) return;
      
      // Only stop if this is the currently hovered size
      if (this.hoveredSize === size) {
        if (this.debug) console.log('Stopping conversions for size:', size);
        this.clearConversionInterval();
        this.resetConversionState();
      }
    },
    startSelectedCycle(size) {
      if (this.debug) console.log('Starting selected cycle for size:', size);
      
      // Clear any existing intervals
      this.clearSelectedInterval();
      this.clearConversionInterval();
      
      // Set initial state
      this.currentConversionIndex = 0;
      this.currentScale = this.scaleOrder[0];
      
      // Start new interval for selected size
      this.selectedInterval = setInterval(() => {
        this.currentConversionIndex = (this.currentConversionIndex + 1) % this.scaleOrder.length;
        this.currentScale = this.scaleOrder[this.currentConversionIndex];
        
        if (this.debug) console.log('Selected interval tick:', this.currentScale);
      }, 2000);
    },
    selectSize(size) {
      if (this.debug) console.log('selectSize called for size:', size);
      this.$emit('update:selectedSize', size);
    },
    clearConversionInterval() {
      if (this.conversionInterval) {
        if (this.debug) console.log('Clearing hover interval');
        clearInterval(this.conversionInterval);
        this.conversionInterval = null;
      }
    },
    clearSelectedInterval() {
      if (this.selectedInterval) {
        if (this.debug) console.log('Clearing selected interval');
        clearInterval(this.selectedInterval);
        this.selectedInterval = null;
      }
    },
    resetConversionState() {
      if (this.debug) console.log('Resetting conversion state');
      this.hoveredSize = null;
      this.currentScale = 'US';
      this.currentConversionIndex = 0;
    },
    isSelected(size) {
      return String(this.selectedSize) === String(size);
    },
    getConversionValue(size) {
      const sizeType = this.product.sizeType || 'men-regular';
      const sizeKey = `US-${String(size)}`;
      const conversions = this.$store.state.products.standardSizes[sizeType]?.sizeConversions[sizeKey];
      
      if (!conversions) return size;
      
      switch (this.currentScale) {
        case 'US':
          return size;
        case 'UK':
        case 'EU':
        case 'CM':
        case 'IN':
          return conversions[this.currentScale] || size;
        default:
          return size;
      }
    },
    getConversions(size) {
      const sizeType = this.product.sizeType || 'men-regular';
      const sizeKey = `US-${String(size)}`;
      const conversions = this.$store.state.products.standardSizes[sizeType]?.sizeConversions[sizeKey] || {};
      
      return {
        US: String(size),
        ...conversions
      };
    },
    toggleSizeGuide() {
      this.showSizeGuide = !this.showSizeGuide;
    }
  },
  beforeUnmount() {
    this.clearConversionInterval();
    this.clearSelectedInterval();
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
  position: relative;
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
  width: 4.5em;
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
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  letter-spacing: -0.01em;
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
