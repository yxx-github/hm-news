<template>
  <div>
    <!-- 头部 -->
    <hm-header>登录</hm-header>

    <!-- logo -->
    <hm-logo></hm-logo>

    <!-- 输入框 -->
    <van-field
      v-model="username"
      required
      label="用户名"
      placeholder="请输入用户名"
      :error-message="usernameErrMsg"
      clearable
      @input="checkUsername"
      @clear="clearUsername"
    />
    <van-field
      v-model="password"
      required
      label="密码"
      placeholder="请输入密码"
      :error-message="passwordErrMsg"
      clearable
      @input="checkPassword"
      @clear="clearPassword"
    />
    <!-- 按钮 -->
    <hm-button @click.native="startLogin">登录</hm-button>

    <!-- 如果没有登录 -->
    <div class="link">
      如果没有账号，请点击
      <router-link class="register" to="/register">注册</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      usernameErrMsg: '',
      passwordErrMsg: ''
    }
  },
  created() {
    // console.log(this.$route)
    // 方法1
    // const { username, password } = this.$route.query

    // 方法2
    const { username, password } = this.$route.params
    if (username && password) {
      this.username = username
      this.password = password
    }
  },
  methods: {
    // 校验用户名
    checkUsername() {
      const reg = /^1\d{3,5}$/
      if (reg.test(this.username)) {
        this.usernameErrMsg = ''
      } else {
        this.usernameErrMsg = '用户名格式错误'
      }
    },
    clearUsername() {
      this.usernameErrMsg = ''
    },
    // 校验密码
    checkPassword() {
      const reg = /^\d{3,12}$/
      if (reg.test(this.password)) {
        this.passwordErrMsg = ''
      } else {
        this.passwordErrMsg = '密码格式错误'
      }
    },
    clearPassword() {
      this.passwordErrMsg = ''
    },
    // 登录前的再次校验
    async startLogin() {
      if (
        this.username !== '' &&
        this.password !== '' &&
        this.usernameErrMsg === '' &&
        this.passwordErrMsg === ''
      ) {
        await this.$dialog.confirm({
          title: '提示',
          message: '登录吗?'
        })
        // 发送请求
        let res = await this.$axios.post('/login', {
          username: this.username,
          password: this.password
        })
        // 解构
        const { statusCode, message, data } = res.data
        if (statusCode === 200) {
          // 1.存token + 用户id
          localStorage.setItem('token', data.token)
          localStorage.setItem('user_id', data.user.id)

          // 2.提示信息
          this.$toast.success(message)

          // 3.跳转
          this.$router.push('/user')
        } else {
          this.$toast.fail(message)
        }
      } else {
        this.$toast.fail('校验失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.link {
  text-align: right;
  padding-right: 30px;
  font-size: 16px;
  .register {
    text-decoration: underline;
  }
}
</style>

