import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import ArtboardsView from '../views/ArtboardsView.vue'
import ArtboradEditView from '../views/ArtboardEditView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import BuyView from '../views/BuyView.vue'
import ArtistsView from '../views/ArtistsView.vue'
import CustomersView from '../views/CustomersView.vue'
import OrdersView from '../views/OrdersView.vue'
import PageNotFoundView from '../views/PageNotFoundView.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/buy',
      name: 'buy',
      component: BuyView,
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('token')) {
          next('/login')
        } else {
          next()
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('token') || !localStorage.getItem('role')) {
          next('/unauthorized')
        } else {
          next()
        }
      }
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView,
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('token')) {
          next('/unauthorized')
        } else {
          next()
        }
      }  
    },
    {
      path: '/artists',
      name: 'artists',
      component: ArtistsView,
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('token')) {
          next('/unauthorized')
        } else {
          next()
        }
      }
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomersView,
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('token')) {
          next('/unauthorized')
        } else {
          next()
        }
      }
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('token')) {
          next('/unauthorized')
        } else {
          next()
        }
      }
    },
    {
      path: '/artboards',
      name: 'artboards',
      component: ArtboardsView,
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('token')) {
          next('/unauthorized')
        } else {
          next()
        }
      }
    },
    {
      path: '/artboards/:id',
      name: 'artboard-edit',
      props: true,
      component: ArtboradEditView,
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('token')) {
          next('/unauthorized')
        } else {
          next()
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'page-not-found',
      component: PageNotFoundView
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView
    }
  ]
})

export default router
