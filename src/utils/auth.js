const TOKEN_KEY = 'Vue-Vant-Token'

export function getToken() {
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  return window.localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  return window.localStorage.removeItem(TOKEN_KEY)
}
