import Vue from 'vue'
import VueRouter from 'vue-router'

// detail: https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(VueRouter)

/* Route Modules */
import demoRoute from './modules/demo'

export const constantRoutes = [
  {
    path: '/',
    component: () => import('_v/home'),
    name: 'home',
    meta: {
      title: '主页',
      keepAlive: false
    }
  },
  // when your routing map is too long, you can split it into small modules.
  demoRoute
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = []

// add route path
constantRoutes.forEach(route => {
  route.path = route.path || '/' + (route.name || '')
})

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.VUE_APP_ROUTER_BASE_PATH,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
