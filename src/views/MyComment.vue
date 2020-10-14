<template>
  <div>
    <!-- 头部 -->
    <hm-header>我的跟帖</hm-header>

    <!-- 列表 -->
    <van-list
      :finished="finished"
      finished-text="没有更多数据了"
      v-model="loading"
      @load="onLoad"
      :immediate-check="false"
      offset="50"
    >
      <div class="item" v-for="item in list" :key="item.id">
        <div class="date">{{ item.create_date }}</div>
        <div class="parent" v-if="item.parent">
          <div class="parent-nickname">回复: {{item.parent.user.nickname}}</div>
          <div class="parent-content line2">{{item.parent.content}}</div>
        </div>
        <div class="content">{{item.content}}</div>
        <div class="post">
          <div class="title line1">{{item.post.title}}</div>
          <i class="iconfont iconjiantou1"></i>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      pageIndex: 1, //页码
      pageSize: 5, // 每页的条数
      loading: false, // 上一次的加载
      finished: false //是否完成
    }
  },
  created() {
    this.getMyComments()
  },
  methods: {
    // 获取我的评论/跟帖
    async getMyComments() {
      let res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      // console.log(res.data)

      if (res.data.statusCode === 200) {
        this.loading = false // 代表该次加载完成
        if (res.data.data.length < this.pageSize) {
          this.finished = true
        }
        // 拼接 用 concat
        // this.list = this.list.concat(res.data.data)

        // 用展开运算符
        this.list = [...this.list, ...res.data.data]
      } else {
        this.$toast.fail(message)
      }
    },
    // 触底触发
    onLoad() {
      console.log('触底 加载更多数据') // 准备下一次加载
      // 在这里，调用 onload 的时候，默认把 loading : true this.loading = true
      this.pageIndex++
      this.getMyComments() // 这样就请求了第二页的数据
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  .date {
    height: 20px;
    line-height: 20px;
    color: #999;
  }
  .parent {
    background-color: #ddd;
    padding: 10px;
    color: #999;
    &-nickname {
      height: 20px;
      line-height: 20px;
    }
    &-content {
      font-size: 14px;
    }
  }
  .content {
    font-size: 14px;
    padding: 10px 0;
  }
  .post {
    display: flex;
    color: #999;
    .title {
      flex: 1;
    }
    .iconfont {
      width: 20px;
      text-align: center;
    }
  }
}
</style>
