<template>
  <div class="date-time-field-container">
    <van-field
      ref="dateTimeField"
      v-bind="attrs"
      v-model="formattedValue"
      v-on="listeners"
      @click="readonly ? '' : showPicker = true"
    >
      <template #label>
        <slot name="label"></slot>
      </template>
      <template #input>
        <slot name="input"></slot>
      </template>
      <template #left-icon>
        <slot name="left-icon"></slot>
      </template>
      <template #right-icon>
        <slot name="right-icon"></slot>
      </template>
      <template #button>
        <slot name="button"></slot>
      </template>
      <template #extra>
        <slot name="extra"></slot>
      </template>
    </van-field>
    <van-popup
      v-model="showPicker"
      v-bind="popupAttrs"
      position="bottom"
    >
      <van-datetime-picker
        ref="dateTimePicker"
        v-bind="pickerAttrs"
        v-model="selectedDateTime"
        v-on="pickerListeners"
      >
        <template #pciker-default>
          <slot name="default"></slot>
        </template>
        <template #picker-title>
          <slot name="title"></slot>
        </template>
        <template #picker-confirm>
          <slot name="confirm"></slot>
        </template>
        <template #picker-cancel>
          <slot name="cancel"></slot>
        </template>
        <template #picker-option>
          <slot name="option"></slot>
        </template>
        <template #picker-columns-top>
          <slot name="columns-top"></slot>
        </template>
        <template #picker-columns-bottom>
          <slot name="columns-bottom"></slot>
        </template>
      </van-datetime-picker>
    </van-popup>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'DateTimeField',
    props: {
      value: {
        type: String,
        default: ''
      },
      format: {
        type: String,
        default: 'YYYY-MM-DD'
      },
      formatter: {
        type: Function,
        default: null
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selectedDateTime: '',
        formattedValue: '',
        showPicker: false
      }
    },
    computed: {
      // field
      attrs () {
        return Object.assign({
          name: 'date',
          label: '日期',
          placeholder: '请选择日期'
        }, this.$attrs, {
          clickable: !this.readonly,
          readonly: true
        })
      },
      listeners () {
        return Object.assign(
          {},
          this.$listeners
        )
      },
      // popup
      popupAttrs () {
        return Object.assign(
          {},
          {
            position: 'bottom',
            round: true,
            'close-on-popstate': true,
            'safe-area-inset-bottom': true
          },
          this.$attrs.popupOptions
        )
      },
      // picker
      pickerAttrs () {
        return Object.assign(
          {},
          {
            type: 'date'
          },
          this.$attrs.pickerOptions
        )
      },
      pickerListeners () {
        return Object.assign(
          {},
          {
            change: this.$listeners['picker-Change'] || this.$listeners['pickerChange'] || ((picker) => {
              this.$emit('picker-change', picker)
              this.$emit('pickerChange', picker)
            }),
            confirm: this.$listeners['picker-cancel'] || this.$listeners['pickerCancel'] || this.handlePickerConfirm,
            cancel: this.$listeners['picker-cancel'] || this.$listeners['pickerCancel'] || this.handlePickerCancel
          }
        )
      }
    },
    watch: {
      value: {
        handler (newValue) {
          if (newValue) {
            this.selectedDateTime = new Date(newValue)
            this.formattedValue = this.formatter && this.formatter(newValue) || newValue
          } else {
            this.selectedDateTime = new Date()
          }
        },
        immediate: true
      }
    },
    methods: {
      handlePickerConfirm (value) {
        this.showPicker = false
        const result = dayjs(value).format(this.format)
        this.formattedValue = this.formatter && this.formatter(result) || result
        this.$emit('picker-confirm', result, this.formattedValue)
        this.$emit('pickerConfirm', result, this.formattedValue)
        this.$emit('input', result, this.formattedValue)
        this.$emit('change', result, this.formattedValue)
      },
      handlePickerCancel () {
        this.showPicker = false
        this.$emit('picker-cancel')
        this.$emit('pickerCancel')
      }
    }
  }
</script>

<style scoped>

</style>
