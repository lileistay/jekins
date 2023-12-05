<template>
  <div v-show="visible" class="local-screen-container">
    <div class="local-screen-box">
      <div class="userInfo-head">
        <el-avatar :size="80" :src="url" />
      </div>
      <div class="userInfo-username">{{ userInfo.nickName }}</div>
      <div>
        <input type="password" style="display: none;">
        <el-input ref="password" v-model="password" autocomplete="off" :loading="checkPassword" placeholder="请输入登录密码" type="text" class="localInput" @focus="passwordFocus" />
        <el-button class="localButton" type="primary" @keyup.enter.native="keyuplogin" :loading="checkPassword" @click.stop="login">登录</el-button>
        <div class="errorText">{{ errorText }}</div>
      </div>
      <div class="userInfo-use-other-account" @click.stop="useOtherAccount" >使用其他账号登录</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LocalScreen',
  data() {
    return {
      checkPassword: false,
      errorText: '',
      visible: false,
      password: '',
      resolve: '',
      reject: '',
      userInfo: {},
      url: require('@/assets/avatar.jpg')
    }
  },
  created() {
    this.keyuplogin()
  },
  methods: {
    login() {},
    keyuplogin() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.login()
        }
      }
    },
    useOtherAccount() {},
    passwordFocus() {
      this.errorText = ''
      this.$refs.password.$refs.input.type = 'password'
    },
    showLocal() {
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    }
  }
}
</script>

<style scoped lang="scss">
.errorText{
  font-size: 12px;
  color: red;
  margin-top: 4px;
}
.local-screen-container{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  bottom: 0;
  transition: 0.2s;
  background-color: #7ec5b7;
  z-index: 99999;
  .local-screen-box{
    width: 400px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 20px;
    box-sizing: border-box;
    .localInput{
      width: calc(100% - 90px);
     &::v-deep input{
       border-radius: 0;
     }
    }
    ::v-deep .localButton{
      border-radius: 0;
    }
    .userInfo-head{
      width: 80px;
      margin:0 auto 20px auto;
    }
    .userInfo-username{
      width: 100%;
      margin-bottom: 30px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
    }
    .userInfo-use-other-account{
      width: 100%;
      margin-top: 20px;
      text-align:  center;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
