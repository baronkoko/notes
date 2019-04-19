<template>
  <header class="header shadow-sm mb-5 bg-white rounded">
    <div class="container">
      <div class="row">
        <div class="col py-1">
          <router-link
            :to="{ name: 'home' }"
            class="h1 header__logo text-dark font-weight-bold text-decoration-none text-capitalize"
          >Notes</router-link>
        </div>
        <div class="col-3 col-sm-1 py-1 ml-auto d-flex justify-content-end align-items-center text-right">
          <router-link
            :to="{ name: 'settings' }"
            class="text-dark h4 mb-0"
          >
            <font-awesome-icon icon="cog" />
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style
  lang="scss"
  scoped
>
  .header {
    &__logo {
       font-family: 'Indie Flower', cursive;
     }
  }
</style>
