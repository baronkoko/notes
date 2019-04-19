<template>
  <div
    id="app"
    class="app"
  >
    <app-header></app-header>
    <div class="app-container pb-5">
      <page-transition>
        <router-view/>
      </page-transition>
    </div>
    <vue-progress-bar></vue-progress-bar>
    <div
      class="new-content-toast position-fixed card bg-white"
      style="width: 18rem;"
      v-if="sw.updateExists"
    >
      <div class="card-body text-center">
        <h5 class="card-title">New content available!</h5>
        <p class="card-text">Please update the application.</p>
        <a
          href="#"
          class="card-link"
          @click.prevent="refreshApp"
          role="button"
        >Update</a>
        <a
          href="#"
          class="card-link"
          @click.prevent="closeRefreshUI"
          role="button"
        >Cancel</a>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/TheHeader'

export default {
  components: {
    AppHeader
  },
  metaInfo: {
    title: 'Home',
    titleTemplate: 'Notes | %s'
  },
  data: () => ({
    sw: {
      refreshing: false,
      registration: null,
      updateExists: false
    }
  }),
  mounted () {
    this.$Progress.finish()
    this.setDatabaseSource()
  },
  created () {
    this.$Progress.start()
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        this.$Progress.parseMeta(meta)
      }
      this.$Progress.start()
      next()
    })
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })
    document.addEventListener('swUpdated', this.showRefreshUI, { once: true })
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.sw.refreshing) return
      this.sw.refreshing = true
      window.location.reload()
    })
  },
  methods: {
    setDatabaseSource () {
      if (!navigator.onLine || !window.localStorage.getItem('app-database')) window.localStorage.setItem('app-database', 'local')
    },
    showRefreshUI (e) {
      this.sw.registration = e.detail
      this.sw.updateExists = true
    },
    closeRefreshUI () {
      this.sw.updateExists = false
    },
    refreshApp () {
      this.sw.updateExists = false
      if (!this.sw.registration || !this.sw.registration.waiting) return
      this.sw.registration.waiting.postMessage('skipWaiting')
    }
  }
}
</script>

<style lang="scss">
  @import '@/styles/bootstrap.scss';

  html,
  body {
    text-rendering: optimizeSpeed;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }
  .new-content-toast {
    right: 20px;
    bottom: 20px;
    z-index: 1;
  }
</style>
