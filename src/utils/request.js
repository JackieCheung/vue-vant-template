import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
import { api } from '@/config'
import { getToken } from '@/utils/auth'

// create an axios instance
const HttpRequest = axios.create({
  baseURL: api.base_api, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 200000 // request timeout
})

// request拦截器 request interceptor
HttpRequest.interceptors.request.use(
  config => {
    // do something before request is sent
    // 开启全局loading
    if (config.showLoading) {
      // loading
      Toast.loading({
        forbidClick: true,
        message: '加载中...'
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
    if (response.status && response.status !== 200) {
      // 登录超时,重新登录
      if (response.status === 401) {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(response.data || 'error')
    } else {
      return Promise.resolve(response.data)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default HttpRequest
