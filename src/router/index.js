// 配置路由信息
import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Edit from '../views/Edit.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComment from '../views/MyComment.vue'
import MyStar from '../views/MyStar.vue'

// 细节: 项目中（模块化工程中）必须要使用 Vue.use()安装一下，把路由当成插件来使用
Vue.use(VueRouter)

// 实例化路由
const router = new VueRouter({
  routes: [{
      // 重定向
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit
    },
    {
      path: '/my-follow',
      component: MyFollow
    },
    {
      path: '/my-comment',
      component: MyComment
    },
    {
      path: '/mystar',
      component: MyStar
    }

  ]
})


// 全局前置守卫
// 1. to :   你要去哪里    305  路由对象
// 2. from  : 你从 哪里来  301  路由对象
// 3. next 是否允许进入
//   next() 允许进入
//   next(false) 不允许进入
//   next('/login') 允许进入login
router.beforeEach((to, from, next) => {
  if (to.path === '/user') {

    let token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

// 导出
export default router