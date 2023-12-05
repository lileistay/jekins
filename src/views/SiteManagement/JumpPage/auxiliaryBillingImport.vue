<template>
  <!-- 辅助开单 导入产品 -->
  <sg-dialog
    ref="sg-dialog"
    title="导入产品"
    :dialog="dialogVisible"
    size="60%"
    @handleClose="butclose"
  >
    <div slot="out" style="height: 600px">
      <el-form size="mini" label-width="100px" :model="dateline">
        <el-row style="width:100%;">
          <el-col :span="5">
            <el-form-item label="产品名称：">
              <el-input v-model="dateline.projectName" readonly onfocus="this.removeAttribute('readonly');" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="产品价格：">
              <el-input
                v-model="dateline.priceOne"
                oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                step="0.01"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="13" style="margin-left:5px;">
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
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-close"
              @click="butclose"
            >关闭</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-row class="two">
        <el-col :span="5" style="height:100%" class="lefts">
          <div>
            <span class="span">产品类型</span>
          </div>
          <div style="margin-top:10px">
            <!--          <Tree-->
            <!--            :options="options"-->
            <!--            :default-props="defaultProps"-->
            <!--            @node-click="treeNodeClick"-->
            <!--            @update="update"-->
            <!--          />-->
            <el-tree :data="bookProjectList" :props="defaultProps" :highlight-current="true" style="margin-bottom: 10px" @node-click="treeNodeClick">
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
        </el-col>
        <el-col :span="18" style="height:100%" class="right">
          <div>
            <span>产品列表</span>
            <el-table
              style="width: 100%"
              :data="projectList"
              size="mini"
              border
              height="200px"
            >
              <el-table-column label="产品名称" prop="projectName" width="120px" />
              <el-table-column label="单位" prop="priceUnit" />
              <el-table-column label="规格" prop="specs" />
              <el-table-column label="价格1" prop="priceOne" />
              <el-table-column label="价格2" prop="priceTwo" />
              <el-table-column label="是否打折" prop="isDiscount">
                <template slot-scope="scope">
                  <span v-for="item in dict.type.discount" :key="item.value">{{ item.value === scope.row.isDiscount ? item.label : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="折扣" prop="discountNumber"/>
              <el-table-column label="库存" prop="quantitySum"/>
              <el-table-column label="次数" prop="priceNum"/>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="{row}">
                  <el-button size="mini" @click="additionalData(row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="display: flex;align-content: center;justify-content: center;margin-top: 10px" >
              <el-pagination @size-change="newhandleSizeChange" @current-change="newhandleCurrentChange"
                             :current-page="currentPage1" :page-sizes="[10, 20, 30, 50]" :page-size="5"
                             layout="total, sizes, prev, pager, next, jumper" :total="Total" v-if="pageflag">
              </el-pagination>
            </div>


            <div class="rightTwo">
              <el-table
                style="width: 100%"
                :data="list"
                size="mini"
                border
                height="200px"
              >
                <el-table-column label="产品名称" prop="projectName" width="120" />
                <el-table-column label="单位" prop="priceUnit" />
                <el-table-column label="价格1" prop="priceOne" />
                <el-table-column label="价格2" prop="priceTwo" />
                <el-table-column label="是否打折" prop="isDiscount">
                  <template slot-scope="scope">
                    <span v-for="item in dict.type.discount" :key="item.value">{{ item.value === scope.row.isDiscount ? item.label : '' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="折扣" prop="discountNumber" />
                <el-table-column label="次数" prop="priceNum" />
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </sg-dialog>
</template>

<script>
import { getDicts } from '@/api/sysManger/dict/data'
import sgDialog from '@/components/Dialog'
import { debounce } from "@/utils/throttleAndDebounce"

export default {
  dicts: ['discount'],
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
      pageSize:10,
      pageflag:true,
      newdepartmentId:"",
      currentPage1: 1,
      pageNum:1,
      Total:0,
      options: {}, // 树形的所有数据
      newList: [],
      projectList: [], // 点击后获取的数据
      list: [],
      dateline: { }, // 搜索
      seletabel: [],
      departmentId: '',
      defaultProps: {
        children: 'departmentInfoVos',
        label: 'departmentName'
      },
      bookProjectList: []
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
      this.getBookProjectList()
    }
  },
  created() {
    let list=JSON.parse(sessionStorage.getItem('adjuvantBillingTherapyitem'))
      if (list.xFlag==1){
          this.getReceptionInfo(list.jdxxId)
      }else {
          // this.billing = JSON.parse(this.$route.query.billing)
        this.billing = JSON.parse(JSON.parse(sessionStorage.getItem('adjuvantBillingTherapyitem')).billing)

          this.departmentId = this.billing.departmentId

      }
    this.deptId = this.$store.getters.departmentId
    // this.billing = JSON.parse(this.$route.query.billing)
    // this.departmentId = this.billing.departmentId
    this.getBookProjectList()
  },
  methods: {
    newhandleSizeChange(e){
 this.pageSize=e;
 this.getlist()
    },
    newhandleCurrentChange(e){
      this.pageNum=e;
      this.getlist()
    },
      // 从月子房间开辅助治疗获取用户信息
      getReceptionInfo(val){
          this.$api.billingList.getReceptionInformation({
              jdxxId: val
          }).then(res => {
              if (res.code==200){
                  this.billing = res.data[0]
                  this.departmentId = this.billing.departmentId
              }
          })
      },
    /**
     * @author Nevin
     * @date 2022/5/28
     * @Description: 搜索辅助治疗产品
     */
    search: debounce(function() {
      getDicts('dept_adjuvant_therapy').then(res => {
        if (res) {
          const list = res.data.find(item => parseInt(item.dictValue) === this.deptId)
          if (list !== undefined) {
            this.$api.product.productManagement({
              deptId: this.deptId,
              departmentId: parseInt(list.dictLabel),
              projectName: this.dateline.projectName,
              priceOne: this.dateline.priceOne,
              pageSize:this.pageSize,
              pageNum:this.pageNum,
              priceStatus:'0'
            }).then(res => {
              this.projectList = res.rows
              this.Total=res.total;

            })
          }
        }
      })
    }),
    /**
     * @author Nevin
     * @date 2022/5/13
     * @Description: 辅助治疗项目
     */
    getBookProjectList() {
      this.loadingData = true
      getDicts('dept_adjuvant_therapy').then(res => {
        if (res) {
          const list = res.data.find(item => parseInt(item.dictValue) === this.deptId)
          if (list !== undefined) {
            this.$api.modules.netPower.projectTreeselect({
              deptId: this.deptId,
              departmentId: parseInt(list.dictLabel)
            }).then(res => {
              this.bookProjectList = res.data
            })
          }
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    treeNodeClick(data) {
      let that=this;
      if (data.departmentInfoVos === undefined  || data.departmentInfoVos === null) {
        this.newdepartmentId=data.departmentId
        this.pageNum=1;
        this.currentPage1=1;
        this.pageflag=false;
        setTimeout(function (){
          that.pageflag=true;
        })
        this.$api.product.productManagement({ categoryId: data.departmentId,pageSize:this.pageSize,pageNum:this.pageNum,priceStatus:'0' }).then(res => {
          if (res) {
            this.projectList = res.rows
            this.Total=res.total;
          }
        })
        this.$forceUpdate()
      }
    },
    getlist(){
      this.currentPage1=1;
      this.$api.product.productManagement({ categoryId:this.newdepartmentId,pageSize:this.pageSize,pageNum:this.pageNum }).then(res => {
        if (res) {
          this.projectList = res.rows
          this.Total=res.total;
        }
      })
    },
    butclose() {
      this.$emit('update:dialogVisible', false)
      this.keshi = []
      this.list = []
      this.projectList = []
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
      this.projectList = []
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
      this.$emit('updata', this.list,true)
      this.emptyList()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-pager li.active {
  background-color: #409eff !important;
  color: #fff;
}
.two {
  height: 500px;
  .lefts {
    height: 100%;
    border: 1px solid #999;
    border-radius: 5px;
    margin-right: 10px;
    overflow: auto;

    .span {
      position: absolute;
      margin: -12px 0 0 14px;
      background-color: #fff;
    }
  }
  .right {
    height: 100%;
    padding: 10px;
    border: 1px solid #999;
    border-radius: 5px;

    //& span {
    //  position: absolute;
    //  margin: -20px 0 0 14px;
    //  background-color: #fff;
    //}
    .rightTwo {
      margin-top: 10px;
    }
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
