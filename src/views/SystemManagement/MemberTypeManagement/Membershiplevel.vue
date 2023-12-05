<!--会员级别维护·-->
<template>
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div class="container">
          <div class="data-table">
            <sg-table
              ref="table"
              :sg-ref="'multipleTable'"
              :pagination="pagination"
              size="mini"
              :selection="true"
              :border="true"
              index="序号"
              :highlight-current-row="true"
              :table-data="tableData"
              :columns="columns"
              @size-change=" sizeChange"
              @current-change="change"
              @row-click="rowClick"
              @selection-change="handleSelectionChange"
              @changeImg="changeImg"
              :hideSearchBar="hideSearchBar"
            >
              <div slot="searchBar">
                <div style="display: flex;align-items: center">
                  <div style="display: inline-block;margin-right: 10px;margin-top: -13px">
                    <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
                  </div>
                  <el-form size="mini" :model="form" label-width="120px" :inline="true" :show-message="false">
                    <el-form-item label="级别代码：">
                      <el-input v-model="form.gradeCode" :clearable="true" />
                    </el-form-item>
                    <el-form-item label="级别名称：">
                      <el-input v-model="form.gradeName" :clearable="true" />
                    </el-form-item>
                    <el-form-item label="级别描述：">
                      <el-input v-model="form.levelDescription" :clearable="true" />
                    </el-form-item>
                    <el-form-item>
                      <el-button size="mini" type="primary" icon="el-icon-search" @click="search" @keydown.enter.native="search">搜索</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div slot="header" class="header">
                <div style="text-align: right">
                  <el-button
                    v-has-permi="['confinement:membershipLevelInfo:add']"
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    :disabled="addBan"
                    @click="addDialogs"
                  >新增
                  </el-button>
                  <el-button
                    v-has-permi="['confinement:membershipLevelInfo:delete']"
                    size="mini"
                    type="danger"
                    icon="el-icon-plus"
                    @click="deleteDialogs"
                  >删除
                  </el-button>
                </div>
              </div>
              <template #custom="data">
                <div v-if="data.props === 'dailyFlag'">
                  <span v-if="data.custom.dailyFlag==='0' ">不启用</span>
                  <span v-if="data.custom.dailyFlag==='1' ">启用</span>
                </div>
                <div v-if="data.props==='cumulativeConsumption'">
                  {{data.custom.cumulativeConsumption}} ~ {{data.custom.endCumulativeConsumption}}
                </div>
                <div v-if="data.props === 'edit'">
                  <el-button v-has-permi="['confinement:membershipLevelInfo:edit']" type="text" @click="editDialogs(data)">
                    编辑
                  </el-button>
                </div>
              </template>
            </sg-table>
          </div>

          <!--  新增 编辑-->
          <sgDialog :title="giftTitle" size="600px" :dialog="showDialogS" @handleClose="showdialogT">
            <div slot="out">
              <div class="formBody">
                <el-form
                  ref="formlist"
                  label-width="125px"
                  label-position="right"
                  :inline="true"
                  :model="formlist"
                  :rules="rules"
                  size="mini"
                  class="demo-form-inline"
                >
                  <el-form-item label="等级代码：" prop="gradeCode">
                    <el-input v-model="formlist.gradeCode" style="width: 140px;" />
                  </el-form-item>
                  <el-form-item label="等级名称：" prop="gradeName">
                    <el-input v-model="formlist.gradeName" style="width: 140px;" />
                  </el-form-item>
                  <el-form-item label="等级描述：" prop="levelDescription">
                    <el-input v-model="formlist.levelDescription" style="width: 140px;" />
                  </el-form-item>
                  <el-form-item label="累计消费金额：" prop="cumulativeConsumption" class="Mums">
                    <el-input-number v-model="formlist.cumulativeConsumption" :min="0" style="width: 60px;" />
                    ~
                    <el-input-number v-model="formlist.cumulativeConsumption1" :min="0" style="width: 60px;" />
                  </el-form-item>
                  <el-form-item label="积分比例：" prop="integralProportion">
                    <el-input v-model="formlist.integralProportion" style="width: 140px;" />
                  </el-form-item>
                  <el-form-item label="折扣比例：" prop="discountRatio">
                    <el-input v-model="formlist.discountRatio" style="width: 140px;" />
                  </el-form-item>
                  <el-form-item label="启用日累计消费：">
                    <el-select v-model="formlist.dailyFlag" filterable style="width: 140px;" placeholder="请选择">
                      <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="日累计消费金额：">
                    <el-input v-model="formlist.dailyCumulation" style="width: 140px;" />
                  </el-form-item>
                </el-form>
              </div>
              <span style="color: red">*第一次请填写会员最低等级</span>
              <div class="footer">
                <el-button size="mini" type="primary" icon="el-icon-folder-checked" @click="submit(formlist)">保存</el-button>
                <el-button size="mini" type="danger" icon="el-icon-close" @click="close">关闭</el-button>
              </div>
            </div>
          </sgDialog>
        </div>
      </template>

    </Tree>
  </div>

</template>
<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import Tree from '@/components/newTree/index'
export default {
  components: {
    Tree,
    SgTable,
    sgDialog
  },
  data() {
    return {
      tableData: [],
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      // 树形选中的公司id
      selectedDeptId: undefined,
      // 树形 搜索公司名称
      deptName: undefined,
      // 公司树
      deptOptions: undefined,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      columns: [

        {
          lab: '会员级别代码',
          val: 'gradeCode'
        },
        {
          lab: '会员级别名称',
          val: 'gradeName'
        }, {
          lab: '会员级别描述',
          val: 'levelDescription'
        },
        {
          lab: '累计消费金额',
          val: 'cumulativeConsumption',
          custom: 'cumulativeConsumption'
        },
        {
          lab: '积分比例',
          val: 'integralProportion'
        },
        {
          lab: '折扣比例',
          val: 'discountRatio'
        },
        {
          lab: '是否启用日计累消费',
          val: 'dailyFlag',
          custom: 'dailyFlag'
        },
        {
          lab: '日计累消费金额',
          val: 'dailyCumulation'
        },
        {
          lab: '操作',
          val: 'edit',
          custom: 'edit'
        }
      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      form: {},
      giftTitle: '新增',
      showDialogS: false,
      formlist: {
        cumulativeConsumption1:undefined,
      },
      statusList: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      wtrWhetherList: [
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        }
      ],
      rules: {
        gradeCode: [
          { required: true, message: '请输入等级代码', trigger: 'blur' }
        ],
        gradeName: [
          { required: true, message: '请输入等级名称', trigger: 'blur' }
        ],
        levelDescription: [
          { required: true, message: '请输入等级描述', trigger: 'blur' }
        ],
        cumulativeConsumption: [
          { required: true, message: '请输入累计消费金额', trigger: 'blur' }
        ],
        integralProportion: [
          { required: true, message: '请输入积分比例', trigger: 'blur' }
        ],
        discountRatio: [
          { required: true, message: '请输入折扣比例', trigger: 'blur' }
        ]
      },
      xflag: 0,
      editList: '',
      selectionData: [],
      giftType: [],
      hideSearchBar:false,
      addBan:true
    }
  },
  // computed: {
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
      // this.membershipLevelInfoList()
    }
  },
  created() {
    this.getTreeSelect(true)
    // this.membershipLevelInfoList()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
    this.$nextTick(function(){
      document.querySelector('.el-table__header-wrapper').children[0].children[1].children[0].children[1].children[0].style.padding='0px'
    })
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
      this.addBan=true
      }else {
        this.addBan=false

        this.selectedDeptId = id
        // 查询的时候的表单
        this.form.deptId = id
        // 修改新增的时候的表单
        this.formlist.deptId = id
        this.membershipLevelInfoList()
      }

    },
    /** 查询公司下拉树结构 */
    async getTreeSelect(isFirst) {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点点击事件
    async handleNodeClick(data) {
      if (data.children === undefined) {
        this.selectedDeptId = data.id
        // 查询的时候的表单
        this.form.deptId = data.id
        // 修改新增的时候的表单
        this.formlist.deptId = data.id
        await this.membershipLevelInfoList()
      } else {
        this.selectedDeptId = undefined
      }
    },
    // 新增按钮
    addDialogs() {
      this.xflag = 0
      this.showDialogS = true
    },
    // 编辑按钮
    editDialogs(val) {
      this.editList = val.custom
      this.xflag = 1
      this.showDialogS = true
      this.giftTitle = '修改'
      this.formlist = {
        deptId: this.editList.deptId,
        gradeCode: this.editList.gradeCode,
        gradeName: this.editList.gradeName,
        levelDescription: this.editList.levelDescription,
        cumulativeConsumption: this.editList.cumulativeConsumption,
        integralProportion: this.editList.integralProportion,
        discountRatio: this.editList.discountRatio,
        dailyFlag: this.editList.dailyFlag,
        dailyCumulation: this.editList.dailyCumulation,
        cumulativeConsumption1:this.editList.endCumulativeConsumption
      }
    },
    // 删除按钮
    deleteDialogs() {
      if (this.selectionData.length === 0) {
        this.$message.warning('请先选择一条数据')
        return
      }
      this.$confirm('此操作将永久删除此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.selectionData[0].membershipLevel, 'this.selectionData[0].membershipLevel')
        this.$api.modules.bookProject.membershipLevelInfoDelete(this.selectionData[0].membershipLevel).then(res => {
          if (res) {
            console.log(res, 'res')
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.membershipLevelInfoList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 搜锁按钮
    search() {
      this.membershipLevelInfoList()
    },
    // 弹窗关闭
    showdialogT() {
      this.formlist = {}
      this.showDialogS = false
    },
    // 保存
    submit() {
      if (this.xflag === 0) {
        this.add()
      } else {
        this.edit()
      }
    },
    // 新增
    add() {
      const query = {
        deptId: this.selectedDeptId,
        gradeCode: this.formlist.gradeCode,
        gradeName: this.formlist.gradeName,
        levelDescription: this.formlist.levelDescription,
        cumulativeConsumption: this.formlist.cumulativeConsumption,
        endCumulativeConsumption:this.formlist.cumulativeConsumption1,
        integralProportion: this.formlist.integralProportion,
        discountRatio: this.formlist.discountRatio,
        dailyFlag: this.formlist.dailyFlag,
        dailyCumulation: this.formlist.dailyCumulation
      }
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          if(this.formlist.cumulativeConsumption1==""||this.formlist.cumulativeConsumption1==undefined){
            this.$message.warning('请输入结束累计消费金额')
            return
          }
          if(this.formlist.cumulativeConsumption>=this.formlist.cumulativeConsumption1){
            this.$message.warning('结束累计金额应大于开始累计金额')
            return
          }
          this.$api.modules.bookProject.membershipLevelInfoAdd(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.close()
              this.membershipLevelInfoList()
            }
          })
        } else {
          return false
        }
      })
    },
    // 修改i
    edit() {
      const query = {
        gradeCode: this.formlist.gradeCode,
        gradeName: this.formlist.gradeName,
        levelDescription: this.formlist.levelDescription,
        cumulativeConsumption: this.formlist.cumulativeConsumption,
        integralProportion: this.formlist.integralProportion,
        discountRatio: this.formlist.discountRatio,
        dailyFlag: this.formlist.dailyFlag,
        dailyCumulation: this.formlist.dailyCumulation,
        membershipLevel: this.selectionData[0].membershipLevel,
        endCumulativeConsumption:this.formlist.cumulativeConsumption1,
      }
      this.$refs.formlist.validate((valid) => {
        if (valid) {
          if(this.formlist.cumulativeConsumption1==""||this.formlist.cumulativeConsumption1==undefined){
            this.$message.warning('请输入结束累计消费金额')
            return
          }
          if(this.formlist.cumulativeConsumption>=this.formlist.cumulativeConsumption1){
            this.$message.warning('结束累计金额应大于开始累计金额')
            return
          }
          this.$api.modules.bookProject.membershipLevelInfoEdit(query).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.close()
              this.membershipLevelInfoList()
            }
          })
        } else {
          return false
        }
      })
    },
    // 关闭
    close() {
      this.formlist = {}
      this.showDialogS = false
    },
    // 获取会员等级信息列表
    membershipLevelInfoList() {
      const query = {
        deptId: this.form.deptId,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        gradeCode: this.form.gradeCode,
        gradeName: this.form.gradeName,
        levelDescription: this.form.levelDescription
      }
      this.$api.modules.bookProject.membershipLevelInfo(query).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },

    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.membershipLevelInfoList() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.membershipLevelInfoList()
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .Mums .el-input__inner{
  padding: 0;
}
::v-deep .el-input-number__decrease{
  display: none;
}
::v-deep .el-input-number__increase{
  display: none;
}
.container {
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

  .data-table {
    width: calc(100% - 0px);
    //background-color: #48c9b0;
  }
}

.footer {
  margin-top: 10px;
  text-align: right;
}

.header {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
