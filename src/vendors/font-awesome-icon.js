import Vue from 'vue'

// use font-awesome icon
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSearchPlus,
  faSearchMinus,
  faUndo,
  faRedo,
  faUpload
} from '@fortawesome/free-solid-svg-icons'
// import {} from '@fortawesome/free-regular-svg-icons'
// import {} from '@fortawesome/free-brands-svg-icons'
import {
  FontAwesomeIcon
  // , FontAwesomeLayers
  // , FontAwesomeLayersText
}
  from '@fortawesome/vue-fontawesome'

library.add(
  faSearchPlus,
  faSearchMinus,
  faUndo,
  faRedo,
  faUpload
)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
// Vue.component('FontAwesomeLayers', FontAwesomeLayers)
// Vue.component('FontAwesomeLayersText', FontAwesomeLayersText)
