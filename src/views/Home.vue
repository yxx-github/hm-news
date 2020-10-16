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

    <!-- tab标签栏-导航栏 -->
    <van-tabs v-model="active" sticky>
      <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
          <!-- 分页 -->
          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            :immediate-check="false"
            finished-text="没有更多了"
          >
            <hm-post v-for="(post,index) in postList" :key="index" :post="post"></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1, //tab栏当前激活的索引
      tabList: [], // tab栏列表数据
      postList: [], // 文章列表数据
      pageIndex: 1, // 当前页码
      pageSize: 10, // 每页条数
      loading: false, // 是否在上一次的加载状态中
      finished: false, // 是否全部加载完成
      isRefreshing: false // 是否正在下拉刷新中 为false => 说明刷新完成
    }
  },
  watch: {
    active(newActive) {
      // 只要 active 发生改变了 就说明切换 tab了

      // 1.处理之前的数据
      this.postList = []
      this.pageIndex = 1

      // 2. 处理加载的问题
      this.finished = false
      this.loading = true

      // 监听到 新的索引 => 对应新的栏目 id => 重新发送新的请求 获取对应的文章列表数据
      this.getPostList(this.tabList[newActive].id)
    }
  },
  created() {
    this.getTabsList()
  },
  methods: {
    // 获取栏目列表数据
    async getTabsList() {
      let res = await this.$axios.get('/category')
      // console.log(res.data.data)
      if (res.data.statusCode === 200) {
        this.tabList = res.data.data

        // 请求成功后，才会有 tabList, 才会有id 根据 id获取对应的文章列表
        this.getPostList(this.tabList[this.active].id)
      }
    },
    // 获取文章列表数据
    async getPostList(id) {
      let res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      if (res.data.statusCode === 200) {
        // 拼接数据
        this.postList = [...this.postList, ...res.data.data]

        // 数据更新完毕 将 loading 改成 false
        this.loading = false

        // 数据更新完毕 将 isRefreshing 改成 false 说明下拉刷新完成·
        this.isRefreshing = false

        // 如果数据已经全部加载完成，将 finished 改成 true
        if (res.data.data.length < this.pageSize) {
          this.finished = true
        }
        // console.log('文章列表', this.postList)
      }
    },
    // 触底加载
    onLoad() {
      // console.log('触底')
      this.pageIndex++
      this.getPostList(this.tabList[this.active].id)
    },
    // 下拉刷新
    onRefresh() {
      // console.log('下拉')
      // 进行异步操作  ===> 默认会把 isRefreshing 改成 true
      // 下拉刷新完成后 我们需要手动把 isRefreshing 改成 false

      // 1. 处理之前的数据  清空原来的数据 + 页码改成第一页
      this.postList = []
      this.pageIndex = 1

      // 上拉刷新的时候 1页的5条数据 => 依然可以看到底部文字,原因是因为没有把 finished 改回来
      // 处理文字 所以我们要把 finished 改成 false
      this.finished = false
      this.loading = true // 防止自动触发一次底部  上一页触底了, 进入到下一页会自动触发

      // 2. 重新请求新的数据
      this.getPostList(this.tabList[this.active].id)
    }
  }
}
</script>

<style lang="less" scoped>
// 如果是组件, 可能正常的scoped 无法深入对组件内部的元素起效果  使用深度作用选择器 less ==>  /deep/
/deep/ .van-tabs__nav {
  background-color: #ddd;
}
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
