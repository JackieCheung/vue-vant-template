import router from '@/router/index'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getAccessToken } from '@/utils/token' // get token from sessionStorage
import { getPageTitle } from '@/utils/tools'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/', '/login', '/register', '/demo', '/demo/imageCropper', '/demo/quillEditor', '/demo/calendar'] // free login whitelists

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // flatten nested multi-level routes contain 'ParentRouterView'
  if (to.matched && to.matched.length > 2) {
    for (let i = 0; i < to.matched.length; i++) {
      const element = to.matched[i]
      if (element.components.default.name === 'ParentRouterView') {
        to.matched.splice(i, 1)
      }
    }
  }

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasAccessToken = getAccessToken()

  if (hasAccessToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getUserInfo
      const hasRoles = store.getters['user/roles'] && store.getters['user/roles'].length > 0
      if (hasRoles) {
        // when has roles it means that all accessible routes have been generated
        // if visit a page without permission, it will automatically enter the 404 page
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getUserInfo')

          // generate accessible routes map based on roles
          const accessibleRoutes = (await store.dispatch('permission/generateRoutes', roles)) || []

          // dynamically add accessible routes
          accessibleRoutes.forEach(route => router.addRoute(route))

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({
            ...to,
            replace: true
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
