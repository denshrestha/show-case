import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {layout: 'login', requireAuth: false},
    component: ()=> import(/* webpackChunkName: "login" */ '../components/auth/login-form'),
  },
  {
    path: '/reset-password',
    name: 'Reset',
    meta: {layout: 'login', requireAuth: false},
    component: ()=> import(/* webpackChunkName: "Reset" */ '../components/auth/reset-password'),
  },
  {
    path: '/change-password',
    name: 'Change',
    meta: {layout: 'login', requireAuth: false},
    component: ()=> import(/* webpackChunkName: "Change" */ '../components/auth/change-password'),
  },
  {
    path: '/',
    name: 'Home',
    meta: {layout: 'mainLayout', requireAuth: true},
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    meta: {layout: 'mainLayout', requireAuth: true},
    component: () => import(/* webpackChunkName: "portfolio" */ '../views/Portfolio.vue')
  },
  {
    path: '/hedge-construction',
    name: 'HedgeConstruction',
    meta: {layout: 'mainLayout', requireAuth: true},
    component: () => import(/* webpackChunkName: "hedge-construction" */ '../views/HedgeConstruction.vue')
  },
  {
    path: '/risk-exposure',
    name: 'RiskExposure',
    meta: {layout: 'mainLayout', requireAuth: true},
    component: () => import(/* webpackChunkName: "risk-exposure" */ '../views/RiskExposure.vue')
  },
  {
    path: '/cash-flows',
    name: 'CashFlows',
    meta: {layout: 'mainLayout', requireAuth: true},
    component: () => import(/* webpackChunkName: "cash-flows" */ '../views/CashFlows.vue')
  },
  {
    path: '/business-and-financial',
    name: 'BusinessAndFinancial',
    meta: {layout: 'mainLayout', requireAuth: true},
    component: () => import(/* webpackChunkName: "business-and-financial" */ '../views/BusinessAndFinancial.vue')
  },
  {
    path: '/clients',
    name: 'Clients',
    meta: {layout: 'mainLayout', requireAuth: true},
    component: () => import(/* webpackChunkName: "clients" */ '../views/Clients.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: {layout: 'mainLayout', requireAuth: true},
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  },
  {
    path: '/users',
    name: 'Users',
    meta: {layout: 'mainLayout', requireAuth: true},
    component: () => import(/* webpackChunkName: "users" */ '../views/Users.vue')
  },
  {
    path: '/error',
    name: 'Error',
    meta: {layout: 'login', requireAuth: false},
    component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue')
  },
  {
    path: '*',
    redirect: '/error'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) =>{
  if(to.meta.requireAuth) {
    const token = localStorage.getItem('deRiskToken') || ''
    const sessionToken = sessionStorage.getItem('deRiskToken') || ''
    const role = localStorage.getItem('userRole') || ''

    if(token || sessionToken){
      if((to.path === '/users' || to.path === '/clients') && role !== 'admin'){
        return next({path: '/error'})
      }
      return next()
    } else {
      next({path: '/login'})
    }
  } else next()
})

export default router
