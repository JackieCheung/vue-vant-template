<template>
  <!--  detail for $attrs and $listeners -->
  <!--  @see https://www.jianshu.com/p/4649d317adfe-->
  <van-field
    v-model="data"
    v-bind="Object.assign({}, $attrs, error)"
    :value="value"
    :required="isRequired"
    :error="errorHighLight && validateMessage !== ''"
    :error-message="validateMessage"
    v-on="$listensers">
    {slots('left-icon') && (
    <template
      #left-icon>
      <slot name="left-icon"></slot>
    </template>
    )}
    {slots('label') && (
    <template
      #label>
      <slot name="label"></slot>
    </template>
    )}
    {slots('button') && (
    <template
      #button
      scope-slot="{data}">
      <slot
        name="button"
        :data="data"></slot>
    </template>
    )}
    {slots('right-icon') && (
    <template
      #right-icon>
      <slot name="right-icon"></slot>
    </template>
    )}
  </van-field>
</template>

<script>
  import AsyncValidator from 'async-validator'

  function getPropByPath (obj, path) {
    let tempObj = obj
    path = path.replace(/\[(\w+)]/g, '.$1')
    path = path.replace(/^\./, '')

    const keyArr = path.split('.')
    let i = 0

    for (let len = keyArr.length; i < len - 1; ++i) {
      const key = keyArr[i]
      if (key in tempObj) {
        tempObj = tempObj[key]
      } else {
        throw new Error('[vant warn]: please transfer a valid prop path to form item!')
      }
    }
    return {
      o: tempObj,
      k: keyArr[i],
      v: tempObj[keyArr[i]]
    }
  }

  export default {
    name: 'FormItem',
    // detail @see https://cn.vuejs.org/v2/api/#model
    model: {
      prop: 'value',
      // event: 'update'
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      prop: {
        type: String,
        default: ''
      },
      rules: {
        type: [Object, Array],
        default () {
          return null
        }
      },
      error: {
        type: String,
        default: ''
      },
      required: {
        type: Boolean,
        default: false
      },
      errorHighLight: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        data: this.value,
        isRequired: false,
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {}
      }
    },
    computed: {
      fieldValue () {
        const model = this.form.model
        if (!model || !this.prop) { return }

        let path = this.prop
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.')
        }

        return getPropByPath(model, path).v
      },
      $listensers () {
        return Object.assign({}, this.$listeners, {
          input: this.handleInput,
          blur: this.onFieldBlur,
          change: this.handleChange
        })
      }
    },
    watch: {
      value (newVal) {
        this.data = newVal
      },
      error: {
        handler (val) {
          this.validateMessage = val
          this.validateState = val ? 'error' : ''
        },
        immediate: true
      },
      validateStatus (val) {
        this.validateState = val
      },
      rules () {
        this.setRules()
      }
    },
    inject: ['form'],
    mounted () {
      if (this.prop) {
        this.$eventHub.$emit('on-form-item-add', this)

        Object.defineProperty(this, 'initialValue', {
          value: this.fieldValue
        })

        this.setRules()
      }
    },
    beforeDestroy () {
      if (this.prop) {
        this.$eventHub.$emit('on-form-item-remove', this)
      }
    },
    methods: {
      handleChange () {
        this.$emit('change', this.data)
        this.onFieldChange()
      },
      handleInput () {
        // this.$emit('update', this.data)
        this.$emit('change', this.data)
        this.onFieldChange()
      },
      setRules () {
        const rules = this.getRules()
        if (rules.length && this.required) {
          return ''
        } else if (rules.length) {
          rules.every((rule) => {
            this.isRequired = rule.required
          })
        } else if (this.required) {
          this.isRequired = this.required
        }
      },
      getRules () {
        let formRules = this.form.rules
        const selfRules = this.rules

        formRules = formRules ? formRules[this.prop] : []

        return [].concat(selfRules || formRules || [])
      },
      getFilteredRule (trigger) {
        const rules = this.getRules()

        return rules.filter(rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1)
      },
      validate (trigger, callback = function () {}) {
        const rules = this.getFilteredRule(trigger)
        if (!rules || rules.length === 0) {
          // if (!this.required) {
          //   callback()
          //   return true
          // } else {
          //   rules = [{ required: true }]
          // }
          callback()
          return true
        }

        this.validateState = 'validating'

        const descriptor = {}
        descriptor[this.prop] = rules

        const validator = new AsyncValidator(descriptor)
        const model = {}

        model[this.prop] = this.fieldValue

        validator.validate(model, { firstFields: true }, errors => {
          this.validateState = !errors ? 'success' : 'error'
          this.validateMessage = errors ? errors[0].message : ''

          callback(this.validateMessage)
        })
        this.validateDisabled = false
      },
      resetField () {
        this.validateState = ''
        this.validateMessage = ''

        const model = this.form.model
        const value = this.fieldValue
        let path = this.prop
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.')
        }

        const prop = getPropByPath(model, path)

        if (Array.isArray(value)) {
          this.validateDisabled = true
          prop.o[prop.k] = [].concat(this.initialValue)
        } else {
          this.validateDisabled = true
          prop.o[prop.k] = this.initialValue
        }
      },
      onFieldBlur () {
        this.validate('blur')
      },
      onFieldChange () {
        if (this.validateDisabled) {
          this.validateDisabled = false
          return
        }
        this.validate('change')
      }
    }
  }
</script>

<style scoped>

</style>
