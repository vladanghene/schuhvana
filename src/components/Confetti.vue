<template>
  <div class="confetti-container" v-if="isActive" :style="containerStyle">
    <div v-for="i in particleCount" :key="i" class="confetti" :style="getParticleStyle(i)"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

export default {
  name: 'Confetti',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 1000
    },
    mouseX: {
      type: Number,
      required: true
    },
    mouseY: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      default: 'add', // 'add' for blue, 'restore' for green
      validator: value => ['add', 'restore'].includes(value)
    }
  },
  setup(props) {
    const particleCount = 50;
    const colorSchemes = {
      add: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#fff'],
      restore: ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#fff']
    };

    const containerStyle = computed(() => ({
      left: `${props.mouseX}px`,
      top: `${props.mouseY}px`
    }));

    const getParticleStyle = (i) => {
      const colors = colorSchemes[props.type];
      const r = (i % colors.length);
      const randomX = (Math.random() - 0.5) * 2000;
      const randomY = (Math.random() - 0.5) * 2000;
      const randomRotate = Math.random() * 360;
      const randomScale = 0.3 + Math.random() * 0.4;
      
      return {
        '--x': `${randomX}%`,
        '--y': `${randomY}%`,
        '--rotate': `${randomRotate}deg`,
        '--scale': randomScale,
        '--color': colors[r],
        '--duration': '0.6s'
      };
    };

    return {
      particleCount,
      getParticleStyle,
      containerStyle
    };
  }
};
</script>

<style scoped>
.confetti-container {
  position: fixed;
  pointer-events: none;
  z-index: 1000;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--color);
  transform-origin: center;
  opacity: 0;
  animation: confetti-explosion var(--duration) cubic-bezier(0.45, 0, 0.55, 1) forwards;
}

@keyframes confetti-explosion {
  0% {
    transform: translate(0, 0) scale(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
    transform: translate(0, 0) scale(1) rotate(var(--rotate));
  }
  35% {
    opacity: 0.8;
  }
  60% {
    opacity: 0.6;
  }
  75% {
    opacity: 0.4;
  }
  100% {
    transform: 
      translate(
        var(--x), 
        var(--y)
      )
      scale(var(--scale))
      rotate(calc(var(--rotate) * 1.5));
    opacity: 0;
  }
}
</style>
