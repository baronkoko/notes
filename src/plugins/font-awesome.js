import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCog, faTrash, faPen)

Vue.component('font-awesome-icon', FontAwesomeIcon)
