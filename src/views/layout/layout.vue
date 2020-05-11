<template>
  <div class="layout">
    <app-main />
  </div>
</template>

<script>
  import { AppMain } from './components'

  export default {
    name: 'Layout',
    components: {
      'app-main': AppMain
    }
  }
</script>

<style scoped>

</style>
