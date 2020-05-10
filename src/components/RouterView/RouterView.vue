<template>
  <keep-alive :include="cachedViews">
    <router-view :key="key" />
  </keep-alive>
</template>

<script>
  export default {
    name: 'RouterView',
    computed: {
      cachedViews () {
        return this.$store.state.routerView.cachedViews
      },
      key () {
        return this.$route.path
      }
    }
  }
</script>

<style scoped>

</style>
