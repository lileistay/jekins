<template>
  <div>
    <Tree :clums="clums" :operation="operation" :isShowfile="isShowfile" :emitWidth="emitWidth" :tableData="tableData"
          :showDefault="showDefault"
          @changeCompay="changeCompay" >

      <!-- 自定义页面 -->
      <template v-slot:company>
        <slot class="top">
          <component
            :is="comName"
            :btn-disabled="btnDisabled"
            :dept-id="jie"
            @xiehuan="twoType"
            @updata="deptBook"
            @fold="fold"
          />
        </slot>
      </template>
    </Tree>
  </div>
</template>
<script>
import Tree from '@/components/newTree/index'
// 一层
import depts from '@/views/SystemManagement/ProductManagement/ProductType/dept'
// 二级
import twoType from '@/views/SystemManagement/ProductManagement/ProductType/type'
// 三级别
import deptBook from '@/views/SystemManagement/ProductManagement/ProductType/project'
import SgTable from '@/components/Table'
import slideSearch from '@/components/SlideSearchBar/index'
export default {
  components: {
    Tree,
    SgTable,
    slideSearch,
    depts,
    twoType,
    deptBook,
  },
  created(){
    //模拟数据
  },
  data() {
    return {
      tableData: [],
      emitWidth:'250px',
      //表格表头
      clums: [ ],
      //操作按钮
      operation: [],

      //是否显示树形文件
      isShowfile: false,
      //是否显示默认组件
      showDefault:false,
      //表格数据
      comName: 'depts',
      showDialog: false, // 显示弹层
      jie: 0, // 记录点击节点的数据
      btnDisabled: true
    }
  },
  methods: {
    fold(e){
      this.emitWidth=e;
    },
    // 点击获取当前的数形的数据
    handleNodeClick(data,item) {
      // this.jie = data
      if (item.children !== undefined) {
        // this.comName = 'depts'
        this.btnDisabled = true
      } else {
        this.comName = 'depts'
        this.jie = data
        this.btnDisabled = false
      }
    },
    // 跳转组件
    twoType(deptId) {
      this.btnDisabled = false
      this.jie = deptId
      this.comName = 'twoType'
      // this.jie = deptId
    },
    // 跳转第三层组件
    deptBook(onde) {
      this.btnDisabled = false
      this.jie = onde
      this.comName = 'deptBook'
    },

    newdelete(data) {
      console.log(data)
    },

    //点击树形三级的回调
    changeCompay(id,item) {
      this.handleNodeClick(id,item)
    }

  }
}
</script>
<style scoped></style>