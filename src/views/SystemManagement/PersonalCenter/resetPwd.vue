<template>
  <!--个人中心 修改密码 -->
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="submitLoading" @click="submit">保存</el-button>
      <el-button type="danger" class="close" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import { updateUserPwd } from "@/api/system/user";

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      submitLoading: false,
      user: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20,
            pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/,
            message: '长度6-20位英文字母、数字或者符号（除空格）', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.$api.user.updateUserPwd(this.user.oldPassword, this.user.newPassword).then(res => {
            if (res) {
              this.$message.success('修改成功')
              this.submitLoading = false
              this.user = {}
              const loadingInstance = this.$loading({ lock: true, text: '正在退出，请稍候', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' })
              this.$store.dispatch('LogOut').then((res) => {
                window.location.href = '/login'
              }).finally(() => {
                loadingInstance.close()
              })
              this.close()
            }
          })
        }
      })
    },
    close() {
      this.$emit('Signout')
    }
  }
}
</script>
