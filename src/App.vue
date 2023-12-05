<template>
  <div id="app">
    <Loading :isTrue="istrue"></Loading>
    <Delloding :isTrueshow="istrueShow"></Delloding>
    <Sollapse :title="title" :isshow="show"></Sollapse>
    <router-view v-if="isRouterAlive" />
    <Chat></Chat>
  </div>
</template>

<script>

import Chat from '@/components/chat.vue'
import axios from 'axios'
export default {
  name: 'App',
  components: {
    Chat
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true,
      istrue: false,
      istrueShow: false,
      time: null,
      count: 0,
      title: "",
      show: false,
      ws: "",
      timer: "",
      id: '',
      timeshow: "",
      newmessage: "消息提示",
      messagelist: [],
      newjump: "",
      newmessagelist: [],
      Index: "",
      messagetz: "",
      messagetzs: "",
      alltime: "",
      ok: false,
      messageList: [],


    }
  },
  watch: {
    istrueShowFlag: {
      deep: true,
      handler: function (newV) {
        if (!newV) {
          this.istrueShow = false;
        } else {
          this.istrueShow = true;
          let that = this;
          setTimeout(function () {
            that.$store.dispatch('setTrueShow', {
              istrueShowFlag: false
            })
          }, 300)
        }

      }
    },
    isReload: {
      deep: true,
      handler: function (newV) {
        this.istrue = true;
      }
    },
    FalseisReload: {
      deep: true,
      handler: function (newV) {
        clearTimeout(this.time)
        this.time = setTimeout(() => {
          this.istrue = false
          this.time = null
        }, 400)

      },
    },

  },
  computed: {
    istrueShowFlag: {
      get() {
        return this.$store.getters.istrueShowFlag
      },
      set(val) {
        val = this.$store.getters.istrueShowFlag;
      }
    },
    isReload: {
      get() {
        return this.$store.getters.isReload
      },
      set(val) {
        val = this.$store.getters.isReload;
      }
    },
    FalseisReload: {
      get() {
        return this.$store.getters.FalseisReload
      },
      set(val) {
        val = this.$store.getters.FalseisReload;
      }
    },
    homepage: {
      get() {
        return this.$store.getters.Homepage
      },
      set(val) {
        val = this.$store.getters.Homepage
      }
    }


  },
  methods: {
    //自动检测项目更新
   async getFilesName() {
      const response = await fetch("./index.html");
      const htmlContent = await response.text();
      // console.log(htmlContent,'黑恶hi')
      // const scriptsList = new Set(getScriptUrls(htmlContent));
      // const linksList = new Set(getLinkUrls(htmlContent));
      // return {
      //   scriptsList,
      //   linksList,
      // };
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },

  },
  created() {
    let that = this;
    this.isReload = this.$store.getters.isReload;
    this.FalseisReload = this.$store.getters.FalseisReload;
    this.istrueShowFlag = this.$store.getters.istrueShowFlag
    window.addEventListener('load', function () {
      if (that.$route.path == '/login') {

      } else {
        localStorage.removeItem('isTrue')
      }

    })
    window.addEventListener('error', function (e) {
    }, null)
    // this.getFilesName();

  },
  mounted() {

    window.addEventListener('beforeunload', () => {
      this.$store.dispatch('setFresh')
      sessionStorage.setItem('$store', JSON.stringify(this.$store.state))
    })
    // 页面刷新后进行赋值
    if (!this.$store.getters.userInfo.token && sessionStorage.getItem('$store')) {
      const state = JSON.parse(sessionStorage.getItem('$store'))
      for (const k in state) {
          this.$store.dispatch(k, state[k])
      }
      setTimeout(() => {
        // sessionStorage.clear()
        if (this.$store.getters.isFresh) {
          this.$store.dispatch('setFresh')
        }
      }, 1000)
    }

    if (this.$store.getters.isLocalScreen) {
      this.$LocalScreen()
    }
  }
}
</script>
<style lang="scss">
::v-deep .el-input__inner {
  -webkit-text-security: disc !important;
}

* {
  padding: 0;
  margin: 0;
}

.el-table .normal-row {
  background-color: #eee !important;
}

::v-deep .el-textarea__inner {
  font-weight: bolder !important;
  color: #555555 !important;
}

.el-form-item--mini.el-form-item {
  margin-bottom: 13px !important;
}

.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 13px;
}

::-webkit-scrollbar {
  width: 0px;
  height: 0;

}
// @font-face {
//   font-family:'微软雅黑';
//   src: url(./styles/sims.ttf);
// }

</style>
