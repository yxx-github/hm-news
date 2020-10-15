<template>
  <!-- hm-header留置占位 -->
  <div class="hm-header">
    <!-- 固定定位 -->
    <div class="m">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <slot></slot>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

// 添加 leng='less' 格式就没有问题了
<style lang="less" >
.hm-header {
  height: 40px;
  .m {
    position: fixed;
    z-index: 999; //提升层级
    width: 100%;
    height: 40px;
    background-color: #f4f4f4;
    border-bottom: 1px solid #ccc;

    display: flex;
    text-align: center;
    align-items: center;

    .left,
    .right {
      width: 30px;
    }
    .center {
      flex: 1;
      font-weight: 700;
      font-size: 14px;
    }
  }
}
</style>


