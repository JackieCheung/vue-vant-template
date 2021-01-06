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
  // scrollBehavior:
  // - only available in html5 history mode
  // - defaults to no scroll behavior
  // - return false to prevent scroll
  // - detail: https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js
  scrollBehavior: (to, from, savedPosition) => {
    const scrollbar = document.querySelector('.app-main .el-scrollbar__wrap')
    if (!from.meta.noCache) {
      from.meta.savedPosition = (scrollbar || document.documentElement || document.body.parentNode || document.body).scrollTop
    }
    // savedPosition is only available for popstate navigations
    /**
     * 如果是通过浏览器的前进后退按钮进行路由切换，那么 savedPosition 值不为 null，保持之前的滚动条位置；
     * 如果是通过 <router-link> 进行路由切换，那么 savedPosition 值为 null ，此时就会回到目标路由页面的指定位置
     */
    if (savedPosition) {
      setTimeout(() => {
        if (scrollbar) {
          scrollbar.scrollTop = to.meta.savedPosition || 0
          savedPosition.y = scrollbar.scrollTop
        }
        return {
          ...savedPosition,
          behavior: 'smooth'
        }
      }, 600) // 对消 transition 的过渡影响
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          scrollbar && (scrollbar.scrollTop = to.meta.savedPosition || 0)
          resolve({
            x: 0,
            y: to.meta.savedPosition || 0,
            behavior: 'smooth'
          })
        }, 600) // 对消 transition 的过渡影响
      })
    }
  },
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

