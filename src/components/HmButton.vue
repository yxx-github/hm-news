<template>
  <div class="hm-button">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

// scoped: 只要给某个组件的style添加scoped属性，那么就可以保证当前组件的样式只会影响到当前组件本身
<style lang="less" scoped>
.hm-button {
  height: 50px;
  margin: 20px;
  background-color: #cc3300;

  text-align: center;
  line-height: 50px;

  font-size: 18px;
  color: #fff;
  border-radius: 25px;
}
</style>
