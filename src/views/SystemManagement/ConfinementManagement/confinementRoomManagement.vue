<template>
  <!--  房间-->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div class="container">
          <div class="floor-table">
            <sg-table
              ref="table"

              :sg-ref="'multipleTable'"
              selection
              size="mini"
              :table-data="tableData"
              :columns="columns"
              :operate="operate"
              row-key="roleId"
              :pagination="pagination"
              @operateClick="operateClick"
              @size-change="sizeChange"
              @current-change="currentChange"
              @row-click="rowClick"
              @selection-change="handleSelectionChange"
              @changeImg="changeImg"
              :hideSearchBar="hideSearchBar"
            >
              <div slot="searchBar" style="display: flex;align-items: center">
                <div style="display: inline-block;margin-right: 10px;margin-top: -13px">
                  <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
                </div>
                <el-form ref="searchForm" :model="searchBar" :inline="true" size="mini" :show-message="false">
                  <el-form-item label="房间编号" prop="roomNumber">
                    <el-input v-model="searchBar.roomNumber" clearable placeholder="房间编号" />
                  </el-form-item>
                  <el-form-item label="房间名称" prop="roomName">
                    <el-input v-model="searchBar.roomName" clearable placeholder="房间名称" />
                  </el-form-item>
                  <el-form-item label="楼层" prop="floorId">
                    <el-select v-model="searchBar.floorId" clearable filterable placeholder="请选择楼层">
                      <el-option
                        v-for="item in floorList"
                        :key="item.floorId"
                        :label="item.floorNumber"
                        :value="item.floorId"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="房间类型" prop="roomTypeId">
                    <el-select v-model="searchBar.roomTypeId" clearable filterable placeholder="请选择房间类型">
                      <el-option
                        v-for="item in roomTypeList"
                        :key="item.roomTypeId"
                        :label="item.roomType"
                        :value="item.roomTypeId"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态" prop="state">
                    <el-select v-model="searchBar.state" filterable clearable placeholder="状态">
                      <el-option label="正常" value="0" />
                      <el-option label="停用" value="1" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button icon="el-icon-search" type="primary" @click.stop="getData(true)" @keydown.enter.native="getData(true)">搜索</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div slot="header">
                <el-button v-has-permi="['share:roomInfo:add']" size="mini" plain icon="el-icon-plus" type="primary" :disabled="btnDisabled" @click.stop="handleAdd">新增</el-button>
                <el-button v-has-permi="['share:roomInfo:remove']" size="mini" plain icon="el-icon-delete" type="danger" @click.stop="handleDelete">删除</el-button>
              </div>
              <template #custom="data">
                <div v-if="data.props === 'state'">
                  <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.state" />
                </div>
              </template>
            </sg-table>

          </div>

          <sg-dialog :title="dialogTitle" :dialog="showDialog" size="400px" @handleClose="handleClose">
            <div slot="out">
              <el-form ref="sg-dialog-form" :model="form" :rules="rules" label-width="80px" size="mini">
                <el-form-item label="归属公司" prop="deptId">
                  <treeselect v-model="form.deptId" disabled :options="deptOptions" :show-count="true" placeholder="请选择归属公司" />
                </el-form-item>
                <el-form-item label="房间编号" prop="roomNumber">
                  <el-input v-model="form.roomNumber" clearable placeholder="请输入房间编号" />
                </el-form-item>
                <el-form-item label="房间名称" prop="roomName">
                  <el-input v-model="form.roomName" clearable placeholder="请输入房间名称" />
                </el-form-item>
                <el-form-item label="默认天数" prop="defaultDays">
                  <el-input-number
                    v-model="form.defaultDays"
                    class="full-width"
                    controls-position="right"
                    :min="1"
                  />
                </el-form-item>
                <el-form-item label="默认费用" prop="defaultCharge">
                  <el-input v-model="form.defaultCharge" clearable placeholder="请输入默认费用" />
                </el-form-item>
                <el-form-item label="楼层" prop="floorId">
                  <el-select v-model="form.floorId" clearable filterable placeholder="请选择楼层" style="width: 100%">
                    <el-option
                      v-for="item in floorList"
                      :key="item.floorId"
                      :label="item.floorNumber"
                      :value="item.floorId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="房间类型" prop="roomTypeId">
                  <el-select v-model="form.roomTypeId" clearable filterable placeholder="请选择房间类型" style="width: 100%">
                    <el-option
                      v-for="item in roomTypeList"
                      :key="item.roomTypeId"
                      :label="item.roomType"
                      :value="item.roomTypeId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                  <el-radio-group v-model="form.state">
                    <el-radio label="0">正常</el-radio>
                    <el-radio label="1">停用</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="form.remark" type="textarea" clearable placeholder="请输入备注" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="loadingSubmit" @click.stop="submitForm">确定</el-button>
                  <el-button @click="handleClose">取消</el-button>
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'
export default {
  name: 'ConfinementRoomManagement',
  dicts: ['sys_normal_disable'],
  components: {
    sgTable,
    sgDialog,
    Tree,
    Treeselect
  },
  data() {
    return {
      deptName: '',
      deptOptions: [],
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogTitle: '',
      showDialog: false,
      form: {
        deptId: undefined,
        roomNumber: undefined,
        roomName: undefined,
        defaultCharge: undefined,
        defaultDays: undefined,
        floorId: undefined,
        roomTypeId: undefined,
        state: '0',
        remark: undefined
      },
      rules: {
        roomNumber: [
          { required: true, message: '请输入房间编号', trigger: 'blur' }
        ],
        roomName: [
          { required: true, message: '请输入房间名称', trigger: 'blur' }
        ],
        defaultCharge: [
          { required: true, message: '请输入默认费用', trigger: 'blur' }
        ],
        defaultDays: [
          { required: true, message: '请输入默认天数', trigger: 'blur' }
        ],
        roomTypeId: [
          { required: true, message: '请选择房间类型', trigger: 'change' }
        ],
        floorId: [
          { required: true, message: '请选择楼层', trigger: 'change' }
        ]
      },
      loadingSubmit: false,
      loadingData: false,
      tableData: [],
      searchBar: {
        floorNumber: '',
        state: '0'
      },
      columns: [
        {
          lab: '编号',
          val: 'roomId'
        },
        {
          lab: '房间名称',
          val: 'roomName'
        },
        {
          lab: '房间编号',
          val: 'roomNumber'
        },
        {
          lab: '默认费用',
          val: 'defaultCharge'
        },
        {
          lab: '默认天数',
          val: 'defaultDays'
        },
        {
          lab: '楼层',
          val: 'floorNumber'
        },
        {
          lab: '房间类型',
          val: 'roomType'
        },
        {
          lab: '状态',
          val: 'state',
          custom: 'state',
          width: 80
        },
        {
          lab: '备注',
          val: 'remark'
        },
        {
          lab: '创建人',
          val: 'createBy'
        },
        {
          lab: '创建时间',
          val: 'createTime',
          width: 140
        }
      ],
      pagination: {
        deptId: 0,
        show: true,
        total: 0,
        pageSize: 20,
        pageNum: 1,
        currentPage: 1
      },
      operate: {
        name: '操作',
        width: '140',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['share:roomInfo:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:roomInfo:remove']
          }
        ]
      },
      btnDisabled: true,
      floorList: [],
      roomTypeList: [],
      hideSearchBar:false
    }
  },
  created() {
    this.getFloorList()
    this.getRoomTypeList()
    this.getTreeSelect()
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
      this.pagination.deptId=id
      this.handleNodeClick(id,item)
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 获取数据
     */
    getData: debounce(function(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        if (this.pagination.deptId==1){
          this.$message.warning('请选择公司查询')
          return
        }
      }
      this.loadingData = true
      this.$api.confinementRoom.roomInfoList(isSearch ? { ...this.searchBar, ...this.pagination } : this.pagination).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 操作
     */
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 新增
     */
    handleAdd() {
      this.$nextTick(() => {
        this.dialogTitle = '添加房间'
      })
      this.form.deptId = this.pagination.deptId
      this.showDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 修改
     */
    handleUpdate(e) {
      this.$nextTick(() => {
        this.dialogTitle = '修改房间'
      })
      this.form.deptId = e.deptId
      this.form.roomId = e.roomId
      this.form.roomName = e.roomName
      this.form.roomNumber = e.roomNumber
      this.form.defaultCharge = e.defaultCharge
      this.form.defaultDays = e.defaultDays
      this.form.floorId = e.floorId
      this.form.roomTypeId = e.roomTypeId
      this.form.remark = e.remark
      this.form.state = e.state
      this.showDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 删除
     */
    handleDelete(e) {
      const roomId = e.roomId || this.selectionData[0].roomId;
      this.$confirm('是否确认删除此房间？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.confinementRoom.removeRoomInfo(roomId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 关闭
     */
    handleClose() {
      this.showDialog = false
      this.resetForm()
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 重置表单
     */
    resetForm() {
      this.form = {
        roomId: undefined,
        roomName: undefined,
        roomNumber: undefined,
        roomTypeId: undefined,
        floorId: undefined,
        state: '0',
        defaultCharge: undefined,
        defaultDays: undefined,
        remark: undefined
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 提交
     */
    submitForm() {
      this.$refs['sg-dialog-form'].validate(valid => {
        if (valid) {
          if (this.form.roomId === undefined || this.form.roomId === '') {
            this.loadingSubmit = true
            this.$api.confinementRoom.addRoomInfo(this.form).then(res => {
              if (res) {
                this.getData()
                this.$message.success(res.msg)
                this.resetForm()
                this.showDialog = false
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          } else {
            this.loadingSubmit = true
            this.$api.confinementRoom.editRoomInfo(this.form).then(res => {
              if (res) {
                this.showDialog = false
                this.getData()
                this.$message.success(res.msg)
                this.resetForm()
                this.showDialog = false
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          }
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/10
     * @Description: 获取楼层
    */
    /**
     * @author 李尚
     * @date 2022/6/18
     * @Description: 添加状态
     */
    getFloorList() {
      const data = {
        deptId: this.pagination.deptId,
        state: '0'
      }
      this.$api.confinementRoom.floorInfoList(data).then(res => {
        if (res) {
          this.floorList = res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/10
     * @Description: 获取房间类型
     */
    /**
      * @author 李尚
      * @date 2022/6/18
      * @Description: 添加状态
    */
    getRoomTypeList() {
      const data = {
        deptId: this.pagination.deptId,
        state: '0'
      }
      this.$api.confinementRoom.roomTypeInfoList(data).then(res => {
        if (res) {
          this.roomTypeList = res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 获取公司树
     */
    getTreeSelect() {
      this.$api.dept.deptTree().then(res => {
        if (res) {
          this.pagination.deptId = res.data[0].id
          this.deptOptions = res.data
          this.getData()
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 筛选节点
     */
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 节点点击
     */
    handleNodeClick(data,item) {
      if (item.children!==undefined){
        this.btnDisabled = true
      }else {
        this.pagination.deptId=data
        this.btnDisabled = false
        this.getData()
        this.getFloorList()
        this.getRoomTypeList()
      }

      // if (data.children === undefined) {
      //   this.btnDisabled = false
      //   if (this.pagination.deptId !== data.id) {
      //     this.pagination.deptId = data.id
      //     this.getFloorList()
      //     this.getRoomTypeList()
      //     this.getData()
      //   }
      // } else {
      //   this.btnDisabled = true
      // }
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 分页
     */
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    /**
     * @author Nevin
     * @date 2022/6/9
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
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
.floor-list {
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
.floor-table {
  width: calc(100% - 0px);
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
