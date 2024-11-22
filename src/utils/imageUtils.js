// Import default image
const DEFAULT_IMAGE = '/assets/images/default-shoe.jpg';
const BASE_URL = '/assets/images';

/**
 * Process an image URL, handling various path formats and providing fallback
 * @param {string} path - The relative path to the image
 * @returns {string} The processed image URL
 */
export const getImageUrl = (path) => {
  if (!path) return DEFAULT_IMAGE;
  
  try {
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_URL}/${normalizedPath}`;
  } catch (error) {
    console.error('Error processing image URL:', error, path);
    return DEFAULT_IMAGE;
  }
};

export { DEFAULT_IMAGE as DEFAULT_SHOE_IMAGE };
