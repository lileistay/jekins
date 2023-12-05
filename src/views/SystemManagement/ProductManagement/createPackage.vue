<template>
  <!--  创建产品套餐-->
  <el-scrollbar >
    <div class="management">
      <div class="formBody">
        <span class="itemment">产品套餐基本信息</span>
        <el-form ref="formInline" :inline="true" class="mentform" :rules="rules" :model="formInline" size="mini">
          <el-form-item label="套餐名称：" prop="pmName">
            <el-input v-model="formInline.pmName" style="width: 170px;" />
          </el-form-item>
          <!--          <el-form-item label="套餐简码：" prop="pmCode">-->
          <!--            <el-input v-model="formInline.pmCode" style="width: 170px;" />-->
          <!--          </el-form-item>-->
          <el-form-item label="是否打折：" prop="isDiscount">
            <el-select filterable v-model="formInline.isDiscount" style="width: 170px;">
              <el-option
                v-for="dict in dict.type.discount"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产品状态：" prop="productStatus">
            <el-select filterable v-model="formInline.productStatus" style="width: 170px;">
              <el-option
                v-for="dict in dict.type.product_status"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label="套餐价格：" prop="pmPrice">
                <!-- <el-input v-model="formInline.pmPrice" style="width: 170px;" oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" /> -->
                <el-input v-model="formInline.pmPrice" style="width: 170px;" />
                <el-button style="margin-left: 10px" @click="confirm">确认套餐金额</el-button>
                <span class="tips">确认后会覆盖原本填写的金额；可选项套餐时，套餐内项目金额会在开单时重新计算</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="套餐类型：" prop="pmCategory">
                <el-select filterable v-model="formInline.pmCategory" style="width: 170px;">
                  <el-option v-for="item in dict.type.package_category" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="formInline.pmCategory === '2'" label="选择数量：" style="margin-left: 10px">
                <el-input v-model="formInline.productQuantity" style="width: 170px;" />
                <span class="tips">例：套餐5选3，填3</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="产品描述：" style="margin-left: 10px">
                <el-input v-model="formInline.productDescription" style="width: 170px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--   暂时注释-->
          <!--   <el-row>-->
          <!--     <el-col>-->
          <!--       <el-form-item label="套餐有效期" prop="packageValidity">-->
          <!--         <el-date-picker-->
          <!--           v-model="formInline.packageValidity"-->
          <!--           type="daterange"-->
          <!--           range-separator="至"-->
          <!--           start-placeholder="开始日期"-->
          <!--           end-placeholder="结束日期">-->
          <!--         </el-date-picker>-->
          <!--         <span class="tips">不填则长期有效</span>-->
          <!--       </el-form-item>-->
          <!--     </el-col>-->
          <!--   </el-row>-->
        </el-form>
      </div>
      <div class="formBody">
        <span class="itemment">套餐产品明细信息</span>
        <div class="mentediv">
          <el-table
            border
            class="tabbox"
            :data="tableData"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            :style="{'font-size': '12px'}"
            style="width: 100%"
          >
            <el-table-column prop="departmentName" label="科室" width="80" />
            <el-table-column prop="projectName" label="产品名称" width="200" />
            <el-table-column prop="priceUnit" label="单位" width="200" />
            <el-table-column prop="priceOne" label="价格" />
            <el-table-column prop="priceNum" label="产品次数" />
            <el-table-column label="套餐内单价" prop="packagePrice">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.packagePrice"
                  size="mini"
                  oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                  step="0.01"
                  @input="() => $forceUpdate()"
                  @blur="obtain($event,scope)"
                />
              </template>f
            </el-table-column>
            <el-table-column label="数量" width="80" prop="quantity">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.quantity"
                  size="mini"
                  oninput="if(this.value=='00'){this.value='0';}else{this.value=this.value.replace(/[^0-9]/g,'')}"
                  @input="() => $forceUpdate()"
                  @blur="ride($event,scope)"
                />
              </template>
            </el-table-column>
            <el-table-column label="套餐内金额" prop="packageInAmount">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.packageInAmount"
                  size="mini"
                  oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                  step="0.01"
                  @blur="obtainAmount($event,scope)"
                  @input="() => $forceUpdate()"
                />
              </template>
            </el-table-column>
            <el-table-column prop="productItemTypeName" label="项目分类" />
            <el-table-column label="备注" width="520">
              <template slot-scope="scope" prop="remark">
                <el-input v-model="scope.row.remark" size="mini" @input="() => $forceUpdate()" :readonly="scope.row.readonly" @click.native="Readonly(scope.$index)" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="formBody">
        <span class="itemment">产品检索(非医保产品信息)</span>
        <div>
          <div class="billing">
            <el-form :inline="true" :model="dateline" class="demo-form-inline" size="mini">
              <el-form-item>
                产品名称:
                <el-input v-model="dateline.projectName" clearable style="width: 150px" />
              </el-form-item>
              <el-form-item>
                产品价格
                <el-input v-model="dateline.priceOne" clearable style="width: 100px" />
                至
                <el-input v-model="dateline.endpriceOne" clearable style="width: 100px" />
              </el-form-item>
              <span class="itemspan">[新增产品组合内项目：先选中产品组合名称再添加项目]</span>
              <el-button class="elbut" style="float:right;" icon="el-icon-search" round size="mini" @click="search()">搜索</el-button>
            </el-form>
          </div>
        </div>
        <div class="product">
          <div class="type">
            <span style="margin-left: 10px">产品类型</span>
            <el-tree :data="bookProjectList" :props="defaultProps" :highlight-current="true" style="margin-bottom: 15px;" @node-click="treeNodeClick">
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
          <div class="list">
            <span style="margin-left: 10px">产品列表</span>
            <el-table :data="projectList" size="mini" style="width: 100%; max-height: 170px; overflow: auto">
              <el-table-column prop="departmentName" label="科室" align="center" />
              <el-table-column prop="projectName" label="产品名称" align="center" />
              <el-table-column prop="priceUnit" label="单位" align="center" />
              <el-table-column prop="priceOne" label="价格一" align="center" />
              <el-table-column prop="priceTwo" label="价格二" align="center" />
              <el-table-column prop="priceNum" label="次数" align="center" />
              <el-table-column prop="productItemTypeName" label="项目分类" align="center" />
              <el-table-column prop="priceTwo" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="handleClick(scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="footer">
          <div class="content">
            <span style="color: red;margin-right: 10px">金额:{{formInline.pmPrice}}</span>
            <el-button size="mini" :loading="submitLoading" @click="addpackage">保存</el-button>
            <el-button size="mini" @click="remode" >关闭</el-button>
          </div>
        </div>
      </div>
    </div>
    <template #custom="data">
      <div v-if="data.props === 'state'">
        <show-dict-data :options="dict.type.product_status" :value="data.custom.state" />
      </div>
      <div v-else-if="data.props === 'region'">
        <show-dict-data :options="dict.type.discount" :value="data.custom.region" />
      </div>
    </template>
  </el-scrollbar>
</template>

<script>
import { math } from '@/utils/math'
import vm from '@/utils/util'

export default {
  dicts: ['product_status', 'discount', 'package_category'],
  data() {
    return {
      submitLoading: false,
      totalPrice:0,
      showDataDialog: false,
      totalnewPrice:0,
      formInline: {
        pmName: '', // 套餐名称
        pmCode: '', // 套餐简码
        pmPrice: '', // 套餐价格
        pmCategory: '', // 套餐类别
        productDescription: '', // 产品描述
        productStatus: '', // 产品状态
        isDiscount: '', // 是否打折
        packageValidity: '' // 产品有效期
      },
      rules: {
        pmCode: [{ required: true, message: '请填写简码', trigger: 'blur' }],
        pmName: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        pmPrice: [{ required: true, message: '请填写价格', trigger: 'blur' }],
        isDiscount: [{ required: true, message: '请选择', trigger: 'blur' }],
        pmCategory: [{ required: true, message: '请选择', trigger: 'blur' }],
        productStatus: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      tableData: [], // 表单数据
      projectList: [],
      dateline: {},
      bookProjectList: [],
      defaultProps: {
        children: 'departmentInfoVos',
        label: 'departmentName'
      },
      packageProducts: {},
      pmId: '',
      removeIds: []
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
    }
  },
  created() {
    // this.pmId = this.$route.query.pmId
    this.pmId = sessionStorage.getItem('createPackage')
    console.log(this.pmId ,'kkk')
    if (this.pmId != 'null') {
      console.log('fff')
      this.getPackageDetailsInfo(this.pmId)
    }
    this.deptId = this.$store.getters.departmentId
    this.getBookProjectList(this.deptId)
  },
  methods: {
    /** 关闭当前标签*/
    Readonly(index){
     this.tableData[index].readonly=false
     this.$set(this.tableData,index,this.tableData[index])
    },
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 确认套餐金额
    confirm(scope) {
      if (this.formInline.pmPrice === '') {
        this.$message('套餐价格不能为空')
        return
      }
      if(this.tableData.length==0){
        this.$message('请先添加套餐')
        return;
      }
      let num=((this.formInline.pmPrice)/(this.totalPrice))
      var total = 0;
      let totals=0;
        this.tableData.forEach((item,index) => {
          item.packagePrice=(math.divide(math.multiply(num,item.priceOne),item.quantity) ).toFixed(2)
          item.packageInAmount=(math.multiply(item.packagePrice,(item.quantity))).toFixed(2);
          total+=Number(item.packageInAmount);
        })
      if(Number(this.formInline.pmPrice)>(Number(total))){
        // this.tableData[this.tableData.length-1].packagePrice=math.add(Number(this.tableData[this.tableData.length-1].packagePrice),(math.subtract(Number(this.formInline.pmPrice),Number(total))))
        this.tableData[this.tableData.length-1].packageInAmount=math.add(Number(this.tableData[this.tableData.length-1].packageInAmount),(math.subtract(Number(this.formInline.pmPrice),Number(total))))
      }else{
        // this.tableData[this.tableData.length-1].packagePrice=math.add(Number(this.tableData[this.tableData.length-1].packagePrice),(math.subtract(Number(total),Number(this.formInline.pmPrice))))
        this.tableData[this.tableData.length-1].packageInAmount=math.subtract(Number(this.tableData[this.tableData.length-1].packageInAmount),(math.subtract(Number(total),Number(this.formInline.pmPrice))))
      }
      this.tableData.forEach((item,index) => {
        totals+=Number(item.packageInAmount);
      })
      this.totalnewPrice=totals;




      // 单价全部相加 单价除于相加的数 再乘于 套餐价格
      // this.tableData.forEach(item => {
      //   item.packageInAmount = math.multiply(math.divide(item.priceOne, total), this.formInline.pmPrice).toFixed(2)
      //   item.packagePrice = math.divide(item.packageInAmount, item.quantity).toFixed(2)
      //   console.log(item.packagePrice,'++++',item.packageInAmount, item.quantity )
      //   if (item.quantity === '' || item.quantity === null || item.quantity === undefined) {
      //     item['quantity'] = 1
      //   }
      //   // $set(this.tableData)
      // })
      this.$forceUpdate()
      // this.$set(this.tableData, scope.$index, scope.row)
      // this.obtain()
      // this.formInline.pmPrice
    },
    // 套餐内单价
    obtain(val, scope) {
      // 套餐内金额packageInAmount
      // 数量quantity
      // 套餐内单价packagePrice
      // return;
      var numal = 0
      this.tableData.forEach(item => {
        item.packageInAmount = math.multiply(item.quantity, item.packagePrice).toFixed(2);
        console.log(item.packageInAmount)
        numal = math.add(numal, item.packageInAmount).toFixed(2)
      })
      // 总金额
      this.formInline.pmPrice = numal
      this.$forceUpdate()
    },
    // obtain(val, scope) {
    //   console.log(scope, 'scope')
    //   if (scope !== undefined) {
    //     // 当数量等于1时 quantity数量
    //     if (scope.row.quantity === 1) {
    //       this.tableData.forEach(item => {
    //         item.packageInAmount = math.multiply(item.quantity, item.packagePrice).toFixed(2)
    //       })
    //       this.$set(this.tableData, scope.$index, scope.row)
    //       // 鼠标离开，计算套餐价格
    //       let data = 0
    //       this.tableData.forEach(item => {
    //         data = math.add(data, item.packageInAmount).toFixed(2)
    //       })
    //       this.$set(this.tableData, scope.$index, scope.row)
    //       // 套餐价格
    //       // this.formInline.pmPrice = data
    //       return
    //     } else {
    //       this.tableData.forEach(item => {
    //         item.packageInAmount = math.multiply(item.packagePrice, item.quantity).toFixed(2)
    //       })
    //       // this.$set(this.tableData, scope.$index, scope.row)
    //       // 鼠标离开，计算套餐价格
    //       let data = 0
    //       this.tableData.forEach(item => {
    //         data = math.add(data, item.packageInAmount).toFixed(2)
    //       })
    //       // this.$set(this.tableData, scope.$index, scope.row)
    //       // 套餐价格
    //       // this.formInline.pmPrice = data
    //     }
    //   } else {
    //     this.tableData.forEach(item => {
    //       item.packagePrice = math.divide(item.packageInAmount, item.quantity).toFixed(2)
    //     })
    //     // this.$set(this.tableData, scope.$index, scope.row)
    //     // 鼠标离开，计算套餐价格
    //     let data = 0
    //     this.tableData.forEach(item => {
    //       data = math.add(data, item.packageInAmount).toFixed(2)
    //     })
    //     // this.$set(this.tableData, scope.$index, scope.row)
    //     // 套餐价格
    //     // this.formInline.pmPrice = data
    //   }
    // },
    // 数量
    ride(val, scope) {
      if (val.target.value === null || val.target.value === '') {
        val.target.value = '0'
      }
      // 计算数量和套餐内金额
      this.tableData.forEach(item => {
        item.packageInAmount = math.multiply(item.quantity, item.packagePrice).toFixed(2)
      })
      // scope.row.packageInAmount = math.multiply(quantity, scope.row.packagePrice).toFixed(2)
      this.$set(this.tableData, scope.$index, scope.row)
      // 鼠标离开，计算套餐价格(金额相加)
      let data = 0
      this.tableData.forEach(item => {
        data = math.add(data, item.packageInAmount).toFixed(2)
      })
      this.$set(this.tableData, scope.$index, scope.row)
      // 套餐价格
      this.formInline.pmPrice = data
    },
    // 套餐内金额
    obtainAmount(val, scope) {
      if (scope.row.quantity === 1 || scope.row.quantity === 0) {
        // 计算数量和套餐内金额
        let data = 0
        this.tableData.forEach(item => {
          // 但数量等于1时，单价和金额是同一个值
          item.packagePrice = item.packageInAmount
          data = math.add(data, item.packageInAmount).toFixed(2)
        })
        this.$set(this.tableData, scope.$index, scope.row)
        this.formInline.pmPrice = data
      } else {
        // 计算数量不为1时，单价和金额相乘
        this.tableData.forEach(item => {
          item.packagePrice = math.divide(item.packageInAmount, item.quantity).toFixed(2)
        })
        // 鼠标离开，计算套餐价格(金额相加)
        let data = 0
        this.tableData.forEach(item => {
          data = math.add(data, item.packageInAmount).toFixed(2)
        })
        this.formInline.pmPrice = data
        // 加这个才起作用，把数据放到 this.tableData
        this.$set(this.tableData, scope.$index, scope.row)
      }
    },
    // 搜索
    search() {
      this.$api.product.productManagement({
        deptId: this.deptId,
        projectName: this.dateline.projectName,
        priceOne: this.dateline.priceOne,
        endpriceOne: this.dateline.endpriceOne
      }).then(res => {
        this.projectList = res.rows
      })
    },
    // 获取回显信息
    getPackageDetailsInfo(pmId) {
      this.showDataDialog = true
      this.$api.product.packageManagementById(pmId).then(res => {
        if (res) {
          const packageNumber = res.data.packageNumber
          this.$api.product.packageDetailsInfoByNumber({ packageNumber }).then(result => {
            this.formInline = res.data
            const arr = result.rows
            arr.forEach(item => {
              item['priceOne'] = item['originalPrice']
              item['priceNum'] = item['quantity']
            })
            this.tableData = arr;

            this.tableData.forEach(value=>{
              this.totalPrice+=((value.priceOne)*value.quantity)
            })
          }).finally(() => {
            this.showDataDialog = false
          })
        }
      })
    },
    // 预约项目列表
    getBookProjectList(deptId) {
      this.showDataDialog = true
      this.$api.modules.netPower.projectTreeselect({ deptId: deptId }).then(res => {
        this.bookProjectList = res.data
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    treeNodeClick(data) {
      this.departmentId = data.departmentId
      this.categoryId = data.categoryId
      this.projectTypeId = data.departmentId
      this.projectTypeName = data.departmentName
      if (data.departmentInfoVos === undefined  || data.departmentInfoVos === null) {
        // this.$message('请选择根节点')
        this.$api.product.productManagement({ categoryId: data.departmentId }).then(res => {
          if (res) {
            this.projectList = res.rows
          }
        })
      }
    },
    // 添加
    handleClick(row) {
      let flag = false
      this.tableData.forEach(item => {
        if (item.itemId === row.itemId) {
          this.$message.warning('不可重复添加')
          flag = true
          return
        }
      })
      if (!flag) {
        this.packageProducts.itemId = row.itemId // 产品ID
        this.packageProducts.departmentId = row.departmentId // 科室ID
        this.packageProducts.departmentName = row.departmentName // 科室名称
        this.packageProducts.projectName = row.projectName // 产品名称
        this.packageProducts.priceUnit = row.priceUnit // 产品单位
        this.packageProducts.deptId = this.deptId // 部门名称
        this.packageProducts.originalPrice = row.priceOne // 原价
        this.packageProducts.packageInAmount = math.multiply(row.priceOne, 1).toFixed(2) // 套餐内金额
        this.packageProducts.packagePrice = row.priceOne // 套餐内单价
        this.packageProducts.productItemTypeId = row.productItemType // 产品类型ID
        this.packageProducts.quantity = 1 // 数量
        this.packageProducts.status = row.status // 状态
        this.packageProducts.priceOne = row.priceOne // 产品价格
        this.packageProducts.priceTwo = row.priceTwo // 产品价格
        this.packageProducts.priceNum = row.priceNum // 次数
        this.packageProducts.costType = row.costType // 产品类型
        this.packageProducts.productItemTypeName = row.productItemTypeName // 类型名称
        this.packageProducts.readonly=true; //设置不回填
        this.tableData.push(this.packageProducts)
        this.packageProducts = {}
      }

      // if (this.formInline.pmPrice !== '') {
      //   this.confirm()
      // }else{
      this.totalPrice=0;
        this.tableData.forEach(value=>{
          this.totalPrice=math.add(this.totalPrice,(value.priceOne)*(value.quantity))
        })
        this.formInline.pmPrice=this.totalPrice
      // }
    },
    handleDelete(index, row) {
      this.removeIds.push(row.packageDetailsId)
      this.tableData.splice(index, 1)
    },
    addpackage() {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
        if(this.tableData.length==0){
          this.$message.warning('请选择套餐产品');
          return;
        }
          this.submitLoading = true
          if (this.pmId === undefined || this.pmId === '' || this.pmId=='null') {
            this.$set(this.formInline, 'deptId', this.deptId)
            // 添加套餐
            this.$api.product.packageManagementInfoAdd({
              'packageManagementInfo': this.formInline,
              'packageDetailsInfoList': this.tableData
            }).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.closeTag()
                this.submitLoading = false
                // this.$router.push('/Product_packageInformation')
              }
            })
          } else {
            // 修改套餐
            this.tableData.forEach(item => {
              this.$delete(item, 'searchValue')
              this.$delete(item, 'createBy')
              this.$delete(item, 'createTime')
              this.$delete(item, 'updateBy')
              this.$delete(item, 'updateTime')
              this.$delete(item, 'params')
              this.$set(item, 'packageNumber', this.formInline.packageNumber)
            })
            this.$delete(this.formInline, 'searchValue')
            this.$delete(this.formInline, 'createBy')
            this.$delete(this.formInline, 'createTime')
            this.$delete(this.formInline, 'updateBy')
            this.$delete(this.formInline, 'updateTime')
            this.$delete(this.formInline, 'params')
            this.$set(this.formInline, 'deptId', this.deptId)
            this.$api.product.packageManagementInfoEdit({
              'packageManagementInfo': this.formInline,
              'packageDetailsInfoList': this.tableData,
              'removeIds': this.removeIds
            }).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.submitLoading = false
                this.closeTag()
                // this.$router.push('/Product_packageInformation')
              }
            })
          }
        }
      })
    },
    remode() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang='scss'>
//5月5，李 修改样式
.formBody {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 20px 10px 15px 10px;
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
.el-button--mini, .el-button--mini.is-round {
  padding: 6px 15px;
  margin-top: 5px;
}
.management {
  padding: 6px 40px;

  .itemment {
    color: #1abc9c;
    font-size: 14px;
    font-weight: 600;
  }

  .mentform {
    margin-top: 14px;
    margin-left: 25px;
  }
  a {
    font-size: 12px;
    color: #1abc9c;
    text-decoration: none
  }

  .billing {
    height: 40px;
    background-color: #1abc9c;
    padding: 0 10px;
    color: #ffffff;
    .billingitem {
      font-size: 14px;
      line-height: 40px;
      color: aliceblue;
    }
  }

  .itemspan {
    font-size: 12px;
    color: #ffffff;
    font-weight: 600;
  }

  .demo-form-inline {
    line-height: 40px;
  }

  .el-input--mini {
    line-height: 37px;
  }

  .elbut {
    margin-top: 7px;
  }
}

.product {
  display: flex;
  margin-bottom: 35px;
  .type {
    float: left;
    position: relative;
    width: 20%;
    height: 200px;
    max-height: 200px;
    overflow-y: auto;
    //border: 1px solid rgb(144, 144, 141);
  }

  .list {
    //position: relative;
    width: 80%;
    padding-left: 5px;
    height: 200px;
    max-height: 200px;
    //border: 1px solid rgb(144, 144, 141);
  }
}

.detailed {
  margin-top: 5px;
  padding: 10px;
  border-radius: 10px;
  min-height: 100px;
  border: 1px solid rgb(144, 144, 141);
}
.tips{
  margin-left: 10px;
  color: #1abc9c;
}
.footer{
  position: fixed;
  bottom:0;
  right:0;
  width: 100%;
  height: 35px;
  background-color: #fff;
  z-index:1000;
  .content{
    position: fixed;
    right: 20px;
  }
}
</style>
