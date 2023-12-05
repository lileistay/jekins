<template>
  <!-- 客户需求 -->
  <el-scrollbar class="scrollbar">
    <div class="box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="需求类型" name="first">
          <DemandTypeList />
        </el-tab-pane>
        <el-tab-pane label="需求管理" name="second">
          <DemandList ref="DemandList" />
        </el-tab-pane>

      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<script>
import DemandTypeList from './demandTypeList'
import DemandList from './demandList'

export default {
  name: 'DemandType',
  components: {
    DemandTypeList,
    DemandList
  },
  data() {
    return {
      form: {},
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab) {
      if (tab.index === '1') {
        this.$refs.DemandList.DemandManagement() // 获取列表
        this.$refs.DemandList.DemandTypes() // 获取类型列表
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.scrollbar {
  box-sizing: border-box;
}
.box {
  height: 100%;
  padding: 10px 20px 0 20px;
}
</style>