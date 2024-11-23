# Cart Timer Implementation Discussion

## Initial Problem
Needed to make the countdown timer in the cart's "Recently Removed" section update in real-time.

## Evolution of the Solution

### 1. First Attempt: Using timerTick
Initially tried using a reactive data property `timerTick` to force updates:
```vue
data() {
  return {
    timerTick: 0
  }
}
```
This approach wasn't ideal as it made the code less clear and added unnecessary complexity.

### 2. Final Solution: Vue Composition API
Simplified the implementation using Vue's Composition API:
```vue
setup() {
  const now = ref(Date.now());
  let timer = null;

  onMounted(() => {
    timer = setInterval(() => {
      now.value = Date.now();
    }, 1000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return { now };
}
```

## Performance Considerations
The implementation is efficient because:
1. Vue's reactivity system only triggers re-renders of timer elements
2. Computations are light (basic math operations)
3. 1-second intervals aren't frequent enough to cause performance issues
4. Timer only runs when there are items in `removedItems`
5. Automatically cleans up when component unmounts

## Alternative Approaches (if needed)
For high-scale scenarios:
- Use `requestAnimationFrame` with throttling
- Update less frequently (2-3 seconds)
- Calculate time differences client-side without constant updates

## Final Implementation Benefits
- Clean, maintainable code
- Efficient performance
- Follows Vue best practices
- Automatic cleanup
- Smooth real-time updates

## Related Files
- `src/views/CartPage.vue`
