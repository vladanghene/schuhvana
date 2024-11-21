import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ProductPage from '../views/ProductPage.vue';
import CartPage from '../views/CartPage.vue';
import CheckoutPage from '../views/CheckoutPage.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import UserAccount from '../views/UserAccount.vue';
import OrderConfirmationPage from '../views/OrderConfirmationPage.vue';
import CategoryPage from '../views/CategoryPage.vue';
import Privacy from '../views/Privacy.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/product/:id',
    name: 'ProductPage',
    component: ProductPage
  },
  {
    path: '/cart',
    name: 'CartPage',
    component: CartPage,
  },
  {
    path: '/category/:categoryname',
    name: 'Category',
    component: CategoryPage,
    props: true
  },
  {
    path: '/checkout',
    name: 'CheckoutPage',
    component: CheckoutPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/account',
    name: 'UserAccount',
    component: UserAccount,
  },
  {
    path: '/order-confirmation',
    name: 'OrderConfirmationPage',
    component: OrderConfirmationPage,
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;