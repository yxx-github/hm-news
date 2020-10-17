import Vue from 'vue'
// 根组件
import App from './App.vue'

// 路由
import router from './router'

Vue.config.productionTip = false

// 引入全局公共样式
import './styles/base.less'
import './styles/iconfont.css'

// 引入lib-flexible
import 'lib-flexible'

// 注册公共组件
import HmHeader from './components/HmHeader.vue'
// Vue.component(组件名（小写字母加-）, HmHeader)
Vue.component('hm-header', HmHeader)

import HmLogo from './components/HmLogo.vue'
Vue.component('hm-logo', HmLogo)

import HmButton from './components/HmButton.vue'
Vue.component('hm-button', HmButton)

import HmPost from './components/HmPost.vue'
Vue.component('hm-post', HmPost)

import {
  Field,
  Toast,
  Cell,
  CellGroup,
  Dialog,
  Radio,
  RadioGroup,
  Uploader,
  List,
  Tab,
  Tabs,
  PullRefresh,
  Sticky
} from 'vant'
Vue.use(Field)
Vue.use(Toast)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Uploader)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(PullRefresh)
Vue.use(Sticky)


// 注册一个全局过滤器
import moment from 'moment'
Vue.filter('date', (val, format = 'YYYY-MM-DD') => {
  return moment(val).format(format)
})

// 处理axios
import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:3000'

// 请求拦截器
axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.authorization = token
  }
  return config
})

// 响应拦截器
// axios.interceptors.response.use(res => {
//   const {
//     statusCode,
//     message
//   } = res.data
//   if (statusCode === 401 && message === '用户信息验证失败') {

//     // 1. 删除本地失效的token
//     localStorage.removeItem('token')
//     localStorage.removeItem('user_id')

//     // 2. 跳转到 login页面
//     router.push('/login')
//   }
//   return res
// })


new Vue({
  // 挂载路由
  router,
  render: h => h(App)
}).$mount('#app')