<template>
  <!-- 个人中心 -->
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="9" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <i class="el-icon-user-solid" /> 用户名称
                <span class="pull-right"> {{ user.userName }} </span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-phone" />手机号码
                <span class="pull-right"> {{ user.phonenumber }} </span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-message" />用户邮箱
                <span class="pull-right"> {{ user.email }} </span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-s-check" />所属公司
                <span v-if="user.dept" class="pull-right">{{ user.dept.deptName }} / {{ postGroup }}</span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-s-custom" />所属角色
                <span class="pull-right"> {{ roleGroup }} </span>
              </li>
              <li class="list-group-item">
                <i class="el-icon-date" />创建日期
                <span class="pull-right"> {{ user.createTime }} </span>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="15" :xs="20">
        <el-card>
          <div slot="header" class="header">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" @Signout="signout" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './userAvatar'
import userInfo from './userInfo'
import resetPwd from './resetPwd'
export default {
  name: 'Profile',
  components: { resetPwd, userInfo, userAvatar },
  data() {
    return {
      user: { },
      roleGroup: {},
      postGroup: {},
      activeTab: 'userinfo'
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    getdata() {
      this.$api.user.getUserProfile().then(res => {
        if (res) {
          this.user = res.data
          this.roleGroup = res.roleGroup
          this.postGroup = res.postGroup
        }
      })
    },
    signout() {
      this.$emit('signout')
    }
  }
}
</script>

<style scoped>
.list-group-item{
  list-style-type:none;
  font-size: 12px;
  padding: 13px;
  border-bottom: 1px solid #7d7d7d;
}
.pull-right{
  float:right;
}
.text-center{
  display: flex;
  justify-content: center;
}
::v-deep .el-card{
  height: 463px;
}
</style>
