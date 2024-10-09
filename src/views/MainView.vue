<script>
export default {
  name: 'MainView',
  data() {
    return {
      teste: 'Teste'
    }
  }
}
</script>
<template>
  <div class="__MainView">
    <h1>MainView</h1>
    {{ teste }}
  </div>

</template>
<style lang="scss" scoped>
.__MainView {
  background-color: #f0f0f0;
}
</style>