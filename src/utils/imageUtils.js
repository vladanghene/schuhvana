// Import default image
const BASE_URL = process.env.VUE_APP_BASE_URL || '';
const IMAGES_PATH = '/assets/images';
const DEFAULT_IMAGE = `${BASE_URL}${IMAGES_PATH}/default-shoe.jpg`;

/**
 * Process an image URL, handling various path formats and providing fallback
 * @param {string} imagePath - The relative path to the image
 * @returns {string} The processed image URL
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return DEFAULT_IMAGE;
  
  // Handle absolute URLs
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Handle relative paths
  try {
    // Since product images are now in a subdirectory structure,
    // we just need to ensure they're under the assets/images path
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${BASE_URL}${IMAGES_PATH}/${path}`;
  } catch (e) {
    console.error('Invalid image path:', imagePath);
    return DEFAULT_IMAGE;
  }
}

/**
 * Validate an image by checking if it can be loaded
 * @param {string} imagePath - The relative path to the image
 * @returns {Promise<boolean>} A promise resolving to true if the image is valid, false otherwise
 */
export function validateImage(imagePath) {
  return new Promise((resolve) => {
    if (!imagePath) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => {
      console.warn(`Failed to load image: ${imagePath}`);
      resolve(false);
    };
    img.src = getImageUrl(imagePath);
  });
}

/**
 * Get a valid image URL, falling back to a default image if the provided path is invalid
 * @param {string} imagePath - The relative path to the image
 * @param {string} fallbackImage - The fallback image URL (defaults to DEFAULT_IMAGE)
 * @returns {Promise<string>} A promise resolving to the valid image URL or the fallback image URL
 */
export async function getValidImageUrl(imagePath, fallbackImage = DEFAULT_IMAGE) {
  const isValid = await validateImage(imagePath);
  return isValid ? getImageUrl(imagePath) : fallbackImage;
}

/**
 * Get a thumbnail URL for an image
 * @param {string} imagePath - The relative path to the image
 * @param {string} size - The size of the thumbnail (small, medium, large)
 * @returns {string} The thumbnail URL
 */
export function getThumbnailUrl(imagePath, size = 'small') {
  const baseUrl = getImageUrl(imagePath);
  if (baseUrl === DEFAULT_IMAGE) return baseUrl;

  const sizes = {
    small: '100x100',
    medium: '300x300',
    large: '600x600'
  };

  try {
    // For now, just append size as a query parameter
    return `${baseUrl}?size=${sizes[size] || sizes.small}`;
  } catch (e) {
    console.error('Error creating thumbnail URL:', e);
    return baseUrl;
  }
}

export { DEFAULT_IMAGE as DEFAULT_SHOE_IMAGE };
