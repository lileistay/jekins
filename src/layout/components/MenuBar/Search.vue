<template>
  <!--  首页搜索框-->
  <div class="menu-bar-search">
    <el-input ref="phone" v-model="userPhone" size="mini" class="el-input" readonly onfocus="this.removeAttribute('readonly');" placeholder="请输入客户电话" @keyup.enter.native="goToBookForm">
      <i slot="suffix" class="el-input__icon el-icon-search" @click.stop="goToBookForm" />
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      userPhone: undefined
    }
  },
  methods: {
    goToBookForm() {
      if (this.userPhone !== undefined) {
        this.$router.replace({ path: 'createAppointmentForm', query: { phone: this.userPhone }})
        // this.$nextTick(() => {
        //   this.userPhone = undefined
        //   this.$refs.phone.blur()
        // })
      }
    }
  }
}
</script>

<style scoped lang="scss">
$height:30px;
$border-radius:12px;
.menu-bar-search{
  ::v-deep .el-input .el-input__inner:focus{
  height:$height;
  border-radius:$border-radius;
  background-color:#f8f8f8;
  opacity: 1;
}
  .el-input__icon{
    line-height: $height;
    font-size: 16px;
    cursor: pointer;
    transition: 0.24s;
  }
  .el-input__icon:hover{
    font-weight: bold;
    font-size: 18px;
   >>>.el-input__inner{
     height:$height;
    border-radius:$border-radius;
    background-color:#f8f8f8;
    opacity: 1;
   }
  }
}
::v-deep .el-input__inner{
  border-radius: 11px;
  opacity: 0.3;
}

</style>
