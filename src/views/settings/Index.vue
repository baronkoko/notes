<template>
  <div class="settings">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="mb-4">Settings</h1>
        </div>
      </div>
    </div>
    <div class="container mt-4">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <p>Data storage:</p>
            <div class="custom-control custom-radio custom-control-inline">
              <input
                id="customRadioInline1"
                v-model="storage"
                type="radio"
                name="local"
                value="local"
                class="custom-control-input"
                @change="setStorage"
              >
              <label class="custom-control-label" for="customRadioInline1">Local Storage</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
              <input
                id="customRadioInline2"
                v-model="storage"
                type="radio"
                name="firebase"
                value="firebase"
                class="custom-control-input"
                @change="setStorage"
              >
              <label class="custom-control-label" for="customRadioInline2">Firebase</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  metaInfo: {
    title: 'Settings'
  },
  data: () => ({
    storage: ''
  }),
  computed: {
    appDatabase () {
      return window.localStorage.getItem('app-database')
    }
  },
  mounted () {
    this.storage = window.localStorage.getItem('app-database')
  },
  methods: {
    setStorage () {
      window.localStorage.setItem('app-database', this.storage)
    }
  }
}
</script>
