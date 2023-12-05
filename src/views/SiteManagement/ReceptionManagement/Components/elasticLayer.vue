<template>
  <!-- 点击未成交项目的弹层 -->
  <sg-dialog
    title="未成交项目"
    :dialog="dialogVisible"
    size="60%"
    @handleClose="butclose"
  >
    <div slot="out">
      <el-form
        size="mini"
        label-width="100px"
      >
        <el-row style="width:100%">
          <el-col :span="5">
            <el-form-item label="产品名称：">
              <el-input v-model="dateline.projectName" />
            </el-form-item>
          </el-col>
          <!--        <el-col :span="5">-->
          <!--          <el-form-item label="简码：">-->
          <!--            <el-input></el-input>-->
          <!--          </el-form-item>-->
          <!--        </el-col>-->
          <el-col :span="10">
            <el-form-item label="产品价格：">
              <el-input v-model="dateline.priceOne" style="width: 30%" />
              至
              <el-input v-model="dateline.endpriceOne" style="width: 30%" />
            </el-form-item>
          </el-col>
          <el-col
            :span="7"
            style="margin-left:5px"
          >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="search"
            >搜索</el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-edit-outline"
              @click="parentadd"
            >导入</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="emptyList"
            >清空</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-row class="two">

        <el-col
          :span="5"
          style="height:100%"
          class="lefts"
        >
          <div>
            <span class="span">产品类型</span>
          </div>
          <div class="product">
            <!--          <el-tree style="width:100%"-->
            <!--                   :data="deptOptions"-->
            <!--                   :props="defaultProps"-->
            <!--                   @node-click="handleNodeClick">-->
            <!--            <span slot-scope="{data,node}"-->
            <!--                  class="custom-tree-node">-->
            <!--              <span @dblclick="dbClicks(data,node)">-->
            <!--                <b v-if="!data.children"-->
            <!--                   class="el-icon-document" />-->
            <!--                <b v-else-->
            <!--                   class="el-icon-folder-opened" />-->
            <!--                {{data.label}}-->
            <!--              </span>-->
            <!--            </span>-->

            <!--          </el-tree>-->

            <!--          <Tree :options="options"-->
            <!--                :defaultProps="defaultProps"-->
            <!--                @node-click="treeNodeClick"-->
            <!--                @update="update" />-->
            <div class="chang">
              <el-tree :data="bookProjectList" :props="defaultProps" :highlight-current="true" style="margin-bottom: 15px" @node-click="treeNodeClick">
                <span slot-scope="{ node,data }" style="width: 100%" class="custom-tree-node">
                  <span style="width: 100%">
                    <b v-if="!data.departmentInfoVos" class="el-icon-document" />
                    <b v-else-if="node.expanded" class="el-icon-folder-opened" />
                    <b v-else class="el-icon-folder" />
                    {{ node.label }}
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col
          :span="18"
          style="height:100%"
          class="right"
        >
          <div>
            <span>产品列表</span>
            <el-table
              style="width: 100%"
              :data="keshi"
              size="mini"
              border
              height="200px"
            >
              <el-table-column
                label="产品名称"
                prop="projectName"
                width="120px"
              />
              <el-table-column
                label="简码"
                prop="shorCode"
                width="100px"
              />
              <el-table-column
                label="单位"
                prop="priceUnit"
              />
              <el-table-column
                label="价格"
                prop="priceOne"
              />
              <el-table-column
                label="价格2"
                prop="priceTwo"
              />
              <el-table-column
                label="是否打折"
                prop="isDiscount"
                :formatter="discount"
              />
              <el-table-column
                label="折扣"
                prop="discountNumber"
              />
              <el-table-column
                label="次数"
                prop="priceNum"
              />
              <el-table-column fixed="right">
                <template slot-scope="{row}">
                  <el-button
                    size="mini"
                    @click="additionalData(row)"
                  >添加</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="rightTwo">
              <el-table
                style="width: 100%"
                :data="list"
                size="mini"
                border
                height="200px"
              >
                <el-table-column
                  label="产品名称"
                  prop="projectName"
                  width="120"
                />
                <el-table-column
                  label="简码"
                  prop="shorCode"
                  width="100"
                />
                <el-table-column
                  label="单位"
                  prop="priceUnit"
                />
                <el-table-column
                  label="价格"
                  prop="priceOne"
                />
                <el-table-column
                  label="价格2"
                  prop="priceTwo"
                />
                <el-table-column
                  label="是否打折"
                  prop="isDiscount"
                  :formatter="discount"
                />
                <el-table-column
                  label="折扣"
                  prop="discountNumber"
                />
                <el-table-column
                  label="次数"
                  prop="priceNum"
                />
               <el-table-column fixed="right">
                  <template slot-scope="{row}">
                    <el-button size="mini" @click="DeleteButton(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

        </el-col>

      </el-row>
    </div>
  </sg-dialog>
</template>

<script>
// 引入树形组件
import sgDialog from '@/components/Dialog'

export default {
  dicts:['discount'],
  components: {
    sgDialog
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dateline: {
        projectName: '' // 产品名称
      },
      bookProjectList: [], //
      billing: {},
      options: [], // 树形的所有数据
      // deptOptions: undefined,//部门树的数据
      // Department: [],//所有科室的数据列表
      newList: [],
      keshi: [], // 点击后获取的数据
      list: [],
      seletabel: [],
      defaultProps: {
        children: 'departmentInfoVos',
        label: 'departmentName'
      }
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
  // 监听部门ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
      // this.projectTreeselect(val)
      this.getBookProjectList(val)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getBookProjectList()
    // this.projectTreeselect(this.deptId)
  },
  methods: {
    /**
     * @author 王发发
     * @date 2022/5/23
     * @Description: 格式化折扣的
    */
    // 格式化折扣
    discount(row, column, cellValue, index) {
      const objs = this.dict.type.discount.find((item) => {
        return item.value == cellValue
      })
      return objs ? objs.label : ''
    },
    /**
     * @author 王发发
     * @date 2022/5/23
     * @Description: 添加给第二个表格的删除按钮的方法
    */
    // 弹层的第二个表格的删除按钮
    DeleteButton(e){
      let arr = this.list
      let id1 = arr.findIndex((arr) => arr.itemId === e.itemId)//id1为对象的数组下标
      this.list.splice(id1, 1)
    },
    treeNodeClick(data) {
      if ('departmentInfoVos' in data) {
        // this.addBan = true
        this.projectList = []
      } else {
        // this.addBan = false
        this.$api.product.productManagement({ categoryId: data.departmentId }).then(res => {
          if (res) {
            this.keshi = res.rows
          }
        })
      }
    },
    // 项目列表
    getBookProjectList() {
      this.showDataDialog = true
      this.$api.modules.netPower.projectTreeselect({
        deptId: this.deptId,
        departmentId: this.departmentId
      }).then(res => {
        this.bookProjectList = res.data
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    butclose() {
      this.$emit('update:dialogVisible', false)
      this.keshi = []
      this.list = []
    },
    // 树形所有数据
    projectTreeselect(deptId) {
      this.$api.modules.netPower.projectTreeselect({ deptId: deptId }).then((res) => {
        if (res) {
          this.options = res.data
        }
      })
    },
    update(data) {
      this.$api.product.productManagement({ categoryId: data.departmentId }).then((res) => {
        if (res) {
          this.keshi = res.rows
        }
      })
    },
    // 点击清空按钮
    emptyList() {
      this.keshi = []
      this.list = []
    },
    // 点击添加
    additionalData(data) {
      let flag = true
      this.list.forEach((item) => {
        if (item.itemId === data.itemId) {
          flag = false
          return
        }
      })
      if (flag) {
        this.list.push(data)
      } else {
        this.$message.warning('不能重复添加')
      }
    },
    // 第二个列表添加
    parentadd() {
      this.$emit('updata', this.list)
    },
    // 点击搜索按钮
    search() {
      this.$api.product.productManagement({
        deptId: this.deptId,
        departmentId: this.billing.departmentId,
        projectName: this.dateline.projectName,
        priceOne: this.dateline.priceOne,
        endpriceOne: this.dateline.endpriceOne
      }).then(res => {
        this.keshi = res.rows
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.two {
  height: 500px;
  .lefts {
    height: 100%;
    border: 1px solid #999;
    border-radius: 5px;
    margin-right: 10px;
    overflow: auto;

    & .span {
      position: absolute;
      margin: -12px 0 0 14px;
      background-color: #fff;
      z-index: 99;
    }
  }
  .product {
    //display: flex;
    margin-top: 10px;
  }
  .right {
    height: 100%;
    padding: 10px;
    border: 1px solid #999;
    border-radius: 5px;

    & span {
      position: absolute;
      margin: -20px 0 0 14px;
      background-color: #fff;
    }
    .rightTwo {
      margin-top: 50px;
    }
  }
}
::v-deep .el-dialog__close {
  border: 1px solid #909399;
  border-radius: 50%;
  background-color:#909399 ;
  color: #ffffff !important;
}
::v-deep .el-dialog__header {
  background-color: #1abc9c !important;
  .el-dialog__title {
    color: #fff !important;
  }
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  z-index: 999999;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 3px;
  height: 20px;
  background: #dcdcdc;
}
::v-deep .el-scrollbar {
  width: 100%;
  height: 100%;
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
