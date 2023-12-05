<template>
  <!----  角色管理 ----->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div >
          <sg-table
            v-if="true"

            selection
            size="mini"
            :table-data="tableData"
            :columns="columns"
            :operate="operate"
            :row-key="getRow"
            :pagination="pagination"
            @size-change="sizeChange"
            @current-change="currentChange"
            @operateClick="operateClick"
            @selection-change="handleSelectionChange"
            @changeImg="changeImg"
            :hideSearchBar="hideSearchBar"
          >
            <div slot="searchBar" style="display: flex;align-items: center">
              <div style="display: inline-block;margin-right: 10px;margin-top: -10px">
                <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
              </div>
              <el-form ref="searchForm" :model="searchBar" :inline="true" size="mini" :show-message="false">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="searchBar.roleName" clearable placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="权限字符" prop="roleKey">
                  <el-input v-model="searchBar.roleKey" clearable placeholder="请输入权限字符" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="searchBar.status" filterable clearable placeholder="角色状态">
                    <el-option label="正常" value="0" />
                    <el-option label="停用" value="1" />
                  </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
<!--                  <el-date-picker-->
<!--                    v-model="dateRange"-->
<!--                    size="small"-->
<!--                    style="width: 240px"-->
<!--                    value-format="yyyy-MM-dd"-->
<!--                    type="daterange"-->
<!--                    range-separator="-"-->
<!--                    clearable-->
<!--                    start-placeholder="开始日期"-->
<!--                    end-placeholder="结束日期"-->
<!--                  />-->
                  <el-date-picker
                    v-model="dateRange" class="inputWidth"
                    size="mini"
                    type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                    :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px;margin-right: 30px" />
                </el-form-item>
                <el-form-item>
                  <!--  v-hasPermi="['system:role:query']"-->
                  <el-button icon="el-icon-search" type="primary" @click.stop="getData(true)" @keydown.enter.native="getData(true)">搜索</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button icon="el-icon-refresh" @click="resetForm('searchForm',true)">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <template #custom="data">
              <div v-if="data.props === 'status'">
                <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
              </div>
            </template>
            <div slot="header">
              <!-- v-hasPermi="['system:roleManger:add']" -->
              <el-button size="mini" plain icon="el-icon-plus" type="primary" :disabled="btnDisabled" @click.stop="handAdd">新增</el-button>
              <!-- v-hasPermi="['system:roleManger:remove']" -->
              <el-button size="mini" plain icon="el-icon-delete" type="danger" :disabled="single" @click.stop="handleDelete">批量删除</el-button>
              <el-button size="mini" plain icon="el-icon-upload2" type="info" @click.stop="handleExport">导出</el-button>
            </div>
          </sg-table>
          <sg-dialog :title="dialogTitle" :dialog="showDialog" @handleClose="handleClose">
            <div slot="out">
              <el-form ref="sg-dialog-form" :disabled="loading" :model="form" :rules="rules" label-width="100px" size="mini">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item prop="roleName" label="角色名称">
                      <el-input v-model="form.roleName" placeholder="请输入角色名称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="roleKey">
                  <span slot="label">
                    <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
                      <i class="el-icon-question" />
                    </el-tooltip>
                    权限字符
                  </span>
                      <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="roleSort" label="角色顺序">
                      <el-input-number
                        v-model="form.roleSort"
                        class="full-width"
                        controls-position="right"
                        :min="0"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <!-- v-hasPermi="['system:role:edit']" -->
                    <el-form-item prop="status" label="角色状态">
                      <el-radio-group v-model="form.status">
                        <el-radio label="0">正常</el-radio>
                        <el-radio label="1">禁用</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="菜单权限">
                      <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
                      <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
                      <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
                      <el-tree
                        ref="menu"
                        class="tree-border"
                        style="height: 300px !important;overflow: auto !important"
                        :data="menuOptions"
                        show-checkbox
                        node-key="menuId"
                        :check-strictly="!form.menuCheckStrictly"
                        empty-text="加载中，请稍候"
                        :props="defaultProps"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item prop="remark" label="备注">
                      <el-input v-model="form.remark" :rows="4" type="textarea" placeholder="请输入内容" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item>
                  <el-button type="primary" :loading="loading" @click.stop="submitForm">确定</el-button>
                  <el-button @click="handleClose">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </sg-dialog>
          <!--    分配数据权限-->
          <sg-dialog :title="dialogTitle" size="600px" :dialog="showDataDialog" @handleClose="handleClose">
            <div slot="out">
              <el-form :model="form" size="mini" label-width="80px">
                <el-form-item label="角色名称">
                  <el-input v-model="form.roleName" :disabled="true" />
                </el-form-item>
                <el-form-item label="权限字符">
                  <el-input v-model="form.roleKey" :disabled="true" />
                </el-form-item>
                <el-form-item label="权限范围">
                  <el-select v-model="form.dataScope" filterable @change="dataScopeSelectChange">
                    <el-option
                      v-for="item in dataScopeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-show="form.dataScope == 2" label="数据权限">
                  <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
                  <el-checkbox v-model="deptNodeAll" v-hasPermi="['system:role:edit']" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
                  <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
                  <el-tree
                    ref="dept"
                    class="tree-border"
                    style="height: 300px !important;overflow: auto !important"
                    :data="deptOptions"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    :check-strictly="!form.deptCheckStrictly"
                    empty-text="加载中，请稍候"
                    :props="deptDefaultProps"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitDataScope">确 定</el-button>
                  <el-button @click="cancelDataScope">取 消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </sg-dialog>
        </div>
      </template>

    </Tree>
  </div>

</template>

<script>
import sgDialog from '@/components/Dialog/index'
import sgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter, lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear,
  todayTime
} from "@/utils/time";
export default {
  name: 'RoleManger',
  dicts: ['sys_normal_disable'],
  components: {
    sgTable,
    sgDialog,
    Tree
  },
  data() {
    return {
      // 树
      deptOption: [],
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', beforeDayTime(1))
            }
          },
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', todayTime())
            }
          },
          {
            text: '上周',
            onClick(picker) {
              picker.$emit('pick', beforeWeek(1))
            }
          },
          {
            text: '本周',
            onClick(picker) {
              picker.$emit('pick', thisWeek())
            }
          },
          {
            text: '上月',
            onClick(picker) {
              picker.$emit('pick', lastMonth())
            }
          },
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', monthData())
            }
          },
          {
            text: '上季度',
            onClick(picker) {
              picker.$emit('pick', lastQuarter())
            }
          },
          {
            text: '本季度',
            onClick(picker) {
              picker.$emit('pick', thisQuarter())
            }
          },
          {
            text: '上年',
            onClick(picker) {
              picker.$emit('pick', lastYear())
            }
          },
          {
            text: '本年',
            onClick(picker) {
              picker.$emit('pick', thisYear())
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(7)[0], todayTime()[1]])
            }
          },
          {
            text: '最近一月',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(30)[0], todayTime()[1]])
            }
          }
        ]
      },
      loadingData: false,
      loading: false,
      // 非单个禁用
      single: true,
      // 多选
      ids: [],
      // 弹窗
      showDialog: false,
      showDataDialog: false,
      dialogTitle: '',
      menuExpand: false,
      menuNodeAll: false,
      deptOptions: [],
      dateRange: [],
      deptExpand: true,
      deptNodeAll: false,
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本公司数据权限'
        },
        {
          value: '4',
          label: '本公司及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ],
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      },
      // 菜单列表
      menuOptions: [],
      // 搜索栏
      searchBar: {
        roleKey: undefined,
        roleName: undefined,
        status: '0'
      },
      // 表单数据
      form: {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: '0',
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined
      },
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      deptDefaultProps: {
        children: 'children',
        label: 'label'
      },
      // 分页
      pagination: {
        show: true,
        total: 0,
        pageSize: 20,
        pageNum: 1
      },
      operate: {
        name: '操作',
        width: '160',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['syetem:roleManger:edit']
          },
          {
            lab: '删除',
            type: 'danger'
          },
          // {
          //   lab: '权限',
          //   type: 'primary'
          // },
          {
            lab: '分配',
            type: 'info',
            permi: ['system:roleManger:distribution']
          }
        ]
      },
      columns: [
        {
          lab: '角色编号',
          val: 'roleId',
          permi: ['system:role:query']
        },
        {
          lab: '角色名称',
          val: 'roleName'
        },
        {
          lab: '权限字符',
          val: 'roleKey'
        },
        {
          lab: '显示顺序',
          val: 'roleSort'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '创建时间',
          val: 'createTime'
        }
      ],
      btnDisabled: true,
      deptId: 0,
      hideSearchBar:false,
      tableData: []
    }
  },
  // computed: {
  //   deptIds: {
  //     get() {
  //       return this.$store.getters.departmentId
  //     },
  //     set(val) {
  //       val = this.$store.getters.departmentId
  //     }
  //   }
  // },
  watch: {
    deptIds(val) {
      this.deptIds = val
    }
  },
  created() {
    this.deptIds = this.$store.getters.departmentId
    // this.$api.role.roleList({ deptId: this.deptIds }, 'get').then(res => {
    //   if (res) {
    //     this.pagination.total = res.total
    //     this.tableData = res.rows
    //   }
    // })
    this.getTreeselect()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
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
    changeImg(e){
      this.hideSearchBar=!e
    },
    changeCompay(id,item){
      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      this.pagination.pageSize = 20
      if (item.children!==undefined){
        this.btnDisabled = true
      }else {
        this.deptId = id
        this.btnDisabled = false
        this.getData()
      }

    },
    getRow(row){
      return row.id
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /** 查询公司下拉树结构 */
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOption = res.data
          // this.getData()
        }
      })
    },
    // 节点点击事件
    handleNodeClick(data) {
      this.deptId = data.id
      if (data.children === undefined) {
        this.btnDisabled = false
        this.getData(this.deptId)
      } else {
        this.btnDisabled = true
      }
    },
    /** 提交按钮（数据权限） */
    async submitDataScope() {
      if (this.form.roleId !== undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys()
        this.$set(this.form, 'deptId', this.deptId);
        await this.$api.role.dataScope(this.form, 'put').then(res => {
          if (res) {
            this.$message.success(res.msg)
            this.showDataDialog = false
            this.getData(this.deptId)
          }
        })
      }
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.showDataDialog = false
      this.resetForm()
    },
    // 所有公司节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的公司节点
      const checkedKeys = this.$refs.dept.getCheckedKeys()
      // 半选中的公司节点
      const halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1];
      // this.pagination.pageNum=e[1];
      this.deptId=this.deptIds
      this.getData()
    },
    currentChange(e) {
      this.pagination.page = e[1]
      this.pagination.currentPage = e[1]
      this.pagination.pageNum=e[1];
      this.deptId=this.deptIds
      this.getData()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.roleId)
      this.single = selection[1].length === 0
    },
    /** 树权限（展开/折叠）*/
    handleCheckedTreeExpand(value, type) {
      if (type === 'menu') {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].menuId].expanded = value
        }
      } else if (type === 'dept') {
        const treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if (value !== '2') {
        this.$refs.dept.setCheckedKeys([])
      }
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      this.$api.menu.roleMenuTreeselect(1).then(res => {
        if (res) {
          this.menuOptions = this.handleTree(res.menus, 'menuId')
          this.showDialog = true
        }
      })
    },
    /** 所有菜单节点数据*/
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 树权限（全选/全不选）*/
    handleCheckedTreeNodeAll(value, type) {
      if (type === 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type === 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
      }
    },
    /** 树权限（父子联动）*/
    handleCheckedTreeConnect(value, type) {
      if (type === 'menu') {
        this.form.menuCheckStrictly = !!value
      } else if (type === 'dept') {
        this.form.deptCheckStrictly = !!value
      }
    },
    /** 重置表单*/
    resetForm(v1, v2) {
      if (this.$refs['sg-dialog-form']) {
        this.$refs['sg-dialog-form'].resetFields()
        this.menuExpand = false
        this.menuNodeAll = false
        this.deptExpand = true
        this.deptNodeAll = false
        this.form = {
          roleId: undefined,
          roleName: undefined,
          roleKey: undefined,
          roleSort: 0,
          status: '0',
          menuIds: [],
          deptIds: [],
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          remark: undefined
        }
      }
      if (v2) {
        this.$refs['searchForm'].resetFields()
        this.dateRange = []
        this.getData(true)
      }
    },
    /** 提交表单*/
    async submitForm() {
      await this.$refs['sg-dialog-form'].validate(async valid => {
        if (valid) {
          this.loading = true
          this.form.menuIds = this.getMenuAllCheckedKeys()
          this.$set(this.form, 'deptId', this.deptId)
          await this.$api.role.roleOperate(this.form, this.form.roleId === undefined ? 'post' : 'put').then(res => {
            if (res) {
              this.getData(this.deptId)
              this.$message.success(res.msg)
              this.showDialog = false
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    /** 删除*/
    async handleDelete(row) {
      this.$confirm('是否确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.role.roleOperate({}, 'delete', row.roleId || this.ids).then(res => {
          if (res) {
            this.getData(this.deptId)
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    /** 根据角色ID查询公司树结构 */
    async getRoleDeptTreeselect(roleId) {
      return await this.$api.dept.roleDeptTreeselect(roleId).then(res => {
        if (res) {
          this.deptOptions = res.depts
          this.searchBar.deptId = res.depts[0].id
          return res
        }
      })
    },
    /** 分配数据权限操作 */
    async handleDataScope(row) {
      this.resetForm()
      const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId)
      await this.$api.role.getRole(row.roleId, 'get').then(res => {
        if (res) {
          this.form = res.data
          this.showDataDialog = true
          this.$nextTick(() => {
            roleDeptTreeselect.then(res => {
              this.$refs.dept.setCheckedKeys(res.checkedKeys)
            })
          })
          this.dialogTitle = '分配数据权限'
        }
      })
    },
    /** 分配用户操作 */
    handleAuthUser(row) {
      const roleId = row.roleId
      this.$router.push('/role/' + roleId)
    },
    /** 操作*/
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
          break
        case '分配':
          this.handleDataScope(e[1])
          break
        case '权限':
          this.handleAuthUser(e[1])
      }
    },
    /** 根据角色ID查询菜单树结构 */
    async getRoleMenuTreeselect(roleId) {
      return await this.$api.menu.roleMenuTreeselect(roleId, 'get').then(res => {
        if (res) {
          this.menuOptions = this.handleTree(res.menus, 'menuId')
        }
        return res
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loadingData = true
      this.resetForm()
      const roleId = row.roleId
      const roleMenu = this.getRoleMenuTreeselect(roleId)
      this.$api.role.getRole(roleId, 'get').then(res => {
        if (res) {
          this.form = res.data
          this.showDialog = true
          this.$nextTick(() => {
            roleMenu.then(res => {
              const checkedKeys = res.checkedKeys
              checkedKeys.forEach((v) => {
                this.$nextTick(() => {
                  this.$refs.menu.setChecked(v, true, false)
                })
              })
            })
          })
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /** 获取数据*/
    getData: debounce(function(isSearch) {
      this.loadingData = true
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.searchBar = this.addDateRange(this.searchBar, this.dateRange)
        if (this.deptId==0){
          this.$message.warning('请选择公司查询')
          return
        }
      }
      this.$set(this.searchBar, 'deptId', this.deptId)
      this.$api.role.roleList(isSearch ? { ...this.searchBar, ...this.pagination } : { ...this.pagination,...this.searchBar}, 'get').then(res => {
        if (res) {
          this.pagination.total = res.total
          this.tableData = res.rows
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    /** 添加*/
    handAdd() {
      this.$nextTick(() => {
        this.resetForm()
        this.dialogTitle = '添加角色'
      })
      this.getMenuTreeselect()
    },
    /** 关闭*/
    handleClose() {
      this.showDialog = false
      this.showDataDialog = false
    },
    /** 导出按钮操作 */
    async handleExport() {
      var data = Object.assign({}, this.searchBar)
      data.pageSize = this.pagination.pageSize
      data.pageNum = this.pagination.pageNum
      await this.$api.role.exportRole(data)
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
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
}
.dept-table{
  width: calc(100% - 270px);
}
.date-picker {
  width: 260px;
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
.tree-border{

}
</style>
