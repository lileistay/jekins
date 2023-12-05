<template>
  <div class="product">
    <!-- 产品信息维护 -- 添加 -->
    <div class="prdout">
      <span class="titme">基础信息</span>
      <el-form
        ref="projectInfo"
        :model="projectInfo"
        :rules="rules"
        class="demo-ruleForm"
        label-width="110px"
        size="mini"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="产品名称:"
              prop="projectName"
              style="width: 100%"
            >
              <el-input v-model="projectInfo.projectName" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品价格1:" prop="priceOne">
              <el-input
                v-model="projectInfo.priceOne"
                placeholder="请输入产品价格"
                oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                step="0.01"
                @focus="aaa()"
                @blur="checkone"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品价格2:" prop="priceTwo" style="width: 100%">
              <el-input
                v-model="projectInfo.priceTwo"
                placeholder="请输入产品价格"
                oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                step="0.01"
                @focus="bbb()"
                @blur="check"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品次数:" prop="priceNum" style="width: 100%">
              <el-input
                v-model.number="projectInfo.priceNum"
                placeholder="请输入产品次数"
                @focus="ccc()"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">-->
          <!--   <el-form-item label="生成简码:" style="width: 80%">-->
          <!--     <p>{{ projectInfo.shorCode }} </p>-->
          <!--   </el-form-item>-->
          <!-- </el-col>-->
          <el-col :span="4">
            <el-form-item label="产品单位:" prop="priceUnit" style="width: 100%">
              <el-select v-model="projectInfo.priceUnit" filterable filterable>
                <el-option
                  v-for="item in price"
                  :key="item.value"
                  :label="item.productUnitName"
                  :value="item.productUnitName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="是否打折:" prop="isDiscount" style="width: 100%">
              <el-select v-model="projectInfo.isDiscount" filterable style="width: 76px" @change="isdout(projectInfo.isDiscount)">
                <el-option
                  v-for="dict in dict.type.discount"
                  :key="dict.value"
                  :value="dict.value"
                  :label="dict.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="折扣:" prop="discountNumber" style="width: 100px; padding-right: 0;">
              <el-input
                v-model="projectInfo.discountNumber"
                :disabled="Discount"
                oninput="value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                style="width: 50px;"
                @blur="discountn"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品状态:" style="width: 100%">
              <el-select v-model="projectInfo.priceStatus" filterable>
                <el-option
                  v-for="dict in dict.type.product_status"
                  :key="dict.value"
                  :value="dict.value"
                  :label="dict.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品描述:" prop="proiceDescribe" style="width: 80%">
              <el-input v-model="projectInfo.proiceDescribe" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="是否重点产品:" prop="isKeyPoint" style="width: 100%">
              <el-select v-model="projectInfo.isKeyPoint" filterable>
                <el-option
                  v-for="(dict, index) in dict.type.whether"
                  :key="index"
                  :value="dict.value"
                  :label="dict.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="是否周期性产品:" style="width: 100%">
              <el-select v-model="projectInfo.isPeriodic" style="width: 100px;" filterable>
                <el-option value="0" label="是" />
                <el-option value="1" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item v-if="projectInfo.isPeriodic === '0'" label="产品周期:" style="width: 100%">
              <el-input v-model="projectInfo.cycleDays" placeholder="天数" style="width: 60px;" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="规格:" prop="specs" style="width: 100%">
              <el-input v-model="projectInfo.specs" style="width: 120px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span class="titme">关联信息</span>
          </el-col>
          <el-col :span="11">
            <span class="titme">医保</span>
          </el-col>
          <!---->
          <el-col :span="4">
            <el-form-item label="项目一级:" prop="departmentId" style="width: 80%">
              <el-select
                v-model="projectInfo.departmentName"
                filterable
                style="width: 120%;"
                @change="onDepartmentChange"
              >
                <el-option
                  v-for="(item,index) in deptOptions"
                  :key="index"
                  :value="item.departmentId"
                  :label="item.departmentName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品类型:" style="width:80%">
              <el-select ref="selectTree" filterable v-model="projectInfo.categoryName" placeholder="请选择" style="width: 120%;" >
                <el-option hidden :value="options.categoryId" filterable :label="options.categoryName" />
                <el-tree
                  ref="tree"
                  class="el-tree"
                  :data="projectOptions"
                  :props="defaultProps"
                  highlight-current
                  node-key="idStr"
                  :check-on-click-node="false"
                  @node-click="handleNodeClick"
                  :default-expanded-keys="expandedArr"
                  :default-checked-keys="checkedAll"
                />
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="4">
            <el-form-item label="费用类型:" prop="costType" style="width: 80%">
              <el-select v-model="projectInfo.costType" filterable style="width: 120%;">
                <el-option
                  v-for="item in costtype"
                  :key="item.value"
                  :label="item.expenseTypeName"
                  :value="item.expenseTypeId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="是否医保产品:" prop="isMedical" style="width: 100%">
              <el-select v-model="projectInfo.isMedical" disabled filterable>
                <el-option
                  v-for="dict in dict.type.whether"
                  :key="dict.value"
                  :value="dict.value"
                  :label="dict.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="社保目录编码:" style="width: 100%">
              <el-input v-model="medicalInsuranceInfo.socialCode" :disabled="this.projectInfo.isMedical === '0'" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="社保目录名称:" style="width: 100%">
              <el-input
                v-model="medicalInsuranceInfo.socialCatalogueName"
                :disabled="this.projectInfo.isMedical === '0'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="归属科室:" prop="ascriptionDepartment" style="width: 80%">
              <el-select
                v-model="projectInfo.ascriptionDepartment"
                filterable
                style="width: 120%;"
              >
                <el-option
                  v-for="(item,index) in newdeptOptions"
                  :key="index"
                  :value="item.departmentId"
                  :label="item.departmentName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品业务分类:" prop="businessType" style="width: 80%">
              <el-select v-model="projectInfo.businessType" filterable style="width: 120%;">
                <el-option
                  v-for="item in ceunit"
                  :key="item.value"
                  :label="item.pbcName"
                  :value="item.pbcId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品项目分类:" prop="productItemType" style="width: 80%">
              <el-select v-model="projectInfo.productItemType" filterable style="width: 120%;">
                <el-option
                  v-for="item in productItem"
                  :key="item.value"
                  :label="item.productItemTypeName"
                  :value="item.productItemTypeId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品自定义类型:" prop="customType" style="width: 80%">
              <el-select v-model="projectInfo.customType" filterable style="width: 120%;">
                <el-option
                  v-for="item in custom"
                  :key="item.value"
                  :label="item.productCustomTypeName"
                  :value="item.productCustomTypeId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="药品本位码(国码):" style="width: 100%">
              <el-input v-model="medicalInsuranceInfo.drugCode" :disabled="this.projectInfo.isMedical === '0'" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="内部目录编码:" style="width: 180%">
              <el-input
                v-model="medicalInsuranceInfo.internalDirectoryCode"
                :disabled="this.projectInfo.isMedical === '0'"
                style="width: 145px"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bot">
      <div class="wuzi">
        <p>物资检索</p>
        <el-input v-model="forms.searchText" size="mini" style="width: 160px;margin-right: 10px" :clearable="true" @keyup.enter.native="seach"
                  readonly onfocus="this.removeAttribute('readonly');" />
        <el-button
          icon="el-icon-search"
          type="primary"
          size="mini"
          @click="seach"
        >搜索
        </el-button>
        <div class="ball">
          <div style="height: 325px;width: 25%;overflow: auto;background-color: #FFFFFF">
            <el-tree
              default-expand-all

              :data="materialTypeOptions"
              :props="materialTypeTreeProps"
              highlight-current
              :expand-on-click-node="false"
              @node-click="materialTypeHandleNodeClick"
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
          </div>
          <div class="tabs" style="width: 73%;">
            <el-table :data="templateData" :border="true" :stripe="true" size="mini" style="width: 100%" height="325">
              <el-table-column prop="materialCode" label="物资编码" width="180" />
              <el-table-column prop="materialName" label="物资名称" width="180" />
              <el-table-column prop="drugPriceOne" label="价格" />
              <el-table-column prop="inventoryQuantity" label="库存" />
              <el-table-column label="操作" width="80" align="center"  fixed="right">
                <template #default="scope">
                  <el-button type="text" @click="addMaterial(scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="wuzi">
        <p class="mingxi">物资明细</p>
        <el-table
          :data="productMaterialRelations"
          :border="true"
          :stripe="true"
          size="mini"
          style="width: 100%"
          height="325"
        >
          <el-table-column prop="materialCode" label="物资编码" />
          <el-table-column prop="materialName" label="物资名称" />
          <el-table-column prop="number" label="数量" width="155" align="center">
            <template #default="scope">
              <el-input-number v-model="scope.row.number" size="mini" :min="0" :precision="2" :step="0.1" />
            </template>
          </el-table-column>
          <el-table-column prop="unitName" label="单位" width="100" />
          <el-table-column prop="materialSpec" label="物资规格" width="130" />
          <el-table-column prop="caozuo" label="操作" width="80" align="center" fixed="right">
            <template #default="scope">
              <el-button type="text" @click="delMaterial(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ebtn">
        <el-button type="warning" size="mini" round @click="backoff">返回</el-button>
        <el-button type="danger" size="mini" round @click="empty">清空</el-button>
        <el-button type="primary" size="mini" round :loading="submitLoading" @click="addproduct">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vm from '@/utils/util'
import tree from "@/components/Tree";

export default {
  dicts: ['product_status', 'whether', 'product_classification', 'discount', 'department'],
  data() {

    const validateMoney = (rule, value, callback) => {
      if (!value) {
        callback(new Error('价格不能为空'))
      } else {
        callback()
      }
    }
    return {
      Discount: false,
      expandedArr:[],
      DeptmentIdnews:'',
      checkedAll:[],
      expandFlag:true,
      newdeptOptions:[],
      DeptmentId:'',
      submitLoading: false,
      loadingData: false,
      showPrise: false, // 天数的显示
      trees: true,
      typeValue: [],
      deptOptions: [],
      projectOptions: [],
      defaultProps: {
        children: 'departmentInfoVos',
        label: 'departmentName'
      },
      newprojectOptions:[],
      // 物资类型树 相关数据====2023.04.29 新增====
      materialTypeOptions: [],
      materialTypeTreeProps: {
        children: 'sonList',
        label: 'name'
      },
      femptree: {},
      rowList: [],
      reqlist: [],
      templateData: [],
      whouseName: null,
      typeId: null,
      single: false,
      addBan: false,
      // 关联物资相关============================
      productMaterialRelations: [],
      // 删除的ids
      delIds: [],
      // ======================================
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        priceOne: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        priceTwo: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        priceNum: [
          { required: true, message: '产品次数不能为空', trigger: 'blur' },
          { type: 'number', message: '产品次数不能为负' }
        ],
        priceUnit: [
          { required: true, message: '请选择产品单位', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择科室', trigger: 'blur' }
        ],
        productItemType: [
          { required: true, message: '请选择产品项目分类', trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '请选择产品业务类型', trigger: 'blur' }
        ],
        costType: [
          { required: true, message: '请选择费用类型', trigger: 'blur' }
        ],
        isMedical: [
          { required: true, message: '请选择费用类型', trigger: 'blur' }
        ],
        ascriptionDepartment:[
          { required: true, message: '请选择归属科室', trigger: 'blur' }
        ]
      },
      // 树结构
      datas: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }],
      // 物资编码
      tableData: [{
        date: '',
        name: '',
        address: ''
      }],
      // 物资明细
      table: [{
        date: '',
        name: '',
        address: '',
        danwei: '',
        gueige: '',
        caozuo: ''
      }],
      // 基础信息
      projectInfo: {
        cycleDays: '', // 天数
        itemId: '',
        // shorCode: '', // 简码
        projectName: '', // 产品名称
        isDiscount: '1', // 是否打折
        priceOne: 0.00, // 产品价格1
        priceTwo: 0.00, // 产品价格2
        priceNum: 0, // 产品次数
        proiceDescribe: '', // 产品描述
        isKeyPoint: '0', // 是否重点产品
        isPeriodic: '', // 是否周期性产品
        departmentId: null, // 科室
        productItemType: '', // 产品项目分类
        costType: '', // 费用类型
        businessType: '', // 产品类型
        customType: '', // 产品自定义类型
        priceStatus: '0', // 产品状态
        specs: '', // 规格
        discountNumber: 1, // 折扣数
        categoryId: '', // 类型ID
        isMedical: '0', // 是否医保产品
        projectTypeId: null, // 二级
        departmentName: '', // 科室名称
        categoryName: '', // 类型名称
        departmentNameback:"",//归属科室
        ascriptionDepartment:null,

      },
      // 医保信息
      medicalInsuranceInfo: {
        drugCode: '', // 国家编码及流水号
        internalDirectoryCode: '', // 内部目录编码
        socialCatalogueName: '', // 社保目录名称
        socialCode: '', // 社保目录编码
        medicalInsuranceName: '' // 产品编号名称
      },
      projectInfoAddDto: {},
      // 搜素
      forms: {
        searchText: '',
        pageSize: 20,
        pageNum: 1,
        total: 0
      },
      cplx: '',
      itemId: null, // 编号
      price: [],
      productItem: [],
      costtype: [],
      ceunit: [],
      custom: [],
      options: [{
        categoryId: '',
        categoryName: ''
      }],
      querylist:{}
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
  // 监听部门ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
      this.getDepartmentList()
      this.priceunit()
      this.getProductItem()
      this.fcosttype()
      this.cenit()
      this.customtype()
      // this.getBookProjectList(val)
    },
  },
  created() {
    this.querylist=JSON.parse(sessionStorage.getItem("productMaintenance"))
    this.deptId = this.querylist.deptId
    this.itemId =this.querylist.itemId
    this.getDepartmentList()
    this.handleUpdate()
    // this.getBookProjectList(this.deptId)
    this.projectInfo.categoryId = this.querylist.categoryId
    this.projectInfo.departmentId = this.querylist.departmentId
    this.options.categoryId = this.querylist.categoryId
    this.DeptmentId=this.querylist.departmentId
    this.options.categoryName = this.querylist.categoryName
    this.projectInfo.projectTypeId = this.querylist.projectTypeId
    this.projectInfo.categoryName =this.querylist.categoryName
    this.getMaterialTypeTreeselect()
    this.expandFlag=false;

    // this.checkedAll.push(2)
  },
  mounted() {
    this.priceunit()
    this.getProductItem()
    this.fcosttype()
    this.cenit()
    this.customtype()


  },
  methods: {
    getMaterialTypeTreeselect() {
      this.$api.storageRoom.materialTypeListTree({ deptId: this.deptId }).then(res => {
        if (res) {
          this.materialTypeOptions = res.data
        }
      })
    },
    async materialTypeHandleNodeClick(data, val) {
      this.rowList = []
      this.getParent(val)
      // 同级tree点击时置空，也可以判断
      this.reqlist = this.rowList
      this.templateData = []
      this.whouseName = data.name
      this.typeId = data.type
      this.single = false
      this.addBan = false
      // this.matTypeId = data.matTypeId
      if (this.reqlist[1] === undefined) {
        this.$set(this.femptree, 'materialTypeId', this.reqlist[0]) // 一级
        this.$set(this.femptree, 'typeId', this.reqlist[1]) // 二级
        this.$set(this.femptree, 'matTypeId', this.reqlist[2]) // 三级
      } else if (this.reqlist[2] === undefined) {
        this.$set(this.femptree, 'materialTypeId', this.reqlist[1]) // 一级
        this.$set(this.femptree, 'typeId', this.reqlist[0]) // 二级
        this.$set(this.femptree, 'matTypeId', this.reqlist[2]) // 三级
      } else {
        this.$set(this.femptree, 'materialTypeId', this.reqlist[2]) // 一级
        this.$set(this.femptree, 'typeId', this.reqlist[1]) // 二级
        this.$set(this.femptree, 'matTypeId', this.reqlist[0]) // 三级
      }
      this.femptree = Object.assign(this.femptree, this.pagination)
      // this.femptree.deptId = this.deptId
      await this.$api.storageRoom.materialInfoLst(this.femptree).then(res => {
        if (res.rows.length > 0) {
          this.templateData = res.rows
        } else {
          this.templateData = []
        }
      })
    },
    getParent(node) {
      var that = this
      if (node.parent.data && !Array.isArray(node.parent.data)) {
        node.parent.data instanceof Object && that.rowList.push(node.data.id)
        that.getParent(node.parent)
      } else if (that.rowList.length === 0) {
        if (that.parentList.length === 0) {
          that.rowList.push(node.data.id)
        }
      } else {
        that.rowList.push(node.data.id)
      }
    },
    delMaterial(row, index) {
      // 如果是原有关联关系被删除，就有pmrId，将pmrId添加到删除列表
      if (this.productMaterialRelations[index].pmrId) {
        this.delIds.push(this.productMaterialRelations[index].pmrId)
      }
      // 从展示列表中删除这条数据
      this.productMaterialRelations.splice(index, 1)
    },
    addMaterial(row) {
      if (this.productMaterialRelations.find(item => item.materId === row.materId)) {
        this.$message.error('不可重复添加！')
        return
      }
      this.productMaterialRelations.push({
        pmrId: null,
        materialCode: row.materialCode,
        materialName: row.materialName,
        materialSpec: row.materialSpec,
        unitName: row.unitName,
        number: 1,
        materId: row.materId,
        itemId: parseInt(this.itemId)
      })
    },
    onDepartmentChange(val) {
      this.expandedArr=[];
      let len=document.querySelectorAll('.el-tree-node__expand-icon');
      for(let i=0;i<len.length;i++){
        if(len[i].className.indexOf('expanded')!==-1){
          len[i].click();
        }
      }
      let that=this;
      let num=''
      let newproject=this.deepClone(this.projectOptions)
      newproject.forEach(value=>{
        if(value.departmentId==val){
          if(this.DeptmentId!==val){
            num=value.departmentInfoVos[0].departmentInfoVos[0].departmentName
            this.projectInfo.categoryId=value.departmentInfoVos[0].departmentInfoVos[0].departmentId
            this.options.categoryName=value.departmentInfoVos[0].departmentInfoVos[0].departmentName
            this.expandedArr.push(value.departmentInfoVos[0].departmentInfoVos[0].idStr)
            setTimeout(function (){
              let lens=document.querySelectorAll('.el-tree-node')
              for(let j=0;j<lens.length;j++){
                if(lens[j].children[0].children[1].innerHTML==that.options.categoryName){
                  lens[j].style.background='#f0f7ff'

                }else{
                  lens[j].style.background=''
                }
              }
            },100)

          }

        }
      })
      if(this.DeptmentId==val){
        num=this.querylist.categoryName
        this.options.categoryName=num;
        this.projectInfo.categoryId=this.querylist.categoryId
        this.expandedArr=[];
        this.expandedArr.push(this.DeptmentIdnews);
        let lens=document.querySelectorAll('.el-tree-node')
        //先清除选中的
        this.$refs.tree.setCurrentKey(null)
        for(let j=0;j<lens.length;j++){
          if(lens[j].children[0].children[1].innerHTML==this.options.categoryName){
            lens[j].style.background='#f0f7ff'
          }else{
            lens[j].style.background='#fff !important'
          }
        }

      }
      // this.newprojectOptions=newarr;

      this.projectInfo = { ...this.projectInfo, categoryName: num}
      this.projectInfo.departmentId=val;
      this.$forceUpdate()
    },
    deepClone(obj) {
      // 根据类型制造一个新的数组或对象 => 指向一个新的空间
      // 由于数组的typeof也是'object',所以用Array.isArray(obj)
      var new_obj = Array.isArray(obj) ? [] : {};
      // 首先判断obj的类型
      // 普通类型
      if (typeof obj != 'object') {
        // 这里不能直接返回obj,不然就是浅拷贝的性质
        return new_obj = obj
      }
      //引用类型
      //数组
      if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
          new_obj[i] = obj[i];
          if (typeof new_obj[i] == 'object') {
            this.deepClone(new_obj[i])
          }
        }
      } else { //对象
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 对象中的数组和对象
            if (typeof obj[key] == 'object') {
              new_obj[key] = this.deepClone(obj[key]);
            } else {//对象中没有引用类型
              new_obj[key] = obj[key]
            }
          }
        }
      }
      return new_obj;
    },
    isdout(val) {
      if (val === '0') {
        this.Discount = true
      } else {
        this.Discount = false
      }
    },
    /**
     * @author 李尚
     * @date 2022/9/7
     * @Description: 鼠标获取焦点清空数据
     */
    aaa() {
      if (this.projectInfo.priceOne === 0) {
        this.projectInfo.priceOne = ''
      }
    },
    bbb() {
      if (this.projectInfo.priceTwo === 0) {
        this.projectInfo.priceTwo = ''
      }
    },
    ccc() {
      if (this.projectInfo.priceNum === 0) {
        this.projectInfo.priceNum = ''
      }
    },
    // 判断产品价格
    checkone() {
      if ((this.projectInfo.priceOne * 1) > (this.projectInfo.priceTwo * 1) && (this.projectInfo.priceTwo * 1) !== 0) {
        this.$message.error('价格1不能大于价格2')
        this.projectInfo.priceTwo = this.projectInfo.priceOne
      }
    },
    // 价格2
    check() {
      if ((this.projectInfo.priceOne * 1) === '') {
        this.$message.error('请先输入价格1的价格')
      } else if ((this.projectInfo.priceOne * 1) > (this.projectInfo.priceTwo * 1)) {
        this.$message.error('价格2不能小于价格1')
        this.projectInfo.priceTwo = 0
        this.projectInfo.priceTwo = this.projectInfo.priceOne
      }
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    // 获取树形结构的数据
    getBookProjectList(deptId) {
      let that=this;
      this.expandedArr=[];
      this.$api.modules.netPower.projectTreeselect({ deptId: deptId }).then(res => {
        this.projectOptions = res.data
        let count=0
        this.projectOptions.forEach(value=>{
          count++
          value.idStr=count;
          if(value.departmentInfoVos){
            value.departmentInfoVos.forEach(newvalue=>{
              count++
              newvalue.idStr=count
              if(newvalue.departmentInfoVos){
                newvalue.departmentInfoVos.forEach(values=>{
                  count++
                  values.idStr=count
                })
              }

            })
          }

        })
        this.projectOptions.forEach(value=>{
          if(value.departmentId==this.querylist.departmentId){
            value.departmentInfoVos.forEach(newvalue=>{
              if(newvalue.departmentInfoVos){
                newvalue.departmentInfoVos.forEach(values=>{
                  if(values.departmentName==this.options.categoryName){
                    that.expandedArr.push(values.idStr)
                    that.DeptmentIdnews=values.idStr
                  }

                })
              }
            })
          }

        })
        this.$nextTick(function (){
          let lens=document.querySelectorAll('.el-tree-node')
          for(let j=0;j<lens.length;j++){
            if(lens[j].children[0].children[1].innerHTML==this.options.categoryName){
              lens[j].style.background='#f0f7ff'
            }
          }
        })
        let newarr=[];
        let newproject=this.deepClone(this.projectOptions)
        newproject.forEach(value=>{
          if(value.departmentName==this.projectInfo.departmentName){
            value.departmentInfoVos.forEach(newvalue=>{
              if(newvalue.departmentInfoVos==undefined){
                newarr.push(value)
              }else {
                newvalue.departmentInfoVos.forEach(newvalues=>{
                  newarr.push(newvalues)
                })
              }
            })
          }
        })
        this.newprojectOptions=newarr;
        this.projectInfo = { ...this.projectInfo }
        //
        // })
        // this.$forceUpdate()
      })
    },
    // 获取科室列表
    getDepartmentList() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        status: '0',
        deptId: this.deptId
        // ,
        // isDepartment: '1'
      }
      this.$api.dept.DepartmentList(data).then(res => {
        /**
         * @author 李尚
         * @date 2022/8/15
         * @Description: 循环遍历数组，不能全等两个数据类型不一样
         */
        if (res) {
          this.deptOptions = res.rows
          this.newdeptOptions=[];
          this.deptOptions.forEach(value=>{
            if(value.isDepartment=='1'){
              this.newdeptOptions.push(value)
            }
          })
          this.deptOptions.forEach(res => {
            if (res.departmentId ==this.querylist.departmentId) {
              this.projectInfo['departmentName'] = res.departmentName
              this.getBookProjectList(this.deptId)
            }
          })
        }
      })
    },
    // 树型结构
    handleNodeClick(data) {
      if (!!data.departmentInfoVos && data.departmentInfoVos.length > 0) {
        // console.log('有子节点不可选')
      } else {
        var idDepartment = 0
        let departmentId=0;
        this.deptOptions.forEach(res => {
          if (data.categoryName === res.departmentName) {
            idDepartment = parseInt(data.categoryId)
            this.projectInfo.departmentName = res.departmentName
            let flag=false
            this.newdeptOptions.forEach(newvalue=>{
              if(res.departmentId==newvalue.departmentId){
                departmentId=newvalue.departmentId
                flag=true
              }
            })
            if(flag){
              this.projectInfo.ascriptionDepartment=departmentId
            }else{
              this.projectInfo.ascriptionDepartment=''
            }

          }
        })
        if (idDepartment !== 0) {
          this.projectInfo.departmentId = data.categoryId
        } else {
          this.projectInfo.departmentName = ''
        }
        this.projectInfo.categoryId = data.departmentId
        this.options.categoryId = data.departmentId
        this.options.categoryName = data.departmentName
        this.projectInfo.projectTypeId = data.projectTypeId
        this.$refs.selectTree.blur()
        this.$forceUpdate() // 制刷新页面页面，element-ui组件中节点清除后必须强制刷新
        this.projectInfo.categoryName = data.departmentName
        let lens=document.querySelectorAll('.el-tree-node')
        for(let j=0;j<lens.length;j++){
          lens[j].style.background=''
        }
      }
    },
    // 复制或修改
    handleUpdate() {
      this.itemId = this.querylist.itemId
      if (this.itemId === undefined || this.itemId === 0) {
        return
      } else {
        if (this.querylist.handleType === '1') {
          this.loadingData = true
          // 查找复制项目的物资关联列表
          this.$api.product.getMaterialRelationByItemId(this.itemId).then(res => {
            res.data.forEach(item => {
              item.pmrId = null
            })
            this.productMaterialRelations = res.data
          })
          this.$api.user.projecgetinfo(this.itemId).then(res => {
            if (res) {
              if (res.data) {
                this.projectInfo = res.data

                this.$delete(this.projectInfo, 'itemId')
                this.projectInfo.categoryId = this.querylist.categoryId
                this.options.categoryId = this.querylist.categoryId
                this.options.categoryName = this.querylist.categoryName
                this.projectInfo['categoryName'] = this.querylist.categoryName
                this.getDepartmentList()
              } else {
                this.empty()
              }
            }
          }).finally(() => {
            this.loadingData = false
          })
        } else {
          this.loadingData = true
          // 获取产品/项目信息
          this.$api.user.projecgetinfo(this.itemId).then(res => {
            if (res) {
              if (res.data) {
                this.projectInfo = res.data
                if(this.projectInfo.assist==''){
                  this.projectInfo.isKeyPoint='0'
                }else{
                  this.projectInfo.isKeyPoint='1'
                }
                this.getDepartmentList()
                // 这里先赋值，后期对完之后，可以删除
                this.projectInfo['categoryName'] = this.querylist.categoryName
              } else {
                this.empty()
              }
            }
          }).finally(() => {
            this.loadingData = false
          })
          // 获取项目与物资的关联关系
          this.$api.product.getMaterialRelationByItemId(this.itemId).then(res => {
            this.productMaterialRelations = res.data
          })
        }
      }
    },
    // 产品单位
    priceunit() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        status: '0',
        deptId: this.deptId
      }
      this.price = []
      this.$api.product.productList(data).then(res => {
        if (res) {
          this.price = res.rows
        }
      })
    },
    // 产品项目分类
    getProductItem() {
      const data = {
        status: '0',
        deptId: this.deptId
      }
      this.productItem = []
      this.$api.product.productitemtyList(data).then(res => {
        if (res) {
          this.productItem = res.rows;
        }
      })
    },
    // 费用类型
    fcosttype() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.costtype = []
      this.$api.product.expenseList(data).then(res => {
        if (res) {
          this.costtype = res.rows
        }
      })
    },
    // 产品业务分类
    cenit() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.ceunit = []
      this.$api.product.classificaList(data).then(res => {
        if (res) {
          this.ceunit = res.rows
        }
      })
    },
    // 产品自定义类型
    customtype() {
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.custom = []
      this.$api.product.productCustomList(data).then(res => {
        if (res) {
          this.custom = res.rows
        }
      })
    },
    // 保存
    addproduct() {
      this.$refs.projectInfo.validate((valid) => {
        if (valid) {
          if (this.projectInfo.priceNum === 0) {
            this.$message('产品次数不能为0')
            return
          }
          // 判断是有(this.querylist.handleType !==1)不等于的话走新增接口，复制上一个产品内容
          if (this.querylist.handleType !== '1') {
            // this.submitLoading = true
            this.$set(this.projectInfo, 'deptId', this.deptId)
            // 如果没有id的话就是新增
            if (this.projectInfo.itemId === '') {
              // console.log('projectInfo', this.projectInfo)
              // 保存如果不需要可以删除
              this.$delete(this.projectInfo, 'departmentName')
              this.$delete(this.projectInfo, 'categoryName')
              let insertion=this.projectInfo.isKeyPoint
              this.projectInfo.params={
                insertion: insertion
              }
              this.$api.user.productAdd({
                'projectInfo': this.projectInfo,
                'medicalInsuranceInfo': this.medicalInsuranceInfo,
                'productMaterialRelationVo': {
                  productMaterialRelations: this.productMaterialRelations,
                  delIDs: null
                }
              }).then(res => {
                if (res) {
                  this.$message.success(res.msg)
                  // this.submitLoading = false
                  this.closeTag()
                }
              })
            } else {
              this.$delete(this.projectInfo, 'params')
              this.$delete(this.projectInfo, 'searchValue')
              this.$delete(this.projectInfo, 'createBy')
              this.$delete(this.projectInfo, 'createTime')
              this.$delete(this.projectInfo, 'updateBy')
              this.$delete(this.projectInfo, 'updateTime')
              this.$delete(this.projectInfo, 'departmentName')
              this.$delete(this.projectInfo, 'categoryName')
              let insertion=this.projectInfo.isKeyPoint
              this.projectInfo.params={
                insertion: insertion
              }
              this.$api.user.projectedit({
                'projectInfo': this.projectInfo,
                'medicalInsuranceInfo': this.medicalInsuranceInfo,
                'productMaterialRelationVo': {
                  productMaterialRelations: this.productMaterialRelations,
                  delIds: this.delIds.length > 0 ? this.delIds : null
                }
              }).then(res => {
                if (res) {
                  this.$message.success(res.msg)
                  this.submitLoading = false
                  this.closeTag()
                }
              })
            }
          } else {
            let insertion=this.projectInfo.isKeyPoint
            this.projectInfo.params={
              insertion: insertion
            }
            this.$api.user.productAdd({
              'projectInfo': this.projectInfo,
              'medicalInsuranceInfo': this.medicalInsuranceInfo,
              'productMaterialRelationVo': {
                productMaterialRelations: this.productMaterialRelations,
                delIDs: null
              }
            }).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.submitLoading = false
                this.closeTag()
              }
            })
          }
        }
      })
    },
    // 清空
    empty() {
      this.projectInfo = {
        // shorCode: '', // 简码
        projectName: '', // 产品名称
        isDiscount: '1', // 是否打折
        priceOne: 0.00, // 产品价格1
        priceTwo: 0.00, // 产品价格2
        priceNum: 0, // 产品次数
        proiceDescribe: '', // 产品描述
        isKeyPoint: '', // 是否重点产品
        isPeriodic: '', // 是否周期性产品
        productItemType: '', // 产品项目分类
        costType: '', // 费用类型
        customType: '', // 产品自定义类型
        priceStatus: '0', // 产品状态
        specs: '', // 规格
        discountNumber: 0, // 折扣数
        categoryId: '', // 类型ID
        isMedical: '' // 是否医保产品
      }
      this.projecgetinfo = {
        // shorCode: '', // 简码
        projectName: '', // 产品名称
        isDiscount: '1', // 是否打折
        priceOne: 0.00, // 产品价格1
        priceTwo: 0.00, // 产品价格2
        priceNum: 0, // 产品次数
        proiceDescribe: '', // 产品描述
        isKeyPoint: '', // 是否重点产品
        isPeriodic: '', // 是否周期性产品
        productItemType: '', // 产品项目分类
        costType: '', // 费用类型
        customType: '', // 产品自定义类型
        priceStatus: '0', // 产品状态
        specs: '', // 规格
        discountNumber: 0, // 折扣数
        categoryId: '', // 类型ID
        isMedical: '' // 是否医保产品
      }
      this.medicalInsuranceInfo = {
        drugCode: '', // 国家编码及流水号
        internalDirectoryCode: '', // 内部目录编码
        socialCatalogueName: '', // 社保目录名称
        socialCode: '', // 社保目录编码
        medicalInsuranceName: '' // 产品编号名称
      }
      this.productMaterialRelations = []
      this.delIds = []
      this.itemId = null
    },
    // 折扣数判断
    discountn() {
      if (this.projecgetinfo.discountNumber > 1 && this.projecgetinfo.discountNumber < 0.1) {

      }
    },
    // 返回
    backoff() {
      this.closeTag()
    },
    // 搜索
    seach() {
      if (this.forms.searchText) {
        this.forms.deptId = this.deptId
        this.$api.storageRoom.searchMaterial(this.forms).then(res => {
          this.templateData = res.rows
          this.forms.total = res.total
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  background-color: #fff !important;
}
> > > .el-form-item__label {
  font-size: 12px;
}

> > > .el-col-10 {
  width: 48.66667%;
}

> > > .el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label {
  line-height: 21px;
}

::v-deep .el-form-item__label {
  font-size: 12px;
}

.titme {
  font-size: 14px;
  padding-left: 5px;
  border-left: 2px solid blue;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  height: 8px;
  z-index: 999999;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px;
  height: 20px;
  background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  //box-shadow: inset 0 0 5px #999;
  background: transparent;
  //border-radius: 2px;
}
.product {
  padding: 10px;
  // background-color: #e0e0e0;
  p {
    font-size: 14px;
  }
}

.prdout {
  margin-top: 10px;
  padding: 10px;
  background-color: #eeeeee;
}

.chanpin {
  height: 20px;
  padding: 10px;
  background-color: #eeeeee;
}

.bot {
  height: 450px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-top: 10px;
  background-color: #FAFAFA;
  border-bottom: 1px solid #eeeeee;

  .wuzi {
    width: 47%;
    padding: 10px;
    // border: 1px solid #eeeeee;
    .mingxi {
      margin-top: 10px;
      padding-bottom: 20px;
    }
  }
}

.ball {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-top: 1px solid #eeeeee;

  .tree {
    width: 25%;
  }
}

.ebtn {
  flex: auto;
  padding-top: 3px;
  padding-bottom: 2px;
  button{
    float: right;
    margin-right: 10px;
  }
}

.el-tree {
  padding: 0 15px;
}

// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
