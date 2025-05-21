<template>
  <div class="auth-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'AuthView'
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
}
</style>