import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
import { api } from '@/config'
import { getToken } from '@/utils/auth'

// create an axios instance
const HttpRequest = axios.create({
  baseURL: api.base_api, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 200000, // request timeout,
  hideLoading: true // hide default loading
})

// request拦截器 request interceptor
HttpRequest.interceptors.request.use(
  config => {
    // do something before request is sent

    // 不传递默认开启loading
    if (!config.hideLoading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['Authorization'] = 'Bearer ' + getToken()
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// respone拦截器 response interceptor
HttpRequest.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 401) {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default HttpRequest
