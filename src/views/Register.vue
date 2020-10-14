<template>
  <div>
    <!-- 头部 -->
    <hm-header>注册</hm-header>

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
      v-model="nickname"
      required
      label="昵称"
      placeholder="请输入昵称"
      :error-message="nicknameErrMsg"
      clearable
      @input="checkNickname"
      @clear="clearNickname"
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
    <hm-button @click.native="startRegister">注册</hm-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      nickname: '',
      password: '',
      usernameErrMsg: '',
      nicknameErrMsg: '',
      passwordErrMsg: ''
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
    // 校验昵称
    checkNickname() {
      const reg = /^[\u4e00-\u9fa5]{3,7}$/
      if (reg.test(this.nickname)) {
        this.nicknameErrMsg = ''
      } else {
        this.nicknameErrMsg = '昵称格式错误'
      }
    },
    clearNickname() {
      this.nicknameErrMsg = ''
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
    // 注册前再次校验
    async startRegister() {
      // 有值 + 格式正确
      if (
        this.username !== '' &&
        this.nickname !== '' &&
        this.password !== '' &&
        this.usernameErrMsg === '' &&
        this.nicknameErrMsg === '' &&
        this.passwordErrMsg === ''
      ) {
        // 发送请求
        let res = await this.$axios.post('/register', {
          username: this.username,
          nickname: this.nickname,
          password: this.password
        })

        // 解构
        const { statusCode, message, data } = res.data
        if (statusCode === 200) {
          // 1.提示信息
          this.$toast.success(message)

          // 2.跳转页面 第一种方法：瑕疵：参数都在地址栏暴露了
          // this.$router.push({
          //   path: '/login',
          //   query: {
          //     username: this.username,
          //     password: this.password
          //   }
          // })

          // 第二种方法：使用 name + params
          this.$router.push({
            name: 'login',
            params: {
              username: this.username,
              password: this.password
            }
          })
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

<style>
</style>