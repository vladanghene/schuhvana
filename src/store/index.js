import { createStore } from 'vuex';
import cart from './modules/cart';
import categories from './modules/categories';
import products from './modules/products';
import user from './modules/user';
import wishlist from './modules/wishlist';
import reviews from './modules/reviews';
import search from './modules/search';

export default createStore({
		state: {
				cart: []
		},

  actions: {},
  modules: {
    cart,
    categories,
    products,
    user,
    wishlist,
    reviews,
    search,
  },
});

