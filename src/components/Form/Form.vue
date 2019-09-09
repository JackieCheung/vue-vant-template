<template>
  <form :autocomplete="autocomplete">
    <template>
      <slot></slot>
    </template>
  </form>
</template>

<script>
  import { CellGroup } from 'vant'

  export default {
    name: 'VForm',
    components: {
      [CellGroup.name]: CellGroup
    },
    props: {
      model: {
        type: Object,
        default () {
          return {}
        }
      },
      rules: {
        type: Object,
        default () {
          return {}
        }
      },
      autocomplete: {
        validator (value) {
          return ['on', 'off'].includes(value)
        },
        default: 'off'
      }
    },
    provide () {
      return { form: this }
    },
    data () {
      return {
        fields: []
      }
    },
    watch: {
      rules () {
        this.validate()
      }
    },
    created () {
      this.$eventHub.$on('on-form-item-add', (field) => {
        if (field) this.fields.push(field)
        return false
      })
      this.$eventHub.$on('on-form-item-remove', (field) => {
        if (field.prop) this.fields.splice(this.fields.indexOf(field), 1)
        return false
      })
    },
    beforeDestroy () {
      this.$eventHub.$off('on-form-item-add')
      this.$eventHub.$off('on-form-item-remove')
    },
    methods: {
      resetFields () {
        this.fields.forEach(field => {
          field.resetField()
        })
      },
      validate (callback) {
        return new Promise(resolve => {
          let valid = true
          let count = 0
          this.fields.forEach(field => {
            field.validate('', errors => {
              if (errors) {
                valid = false
              }
              if (++count === this.fields.length) {
                // all finish
                resolve(valid)
                if (typeof callback === 'function') {
                  callback(valid)
                }
              }
            })
          })
        })
      },
      validateField (prop, cb) {
        const field = this.fields.filter(field => field.prop === prop)[0]
        if (!field) { throw new Error('[vant warn]: must call validateField with valid prop string!') }

        field.validate('', cb)
      }
    }
  }
</script>

<style scoped>

</style>
