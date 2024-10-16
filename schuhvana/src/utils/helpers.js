export const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };
  
  export const capitalize = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  export const sortByPrice = (products, order = 'asc') => {
    return products.sort((a, b) => {
      return order === 'asc' ? a.price - b.price : b.price - a.price;
    });
  };
  
  export const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };