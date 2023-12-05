<template>
  <!-- 账户名称头像 -->
  <div class="choice-mechanism">
    <!--    <el-avatar :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />-->
<!--    <img src="../../../assets/images/logo.png" width="105" height="35" style="margin-right: 10px">-->
    <el-dropdown class="el-dropdown">
      <span class="el-dropdown-link">
        {{ name }} <i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <el-tree
            :data="data"
            :props="defaultProps"
            @node-click="treeClick"
          />
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'ChoiceMechanism',
  data() {
    return {
      name: '时光医疗集团',
      data: [],
      user: {},
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      treeClickCount: 0
    }
  },
  created() {
    this.user = this.$store.getters.user
    this.getData()
  },
  methods: {
    getData() {
      this.$api.dept.deptList({ status: '0' }, 'get').then(res => {
        if (res) {
          // this.name = this.user.dept.deptName
   
          this.data = this.handleTree(res.data, 'deptId')
          // localStorage.setItem('deptList',JSON.stringify(res.data));
          // console.log(res,'哈啊哈')
          // bus.$emit('deptId', res.data[0].deptId)
          // this.$store.dispatch('department', { departmentId: this.user.deptId })
        }
      })
    },
    treeClick(val) {
      this.treeClickCount++
      if (this.treeClickCount >= 2) {
        return
      }
      this.timer = window.setTimeout(() => {
        if (this.treeClickCount === 1) {
          // 把次数归零
          this.treeClickCount = 0
        } else if (this.treeClickCount > 1) {
          // 把次数归零
          this.treeClickCount = 0
          // 双击事件
          this.name = val.deptName
          // bus.$emit('deptId', val.deptId)
          this.$store.dispatch('department', { departmentId: val.deptId })
        }
      }, 300)
    }

  }
}
</script>

<style scoped lang="scss">
$color: #000;
$font-size:18px;
.choice-mechanism {
  float: left;
  height: 100%;
  display: inline-flex;
  align-items: center;
  .el-dropdown{
    display: inline-block;
    line-height: 40px;
    vertical-align: top;
    //margin-left: 10px;
    font-size: $font-size;
  }
  .el-dropdown-link{
    color: $color;
  }
}
.el-dropdown-menu{
  padding: 10px 20px;
  margin: 0;
  .el-dropdown-menu__item{
    padding: 0;
  }
}
</style>
