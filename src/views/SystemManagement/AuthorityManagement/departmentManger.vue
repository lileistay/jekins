<template>
  <!-- 公司管理 -->
  <div class="MenuManger">
    <sg-table
      v-if="refreshTable"
    
      size="mini"
      :table-data="tableData"
      :columns="columns"
      :operate="operate"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="deptId"
      :pagination="{show:false}"
      :default-expand-all="isExpandAll"
      @operateClick="operateClick"
    >
      <div slot="searchBar">
        <el-form ref="searchForm" :model="searchBar" :inline="true" size="mini" :show-message="false">
          <el-form-item label="公司名称" prop="deptName">
            <el-input v-model="searchBar.deptName" placeholder="请输入公司名称" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select filterable v-model="searchBar.status" placeholder="公司状态">
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
      <div slot="header">
        <el-button v-hasPermi="['system:dept:add']" size="mini" plain icon="el-icon-plus" type="primary" @click="addDepartment">新增</el-button>
        <el-button size="mini" plain icon="el-icon-sort" type="info" @click="toggleExpandAll">展开/折叠</el-button>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
        </div>
      </template>
    </sg-table>

    <sg-dialog
      ref="sg-dialog"
      :title="dialogTitle"
      :dialog="showDialog"
      @handleClose="handleClose"
    >
      <div slot="out">
        <el-form ref="sg-dialog-form" :loading="loading" :model="form" size="mini" :rules="rules" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="上级公司" prop="parentId">
                <treeselect
                  v-model="form.parentId"
                  :disabled="loading"
                  :options="deptOptions"
                  :normalizer="normalizer"
                  placeholder="选择上级公司"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公司名称" prop="deptName">
                <el-input v-model="form.deptName" placeholder="请输入公司名称" />
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
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="负责人" prop="leader">
                <el-input v-model="form.leader" placeholder="请输入公司负责人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入负责人联系电话" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入负责人邮箱" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio label="0">正常</el-radio>
                  <el-radio label="1">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" >
              <div style="display: flex">
                <span style="color:red;position: absolute;margin-left: 30px;margin-top: 3px"> *</span>
                <el-form-item label="省份">
                  <el-select v-model="province" placeholder="请选择" style="width: 290px">
                    <el-option
                      v-for="item in areaAll"

                      :value="item.name"
                      :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

            </el-col>
            <el-col :span="12">
              <div style="display: flex">
                <span style="color:red;position: absolute;margin-left: 30px;margin-top: 3px"> *</span>
              <el-form-item label="城市" prop="provice">
                <el-select v-model="city" placeholder="请选择" style="width: 290px">
                  <el-option
                    v-for="item in cityArr"
                    :value="item.name"
                    :label="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="display: flex">
                <span style="color:red;position: absolute;margin-left: 28px;margin-top: 3px"> *</span>
              <el-form-item label="县/区" prop="provice">
                <el-select v-model="area" placeholder="请选择" style="width: 290px">
                  <el-option
                    v-for="item in areaArr"

                    :value="item.name"
                    :label="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址">
                <el-input type="textarea" :rows="5" v-model="detailAddr"></el-input>
<!--                <el-select v-model="detailAddr" placeholder="请选择">-->
<!--                  <el-option-->
<!--                    v-for="item in areaAll"-->

<!--                    :value="item.name"-->
<!--                    :label="item.name">-->
<!--                  </el-option>-->
<!--                </el-select>-->
              </el-form-item>
            </el-col>
          </el-row>
          <!--          <el-row :gutter="20">-->
          <!--            <el-col :span="12">-->
          <!--              <el-form-item label="公司类型" prop="companyType">-->
          <!--                <el-select v-model="form.companyType" style="width: 260px;" placeholder="请选择公司类型">-->
          <!--                  <el-option-->
          <!--                    v-for="dict in dict.type.company_type"-->
          <!--                    :key="dict.value"-->
          <!--                    :label="dict.label"-->
          <!--                    :value="dict.value"-->
          <!--                  />-->
          <!--                </el-select>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="submitform('sg-dialog-form')">确定</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sg-dialog>
  </div>
</template>

<script>
import sgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import { validEmail, validPhone } from '@/utils/validate'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import area from '@/utils/area'
console.log(area,'sdadhashd')
export default {
  name: 'DepartmentManger',
  dicts: ['sys_normal_disable', 'company_type'],
  components: {
    sgTable,
    sgDialog,
    Treeselect
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
      loadingData: false,
      // dialog 類型
      type: '',
      // dialog标题
      dialogTitle: '',
      areaAll:area.arrAll,
      province:"",
      city:"",
      area:"",
      cityArr:[],
      areaArr:[],
      detailAddr:"",
      // 遮罩层
      loading: false,
      // 添加弹窗
      showDialog: false,
      // 默认展开所有
      isExpandAll: true,
      // 重新渲染表格
      refreshTable: true,
      // 搜索栏数据
      searchBar: {
        deptName: '',
        status: '0'
      },
      // 公司树选项
      deptOptions: [],
      // 表单参数
      form: {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: 0,
        leader: undefined,
        phone: undefined,
        status: '0',
        email: undefined,
        companyDepartment: '0',
        province:"",
        city:"",
        area:"",

        // companyType: ''
      },
      // 表单校验规则
      rules: {
        parentId: [
          { required: true, message: '请选择上级公司', trigger: 'change' }
        ],
        deptName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '显示排序不能为空', trigger: 'change' }
        ],
        // companyType: [
        //   { required: true, message: '请选择公司类型', trigger: 'change' }
        // ],
        leader: [
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        province:[
          { required: true,message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      // 操作选项
      operate: {
        name: '操作',
        cell: [
          {
            lab: '新增',
            type: 'primary',
            permi: ['system:dept:add']
          },
          {
            lab: '修改',
            type: 'warning',
            permi: ['system:dept:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['system:dept:remove']
          }
        ]
      },
      // 表格显示的数据列
      columns: [
        {
          lab: '公司名称',
          val: 'deptName'
        },
        {
          lab: '省份',
          val: 'province'
        },
        {
          lab: '城市',
          val: 'city'
        },
        {
          lab: '县/区',
          val: 'area'
        },
        {
          lab: '排序',
          val: 'orderNum'
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
      // 表格数据
      tableData: []
    }
  },
  watch:{
    province(newV){
      if(newV!==''){
        this.selectcity();
        this.selectarea();
      }

    },
    city(newV){
      if(newV!==''){
        this.selectarea();
      }

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
    selectcity(){
      for (const i in this.areaAll) {
        const obj = this.areaAll[i]
        if (obj.name) {
          if (obj.name === this.province) {
            this.cityArr = obj.sub
            break
          }
        }
      }
      this.city=this.cityArr[0].name;
    },
    selectarea(){
      for (var i in this.cityArr) {
        var obj = this.cityArr[i]
        if (obj.name === this.city) {
          this.areaArr = obj.sub
          break
        }
      }
      if (
        this.areaArr && this.areaArr.length > 0 && this.areaArr[0].name
      ) {
        this.area= this.areaArr[0].name
      } else {
        this.area = ''
      }
    },
    /** 添加公司*/
    async addDepartment(row) {
      this.showDialog = true
      this.province=this.areaAll[0].name;
      this.$nextTick(() => {
        this.resetForm('sg-dialog-form')
        if (row !== undefined) {
          this.form.parentId = row.deptId
        }
        this.type = 'add'
      })
      this.dialogTitle = '添加公司'
      await this.$api.dept.deptList({}, 'get').then(res => {
        if (res) {
          this.deptOptions = this.handleTree(res.data, 'deptId')
        }
      })
    },
    /** 修改公司*/
    async handleUpdate(row) {
      this.$nextTick(() => {
        this.resetForm()
        this.type = 'edit'
      })
      this.dialogTitle = '修改公司'
      await this.$api.dept.dept({}, 'get', row.deptId).then(res => {
        if (res) {
          this.form = res.data
          this.province=this.form.province;
          this.city=this.form.city;
          this.area=this.form.area;
          this.$forceUpdate()
          this.showDialog = true
        }
      })
      await this.$api.dept.deptExclude({}, 'get', row.deptId).then(res => {
        if (res) {
          this.deptOptions = this.handleTree(res.data, 'deptId')
        }
      })
    },
    /** 取消的回调*/
    cancel() {
      this.showDialog = false
      this.resetForm()
    },
    /** 重置表单*/
    resetForm() {
      if (this.$refs['sg-dialog-form']) {
        this.$refs['sg-dialog-form'].resetFields()
        this.form = {
          deptId: undefined,
          parentId: undefined,
          deptName: undefined,
          orderNum: 0,
          leader: undefined,
          phone: undefined,
          status: '0',
          email: undefined,
          companyDepartment: '0'
        }
      }
      this.$refs['searchForm'].resetFields()
    },
    /** 删除操作*/
    async handleDelete(row) {
      this.$confirm('是否确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.dept.dept({}, 'delete', row.deptId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    /** 表单操作*/
    operateClick(e) {
      switch (e[0].lab) {
        case '新增':
          this.addDepartment(e[1])
          break
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    /** 关闭弹窗*/
    handleClose() {
      this.showDialog = false
    },
    /** 展开/折叠操作*/
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    /** 转换公司数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      }
    },
    /** 获取数据*/
    getData: debounce(async function(isSearch) {
      this.loadingData = true
      await this.$api.dept.deptList(isSearch ? this.searchBar : {}, 'get').then(res => {
        if (res) {
          this.tableData = this.handleTree(res.data, 'deptId')
          this.loadingData = false
        }
      })
    }),
    /** 提交表单*/
    async submitform(formName) {
      await this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          this.form.province=this.province;
          this.form.city=this.city;
          this.form.area=this.area;
          this.form.detailAddr=this.detailAddr;
          await this.$api.dept.dept(this.form, this.form.deptId !== undefined ? 'put' : 'post').then(res => {
            if (res) {
              this.getData()
              this.$message.success(res.msg)
              this.showDialog = false
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }

  }
}
</script>

