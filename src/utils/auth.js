const TOKEN_KEY = 'Vue-Vant-Token'

export function getToken() {
  return window.localStorage.get(TOKEN_KEY)
}

export function setToken(token) {
  return window.localStorage.set(TOKEN_KEY, token)
}

export function removeToken() {
  return window.localStorage.remove(TOKEN_KEY)
}
