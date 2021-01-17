<template>
  <div>
    <van-calendar
      ref="calendar"
      title="日历"
      :poppable="false"
      :show-confirm="false"
      :default-date="new Date('2021-01-27')"
      :min-date="new Date('2021-01-01')"
      :max-date="new Date('2021-01-31')"
      :lazy-render="false"
      :style="{ height: height }"
    />
    <br />
    <van-button type="primary" @click="click">click</van-button>
  </div>
</template>

<script>
  import { getFinalStyle } from '@/utils/tools'
  import { scrollTo } from '@/utils/scroll-to'

  export default {
    name: 'CalendarDemo',
    data () {
      return {
        defaultHeight: '',
        height: '',
        expand: true
      }
    },
    mounted () {
      this.height = this.defaultHeight = parseFloat(getFinalStyle(this.$el.querySelector('.van-calendar__days'), 'height')) + 48.58 * 2 + 32.8 + 'px'
    },
    methods: {
      click () {
        this.expand = !this.expand
        this.height = this.expand ? this.defaultHeight : '200px'
        if (this.expand) {
          this.$refs.calendar.scrollToDate(new Date())
        } else {
          setTimeout(() => {
            // this.$el.querySelector('.van-calendar__selected-day').scrollIntoView({
            //   behavior: 'smooth'
            // })
            scrollTo(this.$el.querySelector('.van-calendar__body'), this.$el.querySelector('.van-calendar__body').scrollTop + this.$el.querySelector('.van-calendar__selected-day').getBoundingClientRect().top - 135, 300)
          }, 300)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .van-calendar {
    transition: all ease-in-out .3s;
    background-color: aliceblue;
  }
</style>
