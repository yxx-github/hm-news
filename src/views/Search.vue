<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <input
          @input="search_recommend"
          v-model="keyword"
          @keyup.enter="search"
          type="text"
          placeholder="请输入搜索的内容"
        >
        <i class="iconfont iconsearch"></i>
      </div>
      <div class="right" @click="search">搜索</div>
    </div>

    <!-- 搜索推荐 -->
    <div class="search_recommend" v-if="recommendList.length > 0">
      <div v-for="item in recommendList" :key="item.id">{{ item.title }}</div>
    </div>

    <!-- 列表 -->
    <div class="content" v-else-if="postList.length > 0">
      <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
    </div>

    <!-- 历史 -->
    <div class="history" v-else>
      <!-- 历史记录 -->
      <div class="title">历史记录</div>
      <div class="list">
        <div @click="clickHistoryTag(h)" class="item" v-for="h in historyList" :key="h">{{ h }}</div>
      </div>
      <!-- 热门搜索 -->
      <div class="title">热门搜索</div>
      <div class="list">
        <div @click="clickHistoryTag(hot)" class="item" v-for="hot in hotList" :key="hot">{{ hot }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      keyword: '', //搜索的内容
      postList: [], //搜索文章列表
      historyList: [], //历史记录
      hotList: ['关晓彤', '1', '情火'], //热门搜索
      recommendList: [] //搜索推荐列表
    }
  },
  created() {
    // 提前把 防抖 和 节流的函数处理好
    this.search_recommend = _.debounce(this.search_recommend, 500)

    let historyList = JSON.parse(localStorage.getItem('history_list'))
    if (historyList) {
      this.historyList = historyList
    }
  },
  watch: {
    keyword(newVal) {
      if (!newVal) {
        // 输入框内容为空时 把搜索列表清空 把搜索推荐清空
        this.postList = []
        this.recommendList = []
      }
    }
  },
  methods: {
    // 搜索
    async search() {
      console.log('搜索的内容:', this.keyword)
      // 排空，判断输入的搜索的内容是否为空 如果为空 则不需要发送请求
      if (this.keyword.trim() === '') return

      // 把搜索的内容 添加 到历史记录中
      this.historyList.unshift(this.keyword)

      // 先处理去重 去重完成后再保存到本地
      // 1.先把数组转换成集合（不重复）
      // 2.再把集合转换成数组
      this.historyList = [...new Set(this.historyList)]

      // 存到本地
      localStorage.setItem('history_list', JSON.stringify(this.historyList))

      // 发送请求
      let res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.keyword
        }
      })
      if (res.data.statusCode === 200) {
        this.postList = res.data.data
      }
      console.log(res.data)
    },
    // 点击历史记录标签
    clickHistoryTag(h) {
      // 1.赋值给 keyword
      this.keyword = h
      // 2. 搜索
      this.search()
    },
    // 搜索推荐
    async search_recommend() {
      // 排空
      if (this.keyword.trim() === '') return

      let res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.keyword
        }
      })
      if (res.data.statusCode === 200) {
        this.recommendList = res.data.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  height: 40px;
  background-color: #ddd;
  border-bottom: 1px solid #ccc;
  display: flex;
  .left,
  .right {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    justify-content: flex-start;
  }
  .center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    input {
      width: 90%;
      height: 30px;
      border: none;
      border: 1px solid #ccc;
      border-radius: 15px;
      text-indent: 2em;
    }
    i {
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
      color: #999;
    }
  }
}

.history {
  padding: 20px;
  .title {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    font-weight: 700;
    margin-top: 10px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .item {
      background-color: #ddd;
      padding: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}

.search_recommend {
  padding: 10px;
  div {
    border-bottom: 1px solid #ccc;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
  }
}
</style>
