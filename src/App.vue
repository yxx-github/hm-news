<template>
  <!-- 缓存 -->
  <keep-alive include="home">
    <!-- 出口 -->
    <router-view></router-view>
  </keep-alive>
</template>

<script>
export default {}
</script>

<style>
.one {
  width: 200px;
  height: 200px;
  background-color: pink;
}
</style>


