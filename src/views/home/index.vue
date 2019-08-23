<!-- home -->
<template>
  <div>
    <h1>Welcome to Vue Vant Template</h1>
    <van-button type="primary">主要按钮</van-button>
  </div>
</template>

<script>
  import {
    Button
  } from 'vant'

  export default {
    components: {
      'van-button': Button
    },

    data() {
      return {}
    },

    computed: {},

    mounted() {
      console.log(process.env)
    },

    methods: {}
  }

</script>
<style lang='scss' scoped>
</style>
