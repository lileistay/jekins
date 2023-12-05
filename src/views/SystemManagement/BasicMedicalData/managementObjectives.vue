<template>
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div class="user-table">
            <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="公司业绩" name="first" lazy>
              <departmentObjectives ref="first" :addBan="addBan" :deptids="deptids" />
            </el-tab-pane>
            <el-tab-pane label="部门业绩" name="second">
              <sectionObjection ref="second" :addBan="addBan" :deptids="deptids" />
            </el-tab-pane>
            <el-tab-pane label="个人业绩" name="third">
              <employeeObjectives ref="third" :addBan="addBan" :deptids="deptids" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>

    </Tree>
  </div>

</template>

<script>

import departmentObjectives from '@/views/SystemManagement/BasicMedicalData/departmentObjectives'
import sectionObjection from '@/views/SystemManagement/BasicMedicalData/sectionObjection'
import employeeObjectives from '@/views/SystemManagement/BasicMedicalData/employeeObjectives'
import Tree from '@/components/newTree/index'
export default {
  name: 'UserManger',
  components: {
    departmentObjectives,
    sectionObjection,
    employeeObjectives,
    Tree
  },
  data() {
    return {
      addBan:true,
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      deptids: 0, // 父子组件传值
      // 树形 搜索公司名称
      deptName: undefined,
      // 公司树
      deptOptions: undefined,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      activeName: 'first'
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
    },
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getTreeselect(true)
  },
  methods: {
    fold(){
      if(this.trans=='rotate(-180deg)'){
        this.trans='rotate(0deg)'
        this.emitWidth='0px';
      }else{
        this.trans='rotate(-180deg)'
        this.emitWidth='250px';
      }

    },
    changeCompay(id,item){
      // this.pagination.pageNum = 1
      // this.pagination.currentPage = 1
      // this.pagination.pageSize = 20


      this.handleNodeClick(id,item)
    },
    /** 查询公司下拉树结构 */
    async getTreeselect(isFirst) {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    // 节点点击事件
    async handleNodeClick(id,item) {
      if (item.children!==undefined){
        this.addBan=true
      }else {
        this.deptids = id
        this.addBan=false
      }

    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleClick(tab, event) {
    }
  }
}

</script>

<style scoped lang="scss">
.importFormBar{
  margin-top: 20px;
}
.userManger {
  .userManger-box {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .department-list {
      width: 250px;
      padding: 5px;
      box-sizing: border-box;
      .down-tree {
        height: 730px;
        display: block;
        overflow-y: scroll;
      }
      .el-tree {
        background-color: #f8f8f8;
      }
      //background-color: rebeccapurple;
    }
    .user-table {
      margin-top: 10px;
      width: calc(100% - 260px);
      //background-color: #48c9b0;
    }
  }
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
//.el-tabs--card {
//  height: calc(100vh - 200px);
//  /* overflow-y: auto; */
//}
//.el-tab-pane {
//  height: calc(100vh - 200px);
//  overflow-y: auto;
//}
</style>
