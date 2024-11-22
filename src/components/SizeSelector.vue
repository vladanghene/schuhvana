<template>
  <div class="size-selector">
    <div class="size-scale-selector">
      <button 
        v-for="scale in availableScales" 
        :key="scale"
        :class="{ active: currentScale === scale }"
        @click="setScale(scale)"
        class="scale-button"
      >
        {{ scale }}
      </button>
    </div>

    <div class="sizes-grid">
      <button
        v-for="size in availableSizes"
        :key="size"
        :class="{ 
          active: isSelected(size)
        }"
        @click="selectSize(size)"
        class="size-button"
      >
        {{ size }}
        <div v-if="isSelected(size)" class="size-conversions">
          <div v-for="(value, scale) in getConversions(size)" :key="scale" class="conversion">
            {{ scale }}: {{ value }}
          </div>
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
                  <th v-for="scale in availableScales" :key="scale">{{ scale }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="size in availableSizes" :key="size">
                  <td>{{ size }}</td>
                  <td v-for="scale in availableScales.filter(s => s !== 'US')" :key="scale">
                    {{ getConversions(size)[scale] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="measurement-tips">
            <h4>How to Measure</h4>
            <p>For the most accurate fit, measure your feet:</p>
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
    },
    selectedScale: {
      type: String,
      default: 'US'
    }
  },
  data() {
    return {
      currentScale: this.selectedScale,
      showConversions: true,
      showSizeGuide: false
    };
  },
  computed: {
    availableScales() {
      const sizes = this.$store.getters['products/getProductSizes'](this.product);
      return Object.keys(sizes);
    },
    availableSizes() {
      const sizes = this.$store.getters['products/getProductSizes'](this.product);
      return sizes[this.currentScale || 'US'];  // Default to US if no scale selected
    }
  },
  methods: {
    setScale(scale) {
      // Convert the current size to the new scale
      if (this.selectedSize) {
        let newSize;
        const sizeConversions = this.$store.getters['products/getProductSizeConversions'](this.product);
        
        if (this.currentScale === 'US') {
          // Converting from US to another scale
          const usSize = `US-${this.selectedSize}`;
          const conversion = sizeConversions[usSize];
          newSize = conversion ? conversion[scale] : null;
        } else if (scale === 'US') {
          // Converting to US
          // Find the US size that matches current size in current scale
          const usSize = Object.keys(sizeConversions).find(key => {
            const conversion = sizeConversions[key];
            return conversion[this.currentScale] === this.selectedSize.toString();
          });
          newSize = usSize ? parseFloat(usSize.replace('US-', '')) : null;
        } else {
          // Converting between non-US scales
          // First convert to US, then to target scale
          const usSize = Object.keys(sizeConversions).find(key => {
            const conversion = sizeConversions[key];
            return conversion[this.currentScale] === this.selectedSize.toString();
          });
          if (usSize) {
            const conversion = sizeConversions[usSize];
            newSize = conversion[scale];
          }
        }

        if (newSize !== null) {
          // Convert string sizes to numbers where appropriate
          if (['US', 'UK', 'EU', 'CM', 'IN'].includes(scale)) {
            newSize = parseFloat(newSize);
          }
          this.$emit('update:selectedSize', newSize);
        }
      }
      
      this.currentScale = scale;
    },
    selectSize(size) {
      this.$emit('update:selectedSize', size);
    },
    isSelected(size) {
      return this.selectedSize === size;
    },
    getConversions(size) {
      const sizeConversions = this.$store.getters['products/getProductSizeConversions'](this.product);
      const usSize = `US-${size}`;
      const conversion = sizeConversions[usSize];
      if (!conversion) return {};
      
      // Remove current scale from conversions and filter out null values
      return Object.fromEntries(
        Object.entries(conversion)
          .filter(([key, value]) => value != null && key !== this.currentScale)
      );
    },
    toggleSizeGuide() {
      this.showSizeGuide = !this.showSizeGuide;
    }
  }
};
</script>

<style scoped>
.size-selector {
  margin: 1rem 0;
}

.size-scale-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.scale-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.scale-button.active {
  background: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

.sizes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.size-button {
  position: relative;
  padding: 0.75rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.size-button:hover {
  border-color: #2c3e50;
}

.size-button.active {
  background: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

.size-conversions {
  display: none;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
}

.size-button:hover .size-conversions {
  display: block;
  opacity: 1;
}

.size-conversions::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px;
  height: 10px;
  background: white;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.conversion {
  font-size: 0.9rem;
  color: #666;
  margin: 0.25rem 0;
}

.size-guide-button {
  background: none;
  border: none;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  padding: 0.5rem;
}

.size-guide-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.size-guide-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.size-chart {
  margin: 1rem 0;
  overflow-x: auto;
}

.size-chart table {
  width: 100%;
  border-collapse: collapse;
  min-width: 500px;
}

.size-chart th,
.size-chart td {
  padding: 0.75rem;
  text-align: center;
  border: 1px solid #ddd;
}

.size-chart th {
  background: #f8f9fa;
  font-weight: 600;
}

.measurement-tips {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
}

.measurement-tips h4 {
  margin-bottom: 1rem;
}

.measurement-tips ol {
  padding-left: 1.5rem;
}

.measurement-tips li {
  margin: 0.5rem 0;
  color: #666;
}
</style>
