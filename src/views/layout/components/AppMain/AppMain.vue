<template>
  <main class="app-main">
    <div class="app-main__content">
      <parent-router-view></parent-router-view>
    </div>
  </main>
</template>

<script>
  import ParentRouterView from '_c/ParentRouterView'

  export default {
    name: 'AppMain',
    components: {
      ParentRouterView
    }
  }
</script>

<style lang="scss" scoped>
  /*.app-main {*/
  /*  padding: 16px;*/
  /*}*/
</style>
