<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="center">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="right">
        <i class="iconfont iconwode"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.header {
  height: 40px;
  background-color: #f00;

  display: flex;
  align-items: center;
  text-align: center;
  color: #fff;

  .left,
  .right {
    width: 60px;
  }
  .iconnew {
    font-size: 50px;
  }
  .iconwode {
    font-size: 24px;
  }
  .iconsearch {
    margin-right: 6px;
  }
  .center {
    flex: 1;
    background-color: rgba(255, 255, 255, 0.5);
    height: 30px;
    border-radius: 15px;
    line-height: 30px;
  }
}
</style>
