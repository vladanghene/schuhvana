import { createStore } from 'vuex';
import cart from './modules/cart';
import products from './modules/products';
import user from './modules/user';
import wishlist from './modules/wishlist';
import reviews from './modules/reviews';
import search from './modules/search';

export default createStore({
  modules: {
    cart,
    products,
    user,
    wishlist,
    reviews,
    search,
  },
});