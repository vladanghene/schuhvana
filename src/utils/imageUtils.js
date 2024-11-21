// Import default image
const DEFAULT_IMAGE = '/assets/images/default-shoe.jpg';

/**
 * Process a product image URL, handling various path formats and providing fallback
 * @param {string} path - The relative path to the product image
 * @returns {string} The processed image URL
 */
export const getProductImageUrl = (path) => {
  if (!path) return DEFAULT_IMAGE;
  
  try {
    // Handle absolute URLs and data URLs
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }

    // Handle relative paths starting with /
    if (path.startsWith('/')) {
      return path;
    }

    // For all other images, assume they're in the assets/images directory
    return `/assets/images/${path}`;
  } catch (error) {
    console.error('Error processing product image URL:', error, path);
    return DEFAULT_IMAGE;
  }
};

/**
 * Process a category image URL, handling various path formats and providing fallback
 * @param {string} path - The relative path to the category image
 * @returns {string} The processed image URL
 */
export const getCategoryImageUrl = (path) => {
  if (!path) return DEFAULT_IMAGE;
  
  try {
    // Handle absolute URLs and data URLs
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }

    // Handle relative paths starting with /
    if (path.startsWith('/')) {
      return path;
    }

    // For all other images, assume they're in the assets/images directory
    return `/assets/images/${path}`;
  } catch (error) {
    console.error('Error processing category image URL:', error, path);
    return DEFAULT_IMAGE;
  }
};

export const DEFAULT_SHOE_IMAGE = DEFAULT_IMAGE;
