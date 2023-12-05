<template>
  <div>
    <el-form :inline="true" :model="femptree" class="demo-form-inline" size="mini">
      <el-form-item label="物资名称:">
        <el-input v-model="femptree.materialName" clearable style="width: 120px"/>
      </el-form-item>
      <el-form-item label="简码:">
        <el-input v-model="femptree.shortCode" clearable style="width: 120px"/>
      </el-form-item>
      <el-form-item label="编码:">
        <el-input v-model="femptree.materialCode" clearable style="width: 120px"/>
      </el-form-item>
      <el-button style="float:right;" type="danger" size="mini" @click="handleClose">关闭</el-button>
      <el-button style="float:right; margin-right: 5px" size="mini" @click="treeDelete">清空</el-button>
      <el-button style="float:right;" size="mini" @click="treeImport">导入</el-button>
      <el-button style="float:right;" type="primary" icon="el-icon-search" size="mini" @click="getTree">搜索</el-button>
      <el-button style="float:right;" type="primary" icon="el-icon-search" size="mini" @click="getTreeheva">
        搜索(有库存)
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
        >
          <span slot-scope="{ node,data }" style="width: 100%" class="custom-tree-node">
            <span style="width: 100%">
              <b v-if="!data.departmentInfoVos" class="el-icon-document"/>
              <b v-else-if="node.expanded" class="el-icon-folder-opened"/>
              <b v-else class="el-icon-folder"/>
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
      <div class="form-right">
        <div class="title">物资列表</div>
        <div style="margin-top: 10px">
          <el-table
              :data="templateData"
              size="mini"
              height="180"
              border
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
              @row-click="DataList"
          >
            <el-table-column prop="shortCode" label="物资简码" width="120"/>
            <el-table-column prop="materialName" label="物资名称"/>
            <el-table-column prop="materialCode" label="物资编码"/>
            <el-table-column prop="inventoryQuantity" label="库存总量"/>
            <el-table-column prop="materialSpec" label="规格"/>
            <el-table-column prop="unitName" label="单位"/>
            <el-table-column prop="minStock" label="最小库存"/>
          </el-table>
          <el-table
              :data="templateDataque"
              size="mini"
              height="180"
              border
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
          >
            <el-table-column prop="whouseName" label="库房"/>
            <el-table-column prop="availableNumber" label="可用数量" />
            <el-table-column prop="materialName" label="物资名称"  width="160" />
            <el-table-column prop="materialSpec" label="规格	" :show-overflow-tooltip="true" width="60"/>
            <el-table-column prop="unitName" label="单位	" :show-overflow-tooltip="true" width="60"/>
            <el-table-column prop="productionBatch" label="生产批次号" width="120"/>
            <el-table-column prop="endTime" label="结束有效期" width="120" />
            <el-table-column prop="inBatchNumber" label="入库批次号" :show-overflow-tooltip="true" width="90" />
            <el-table-column prop="startTime" label="开始有效期" width="120"  />
            <el-table-column prop="materialPrice" label="物资价格" width="80"/>
            <el-table-column prop="insertNumber" label="入库数量"/>
            <el-table-column prop="place" label="产地" width="80"/>
            <el-table-column prop="priceNum" label="操作" fixed="right">
              <template slot-scope="{row}">
                <el-button size="mini" @click="additionapriceNum(row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="height: 40px;line-height: 40px;padding-left: 10px; background-color: #1abc9c">已选择</div>
        <div style="margin-top: 10px">
          <el-table
              :data="templateDatas"
              size="mini"
              border
              height="180"
              :header-cell-style="{'text-align':'center', 'font-size':'12px'}"
              :cell-style="{'text-align':'center', 'font-size':'12px'}"
          >
            <el-table-column prop="materialName" label="物资名称"/>
            <el-table-column prop="materialSpec" label="规格"/>
            <el-table-column prop="unitName" label="单位"/>
            <el-table-column prop="productionBatch" label="生产批次号" width="120"/>
            <el-table-column prop="shortCode" label="简码" width="120"/>
            <el-table-column prop="materialCode" label="物资编码"/>
            <el-table-column prop="isMaterial" label="是否关键物资" width="120">
              <el-table-column prop="inBatchNumber" label="入库批次号" width="130" :show-overflow-tooltip="true" />
              <template slot-scope="scope">
                <p>{{ scope.row.isMaterial == '0' ? '否' : '是' }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="availableNumber" label="现有库存"/>
            <el-table-column prop="insertNumber" label="入库库存"/>
            <el-table-column prop="priceNum" label="操作" fixed="right">
              <template slot-scope="{row}">
                <el-button size="mini" @click="deleteitiona(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    form: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      templateData: [],
      templateDatas: [],
      templateDataque: [],
      // 树结构
      deptOptions: [], // 树 的数据
      defaultProps: {
        children: 'sonList',
        label: 'name'
      },
      femptree: {
        params: {},
        createTime: '', // 开始时间
        endcreateTime: '', // 结束时间
        shortCode: '', // 简码
        templateUseName: '', // 物资名称
        deptId: '', // 公司
        isInventory: 1
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
  // 监听公司ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.femptree.deptId = this.deptId
    this.getTreeselect()
  },
  methods: {
    // 树结构
    getTreeselect() {
      this.$api.storageRoom.materialTypeListTree({deptId: this.deptId}).then(res => {
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
    DataList(row) {
      this.templateDataque = []
      if (row.inventoryQuantity === 0 || row.inventoryQuantity === undefined) {
        this.$message('该物资暂无可出库的入库单信息。')
        return
      }
      var data = {
        materId: row.materId,
        status: '1',
        whouseId: row.whouseId,
        isInventory: row.whouseId > 0 ? 1 : null
      }
      this.$api.storageRoom.insertList(data).then(res => {
        if (res) {
          // 将上级的typeId 将给子数据
          res.rows.forEach(item => {
            item.typeId = row.typeId
            // 可用数量大于零
            if (item.availableNumber > 0) {
              this.templateDataque.push(item)
            }
          })
        }
      })
    },
    // 弹框按钮 关闭
    handleClose() {
      this.templateData = []
      this.templateDatas = []
      this.templateDataque = []
      this.$emit('handleDelete')
    },
    // 弹框 清空
    treeDelete() {
      this.templateDatas = []
      this.templateDataque = []
    },
    // 弹框按钮 导入
    treeImport() {
      if (this.templateDatas.length !== 0) {
        this.$emit('daoruImport', this.templateDatas)
        this.templateData = []
        this.templateDatas = []
        this.templateDataque = []
      } else {
        this.$message('导入物资不能为空')
      }
    },
    // 导入物资-搜索
    getTree() {
      console.log(this.femptree,'嘿嘿')
      // if (this.form.whouseId === undefined) {
      //   this.templateData = []
      //   this.templateDataque = []
      //   this.$api.storageRoom.materialInfoLst(this.femptree).then(res => {
      //     if (res) {
      //       this.templateData = res.rows
      //     }
      //   })
      // } else {
      this.femptree.params={
        shortCode:this.femptree.shortCode,
        materialName:this.femptree.materialName,
        materialCode:this.femptree.materialCode
      }
      // delete  this.femptree.shortCode;
      // delete  this.femptree.materialName;
      // delete  this.femptree.materialCode
        this.templateData = []
        this.templateDataque = []
        this.$api.storageRoom.storehouseInfoList(this.femptree).then(res => {
          if (res) {
            this.templateData = res.rows
          }
        })
      // }
    },
    // 节点点击事件 禁用按钮
    handleNodeClick(data, val) {
      this.templateDataque = []
      this.$set(this.femptree, 'whouseId', this.form.whouseId)
      if (this.form.whouseId === undefined) {
        // 根据 不同等级 添加不同参数
        if (data.type === '1') {
          this.$set(this.femptree, 'materialTypeId', data.id)
          this.$delete(this.femptree, 'typeId')
          this.$delete(this.femptree, 'matTypeId')
        } else if (data.type === '2') {
          this.$delete(this.femptree, 'materialTypeId')
          this.$delete(this.femptree, 'matTypeId')
          this.$set(this.femptree, 'typeId', data.id)
        } else if (data.type === '3') {
          this.$delete(this.femptree, 'materialTypeId')
          this.$delete(this.femptree, 'typeId')
          this.$set(this.femptree, 'matTypeId', data.id)
        }
        this.$api.storageRoom.materialInfoLst(this.femptree).then(res => {
          if (res) {
            this.templateData = res.rows
          }
        })
      } else {
        // 根据 不同等级 添加不同参数
        if (data.type === '1') {
          this.$set(this.femptree.params, 'materialTypeId', data.id)
          this.$delete(this.femptree.params, 'typeId')
          this.$delete(this.femptree.params, 'matTypeId')
        } else if (data.type === '2') {
          this.$delete(this.femptree.params, 'materialTypeId')
          this.$delete(this.femptree.params, 'matTypeId')
          this.$set(this.femptree.params, 'typeId', data.id)
        } else if (data.type === '3') {
          this.$delete(this.femptree.params, 'materialTypeId')
          this.$delete(this.femptree.params, 'typeId')
          this.$set(this.femptree.params, 'matTypeId', data.id)
        }
        this.$api.storageRoom.storehouseInfoList(this.femptree).then(res => {
          if (res) {
            this.templateData = res.rows
          }
        })
      }
    },
    // 搜索 有库存的
    getTreeheva() {
      const data = {
        deptId: this.deptId,
        isInventory: '1'
      }
      this.femptree.params={
        shortCode:this.femptree.shortCode,
        materialName:this.femptree.materialName,
        materialCode:this.femptree.materialCode
      }
      if(this.form.whouseId){
        data.whouseId=this.form.whouseId
      }
      Object.assign(data, this.femptree)
      this.$api.storageRoom.materialInfoLst(data).then(res => {
        if (res) {
          this.templateData = res.rows
          // this.treeImport()
        }
      })
    },
    // 添加
    additionapriceNum(data) {
      let flag = true
      this.templateDatas.forEach(item => {
        if (item.insertId === data.insertId) {
          flag = false
          return
        }
      })
      if (flag) {
        this.templateDatas.push(data)
        this.templateDataque = this.templateDataque.filter(item => {
          return data.insertId !== item.insertId
        })
      } else {
        this.$message.warning('不能重复添加')
      }
    },
    // 删除
    deleteitiona(data) {
      this.templateDatas = this.templateDatas.filter(item => {
        return data.insertId !== item.insertId
      })
      this.templateDataque.push(data)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  height: 8px;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.formBodys {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 30px 15px 15px 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;

  .title {
    position: absolute;
    top: -11px;
    left: 25px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }

  .form-left {
    width: 23%;
    min-height: 220px;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    position: relative;
    padding: 15px;
    box-sizing: border-box;
  }

  .form-right {
    width: 75%;
    min-height: 220px;
    border-radius: 10px;
    position: relative;
    border: 1px solid #c6c6c6;
  }

}
</style>
