const ACCESS_TOKEN_KEY = 'Vue-Vant-Access-Token'
const REFRESH_TOKEN_KEY = 'Vue-Vant-Refresh-Token'

export function getAccessToken () {
  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken (token) {
  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function removeAccessToken () {
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken () {
  return window.sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken (refreshToken) {
  window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function removeRefreshToken () {
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
}
