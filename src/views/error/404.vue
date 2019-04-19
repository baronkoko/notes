<template>
  <div class="settings">
    <div class="container">
      <div class="row">
        <div class="col text-center">
          <h1 class="px-5 display-2 text-monospace">404</h1>
          <p class="h5 mb-4">Page not found</p>
          <router-link :to="{ name: 'home' }">Back to home page</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  metaInfo: {
    title: '404'
  }
}
</script>
