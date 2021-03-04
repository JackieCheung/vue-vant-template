import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Toast } from 'vant'
import { isFunction } from './validate'
import { refreshAccessToken } from '@/api/user'
import { getType } from '@/utils/tools'

// create an axios instance
const HttpRequest = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 40000 // request timeout
})

let pendingRequest = null
// request interceptor
HttpRequest.interceptors.request.use(
  config => {
    /** do something before request is sent */

    pendingRequest = pendingRequest || new PendingRequest({
      cancelDuplicateRequest: process.env.NODE_ENV === 'production',
      ...config
    })
    // check the previous request for cancellation before the request starts
    pendingRequest.remove(config || {})
    // add the current request to pendingRequest
    pendingRequest.add(config || {})

    if (store.getters['user/accessToken']) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation, such as `config.headers['Authorization'] = 'Bearer ' + getAccessToken()`
      // config.headers['Authorization'] = getAccessToken()
      config.headers['Authorization'] = store.getters['user/accessToken']
    }
    return config
  },
  error => {
    /** do something with request error */

    console.error(error) // for debug

    // when error has occurred, remove the current request from pendingRequest
    pendingRequest.remove(error.config || {})

    return Promise.reject(error)
  }
)

let tokenRefreshing = false // token refreshing flag
let reRequestQueue = [] // re-request queue
// response interceptor
HttpRequest.interceptors.response.use(
  /*
   * If you want to get http information such as headers or status
   * Please return  response => response
   */
  response => {
    // remove the current request from pendingRequest
    pendingRequest.remove(response.config)

    /**
     * Determine the request status by HTTP Status Code
     * Here is just an example
     * You can also judge the status by custom code
     */
    // if the http status code is not 200, it is judged as an error
    if (response.status && response.status !== 200) {
      // try to re-login or other actions according to business requirements
      return Promise.reject(response.data || 'error')
    } else {
      // token 过期
      if (response.data.code === 40001) {
        const { config } = response
        if (!tokenRefreshing) {
          tokenRefreshing = true
          return refreshAccessToken(store.getters['user/refreshToken']).then(async res => {
            if (res.code === 0) {
              const {
                access_token: accessToken,
                refresh_token: refreshToken
              } = res.data
              await store.dispatch('user/updateToken', {
                accessToken,
                refreshToken
              })
              config.baseURL = ''
              config.headers['Authorization'] = accessToken
              reRequestQueue.forEach(cb => cb(accessToken))
              reRequestQueue = []
              // 重试当前请求并返回promise
              return HttpRequest(config)
            } else {
              Toast.fail('登录超时，请重新登录！')
              // remove token and go to login page to re-login
              store.dispatch('user/resetToken').then(() => {
                router.push({ path: `/login?redirect=${encodeURIComponent(router.history._startLocation)}` }).catch(err => err)
              })
              return Promise.resolve(response.data)
            }
          }).catch(error => {
            // 刷新 token 失败，重新登录
            console.error('Refresh Token Error: ', error)
            Toast.fail('登录超时，请重新登录！')
            // remove token and go to login page to re-login
            store.dispatch('user/resetToken').then(() => {
              router.push({ path: `/login?redirect=${encodeURIComponent(router.history._startLocation)}` }).catch(err => err)
            })
            return Promise.resolve(response.data)
          }).finally(() => {
            tokenRefreshing = false
          })
        } else {
          return new Promise(resolve => {
            reRequestQueue.push(accessToken => {
              config.baseURL = ''
              config.headers['Authorization'] = accessToken
              resolve(HttpRequest(config))
            })
          })
        }
      }
      return Promise.resolve(response.data)
    }
  },
  error => {
    /** do something with response error */

    console.error('Request Error: ', error) // for debug

    // when error has occurred, remove the current request from pendingRequest
    pendingRequest.remove(error.config || {})
    // ignores the error message of canceling the duplicate request
    if (axios.isCancel(error)) {
      return new Promise(() => {})
    }
    return Promise.reject(error)
  }
)

// configure to cancel duplicate requests
class PendingRequest {
  constructor (options = {}) {
    const {
      cancelDuplicateRequest,
      duplicateKeyFn
    } = options
    // whether to enable cancellation of duplicate requests
    this.cancelDuplicateRequest = !!cancelDuplicateRequest
    // store the identity and cancellation function for each request
    this.pendingRequest = new Map()
    this.duplicateKeyFn = isFunction(duplicateKeyFn) ? duplicateKeyFn : config => `method: ${config.method} & url: ${config.url}${config.params && ' & params: ' + JSON.stringify(config.params)}`
  }

  /**
   * add current request to pendingRequest
   * @param {Object} config
   */
  add (config = {}) {
    const cancelDuplicateRequest = getType(config.cancelDuplicateRequest) === 'boolean' ? config.cancelDuplicateRequest : this.cancelDuplicateRequest
    // if need to cancel duplicate request
    if (cancelDuplicateRequest) {
      const duplicateKey = config.duplicateKey || this.duplicateKeyFn(config)
      config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
        // if the current request does not exist in pendingRequest, add it
        if (duplicateKey && !this.pendingRequest.has(duplicateKey)) {
          this.pendingRequest.set(duplicateKey, cancel)
        }
      })
    }
  }

  /**
   * remove the duplicate request in pendingRequest
   * @param {Object} config
   */
  remove (config = {}) {
    const cancelDuplicateRequest = getType(config.cancelDuplicateRequest) === 'boolean' ? config.cancelDuplicateRequest : this.cancelDuplicateRequest
    // if need to cancel duplicate request
    if (cancelDuplicateRequest) {
      const duplicateKey = config.duplicateKey || this.duplicateKeyFn(config)
      // if the current request exists in pendingRequest, cancel the previous duplicate request and remove it
      if (duplicateKey && this.pendingRequest.has(duplicateKey)) {
        const cancel = this.pendingRequest.get(duplicateKey)
        cancel('Duplicate request: ' + duplicateKey)
        this.pendingRequest.delete(duplicateKey)
      }
    }
  }

  /**
   * clear pendingRequest, usage case: when the route changes - router.beforeEach
   */
  clear () {
    for (const [key, cancel] of this.pendingRequest) {
      cancel('Duplicate request: ' + key)
    }
    pendingRequest.clear()
  }
}

export default HttpRequest
