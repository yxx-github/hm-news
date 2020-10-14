<template>
  <div>
    <!-- 头部 -->
    <hm-header>我的关注</hm-header>

    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="$axios.defaults.baseURL + item.head_img" alt>
        </div>
        <div class="center">
          <div class="nickname">{{item.nickname}}</div>
          <div class="date">{{item.create_date | date}}</div>
        </div>
        <div class="right" @click="unfollow(item.id)">取消关注</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [] // 关注的用户列表
    }
  },
  created() {
    // this.follow()
    this.getFollowsList()
  },
  methods: {
    // 获取关注的用户列表
    async getFollowsList() {
      let res = await this.$axios.get('/user_follows')
      this.list = res.data.data
    },
    // 取消关注的用户
    async unfollow(id) {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要取消关注吗?'
        })
        let res = await this.$axios.get(`/user_unfollow/${id}`)
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          // 弹框
          this.$toast.success(message)
          // 再次获取最新的列表
          this.getFollowsList()
        }
      } catch (error) {
        console.log('取消')
      }
    }
    // // 模拟关注用户
    // async follow() {
    //   let res = await this.$axios.get('/user_follows/8')
    //   this.getFollowsList()
    // }
  }
}
</script>

<style lang="less" scoped>
.list {
  .item {
    height: 90px;
    border-bottom: 1px solid #ccc;

    display: flex;
    align-items: center;
    padding: 0 20px;
    .left {
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    .center {
      flex: 1;
      padding-left: 20px;
      height: 50px;
      line-height: 25px;

      .nickname {
        font-size: 14px;
      }
      .date {
        color: #999;
      }
    }
    .right {
      background-color: #ddd;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      border-radius: 15px;
    }
  }
}
</style>
