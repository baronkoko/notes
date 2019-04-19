import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
  position: 'top-right',
  duration: 5000,
  className: 'd-toast-box',
  containerClass: 'd-toast'
})
