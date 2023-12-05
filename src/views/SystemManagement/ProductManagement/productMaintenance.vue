<template>
  <!-- 产品信息维护 -->
  <el-scrollbar>
    <div>
      <el-row>
        <el-col :span="4">
          <div style="padding-left: 10px;padding-top: 5px">选择科室</div>
          <el-tree
            ref="tree"
            :data="deptOptions"
            :props="defaultProps"
            :highlight-current="true"
            node-key="id"
            node-expand="nextChild"
            @node-click="handleNodeClick"
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
        </el-col>
        <el-col :span="20">
          <sg-table
            :columns="columns"
            size="mini"
            index="序号"
            :table-data="tableData"
            :operate="operate"
            :pagination="pagination"
            selection
            border
            :header-style="{backgroundColor: '#f2f2f2'}"
            @operateClick="operateClick"
            @size-change="sizeChange"
            @current-change="currentChange"
            @selection-change="handleSelectionChange"
            @changeImg="changeImg"
            :hideSearchBar="hideSearchBar"
          >
            <div slot="searchBar" class="herder">
              <div>
                <el-form ref="form" :inline="true" :model="form" size="mini" label-width="100px">
                  <el-form-item label="产品名称" prop="projectName">
                    <el-input v-model="form.projectName" clearable @keyup.enter.native="getData(true)" />
                  </el-form-item>
                  <el-form-item label="产品状态">
                    <el-select filterable v-model="form.priceStatus" clearable>
                      <el-option
                        v-for="dict in dict.type.product_status"
                        :key="dict.value"
                        :value="dict.value"
                        :label="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="项目分类">
                    <el-select v-model="form.productItemType" clearable filterable :filter-method="handleFilter">
                      <el-option
                        v-for="dict in productItem"
                        :key="dict.productItemTypeId"
                        :value="dict.productItemTypeId"
                        :label="dict.productItemTypeName"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>

              </div>
              <div>
                <el-button
                  size="mini"
                  icon="el-icon-search"
                  type="primary"
                  plain
                  @click.native="getData(true)"
                  @keydown.enter.native="getData(true)"
                >搜索</el-button>
              </div>
            </div>
            <template #custom="data">
              <div v-if="data.props === 'isDiscount'">
                <show-dict-data :options="dict.type.whether" :value="data.custom.isDiscount" />
              </div>
              <div v-else-if="data.props === 'priceStatus'">
                <show-dict-data :options="dict.type.product_status" :value="data.custom.priceStatus" />
              </div>
            </template>
            <div slot="header" class="herder">
              <div>
                列表清单
                <span> <i class="one" />下架产品</span>
                <span><i class="two" />待审核产品</span>
              </div>
              <div>
                <el-button
                  v-hasPermi="['confinement:projectInfo:add']"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  :disabled="addBan"
                  @click="addto"
                >添加
                </el-button>
                <el-button
                  v-hasPermi="['confinement:projectInfo:daoru']"
                  size="mini"
                  type="info"
                  icon="el-icon-download"
                  @click="handleImport"
                >导入
                </el-button>
                <el-button
                  v-hasPermi="['confinement:projectInfo:remove']"
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  :disabled="single"
                  @click.stop="handleDelete"
                >删除
                </el-button>
              </div>
            </div>
          </sg-table>
        </el-col>
      </el-row>
      <!-- 导入组件 -->
      <import-template
        ref="import"
        :upload="upload"
        @downloadTemplate="downloadTemplate"
        @handleClose="handleClose"
        @handleFileUploadProgress="handleFileUploadProgress"
        @handleFileSuccess="handleFileSuccess"
        @handleFileClose="handleFileClose"
        @submitFileForm="submitFileForm"
      />
    </div>
  </el-scrollbar>
</template>

<script>
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import importTemplate from '@/components/ImportTemplate'
import PinyinMatch from 'pinyin-match'
// import bus from '@/utils/bus'

export default {
  dicts: ['product_status', 'whether', 'product_classification'],
  components: { SgTable, importTemplate },
  data() {
    return {
      hideSearchBar:false,
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 上传的地址
        url: '/api/confinement/projectInfo/importData'
      },
      showDataDialog: false,
      // 非单个禁用
      single: true,
      addBan: true,
      // trees: true,
      // 树结构
      deptOptions: [],
      defaultProps: {
        children: 'departmentInfoVos',
        label: 'departmentName'
      },
      // 搜索的值
      form: {
        projectName: undefined,
        priceStatus: '0',
        categoryId: '',
        productItemType: undefined
      },
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      tableData: [], // 表格数据
      // 操作
      operate: {
        name: '操作',
        width: '140',
        fixed: 'right',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['confinement:projectInfo:edit']
          },
          {
            lab: '复制',
            type: 'danger'
          }
        ]
      },
      columns: [
        {
          lab: '产品名称',
          val: 'projectName',
          width: 350
        },
        {
          lab: '价格1',
          val: 'priceOne'
        },
        {
          lab: '价格2',
          val: 'priceTwo'
        },
        {
          lab: '状态',
          val: 'priceStatus',
          custom: 'priceStatus'
        },
        {
          lab: '是否打折',
          val: 'isDiscount',
          custom: 'isDiscount'
        },
        {
          lab: '折扣',
          val: 'discountNumber'
        },
        {
          lab: '项目分类',
          val: 'productItemTypeName',
          width: 110
        },
        {
          lab: '业务类型',
          val: 'pbcName'
        },
        {
          lab: '费用类型',
          val: 'expenseTypeName'
        },
        {
          lab: '产品单位',
          val: 'priceUnit'
        },
        {
          lab: '次数',
          val: 'priceNum'
        },
        {
          lab: '科室',
          val: 'departmentName'
        },
        {
          lab: '自定义分类',
          val: 'productCustomTypeName',
          width: 120
        }
      ], // 表格的列
      lonang: false,
      custype: [],
      departmentId: '',
      departmentName: '',
      projectTypeId: '',
      projectTypeName: '',
      categoryName: '',
      categoryId: '',
      treeClickCount: 0,
      productItem: [],
      copyProductItem: [],
      treelist: []
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
      this.getBookProjectList(val)
      this.getData()
      this.getProductItem()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getBookProjectList(this.deptId)
    this.getProductItem()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  activated() {
    if (!this.$route.meta.noCache) {
      this.getData(false)
    }
  },
  methods: {
    nextChild(val, hs) {
      console.log(hs.target)
    },
    handleFilter(val) {
      if (val) {
        this.productItem = this.copyProductItem.filter((item) => {
          if (item.productItemTypeName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.productItemTypeName, val)
        })
      } else {
        this.productItem = this.copyProductItem
      }
    },
    // 产品项目分类
    getProductItem() {
      this.$api.product.productitemtyList({ deptId: this.deptId }).then(res => {
        if (res) {
          this.productItem = res.rows
          this.copyProductItem = this.productItem
        }
      })
    },
    // 获取树形结构的数据
    getBookProjectList(deptId) {
      this.$api.modules.netPower.projectTreeselect({ deptId: deptId }).then(res => {
        this.deptOptions = res.data
        this.deptOptions.forEach((value, index) => {
          value.id = index
        })
        setTimeout(function() {
          const tree = document.querySelectorAll('.el-tree-node')
          for (let i = 0; i < tree.length; i++) {
            // if(tree[i].parentNode.cla)
            if (tree[i].parentNode.className == 'el-tree el-tree--highlight-current') {
              tree[i].setAttribute('Index', i)
              tree[i].classList.add('treesearch')
            }
          }
        }, 50)
      })
    },
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handlecompile(e[1])
          break
        case '复制':
          this.handledcopy(e[1])
      }
    },
    // 搜索显示与隐藏
    changeImg(e){
      this.hideSearchBar=!e
      console.log(e,'搜索显示与隐藏')
    },
    // 添加
    addto() {
      this.$router.push({
        path: 'productInfo',
        // query: {
        //   deptId: this.deptId,
        //   departmentId: this.departmentId,
        //   categoryId: this.categoryId,
        //   projectTypeId: this.projectTypeId,
        //   categoryName: this.categoryName
        // }
      })
      const  query= {
        deptId: this.deptId,
        departmentId: this.departmentId,
        categoryId: this.categoryId,
        projectTypeId: this.projectTypeId,
        categoryName: this.categoryName
      }
      sessionStorage.setItem("productMaintenance", JSON.stringify(query));
    },
    // 编辑
    handlecompile(e) {
      // console.log('数据单', e)
      const itemIds = e.itemId
      this.$router.push({
        path: 'productInfo',
        // query: {
        //   itemId: itemIds,
        //   deptId: this.deptId,
        //   departmentId: e.departmentId,
        //   categoryId: e.categoryId,
        //   projectTypeId: e.projectTypeId,
        //   categoryName: e.categoryName
        // }
      })
      const  query= {
        itemId: itemIds,
        deptId: this.deptId,
        departmentId: e.departmentId,
        categoryId: e.categoryId,
        projectTypeId: e.projectTypeId,
        categoryName: e.categoryName
      }
      sessionStorage.setItem("productMaintenance", JSON.stringify(query));
    },
    // 复制
    handledcopy(e) {
      // console.log('复制', e)
      const itemIds = e.itemId
      const  query= {
        itemId: itemIds,
        categoryId: e.categoryId,
        projectTypeId: e.projectTypeId,
        categoryName: e.categoryName,
        departmentId: e.departmentId,
        handleType: '1'
      }
      sessionStorage.setItem("productMaintenance", JSON.stringify(query));
      this.$router.push({
        path: 'productInfo',
        // query: {
        //   itemId: itemIds,
        //   categoryId: e.categoryId,
        //   projectTypeId: e.projectTypeId,
        //   categoryName: e.categoryName,
        //   departmentId: e.departmentId,
        //   handleType: '1'
        // }
      })

    },
    // 搜索
    getData: debounce(function(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.form = {
        deptId: this.deptId,
        categoryId: isSearch==false?this.categoryId:'',
        projectName: this.form.projectName,
        priceStatus: this.form.priceStatus,
        productItemType: this.form.productItemType
      }
      this.showDataDialog = true
      this.$api.product.productManagement({
        ...this.form,
        ...this.pagination
      }).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    // 分页
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    // 导入
    handleImport() {
      this.upload.title = '产品导入'
      this.upload.open = true
    },
    /**
     * @author Nevin
     * @date 2022/8/12
     * @Description: 下载模板
     */
    downloadTemplate() {
      this.$api.product.importTemplate()
    },
    /**
     * @author Nevin
     * @date 2022/8/12
     * @Description: 导入中方法
     */
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    /**
     * @author Nevin
     * @date 2022/8/12
     * @Description: 导入成功方法
     */
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.getData()
    },
    /**
     * @author Nevin
     * @date 2022/8/12
     * @Description: 提交方法
     */
    submitFileForm() {
      // this.$refs.upload.submit()
    },
    /**
     * @author Nevin
     * @date 2022/8/12
     * @Description: 关闭弹窗
     */
    handleFileClose() {
      this.upload.open = false
    },
    handleClose() {
      this.upload.open = false
    },
    // 节点点击事件
    handleNodeClick(data, val, hs) {
      let flag = ''
      this.categoryId = data.departmentId
      this.categoryName = data.departmentName
      this.projectTypeId = data.projectTypeId
      this.projectTypeName = data.projectTypeName
      this.departmentId = data.categoryId
      this.departmentName = data.categoryName
      if (val.parent.parent == null) {
        this.treelist.forEach(value => {
          if (value == data.id) {
            flag = true
          }
        })
        if (!flag) {
          this.treelist.push(data.id)
        }
        const that = this
        setTimeout(function() {
          const tree = document.querySelectorAll('.el-tree-node')
          const trees = document.querySelectorAll('.el-tree-node__expand-icon')
          for (let i = 0; i < tree.length; i++) {
            if (tree[i].parentNode.className == 'el-tree el-tree--highlight-current') {
              tree[i].setAttribute('Index', i)
              tree[i].classList.add('treesearch')
            }
          }
          if (that.treelist.length > 1) {
            const tree = document.querySelectorAll('.treesearch')
            if (tree[that.treelist[0]].children[0].children[0].className == 'expanded el-tree-node__expand-icon el-icon-caret-right') {
              tree[that.treelist[0]].children[0].children[0].click()
            }
            that.treelist.splice(0, 1)
          }
        }, 50)
      }
      if (data.categoryId >= 1) {
        this.addBan = false
        this.getData(false)
      } else {
        this.addBan = true
      }
      // 多余放弃
      // if (!data.categoryId) {
      //   this.addBan = true
      //   this.getData()
      // } else if (data.departmentInfoVos === null || data.departmentInfoVos === undefined) {
      //   this.addBan = false
      //   this.getData()
      // } else {
      //   this.addBan = true
      // }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      /**
       * @author 李尚
       * @date 2022/8/15
       * @Description: selection[1].map(item => item.itemId)点击选择框的时候拿到的是一个数组，数组点一个便是所点击的id
       */
      const ids = selection[1].map(item => item.itemId)
      this.departmentId = ids[0]
      this.single = selection[1].length === 0
    },
    // 删除
    handleDelete(e) {
      this.$confirm('此操作将永久此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const itemIds = e.itemId || this.departmentId
        this.$api.user.projdeles(itemIds).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 0;
}

>>> .el-dialog .el-dialog__body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.left {
  padding-bottom: 5px;
}

.herder {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: center;

  &:nth-child(1) div span {
    margin-left: 20px;
    font-size: 14px;

    .one,
    .two {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 3px;
      border-radius: 3px;
      background-color: yellow;
      border: 1px solid yellow;
    }

    .two {
      background-color: green;
      border: 1px solid green;
    }
  }
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
