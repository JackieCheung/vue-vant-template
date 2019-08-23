const getters = {
  visitedViews: state => state.routerView.visitedViews,
  cachedViews: state => state.routerView.cachedViews,
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permissionRoutes: state => state.permission.routes
}
export default getters
