import { login, logout, getUserInfo } from '@/api/user'
import {
  getAccessToken, setAccessToken, removeAccessToken,
  getRefreshToken, setRefreshToken, removeRefreshToken
} from '@/utils/token'
import router, { resetRouter } from '@/router'

const state = {
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
  roles: [],
  userInfo: {}
}

const getters = {
  accessToken: state => state.accessToken,
  refreshToken: state => state.refreshToken,
  roles: state => state.roles,
  userInfo: state => state.userInfo
}

const mutations = {
  SET_ACCESS_TOKEN: (state, accessToken) => {
    state.accessToken = accessToken
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  // userInfo: 登录信息
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        if (response.code === 0) {
          const {
            access_token: accessToken,
            refresh_token: refreshToken
          } = response.data

          commit('SET_ACCESS_TOKEN', accessToken)
          setAccessToken(accessToken)

          commit('SET_REFRESH_TOKEN', refreshToken)
          setRefreshToken(refreshToken)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getUserInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        const { code, data, msg } = res
        if (code !== 0 || !data) {
          reject(new Error(msg ? msg + '，请重新登录！' : '验证失败，请重新登录！'))
        } else {
          const { roles } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject(new Error('getUserInfo: roles must be a non-null array!'))
          }

          commit('SET_ROLES', roles)
          commit('SET_USER_INFO', data)

          resolve(data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_ACCESS_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_ROLES', [])

        removeAccessToken()
        removeRefreshToken()

        resetRouter()

        // reset visited views and cached views
        dispatch('routerView/delAllViews', null, { root: true })

        // reset routes
        dispatch('permission/resetRoutes', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // update token
  updateToken ({ commit }, { accessToken, refreshToken }) {
    commit('SET_ACCESS_TOKEN', accessToken)
    setAccessToken(accessToken)

    commit('SET_REFRESH_TOKEN', refreshToken)
    setRefreshToken(refreshToken)
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_ACCESS_TOKEN', '')
      commit('SET_REFRESH_TOKEN', '')
      commit('SET_ROLES', [])

      removeAccessToken()
      removeRefreshToken()

      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles ({ commit, dispatch }, role) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setAccessToken(token)

      const { roles } = await dispatch('getUserInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('routerView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // update user info
  updateUserInfo ({ commit, state }, userInfo) {
    commit('SET_USER_INFO', {
      ...state.userInfo,
      ...userInfo
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
