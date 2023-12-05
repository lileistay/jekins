<template>
  <el-scrollbar>
    <div class="management" style="margin-bottom: 20px">
      <div class="formBody">
        <div class="itemment">产品关联信息
        </div>
        <el-form ref="form" class="mentform" :model="form" size="mini" label-width="100px" style="margin-top:10px ">
          <el-row :gutter="24">
            <el-col :span="4">
              <el-form-item label="产品名称:">
                <el-input v-model="form.projectName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="产品信息:">
                <el-button type="primary" icon="el-icon-plus" plain @click="productList">选择产品</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="4">
              <el-form-item label="物资名称:">
                <el-input v-model="form.materialName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="物资信息:">
                <el-button type="primary" icon="el-icon-plus" plain @click="material">选择物资</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--产品信息-->
      <sg-dialog
        title="产品信息"
        :dialog="lodingproduct"
        size="60%"
        @handleClose="productClose"
      >
        <div slot="out">
          <el-form :inline="true" :model="formproduct" class="demo-form-inline" size="mini">
            <el-form-item label="物资名称:">
              <el-input v-model="formproduct.projectName" placeholder="模板名称" clearable style="width: 120px" />
            </el-form-item>
            <el-form-item label="产品价格:">
              <el-input-number v-model="formproduct.priceOne" :precision="2" style="width: 100px;margin-right: -18px" />
              至
              <el-input-number v-model="formproduct.endpriceOne" :precision="2" style="width: 100px;" />
            </el-form-item>
            <el-button style="float:right;margin-left: 10px" type="danger" size="mini" @click="productClose">关闭
            </el-button>
            <el-button style="float:right;" type="primary" icon="el-icon-search" size="mini" @click="search">搜索
            </el-button>
          </el-form>
          <div class="formBodys">
            <div class="form-left">
              <div class="title">产品信息</div>
              <el-tree
                :data="bookProjectproduct"
                :props="defaultproduct"
                :highlight-current="true"
                style="margin-bottom: 15px"
                @node-click="treeNodeproduct"
              >
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
            <div class="form-right">
              <div class="title">产品列表</div>
              <div style="margin-top: 10px;height: 237px;overflow: auto;">
                <el-table :data="projectList" size="mini" height="237px" style="width: 100%; overflow: scroll;">
                  <el-table-column prop="projectName" label="产品名称" width="200" align="center" />
                  <el-table-column prop="priceUnit" label="单位" align="center" />
                  <el-table-column prop="specs" label="规格" align="center" />
                  <el-table-column prop="priceOne" label="价格一" align="center" />
                  <el-table-column prop="priceTwo" label="价格二" align="center" />
                  <el-table-column prop="isDiscount" label="是否打折" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isDiscount === '0'">否</span>
                      <span v-if="scope.row.isDiscount === '1'">是</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="discountNumber" label="折扣" align="center" />
                  <el-table-column prop="priceNum" label="次数" align="center" />
                  <el-table-column label="操作" align="center" width="60" fixed="right">
                    <template slot-scope="scope">
                      <el-button type="text" size="mini" @click="handleClick(scope.$index, scope.row)">添加</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </sg-dialog>
      <!--物资信息-->
      <sg-dialog
        title="物资信息"
        :dialog="dialogVisible"
        size="60%"
        @handleClose="handleClose"
      >
        <div slot="out">
          <el-form :inline="true" :model="femptree" class="demo-form-inline" size="mini">
            <el-form-item label="物资名称:">
              <el-input v-model="femptree.materialName" clearable style="width: 120px" />
            </el-form-item>
            <el-form-item label="简码:">
              <el-input v-model="femptree.shortCode" clearable style="width: 120px" />
            </el-form-item>
            <el-form-item label="编码:">
              <el-input v-model="femptree.materialCode" clearable style="width: 120px" />
            </el-form-item>
            <el-button style="float:right; margin-left: 10px" type="danger" size="mini" @click="handleClose">关闭
            </el-button>
            <el-button style="float:right;" type="primary" icon="el-icon-search" size="mini" @click="getTree">搜索
            </el-button>
          </el-form>
          <div class="formBodys">
            <div class="form-left">
              <div class="title">物资类型</div>
              <el-tree
                default-expand-all
                :filter-node-method="filterNode"
                :data="deptOptions"
                :props="defaultProps"
                highlight-current
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
                @current-node-key="currentNodeKey"
              >
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
            <div class="form-right">
              <div class="title">物资列表</div>
              <div style="margin-top: 10px;height: 427px;overflow: auto;">
                <el-table
                  :data="templateData"
                  size="mini"
                  border
                  height="395px"

                  :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
                  :cell-style="{'text-align':'center', 'font-size':'12px'}"
                >
                  <el-table-column prop="shortCode" label="简码" width="120" />
                  <el-table-column prop="materialName" label="物资名称" />
                  <el-table-column prop="materialCode" label="物资编码" />
                  <el-table-column prop="materialSpec" label="规格" />
                  <el-table-column prop="unitName" label="单位" />
                  <el-table-column prop="isMaterial" label="是否关键物资">
                    <template #default="scope">
                      <p v-if="scope.row.isMaterial==='0'">是</p>
                      <p v-if="scope.row.isMaterial==='1'">否</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="isDiscount" label="现有库存" />
                  <el-table-column prop="minStock" label="最小库存" />
                  <el-table-column prop="priceNum" label="操作" fixed="right">
                    <template slot-scope="{row}">
                      <el-button size="mini" @click="additionalData(row)">添加</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  v-if="pagination.show"
                  ref="pagination"
                  class="pagination"
                  style="display:flex;justify-content: center"
                >
                  <el-pagination
                    size="mini"
                    background
                    style="background: #fff;"
                    :page-sizes="pagination.sizes?pagination.sizes:[10,20, 30, 40, 50]"
                    :page-size="pagination.pageSize"
                    :layout="pagination.layout?pagination.layout:'total, sizes, prev, pager, next, jumper'"
                    :total="pagination.total"
                    :current-page="pagination.currentPage"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </sg-dialog>
      <div class="footer">
        <div class="content">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-folder-checked"
            :loading="submitLoading"
            @click="addOrEdit"
          >保存
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="remode">关闭</el-button>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import sgDialog from '@/components/Dialog'
import { debounce } from '@/utils/throttleAndDebounce'
import vm from '@/utils/util'

export default {
  dicts: ['whether'],
  name: 'ProductAssociationAdd',
  components: {
    sgDialog
  },
  data() {
    return {
      form: {
        projectName: '',
        itemId: '',
        materialName: '',
        matTypeId: '',
        materId: ''
      },
      formproduct: {},
      femptree: {},
      templateData: [], // 物资列表
      dialogVisible: false, // 弹框
      // 产品
      lodingproduct: false,
      projectList: [],
      bookProjectproduct: [],
      defaultproduct: {
        children: 'departmentInfoVos',
        label: 'departmentName'
      },
      // 树结构
      deptOptions: [], // 树 的数据
      defaultProps: {
        children: 'sonList',
        label: 'name'
      },
      submitLoading: false, // 保存按钮 loding
      pagination: {
        pageSize: 10, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      queryList:{}
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
  // 监听公司ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getTreeselect()
    this.getbookProjectproduct()
    // this.$route.query.date
    // this.$route.query.item
   this.queryList = JSON.parse(sessionStorage.getItem("productAssociationitem"))
    this.queryData()
  },
  methods: {
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    queryData() {
      this.form.itemId = this.queryList.itemId
      this.form.marId = this.queryList.marId
      this.form.materId = this.queryList.materId
      this.form.whouseId = this.queryList.whouseId
      this.form.materialName = this.queryList.materialName
      this.form.projectName = this.queryList.projectName
    },
    // 报存
    addOrEdit() {
      if (this.queryList != '') {
        const data = {
          itemId: this.form.itemId,
          matTypeId: this.form.matTypeId,
          materId: this.form.materId,
          whouseId: this.form.whouseId
        }
        console.log('this.form', this.form, data)
        this.$api.storageRoom.materialAuxiliaryRelationEdit(this.form).then(res => {
          if (res) {
            this.$message.success('修改成功')
            this.$router.push({ path: '/productAssociation' })
          }
        })
      } else {
        const data = {
          deptId: this.deptId,
          itemId: this.form.itemId,
          matTypeId: this.form.matTypeId,
          materId: this.form.materId,
          whouseId: this.form.whouseId
        }
        this.$api.storageRoom.materialAuxiliaryRelationAdd(data).then(res => {
          if (res) {
            this.$message.success('添加成功')
            this.$router.push({ path: '/productAssociation' })
          }
        })
      }
    },
    // 物资按钮
    material() {
      this.dialogVisible = true
    },
    handleClose() {
      this.femptree = {}
      this.dialogVisible = false
    },
    productList() {
      this.lodingproduct = true
    },
    handleClick(index, row) {
      this.form.itemId = row.itemId
      this.form.projectName = row.projectName
      this.lodingproduct = false
    },
    // 物资列表添加
    additionalData(row) {
      this.form.whouseId = row.whouseId
      this.form.materId = row.materId
      this.form.matTypeId = row.matTypeId
      this.form.materialName = row.materialName
      this.dialogVisible = false
    },
    // 产品搜索
    search: debounce(function() {
      // console.log('你好', this.deptId)
      this.$api.product.productManagement({
        deptId: this.deptId,
        projectName: this.formproduct.projectName,
        priceOne: this.formproduct.priceOne,
        endpriceOne: this.formproduct.endpriceOne,
        priceStatus:'0'
      }).then(res => {
        this.projectList = res.rows
      })
    }),
    // 产品
    getbookProjectproduct() {
      this.$api.modules.netPower.projectTreeselect({
        deptId: this.deptId,
        isFuZhu: '1' // 是否只取辅助治疗
      }).then(res => {
        this.bookProjectproduct = res.data
      }).finally(() => {
        console.log('报错了')
      })
    },
    treeNodeproduct(data) {
      if (this.timer) {
        // 如果数据正在请求阻止并删除上次请求
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        if ('departmentInfoVos' in data) {
          this.projectList = []
        } else {
          this.categoryId = data.departmentId
          this.$api.product.productManagement({ categoryId: data.departmentId, deptId: this.deptId,priceStatus:'0' }).then(res => {
            if (res) {
              this.projectList = res.rows
            }
          })
        }
      }, 500)
    },
    // 树结构
    getTreeselect() {
      this.$api.storageRoom.materialTypeListTree({ deptId: this.deptId }).then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    // 节点点击事件
    handleNodeClick(data, val) {
      console.log(data, 'sss')
      if (data.sonList !== undefined) {
        return
      }
      if (data.type === '1') {
        this.$set(this.femptree, 'whouseId', data.whouseId)
        this.$delete(this.femptree, 'typeId')
        this.$delete(this.femptree, 'matTypeId')
      } else if (data.type === '2') {
        this.$delete(this.femptree, 'whouseId')
        this.$delete(this.femptree, 'matTypeId')
        this.$set(this.femptree, 'typeId', data.whouseId)
      } else if (data.type === '3') {
        this.$delete(this.femptree, 'whouseId')
        this.$delete(this.femptree, 'typeId')
        this.$set(this.femptree, 'matTypeId', data.whouseId)
      }
      this.$set(this.femptree, 'deptId', this.deptId)
      const query = {
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.pageNum,
        currentPage: this.pagination.currentPage,
        matTypeId: data.id
      }
      const list = { ...this.femptree, ...query }
      this.$api.storageRoom.materialInfoLst(list).then(res => {
        if (res) {
          this.templateData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    // 当前选中的节点
    currentNodeKey(num) {
      console.log(num, 'num')
    },
    // 导入物资-搜索
    getTree() {
      this.$delete(this.femptree, 'whouseId')
      const query = {
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.pageNum,
        currentPage: this.pagination.currentPage
      }
      const list = { ...this.femptree, ...query }
      this.$api.storageRoom.materialInfoLst(list).then(res => {
        if (res) {
          this.templateData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 产品
    productClose() {
      this.formproduct = {}
      this.lodingproduct = false
    },
    remode() {
      this.closeTag()
    },
    handleSizeChange(e) {
      this.pagination.pageSize = e

      this.getTree()
    },
    handleCurrentChange(e) {
      console.log(e, 'esse')
      this.pagination.pageNum = e
      this.pagination.currentPage = e
      this.getTree()
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  height: 8px !important;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px !important;
  background: #dcdcdc !important;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  background: transparent !important;
}
::v-deep .el-input-number__decrease {
  display: none;
}

::v-deep .el-input-number__increase {
  display: none;
}

//number 宽度调整
::v-deep .el-input-number .el-input__inner {
  padding: 0;
  width: 80px;
}

.management {
  margin: 10px 40px;
}

.formBody {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 15px 20px 20px 20px;
  box-sizing: border-box;
  position: relative;
  margin: 20px 0;

  .itemment {
    position: absolute;
    top: -12px;
    left: 40px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }
}

.itemment {
  color: #1abc9c;
  font-size: 14px;
  font-weight: 600;
}

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 35px;
  background-color: #fff;
  z-index: 1000;

  .content {
    position: fixed;
    right: 20px;
  }
}

.formBodys {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 40px 20px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 15px;

  .title {
    position: absolute;
    top: -11px;
    left: 25px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }

  .form-left {
    width: 25%;
    min-height: 260px;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
  }

  .form-right {
    width: 73%;
    min-height: 260px;
    border-radius: 10px;
    position: relative;
    border: 1px solid #c6c6c6;
  }
}

// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #1abc9c !important;
}

::v-deep .el-pagination.is-background .btn-prev {
  background: none;
}

::v-deep .el-pagination.is-background .btn-next {
  background: none;
}
</style>
