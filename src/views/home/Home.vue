<!-- home -->
<template>
  <div class="home">
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
      Welcome to vue-vant-template.
    </van-divider>
  </div>
</template>

<script>
  import { Divider } from 'vant'

  export default {
    components: {
      [Divider.name]: Divider
    },

    data () {
      return {}
    },

    computed: {},

    mounted () {
      console.log(process.env)
    },

    methods: {}
  }

</script>
<style lang="scss" scoped>
</style>
