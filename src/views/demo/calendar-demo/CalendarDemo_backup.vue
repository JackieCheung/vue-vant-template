<template>
  <div>
    <van-calendar
      ref="calendar"
      title="日历"
      :formatter="formatter"
      :poppable="false"
      :show-confirm="false"
      :min-date="minDate"
      :max-date="maxDate"
      :lazy-render="false"
      :style="{ height: height }"
      :show-mark="false"
    />
    <br />
    <van-button type="primary" @click="click"> click</van-button>
  </div>
</template>

<script>
  import { addClass, removeClass } from '@/utils/tools'
  import dayjs from 'dayjs'
  /** version: v1 */
  // import { getFinalStyle } from '@/utils/tools'
  // import { scrollTo } from '@/utils/scroll-to'
  // const FOLDING_HEIGHT = '200px'

  export default {
    name: 'CalendarDemo',
    data () {
      return {
        defaultHeight: '',
        height: '',
        expand: true,
        currentMonth: dayjs().format('YYYY-MM')
      }
    },
    computed: {
      minDate () {
        return new Date(dayjs(this.currentMonth).startOf('month').startOf('week').format('YYYY-MM-DD'))
      },
      maxDate () {
        return new Date(dayjs(this.currentMonth).endOf('month').endOf('week').format('YYYY-MM-DD'))
      }
    },
    mounted () {
      /** version: v1 */
      // this.defaultHeight = parseFloat(getFinalStyle(this.$el.querySelector('.van-calendar__days'), 'height')) + 48.58 * 2 + 32.8 + 'px'
      // this.height = FOLDING_HEIGHT
      // this.$nextTick(() => {
      //   scrollTo(
      //     this.$el.querySelector('.van-calendar__body'),
      //     this.$el.querySelector('.van-calendar__body').scrollTop + this.$el.querySelector('.van-calendar__selected-day').getBoundingClientRect().top - 135,
      //     200
      //   )
      // })
      this.$nextTick(() => {
        this.$el.querySelectorAll('.van-calendar__month-title').forEach((el, index) => {
          const parentNode = el.parentNode
          el.nextElementSibling.style.marginTop = '-17.06667vw'
          parentNode.removeChild(el)
        })
      })
    },
    methods: {
      formatter (day) {
        if (day.type === 'disabled') {
          day.className = 'd-none'
        }
        return day
      },
      click () {
        this.expand = !this.expand
        /** version: v1 */
        // if (this.expand) {
        //   this.height = this.defaultHeight
        //   this.$refs.calendar.scrollToDate(new Date())
        // } else {
        //   this.height = FOLDING_HEIGHT
        //   setTimeout(() => {
        //     // this.$el.querySelector('.van-calendar__selected-day').scrollIntoView({
        //     //   behavior: 'smooth'
        //     // })
        //     scrollTo(this.$el.querySelector('.van-calendar__body'), this.$el.querySelector('.van-calendar__body').scrollTop + this.$el.querySelector('.van-calendar__selected-day').getBoundingClientRect().top - 135, 300)
        //   }, 300)
        // }
        if (this.expand) {
          for (const el of this.$el.querySelectorAll('.van-calendar__day')) {
            removeClass(el, 'fade-out')
            removeClass(el, 'hidden')
          }
        } else {
          const selectedNode = this.$el.querySelector('.van-calendar__selected-day').parentNode
          for (const el of this.$el.querySelectorAll('.van-calendar__day')) {
            if (el === selectedNode) continue
            if (el.getBoundingClientRect().top !== selectedNode.getBoundingClientRect().top) {
              if (el.parentNode.parentNode !== selectedNode.parentNode.parentNode) {
                addClass(el, 'hidden')
              } else {
                addClass(el, 'fade-out')
              }
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .van-calendar {
    // transition: all ease-in-out .3s;
    background-color: aliceblue;

    ::v-deep .van-calendar__day {
      transition: height ease-in-out .4s, opacity ease-in-out .4s;

      &.fade-out {
        height: 0;
        opacity: 0;
      }

      &.hidden {
        opacity: 0;
      }
    }
  }
</style>
