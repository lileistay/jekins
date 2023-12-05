<template>
  <!-- 菜单管理  -->
  <div class="MenuManger">
    <sg-table
      v-if="refreshTable"
      ref="tableRefL"
      :sg-ref="'tableRef'"
      size="mini"
      :table-data="tableData"
      :columns="columns"
      :operate="operate"
      :row-key="getRow"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :pagination="{show:false}"
      :default-expand-all="isExpandAll"
      @operateClick="operateClick"
      @row-click="onRowClick"
    >
      <div slot="searchBar">
        <el-form ref="searchForm" :model="searchBar" :inline="true" size="mini" :show-message="false">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="searchBar.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="searchBar.status" filterable placeholder="菜单状态">
              <el-option label="正常" value="0" />
              <el-option label="禁用" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
        </div>
        <div v-else-if="data.props==='orderNum'" >
          <div class="hiddenNumber" >
            <el-input-number v-model="data.custom.orderNum"  :min="0" @click.native="changeOrderNum($event,data.custom)" @blur="blurNum">

            </el-input-number>
          </div>

        </div>
        <div v-if="data.props === 'menuName'">
          <span >{{data.custom.menuName}}</span>
        </div>
      </template>
      <div slot="header">
        <el-button size="mini" plain icon="el-icon-plus" type="primary" @click.stop="handleAdd" v-hasPermi="['menuManger:add']">新增</el-button>
        <el-button size="mini" plain icon="el-icon-edit" type="info" @click.stop="toggleExpandAll">展开/折叠</el-button>
      </div>
    </sg-table>
    <sg-dialog
      :title="dialogTitle"
      :dialog="showDialog"
      @handleClose="handleClose"
    >
      <div slot="out">
        <el-form ref="sg-dialog-form" :disabled="loading" :model="form" size="mini" :rules="rules" label-width="100px">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="上级菜单" prop="parentId">
                <treeselect
                  v-model="form.parentId"
                  :disabled="loading"
                  :options="menuOptions"
                  :normalizer="normalizer"
                  placeholder="选择上级菜单"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="菜单类型" prop="menuType">
                <el-radio-group v-model="form.menuType">
                  <el-radio label="M">目录</el-radio>
                  <el-radio label="C">菜单</el-radio>
                  <el-radio label="F">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示排序" prop="orderNum">
                <el-input-number
                  v-model="form.orderNum"
                  class="full-width"
                  controls-position="right"
                  :min="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <span slot="label">
                  <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                    <i class="el-icon-question" />
                  </el-tooltip>
                  是否外链
                </span>
                <el-radio-group v-model="form.isFrame">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType !== 'F'" :span="12">
              <el-form-item prop="path">
                <span slot="label">
                  <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                    <i class="el-icon-question" />
                  </el-tooltip>
                  路由地址
                </span>
                <el-input v-model="form.path" placeholder="请输入路由地址" />
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType == 'C'" :span="12">
              <el-form-item prop="component">
                <span slot="label">
                  <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                    <i class="el-icon-question" />
                  </el-tooltip>
                  组件路径
                </span>
                <el-input v-model="form.component" placeholder="请输入组件路径" />
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType !== 'M'" :span="12">
              <el-form-item>
                <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
                <span slot="label">
                  <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                    <i class="el-icon-question" />
                  </el-tooltip>
                  权限字符
                </span>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType == 'C'" :span="12">
              <el-form-item>
                <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
                <span slot="label">
                  <el-tooltip content="访问路由的默认传递参数，如：`{&quot;id&quot;: 1, &quot;name&quot;: &quot;ry&quot;}`" placement="top">
                    <i class="el-icon-question" />
                  </el-tooltip>
                  路由参数
                </span>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType == 'C'" :span="12">
              <el-form-item>
                <span slot="label">
                  <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                    <i class="el-icon-question" />
                  </el-tooltip>
                  是否缓存
                </span>
                <el-radio-group v-model="form.isCache">
                  <el-radio label="0">缓存</el-radio>
                  <el-radio label="1">不缓存</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType !== 'F'" :span="12">
              <el-form-item>
                <span slot="label">
                  <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                    <i class="el-icon-question" />
                  </el-tooltip>
                  显示状态
                </span>
                <el-radio-group v-model="form.visible">
                  <el-radio
                    v-for="dict in dict.type['sys_show_hide']"
                    :key="dict.value"
                    :label="dict.value"
                  >{{ dict.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="form.menuType !== 'F'" :span="12">
              <el-form-item>
                <span slot="label">
                  <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                    <i class="el-icon-question" />
                  </el-tooltip>
                  菜单状态
                </span>
                <el-radio-group v-model="form.status">
                  <el-radio
                    v-for="dict in dict.type['sys_show_hide']"
                    :key="dict.value"
                    :label="dict.value"
                  >{{ dict.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click.stop="submitForm('sg-dialog-form')">确定</el-button>
            <el-button @click.stop="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sg-dialog>
  </div>
</template>

<script>
import sgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'MenuManger',
  dicts: ['sys_show_hide', 'sys_normal_disable'],
  components: {
    sgTable,
    sgDialog,
    Treeselect
  },
  data() {
    return {
      loadingData: false,
      // 弹窗
      dialogTitle: '',
      showDialog: false,
      // 表格展开与折叠
      refreshTable: true,
      isExpandAll: false,
      // 菜单树选项
      menuOptions: [],
      // 搜索栏
      searchBar: {
        menuName: '',
        status: '0'
      },
      // 加载
      loading: false,
      // 表单数据
      form: {
        parentId: '',
        menuType: 'M',
        isFrame: '1',
        isCache: '0',
        visible: '0',
        status: '0',
        orderNum: 0,
        menuName: '',
        menuId: ''
      },
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ]
      },
      // 操作配置项
      operate: {
        name: '操作',
        cell: [
          {
            lab: '新增',
            type: 'primary',
            permi: ['menuManger:add']
          },
          {
            lab: '修改',
            type: 'warning',
            permi: ['menuManger:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['menuManger:remove']
          }
        ]
      },
      // 表格数据展示列
      columns: [
        {
          lab: '菜单名称',
          val: 'menuName',
          align: 'left',
          className: 'colClass',
          width: 400
        },
        // {
        //   lab: '图标',
        //   val: 'icon'
        // },
        {
          lab: '排序',
          val: 'orderNum',
          custom: 'orderNum',
          width: 100
        },
        {
          lab: '权限标识',
          val: 'perms'
          // showOverflowTooltip: true
        },
        {
          lab: '组件路径',
          val: 'component'
          // showOverflowTooltip: true
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status',
          width: 120
        },
        {
          lab: '创建时间',
          val: 'createTime',
          width: 150
        }
      ],
      // 表格数据
      tableData: [],
      xflag:false
    }
  },
  created() {
    this.getData()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    blurNum(e){
      this.form.orderNum=Number(e.target.value)
      this.$api.menu.menuOperate(this.form, this.form.menuId ? 'put' : 'post').then(res => {
        if (res) {
          this.getData()
          this.$message.success(res.msg)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    changeOrderNum(e,row){
      this.$api.menu.menuOperate({}, 'get', row.menuId).then(res => {
        if (res) {
          this.form = res.data
        }
      })
    },
    getRow(row){
      return row.menuId
    },
    //
    onRowClick  (row)  {
      row[1].expanded = !row[1].expanded;
      this.$refs.tableRefL.$refs.tableRef.toggleRowExpansion(row[1], row[1].expanded)
    },
    resetForm() {
      if (this.$refs['sg-dialog-form']) {
        this.$refs['sg-dialog-form'].resetFields()
        this.form = {
          parentId: undefined,
          menuType: 'M',
          isFrame: '1',
          isCache: '0',
          visible: '0',
          status: '0',
          orderNum: 0,
          menuName: '',
          menuId: undefined
        }
      }
      this.$refs['searchForm'].resetFields()
    },
    /** 提交操作*/
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          this.$api.menu.menuOperate(this.form, this.form.menuId ? 'put' : 'post').then(res => {
            if (res) {
              this.getData()
              this.showDialog = false
              this.$message.success(res.msg)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    /** 获取数据*/
    async getData(isSearch) {
      this.loadingData = true
      await this.$api.menu.menuList(isSearch ? this.searchBar : {}, 'get').then(res => {
        if (res && res.data.length > 0) {
          res.data.forEach(item=>{
            item.expanded=false
          })
          this.tableData = this.handleTree(res.data, 'menuId');
          this.tableData.forEach(value=>{
            value.disabled=true;
          })
        } else {
          this.tableData = []
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /** 修改操作*/
    handleUpdate(row) {
      this.resetForm()
      this.getTreeselect()
      this.$api.menu.menuOperate({}, 'get', row.menuId).then(res => {
        if (res) {
          this.form = res.data
          this.showDialog = true
          this.dialogTitle = '修改菜单'
        }
      })
    },
    /** 查询菜单下拉树结构 */
    async getTreeselect() {
      await this.$api.menu.menuList({}, 'get').then(res => {
        if (res) {
          this.menuOptions = []
          const menu = { menuId: 0, menuName: '主类目', children: [] }
          menu.children = this.handleTree(res.data, 'menuId')
          this.menuOptions.push(menu)
        }
      })
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.resetForm()
      this.getTreeselect()
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId
      } else {
        this.form.parentId = 0
      }
      this.showDialog = true
      this.dialogTitle = '添加菜单'
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      }
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    /** 删除操作*/
    handleDelete(row) {
      this.$confirm('是否确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.menu.menuOperate({}, 'delete', row.menuId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    /** 取消*/
    cancel() {
      this.showDialog = false
      this.resetForm()
    },
    /** 操作*/
    operateClick(e) {
      switch (e[0].lab) {
        case '新增':
          this.handleAdd(e[1])
          break
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    /** 关闭弹窗的回调*/
    handleClose() {
      this.showDialog = false
    }
  }
}
</script>

<style scoped>
::v-deep .hiddenNumber .el-input-number__decrease{
  display: none !important;
}
::v-deep .hiddenNumber .el-input{
  width: 100px !important;
}
::v-deep .hiddenNumber .el-input__inner{
  padding:  0px !important;
  width: 50px !important;
  height: 20px;
  border: none !important;
}
::v-deep .hiddenNumber .el-input-number__increase{
  display: none !important;
}
::v-deep .colClass{
  padding-left: 100px !important;
}

</style>
