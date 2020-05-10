import { asyncRoutes, constantRoutes } from '@/router'

/**
 * @description use meta.role to determine if the current user has permission
 * @param { Array } roles
 * @param { Object } route
 * @returns { Boolean } has permission or not
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * @description filter asynchronous routing tables by recursion
 * @param { Array } routes
 * @param { Array } roles
 * @returns { Array } permissible routes
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const getters = {
  routes: state => state.routes
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes ({ commit }, roles) {
    return new Promise(resolve => {
      let accessibleRoutes = []
      if (roles.includes('ROLE_ADMIN')) {
        accessibleRoutes = asyncRoutes || []
      } else {
        accessibleRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessibleRoutes)
      resolve(accessibleRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
