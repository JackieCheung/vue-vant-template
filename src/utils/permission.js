import store from '@/store'

/**
 * @description check whether has permission or not
 * @param { Array } value: permissible roles
 * @returns { Boolean } has permission or not
 */
export function hasPermission (value) {
  if (value && Array.isArray(value) && value.length) {
    const roles = store.getters && store.getters['user/roles']
    const permissibleRoles = value
    return roles.some(role => permissibleRoles.includes(role))
  } else {
    return false
  }
}
