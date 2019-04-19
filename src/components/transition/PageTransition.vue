<template>
  <transition
    name="page"
    mode="out-in"
  >
    <slot/>
  </transition>
</template>

<script>
export default {
  name: 'PageTransition'
}
</script>

<style scoped>
  .page-enter-active,
  .page-leave-active {
    transition: opacity .3s;
  }
  .page-enter,
  .page-leave-to {
    opacity: 0;
  }
</style>
