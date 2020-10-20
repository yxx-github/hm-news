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
      <div class="title line2">{{ detail.title }}</div>
      <div class="name">
        <span>{{ detail.user.nickname }}</span>
        <span>{{ detail.create_date | date}}</span>
      </div>
      <!-- 1.文本内容 (图片 + 文字) -->
      <div v-if="detail.type === 1" class="content" v-html="detail.content"></div>
      <!-- 2.视频 -->
      <video v-else :src="detail.content" controls></video>
      <!-- 点赞 -->
      <div class="bottom">
        <div @click="like" class="like" :class="{ active : detail.has_like }">
          <i class="iconfont icondianzan"></i>
          <i>{{ detail.like_length }}</i>
        </div>
      </div>
    </div>

    <div ref="box"></div>

    <!-- 评论 -->
    <div class="comments">
      <hm-comment v-for="comment in commentsList" :key="comment.id" :comment="comment"></hm-comment>
    </div>

    <!-- 底部 -->
    <div class="footer">
      <!-- input -->
      <div class="input" v-if="!isShow">
        <div class="left">
          <input ref="input" @focus="handleFocus" type="text" placeholder="写跟帖">
        </div>
        <div class="center">
          <van-icon name="chat-o" :badge="detail.comment_length"/>
        </div>
        <div class="right" @click="star">
          <van-icon name="star-o" :class="{ active: detail.has_star }"/>
        </div>
      </div>
      <!-- textarea -->
      <div class="textarea" v-else>
        <div class="left">
          <textarea
            v-model="content"
            ref="textarea"
            @blur="handleBlur"
            :placeholder="replyName ? '回复:' + replyName : '请输入内容'"
          ></textarea>
        </div>
        <div class="right">
          <div @touchstart="send" class="send">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {
        user: {}
      }, //详情页信息
      commentsList: [], //评论列表
      isShow: false, // 控制 textarea 显示与否
      replyId: '', // 回复id
      replyName: '', // 回复昵称
      content: '' // 回复/评论的内容
    }
  },
  created() {
    // console.log(this.$route.params.id)
    this.getDetail()
    this.getComments()

    // 注册事件
    this.$bus.$on('reply', async (replyId, replyName) => {
      console.log('detail:', replyId, replyName)

      // 保存 传递过来的 id和 name
      this.replyId = replyId // 用来发送
      this.replyName = replyName // 它的作用仅仅就是为了显示在 textarea 里面

      // 显示 textarea
      this.isShow = true
      // 聚焦
      await this.$nextTick()
      this.$refs.textarea && this.$refs.textarea.focus()
    })
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
    },
    // 获取评论列表
    async getComments() {
      let res = await this.$axios.get(`/post_comment/${this.$route.params.id}`)
      if (res.data.statusCode === 200) {
        this.commentsList = res.data.data
        console.log('评论列表', res.data.data)
      }
    },
    // 聚焦
    async handleFocus() {
      // 1.textarea 显示数
      this.isShow = true
      // 2.textarea 聚焦 => textarea.focus() 需要拿到 textarea 标签（DOM操作）
      // 在vue中，我们想要拿到某个标签或者组件 ===> ref ===> vue 中的 DOM 操作
      // 据更新 ,更新视图是异步的 所以要用 $nextTick()
      await this.$nextTick()
      this.$refs.textarea.focus()
    },
    // 失焦
    handleBlur() {
      this.isShow = false //不管有没有内容 textarea都要隐藏

      if (!this.content) {
        // 判断 有内容的时候不清空 没内容的时候就清空
        // 失焦的时候,让 replyId 和 replyName 清空
        this.replyId = ''
        this.replyName = ''
      }
    },
    // 点击发送
    async send() {
      console.log('发送')
      let res = await this.$axios.post(
        `/post_comment/${this.$route.params.id}`,
        {
          content: this.content,
          parent_id: this.replyId
        }
      )

      if (res.data.statusCode === 200) {
        // 提示
        this.$toast.success(res.data.message)
        // 重新请求评论
        this.getComments()
        // 清空
        this.content = ''
        this.replyId = ''
        this.replyName = ''

        // // 隐藏 textarea
        this.isShow = false

        // 滚动到某个位置
        this.$refs.box.scrollIntoView()
      }
    },
    // 收藏
    async star() {
      let res = await this.$axios.get(`/post_star/${this.$route.params.id}`)
      if (res.data.statusCode === 200) {
        // 提示
        this.$toast.success(res.data.message)
        // 重新请求数据
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

// 评论
.comments {
  border-top: 2px solid #ccc;
  padding-bottom: 40px;
}

// 底部
.footer {
  background-color: #fff;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  width: 100%;
  .input {
    height: 40px;
    display: flex;
    .left {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      input {
        width: 80%;
        height: 30px;
        border: none;
        background-color: #ddd;
        border-radius: 15px;
        text-indent: 1em;
      }
    }
    .center,
    .right {
      width: 60px;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .active {
      color: #f00;
    }
  }
  .textarea {
    height: 70px;
    display: flex;
    .left {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      textarea {
        border: none;
        width: 90%;
        height: 75%;
        border-radius: 8px;
        resize: none;
        background-color: #ddd;
        text-indent: 1em;
        padding-top: 5px;
      }
    }
    .right {
      width: 80px;
      display: flex;
      justify-content: center;
      align-items: center;

      .send {
        width: 40px;
        height: 30px;
        background-color: #f00;
        color: #fff;
        text-align: center;
        line-height: 30px;
        border-radius: 5px;
      }
    }
  }
}
</style>
