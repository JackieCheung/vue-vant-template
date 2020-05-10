import axios from 'axios'
import store from '@/store'
// import { getToken } from '@/utils/token'

// create an axios instance
const HttpRequest = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
HttpRequest.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters['user/token']) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation, such as `config.headers['Authorization'] = 'Bearer ' + getToken()`
      // config.headers['authentication'] = getToken()
      config.headers['authentication'] = store.getters['user/token']
    }
    return config
  },
  error => {
    // do something with request error
    console.error(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
HttpRequest.interceptors.response.use(
  /*
   * If you want to get http information such as headers or status
   * Please return  response => response
   */
  response => {
    /*
     * Determine the request status by HTTP Status Code
     * Here is just an example
     * You can also judge the status by custom code
   */
    // if the http status code is not 200, it is judged as an error
    if (response.status && response.status !== 200) {
      // try to re-login or other actions according to business requirements
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
    console.error('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default HttpRequest
