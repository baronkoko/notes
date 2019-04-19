import Vue from 'vue'
import PageTransition from './transition/PageTransition'

[
  PageTransition
].forEach(Component => {
  Vue.component(Component.name, Component)
})
