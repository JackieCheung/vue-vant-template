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
      @select="handleSelect"
    />
    <br />
    <van-button type="primary" @click="expand = !expand">
      click
    </van-button>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'CalendarDemo',
    data () {
      return {
        defaultHeight: '',
        height: '',
        expand: true,
        currentDate: dayjs().format('YYYY-MM-DD'),
        selectedDate: dayjs().format('YYYY-MM-DD')
      }
    },
    computed: {
      minDate () {
        return new Date(dayjs(this.currentDate).startOf('month').startOf('week').format('YYYY/MM/DD'))
      },
      maxDate () {
        return new Date(dayjs(this.currentDate).endOf('month').endOf('week').format('YYYY/MM/DD'))
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$el.querySelectorAll('.van-calendar__month-title').forEach(el => { el.parentNode.removeChild(el) })
      })
    },
    methods: {
      handleSelect (date) {
        this.selectedDate = dayjs(date).format('YYYY-MM-DD')
      },
      formatter (day) {
        const classArr = []
        if (day.type === 'disabled') classArr.push('d-none')
        if (dayjs(day.date).isBefore(this.currentDate, 'month')) classArr.push('prev-month')
        if (dayjs(day.date).isSame(this.currentDate, 'month')) classArr.push('same-month')
        if (dayjs(day.date).isAfter(this.currentDate, 'month')) classArr.push('next-month')
        if (dayjs(day.date).isSame(this.selectedDate, 'week')) classArr.push('same-week')
        if (!this.expand && !classArr.includes('same-week')) classArr.push('fade-out')
        if (day.type === 'selected') classArr.push('selected')
        day.className = classArr.join(' ')
        return day
      }
    }
  }
</script>

<style lang="scss" scoped>
  .van-calendar {
    background-color: aliceblue;

    ::v-deep .van-calendar__days {
      pointer-events: none;

      .van-calendar__day {
        pointer-events: auto;
        transition: height ease-in-out .4s, margin ease-in-out .4s, color ease-in-out .4s;

        &.fade-out {
          height: 0 !important;
          color: rgba(0, 0, 0, 0);
        }

        &.prev-month {
          margin-bottom: -17.06667vw;

          &.fade-out {
            margin-bottom: 0;
          }
        }

        &.next-month {
          margin-top: -17.06667vw;

          &.fade-out {
            margin-top: 0;
          }
        }

        &.prev-month, &.next-month {
          opacity: 0.5;

          &.selected {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
