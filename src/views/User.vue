<template>
  <div>
    <!-- 头部 -->
    <hm-header>个人中心</hm-header>
    <!-- 信息 -->
    <div class="info">
      <div class="left">
        <img :src="$axios.defaults.baseURL + info.head_img" alt>
      </div>
      <div class="center">
        <div class="nickname">
          <i v-if="info.gender === 1" class="iconfont iconxingbienan"></i>
          <i v-else class="iconfont iconxingbienv"></i>
          {{ info.nickname }}
        </div>
        <div class="date">{{ info.create_date | date }}</div>
      </div>
    </div>
    <!-- 列表 -->
    <van-cell-group>
      <van-cell @click="$router.push('/my-follow')" title="我的关注" is-link value="关注的用户"/>
      <van-cell @click="$router.push('/my-comment')" title="我的跟帖" is-link value="跟帖/回复"/>
      <van-cell @click="$router.push('/mystar')" title="我的收藏" is-link value="文档/视频"/>
      <van-cell title="设置" is-link @click="$router.push('/edit')"/>
      <van-cell title="退出" is-link @click="logout"/>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {}
    }
  },
  async created() {
    // 获取 token 用户id
    let token = localStorage.getItem('token')
    let user_id = localStorage.getItem('user_id')

    let res = await this.$axios.get(`/user/${user_id}`)
    // 解构
    const { statusCode, message, data } = res.data
    if (statusCode === 200) {
      // 保存用户信息
      this.info = data
    } else {
      this.$toast.fail(message)
    }
  },
  methods: {
    // 退出
    async logout() {
      try {
        // 提示框
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '你确定要退出当前账号吗？'
        })
        // 确定
        // 1. 删除 token
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')

        // 2. 提示
        this.$toast.success('退出成功！')

        // 3. 跳转到 login
        this.$router.push('/login')
      } catch (error) {
        console.log('取消')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.info {
  height: 100px;
  border-bottom: 1px solid #ccc;

  display: flex;
  padding: 0 20px;
  align-items: center;

  .left {
    img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .center {
    flex: 1;
    padding-left: 20px;
    height: 50px;
    line-height: 25px;
    font-size: 14px;
  }
}
</style>
