<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div @click="unfollow" v-if="detail.has_follow" class="follow">已关注</div>
        <div @click="follow" v-else class="follow">关注</div>
      </div>
    </div>

    <!-- 内容 -->
    <div class="container">
      <div class="title line2">相互服务器好好发挥和的哈哈哈上海能否恢复凤凰号发回方法</div>
      <div class="name">
        <span>新华网</span>
        <span>2020-10-10</span>
      </div>
      <!-- 1.文本内容 (图片 + 文字) -->
      <div v-if="detail.type === 1" class="content" v-html="detail.content"></div>
      <!-- 2.视频 -->
      <video v-else :src="detail.content" controls></video>
      <!-- 点赞 -->
      <div class="bottom">
        <div @click="like" class="like" :class="{ active : detail.has_like }">
          <i class="iconfont icondianzan"></i>
          <i>{{detail.like_length}}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {} //详情页信息
    }
  },
  created() {
    console.log(this.$route.params.id)
    this.getDetail()
  },
  methods: {
    // 获取详情页信息
    async getDetail() {
      let res = await this.$axios.get(`/post/${this.$route.params.id}`)
      console.log('详情页信息', res.data)
      if (res.data.statusCode === 200) {
        this.detail = res.data.data
      }
    },
    // 取消关注
    async unfollow() {
      // 注意：当前请求中需要的 id 不是文章id，而是用户id
      try {
        // 1. 弹框
        await this.$dialog.confirm({
          title: '提示',
          message: '确定取消吗?'
        })
        // 2. 请求
        let res = await this.$axios.get(`/user_unfollow/${this.detail.user.id}`)
        console.log(res.data)
        if (res.data.statusCode === 200) {
          // 3.提示
          this.$toast.success(res.data.message)
          // 4. 重新获取
          this.getDetail()
        }
      } catch (error) {
        console.log('取消')
      }
    },
    // 关注
    async follow() {
      // 判断有没有登录
      let token = localStorage.getItem('token')
      if (!token) {
        this.$toast('请先登录！')
        this.$router.push({
          name: 'login',
          params: {
            back: true
          }
        })
        return
      }
      // 注意：当前请求中需要的 id 不是文章id，而是用户id
      // 1.请求
      let res = await this.$axios.get(`/user_follows/${this.detail.user.id}`)
      console.log(res.data)
      if (res.data.statusCode === 200) {
        // 2.提示
        this.$toast.success(res.data.message)
        // 3. 重新获取
        this.getDetail()
      }
    },
    // 点赞
    async like() {
      // 判断有没有登录 如果没有登录 不可以点赞 要回到登录页登录
      let token = localStorage.getItem('token')
      if (!token) {
        this.$toast('请登录！')
        this.$router.push({
          name: 'login',
          params: {
            back: true
          }
        })
        return //要 return 因为如果没有登录 就不需要进行下面的请求了
      }

      let res = await this.$axios.get(`/post_like/${this.detail.id}`)
      if (res.data.statusCode === 200) {
        // 提示
        this.$toast.success(res.data.message)
        // 重新请求
        this.getDetail()
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 头部
.header {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #ccc;
  align-items: center;
  .left {
    width: 40px;
    text-align: center;
    i {
      font-size: 20px;
    }
  }
  .center {
    flex: 1;
    i {
      font-size: 50px;
      padding-left: 10px;
    }
  }
  .right {
    width: 80px;

    .follow {
      width: 54px;
      height: 20px;
      border: 1px solid #666;
      text-align: center;
      border-radius: 10px;
      line-height: 22px;
    }
  }
}

.container {
  padding: 10px;
  .title {
    font-size: 18px;
    font-weight: 700;
    margin: 10px 0;
  }
  .name {
    color: #999;
    span {
      margin-right: 15px;
    }
  }
  .content {
    margin-top: 10px;
  }
}

/deep/ img {
  width: 100%;
}

video {
  width: 100%;
  margin-top: 10px;
}

// 点赞
.bottom {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
  .like {
    width: 80px;
    height: 30px;
    border: 1px solid #666;
    text-align: center;
    line-height: 30px;
    border-radius: 15px;
    i {
      margin: 0 5px;
      color: #666;
    }
  }
  .like.active {
    border: 1px solid #f00;
    i {
      color: red;
    }
  }
}
</style>
