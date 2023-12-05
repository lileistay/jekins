<template>
<!--  用户管理-->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div class="userManger">
          <div class="userManger-box">

            <div class="user-table">
              <sg-table v-if="true" selection size="mini" :table-data="tableData" :columns="columns" :operate="operate"
                        :pagination="searchBar" @size-change="sizeChange" @current-change="currentChange" @operateClick="operateClick"
                        @selection-change="handleSelectionChange" :hideSearchBar="hideSearchBar" @changeImg="changeImg">
                <div slot="searchBar" class="header">

                  <div style="display: flex;align-items: center">
                    <div style="display: inline-block;margin-right: 10px;margin-top: -10px">
                      <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
                    </div>
                    <el-form ref="searchForm" :model="searchBar" :inline="true" size="mini" :show-message="false">
                      <el-form-item label="登录名" prop="userName">
                        <el-input v-model="searchBar.userName" clearable style="width: 160px" placeholder="请输入登录名" />
                      </el-form-item>
                      <el-form-item label="真实姓名" prop="nickName">
                        <el-input v-model="searchBar.nickName" clearable style="width: 160px" placeholder="请输入真实姓名" />
                      </el-form-item>
                      <el-form-item label="手机号码" prop="phonenumber">
                        <el-input v-model="searchBar.phonenumber" clearable style="width: 160px" placeholder="请输入手机号码" />
                      </el-form-item>
                      <el-form-item label="用户状态" prop="status">
                        <el-select v-model="searchBar.status" filterable clearable style="width: 160px" placeholder="角色状态">
                          <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label"
                                     :value="dict.value" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="创建时间">
<!--                        <el-date-picker v-model="dateRange" size="small" style="width: 220px" value-format="yyyy-MM-dd"-->
<!--                                        type="daterange" clearable range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />-->
                        <el-date-picker
                          v-model="dateRange" class="inputWidth"
                          size="mini"
                          type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                          :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px;margin-right: 30px" />
                      </el-form-item>
                    </el-form>
                  </div>
                  <div>
                    <el-button size="mini" icon="el-icon-search" type="primary" @click.stop="getData(true)" @keydown.enter.native="getData(true)">搜索</el-button>
                    <el-button size="mini" icon="el-icon-refresh" @click="resetForm('searchForm')">重置</el-button>
                  </div>
                </div>
                <div slot="header">
                  <el-button v-hasPermi="['system:user:add']" size="mini" plain :disabled="addBan" icon="el-icon-plus" type="primary"
                             @click="handleAdd">新增</el-button>
                  <el-button size="mini" plain icon="el-icon-delete" type="danger" :disabled="multiple"
                             @click="handleDelete">批量删除</el-button>
                  <el-button v-hasPermi="['system:user:export']" size="mini" plain icon="el-icon-download" type="info"
                             @click="handleImport">导入</el-button>
                  <el-button v-hasPermi="['system:user:import']" size="mini" plain icon="el-icon-upload2" type="info"
                             @click="handleExport">导出</el-button>
                </div>
                <template #custom="data">
                  <div v-if="data.props === 'status'">
                    <el-switch v-model="data.custom.status" active-value="0" inactive-value="1" active-color="#13ce66"
                               inactive-color="#ff4949" @change="handleStatusChange(data.custom)" />
                  </div>
                  <div v-else-if="data.props === 'postList'">
                    <el-tag v-for="posts in data.custom.postList" :key="posts.postId" style="margin: 0 4px" size="mini">{{
                        posts.postName }}</el-tag>
                  </div>
                </template>
              </sg-table>
            </div>
            <!-- 弹框-->
            <sg-dialog ref="sg-dialog" :title="dialogTitle" :dialog="showDialog" @handleClose="handleClose">
              <div slot="out" style="margin-left: 68px">
                <el-form ref="sg-dialog-form" :disabled="loading" :model="form" size="mini" :rules="rules" label-width="80px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="真实姓名" prop="nickName">
                        <el-input v-model="form.nickName" style="width: 190px;" placeholder="请输入用户昵称" maxlength="30" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="归属公司" prop="deptId">
                        <treeselect v-model="form.deptId" style="width: 190px;" :options="deptOptions" :show-count="true"
                                    :clearable="false" :disable-branch-nodes="true" placeholder="请选择归属公司" @select="handelDeptSelect" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="手机号码" prop="phonenumber">
                        <el-input v-model="form.phonenumber" style="width: 190px;" placeholder="请输入手机号码" maxlength="11" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="部门" prop="sectionId">
                        <treeselect v-model="form.sectionId" :options="sectionlist" :normalizer="normalizer"
                                    style="width: 190px;" placeholder="选择部门" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
                        <el-input v-model="form.password" style="width: 190px;" placeholder="请输入用户密码" type="password"
                                  maxlength="20" show-password />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="科室" prop="departmentId">
                        <el-select v-model="form.departmentId" style="width: 190px;" clearable filterable placeholder="请选择"
                                   @change="change">
                          <el-option v-for="item in department" :key="item.departmentId" :label="item.departmentName"
                                     :value="item.departmentId" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item v-if="form.userId == undefined" label="登录名" prop="userName">
                        <el-input v-model="form.userName" style="width: 190px;" placeholder="请输入用户名称" maxlength="30" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="角色" prop="roleIds">
                        <el-select v-model="form.roleIds" filterable style="width: 190px;" multiple placeholder="请选择">
                          <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId"
                                     :disabled="item.status == 1" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="用户性别" prop="sex">
                        <el-select v-model="form.sex" filterable style="width: 190px;" placeholder="请选择">
                          <el-option v-for="dict in dict.type.sys_user_sex" :key="dict.value" :label="dict.label"
                                     :value="dict.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="岗位" prop="postIds">
                        <el-select v-model="form.postIds" filterable multiple placeholder="请选择">
                          <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName" :value="item.postId"
                                     :disabled="item.status == 1" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" style="width: 190px;" placeholder="请输入邮箱" maxlength="50" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="用户类型" prop="employeeType">
                        <el-select v-model="form.employeeType" filterable placeholder="请选择">
                          <el-option v-for="dict in dict.type.customer_type" :key="dict.value" :label="dict.label"
                                     :value="dict.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="form.status">
                          <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{
                              dict.label }}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark" style="width: 540px;" :rows="4" type="textarea" placeholder="请输入内容" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <el-button :loading="buttenLoading" type="primary" @click="submitForm">确认</el-button>
                        <el-button @click="showDialog = false">取消</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </sg-dialog>
            <import-template ref="import" :upload="upload" @downloadTemplate="downloadTemplate"
                             @handleFileClose="handleFileClose" @handleFileUploadProgress="handleFileUploadProgress"
                             @handleFileSuccess="handleFileSuccess" @handleFileError="handleFileError" @submitFileForm="submitFileForm" />
          </div>
          <sg-dialog ref="sg-dialog" title="关联客户信息" :dialog="showDialogcustom" @handleClose="handleClosecustom" size="380px">
            <div slot="out">
              <div  style="overflow: hidden;display: flex;align-items: center;">
                <span style="color: red;">*</span>
                <span>手机号</span>
                <el-input size="mini" style="width:230px;margin-left:10px;" placeholder="请输入手机号"
                          v-model="customglphone"></el-input><span>
          <img src="@/assets/images/wh.png" alt="" style="margin-left: 10px;" title="请输入绑定微信的手机号">
        </span>
              </div>
              <div  v-if="msg" style="margin-top: 10px;"><el-checkbox @change="changeText" v-model="checked">{{msg}}</el-checkbox></div>
              <div class=""
                   style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">

                <div style="width: 160px;height: 40px;">
                  <el-button type="primary" size="mini" @click="ok">确定</el-button>
                  <el-button @click="showDialogcustomClose" size="mini">取消</el-button>
                </div>
              </div>
            </div>
          </sg-dialog>
        </div>
      </template>

    </Tree>
  </div>

</template>

<script>
import sgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { validEmail, validPhone } from '@/utils/validate'

import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import importTemplate from '@/components/ImportTemplate'
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
  name: 'UserManger',
  dicts: ['sys_normal_disable', 'sys_user_sex', 'customer_type'],
  components: {
    sgTable,
    sgDialog,
    Treeselect,
    importTemplate,
    Tree
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value !== undefined) {
        const valid = validEmail(value)
        if (!valid) {
          callback(new Error('邮箱格式不正确'))
        }
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value !== undefined) {
        const valid = validPhone(value)
        if (!valid) {
          callback(new Error('手机号码格式不正确'))
        }
        callback()
      }
    }
    return {
      showDialogcustom: false,
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
      customId: '',
      customglphone: "",
      finishTimer: undefined,
      timer: undefined,
      progressLoading: false,
      progressPercent: 0,
      fileList: [],
      buttenLoading: false,
      departmentId: 0,
      department: [],
      sectionlist: [], // 部门
      loading: false,
      showDataDialog: false,
      deptid: 0,
      // 用户导入参数
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
        url: '/api/system/user/importSysUserTemplateData'
      },
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 树形 搜索公司名称
      deptName: undefined,
      // 搜索数据
      dateRange: null,
      searchBar: {
        userName: undefined,
        nickName: undefined,
        phonenumber: undefined,
        status: '0',
        show: true,
        total: 0,
        pageSize: 20,
        pageNum: 1,
        currentPage: 1
      },
      // 岗位
      postOptions: [],
      // 角色
      roleOptions: [],
      // 表单参数
      form: {
        departmentId: null
      },
      // 默认密码
      initPassword: undefined,
      // 弹窗标题
      dialogTitle: undefined,
      showDialog: false,
      // 操作
      operate: {
        name: '操作',
        width: 300,
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['system:user:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['system:user:remove']
          },
          {
            lab: '重置密码',
            type: 'info',
            permi: ['system:user:reset']
          },
          {
            lab: '分配角色',
            type: 'info',
            permi: ['system:role']
          },
          {
            lab: '关联客户',
            type: 'info',
            permi: ['system:user:remove']
          },
        ]
      },
      // 表格显示列表
      columns: [
        {
          lab: '用户编号',
          val: 'userId',
          width: 80
        },
        {
          lab: '登录名',
          val: 'userName'
        },
        {
          lab: '真实姓名',
          val: 'nickName'
        },
        {
          lab: '公司',
          val: 'dept.deptName'
        },
        {
          lab: '岗位',
          val: 'postList',
          custom: 'postList',
          width: 280
        },
        {
          lab: '手机号码',
          val: 'phonenumber'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status',
          width: 80
        },
        {
          lab: '创建时间',
          val: 'createTime'
        }
      ],
      tableData: [],
      // 公司树
      deptOptions: undefined,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表格校验规则
      rules: {
        userName: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '用户手机号不能为空', trigger: 'blur' },
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        postIds: [
          { required: true, message: '岗位不能为空', trigger: 'blur' }
        ],
        employeeType: [
          { required: true, message: '用户类型不能为空', trigger: 'blur' }
        ]
      },
      msg:'',
      checked:false,
      forceUpdate:'',
      hideSearchBar:false,
      addBan:true
    }
  },
  // computed: {
  //   // eslint-disable-next-line vue/no-dupe-keys
  //   deptId: {
  //     get() {
  //       return this.$store.getters.departmentId
  //     },
  //     set(val) {
  //       val = this.$store.getters.departmentId
  //     }
  //   }
  // },
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
    // this.getData()
    this.getTreeselect(true)
    this.$api.config.getConfigKey('sys.user.initPassword').then(res => {
      if (res) {
        this.initPassword = res.msg
      }
    })
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
      this.searchBar.pageNum = 1
      this.searchBar.currentPage = 1
      this.searchBar.pageSize = 20
      if (item.children!==undefined){
        this.addBan = true
      }else {
        this.searchBar.deptId = id
        this.addBan = false
        this.getData()
      }

    },
    changeText(val){
      console.log(val,'aaa')
      // if (val){
      //   this.$confirm('将删除原始绑定关系是否继续？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.ok()
      //
      //   })
      // }
    },
    ok() {
      let flag = validPhone(this.customglphone);
      if (this.customglphone == '') {
        this.$message.error("请输入手机号");
      } else {
        if (flag) {
          if (this.checked){
            this.forceUpdate="1"
              this.$confirm('将删除原始绑定关系是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                let data = {
                  phone: this.customglphone,
                  userId: this.customId,
                  forceUpdate:this.forceUpdate?this.forceUpdate:''
                }
                this.$api.confinementRoom.syncClientAndService(data).then(res => {
                  if (res.code == 200) {
                    this.$message.success('关联成功');
                    this.checked=false

                    this.showDialogcustom = false
                    this.msg=''
                  }else if (res.code == 103) {
                    this.msg=res.msg
                    this.checked=false
                  }
                })
                return
              })

          }else {
            let data = {
              phone: this.customglphone,
              userId: this.customId,
              // forceUpdate:this.forceUpdate?this.forceUpdate:''
            }
            this.$api.confinementRoom.syncClientAndService(data).then(res => {
              if (res.code == 200) {
                this.$message.success('关联成功');
                this.checked=false


                this.showDialogcustom = false
              }else if (res.code == 103) {
                this.msg=res.msg
                this.checked=false
              }
            })
          }
        } else {
          this.$message.error("请输入正确的手机号");
        }
      }
      // this.checked=false

    },
    customgl(e) {
      this.msg=''
      this.customId = e.userId
      if (e.openId !== "") {
        this.$confirm('该顾客已关联客户信息，是否继续修改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.customglphone = ''
          this.showDialogcustom = true;

        })
      } else {
        this.customglphone = ''
        this.showDialogcustom = true;

      }


    },
    handleClosecustom() {
      this.showDialogcustom = false;
      this.checked=false
    },
    showDialogcustomClose(){
      this.showDialogcustom = false
      this.checked=false
      this.msg=''
    },
    change() {
      this.$forceUpdate()
    },
    // 公司选择事件
    handelDeptSelect(e) {
      this.postOptions = []
      this.department = []
      this.roleOptions = []
      if (e.id === undefined) {
        this.deptid = e
      } else {
        this.deptid = e.id
      }
      const data = {
        deptId: this.deptid,
        status: '0',
        isDepartment: '1'
      }
      this.$api.post.postList(data).then(res => {
        if (res) {
          this.postOptions = res.rows
        }
      })
      this.$api.role.roleList(data, 'get').then(res => {
        if (res) {
          this.roleOptions = res.rows
        }
      })
      this.$api.dept.DepartmentList(data).then((res) => {
        if (res) {
          this.department = res.rows
        }
      })
      // this.$api.post.sectionInfoList(data).then(res => {
      //   if (res) {
      //     if (res && res.rows.length > 0) {
      //       this.handleTree(res.rows, 'sectionId')
      this.getsection()
      // } else {
      //   this.form.sectionId = undefined
      //   this.sectionlist = []
      // }
      // }
      // })
    },
    /** 查询菜单下拉树结构 */
    async getsection() {
      var data = {
        status: '0',
        deptId: this.form.deptId
      }
      await this.$api.post.sectionInfoList(data).then(res => {
        if (res) {
          this.sectionlist = []
          const menu = { sectionId: 0, sectionName: '请选择', children: [] }
          menu.children = this.handleTree(res.rows, 'sectionId')
          this.sectionlist.push(menu)
        }
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.sectionId,
        label: node.sectionName,
        children: node.children
      }
    },
    // 节点点击事件
    async handleNodeClick(data) {
      this.searchBar.deptId = data.id
      if (data.children==undefined){
        await this.getData()
      }
    },
    /** 查询公司下拉树结构 */
    async getTreeselect(isFirst) {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          if (isFirst) {
            this.searchBar.deptId = res.data[0].id
          }
          this.deptOptions = res.data
        }
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /** 获取用户列表*/
    getData: debounce(async function (isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.searchBar.pageNum = 1
        this.searchBar.currentPage = 1
        if (this.searchBar.deptId == 1) {
          this.$message.warning('请选择公司查询')
          return
        }
      }
      this.showDataDialog = true
      await this.$api.user.userList(this.addDateRange(this.searchBar, this.dateRange), 'get').then(res => {
        if (res) {
          this.tableData = res.rows
          this.searchBar.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    /** 提交表单*/
    submitForm() {
      this.$refs['sg-dialog-form'].validate(async valid => {
        if (valid) {
          this.buttenLoading = true
          await this.$api.user.userOperator(this.form, this.form.userId ? 'put' : 'post').then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.showDialog = false
              this.getData()
            }
          }).finally(() => {
            this.buttenLoading = false
          })
        }
      })
    },
    // 分页
    sizeChange(e) {
      this.searchBar.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.searchBar.pageNum = e[1]
      this.searchBar.currentPage = e[1]
      this.getData()
    },
    // 用户状态修改
    handleStatusChange(row) {
      this.$confirm('确认要修改“' + row.userName + '”的用户状态吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const data = {
          userId: row.userId,
          status: row.status
        }
        await this.$api.user.changeUserStatus(data).then(res => {
          if (res) {
            this.getData()
            this.$forceUpdate()
            this.$message.success(res.msg)
          } else {
            row.status = row.status === '0' ? '1' : '0'
          }
        })
      }).catch(() => {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
    },
    // 重置表单
    resetForm(formName) {
      if (formName) {
        this.searchBar = {
          userName: undefined,
          phonenumber: undefined,
          status: undefined,
          show: true,
          total: 0,
          pageSize: 20,
          pageNum: 1
        }
        this.dateRange = undefined
        this.getData()
      } else {
        this.reset('sg-dialog-form')
        this.form = {
          userId: undefined,
          deptId: undefined,
          userName: undefined,
          nickName: undefined,
          password: undefined,
          phonenumber: undefined,
          email: undefined,
          sex: undefined,
          status: '0',
          remark: undefined,
          postIds: [],
          roleIds: []
        }
      }
    },
    reset(formname) {
      this.$nextTick(() => {
        if (this.$refs[formname]) {
          this.$refs[formname].resetFields()
        }
      })
    },
    // 表格操作事件
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
          break
        case '重置密码':
          this.resetPassword(e[1])
          break
        case '分配角色':
          this.distributionRole(e[1])
          break
        case '关联客户':
          this.customgl(e[1])
          break
      }
    },
    /** 新增按钮操作 */
    async handleAdd() {
      this.resetForm()
      await this.getTreeselect()
      await this.$api.user.getUser().then(res => {
        if (res) {
          this.showDialog = true
          this.dialogTitle = '添加用户'
          this.form.password = this.initPassword
          this.form.deptId = this.searchBar.deptId
          this.handelDeptSelect(this.searchBar.deptId)
        }
      })
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      await this.getTreeselect()
      const userId = row.userId
      await this.$api.user.getUser(userId, 'get').then(res => {
        this.form = res.data
        this.postOptions = res.posts
        // this.roleOptions = res.roles
        this.form.postIds = res.postIds
        this.form.roleIds = res.roleIds
        this.showDialog = true
        this.dialogTitle = '修改用户'
        this.form.password = ''
        this.handelDeptSelect({ id: row.deptId })
      })
    },
    /** 删除按钮操作 */
    async handleDelete(row) {
      const userIds = row.userId || this.ids
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$api.user.userOperator({}, 'delete', userIds).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    /** 导出按钮操作 */
    async handleExport() {
      await this.$api.user.userExport(this.searchBar)
    },
    /** 重置密码*/
    async resetPassword(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: '用户密码长度必须介于 5 和 20 之间'
      }).then(async ({ value }) => {
        const data = {
          userId: row.userId,
          password: value
        }
        await this.$api.user.resetUserPwd(data).then(res => {
          if (res) {
            this.$message.success('密码重置成功')
          }
        })
      }).catch(() => { })
    },
    /** 分配角色*/
    distributionRole(row) {
      // this.$router.push('/role/' + row.userId)
      this.$router.push({ name: 'Role' })
      sessionStorage.setItem('Roleitem',row.userId)
    },
    /** 选择*/
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.userId)
      this.single = selection[1].length !== 1
      this.multiple = !selection[1].length
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
      // this.upload.url='/api/system/user/importSysUserTemplateData'
    },
    /**
     * @author Nevin
     * @date 2022/8/10
     * @Description: 下载用户列表模板
     */
    downloadTemplate() {
      this.$api.netPower.importSysUserTemplate({
        deptId:this.searchBar.deptId
      })
    },
    /**
     * @author Nevin
     * @date 2022/8/11
     * @Description: 提交上传文件
     */
    submitFileForm() {
      // this.$refs.upload.submit()
    },
    /**
     * @author Nevin
     * @date 2022/8/11
     * @Description: 文件上传中处理
     */
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    /**
     * @author Nevin
     * @date 2022/8/11
     * @Description: 文件上传成功处理
     */
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.getData()
    },
    /**
     * @author Nevin
     * @date 2022/8/13
     * @Description: 上传失败处理
     */
    handleFileError() {
      this.upload.open = false
      this.upload.isUploading = false
    },
    /**
     * @author Nevin
     * @date 2022/8/12
     * @Description: 关闭弹窗
     */
    handleFileClose() {
      this.upload.open = false
    }
  }
}

</script>

<style scoped lang="scss">
::v-deep .el-checkbox__label{
  color: #f64747 !important;
  font-size: 12px !important;
}
.importFormBar {
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
      width: calc(100% - 0px);
      //background-color: #48c9b0;
    }
  }
}

.date-picker {
  width: 260px;
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
