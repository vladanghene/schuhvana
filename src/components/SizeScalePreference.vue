<template>
  <div class="size-scale-preference">
    <label for="sizeScale">Preferred Size Scale:</label>
    <select 
      id="sizeScale" 
      v-model="selectedScale" 
      @change="updatePreference"
      class="scale-selector"
    >
      <option v-for="scale in availableScales" :key="scale" :value="scale">
        {{ scale }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'SizeScalePreference',
  data() {
    return {
      selectedScale: null
    };
  },
  computed: {
    ...mapState('user', ['userPreferredScale']),
    ...mapGetters('products', ['getAvailableScales']),
    availableScales() {
      return this.getAvailableScales;
    }
  },
  methods: {
    ...mapActions('user', ['updatePreferredScale']),
    updatePreference() {
      if (this.selectedScale) {
        this.updatePreferredScale(this.selectedScale);
      }
    }
  },
  created() {
    this.selectedScale = this.userPreferredScale || 'EU';
  }
};
</script>

<style scoped>
.size-scale-preference {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
}

.scale-selector {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

label {
  font-weight: 500;
}
</style>
