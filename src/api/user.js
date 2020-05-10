import request from '@/utils/request'

/**
 * @description 用户登录
 * @param { Object } data 用户登录信息
 * @returns { Object } 登录结果
 * @author Jackie
 * @date 2020-03-03 09:17
 */
export function login (data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * @description 获取用户信息
 * @returns { object } 用户信息
 * @author Jackie
 * @date 2020-03-03 09:25
 */
export const getUserInfo = _ => {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * @description 用户注销
 * @returns { object } 注销结果
 * @author Jackie
 * @date 2020-03-03 09:17
 */
export const logout = _ => {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
