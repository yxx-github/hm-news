<template>
  <div>
    <hm-floor :count="count - 1" v-if="parent.parent" :parent="parent.parent"></hm-floor>
    <div class="hm-floor" :class="{top : !parent.parent}">
      <div class="header">
        <div class="left">{{ count }}楼 {{ parent.user.nickname }}</div>
        <div class="center">{{ parent.create_date }}</div>
        <div class="right" @click="reply">回复</div>
      </div>
      <div class="content">{{ parent.content }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['parent', 'count'],
  name: 'hm-floor',
  methods: {
    reply() {
      console.log('楼层回复')
      this.$bus.$emit('reply', this.parent.id, this.parent.user.nickname)
    }
  }
}
</script>

<style lang="less" scoped>
.hm-floor {
  border: 1px solid #000;
  border-top: none;
  padding: 10px;
  background-color: #ddd;

  &.top {
    border-top: 1px solid #000;
  }
  .header {
    display: flex;
    .left {
      flex: 1;
    }
    .center {
      flex: 2;
      color: #999;
    }
    .right {
      width: 50px;
    }
  }
  .content {
    padding-top: 10px;
  }
}
</style>
