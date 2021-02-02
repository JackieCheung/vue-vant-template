import Vue from 'vue'
import _ from 'lodash'

Vue.prototype.$lodash = {
  pick: _.pick,
  cloneDeep: _.cloneDeep
}
