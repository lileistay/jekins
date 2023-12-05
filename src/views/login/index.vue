<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">{{ VUE_APP_SYSTEM_NAME }}</h3>
        <div class="min-title">Time group management system</div>
      </div>
      <!-- 取消企业地域 -->

      <!-- <el-form-item prop="enterprise"> -->
      <!-- <span class="svg-container">
          <i class="el-icon-s-flag" />
        </span> -->
      <!-- <el-input
          ref="enterprise"
          v-model="loginForm.enterprise"
          placeholder="请输入企业域"
          name="enterprise"
          type="text"
          tabindex="1"
          clearable
          autocomplete="on"
        /> -->
      <!-- </el-form-item> -->
      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user-solid" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名称"
          name="username"
          type="text"
          tabindex="1"
          clearable
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <i class="el-icon-lock" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入登录密码"
            name="password"
            tabindex="2"
            autocomplete="new-password"
            show-password
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
      </el-tooltip>
      <el-button :loading="loading" type="primary" style="margin-top: 6px; width:100%;" @click.native.prevent="handleLogin" @keyup.enter.native="handleLogin">登 录
      </el-button>
      <div class="footer">
        <div>{{ VUE_APP_SYSTEM_RECORD }}</div>
        <div>{{ VUE_APP_SYSTEM_INTRODUCE }}</div>
      </div>
    </el-form>
  </div>
</template>

<script>

import { GetCurrentBrowser, GetOs } from '@/utils/systemTool'
import { removeToken } from "@/utils/auth.js"
import { getrandom } from '@/utils/randomNumber';
export default {
  name: 'Login',
  components: {
    GetCurrentBrowser,
    GetOs
  },
  data() {
    // const validateEntErprise = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入企业域'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateUsername = (rule, value, callback) => {
      // !validUsername(value)
      if (value === '') {
        callback(new Error('请输入用户名称'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      VUE_APP_SYSTEM_NAME: process.env.VUE_APP_SYSTEM_NAME,
      VUE_APP_SYSTEM_RECORD: process.env.VUE_APP_SYSTEM_RECORD,
      VUE_APP_SYSTEM_INTRODUCE: process.env.VUE_APP_SYSTEM_INTRODUCE,
      // 登录表单
      loginForm: {
      //  enterprise : '',
        username: '',
        password: '',
        type: 'pc'
      },
      // 表单校验规则
      loginRules: {
        // enterprise: [{ required: true, trigger: 'blur', validator: validateEntErprise }],
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      browser: '',
      judgepassword: 0
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.$store.dispatch('clearCache',[])
    // this.logings()
    // 获取浏览器和系统版本
    // this.browser = GetCurrentBrowser()
    // this.os = GetOs()
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    // if (this.loginForm.enterprise === '') {
    //   this.$refs.enterprise.focus()}
    window.addEventListener("beforeunload",e=>this.beforeunloadHandler(e))
    window.addEventListener('unload', e => this.beforeunloadHandler(e))
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
    window.removeEventListener("beforeunload",e=>this.beforeunloadHandler(e))
     window.removeEventListener('unload', e => this.beforeunloadHandler(e))
  },
  methods: {
    /**
     * @auther  wanghu
     * @date    2023/02/21
     * @desc    操作浏览器窗口之前执行
     */
    beforeunloadHandler(){
      let _gap_time=new Date().getTime()-this._beforeUnload_time;
      if(_gap_time<=5){
        removeToken()
      }
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    // logings() {
    //   document.onkeyup = e => {
    //     if (e.keyCode === 13) {
    //       this.handleLogin()
    //     }
    //   }
    // },
    async handleLogin() {
      await this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await this.$store.dispatch('Login', this.loginForm).then((res) => {
            if (res) {
              localStorage.setItem('userId',res.data.userId);
              localStorage.setItem('username',res.data.username)
              this.judgePassword()
              this.$router.push({ path: '/', query: { judgePassword: this.judgepassword }})
              this.$store.dispatch('setLogin',{Loginconnect:getrandom()})
              localStorage.removeItem('isTrue')
              this.$api.menu.getRouters()
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    judgePassword() {
      this.$api.login.judgePassword().then(res => {
        if (res) {
          if (res.data === 602) {
            this.judgepassword = 1
          }
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$deep-color: #333;
$light_gray: #fff;
$cursor: #999;
$primary-color: #36c2aa;
$primary-fouc-color: #36c2aa7d;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.el-button--primary {
  background-color: $primary-color;
  border-color: $primary-color;
}

.el-button--primary:hover, .el-button--primary:focus {
  background-color: $primary-fouc-color;
  border-color: $primary-fouc-color;
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $deep-color;
      height: 40px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $light_gray inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-color: $light_gray;
    border-radius: 5px;
    color: #454545;
    border: 1px solid #dbdbdb;
  }
  .el-form-item {
    margin-bottom: 22px;
}
}
</style>

<style lang="scss" scoped>
$bg: #36c2aa;
$white-bg: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;
$title-color: #1abc9c;

.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    transform: translateY(30%);
    width: 460px;
    height: 460px;
    max-width: 100%;
    padding: 60px 60px 0;
    margin: 0 auto;
    background-color: $white-bg;
    overflow: hidden;
    border-radius: 10px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 40px;
    font-size: 22px;
    color: #cccccc;
    display: inline-block;
  }

  .title-container {
    position: relative;
    padding-bottom: 10px;

    .title {
      font-size: 28px;
      color: $title-color;
      margin: 0px auto 5px auto;
      text-align: center;
      font-weight: bold;
      padding-bottom: 13px;
    }

    .min-title {
      font-size: 20px;
      height: 40px;
      margin: auto;
      text-align: center;
      color: $title-color;
      padding-bottom: 12px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
  .footer{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    z-index: 9999;
    color: #cccccc;
    font-size: 12px;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
    line-height: 22px;
    margin-bottom: 6px;
  }
}
</style>
