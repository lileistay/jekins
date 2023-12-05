<template>
  <!-- 物资信息 -->
  <el-scrollbar>
    <div>
      <el-row>
        <el-col :span="4">
          <div style="padding-left: 10px;padding-top: 5px">物资类型</div>
          <el-tree
            ref="tree"
            default-expand-all
            :filter-node-method="filterNode"
            :data="deptOptions"
            :props="defaultProps"
            highlight-current
            @node-click="handleNodeClick"
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
        </el-col>
        <el-col :span="20">
          <sg-table
            :columns="columns"
            size="mini"
            index="序号"
            :table-data="tableData"
            :operate="operate"
            :pagination="pagination"
            border
            max-height="760"
            :header-style="{backgroundColor: '#1abc9c'}"
            @operateClick="operateClick"
            @size-change="sizeChange"
            @current-change="currentChange"
            @selection-change="handleSelectionChange"
          >
            <div slot="searchBar" class="header-float">
              <div style="margin-top: 20px">
                <el-form ref="form" :inline="true" :model="form" size="mini" label-width="110px">
                  <el-form-item label="物资编码：" prop="materialCode">
                    <el-input v-model="form.materialCode" clearable style="width: 120px;" />
                  </el-form-item>
                  <el-form-item label="物资名称：" prop="materialName">
                    <el-input v-model="form.materialName" clearable style="width: 120px;" />
                  </el-form-item>
<!--                  <el-form-item label="是否关键物资：">-->
<!--                    <el-select v-model="form.isMaterial" filterable clearable style="width: 120px;">-->
<!--                      <el-option value="0" label="是" />-->
<!--                      <el-option value="1" label="否" />-->
<!--                    </el-select>-->
<!--                  </el-form-item>-->
                  <el-form-item label="物资类型：" prop="materialType">
                    <el-select v-model="form.materialType" clearable filterable style="width: 120px;">
                      <el-option
                        value="0"
                        label="物资"
                      />
                      <el-option
                        value="1"
                        label="药品"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <div>
                <el-button
                  size="mini"
                  icon="el-icon-search"
                  type="primary"
                  plain
                  @click.native="getData(true)"
                  @keydown.enter.native="getData(true)"
                >搜索
                </el-button>
              </div>
            </div>
            <template #custom="data">
              <div v-if="data.props === 'status'">
                <p>{{ data.custom.status === '0' ? '是' : '否' }}</p>
              </div>
              <div v-else-if="data.props === 'isMaterial'">
                <p>{{ data.custom.isMaterial === '0' ? '是' : '否' }}</p>
              </div>
              <div v-else-if="data.props === 'materialType'">
                <show-dict-data :options="dict.type.Material_category" :value="data.custom.materialType" />
                <!--<p>{{ data.custom.materialType === '0' ? '物资' : '药品' }}</p>-->
              </div>
              <div v-else-if="data.props === 'matTypeName'">
                <p>{{ data.custom.matTypeName !== null ? data.custom.matTypeName : data.custom.typeName }}</p>
              </div>
            </template>
            <div slot="header" class="herder">
              <div />
              <div>
                <el-button
                  v-hasPermi="['sorage:materialInfo:add']"
                  size="mini"
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  :disabled="addBan"
                  @click="addto"
                >添加
                </el-button>
                <el-button
                  v-hasPermi="['confinement:projectInfo:daoru']"
                  size="mini"
                  type="info"
                  icon="el-icon-download"
                  @click="handleImport"
                >导入
                </el-button>
              </div>
            </div>
          </sg-table>
        </el-col>
      </el-row>
      <!--弹框-->
      <sgDialog :title="title" size="630px" :dialog="showDialog" @handleClose="mathandleClose">
        <div slot="out">
          <el-form ref="formType" :model="formType" :rules="rules" size="mini" label-width="150px">
            <el-row>
              <!--左侧-->
              <el-col :span="12">
                <el-form-item label="物资名称：" prop="materialName">
                  <el-input v-model="formType.materialName" />
                </el-form-item>
                <el-form-item label="物资价格1：" prop="drugPriceOne">
                  <el-input
                    v-model="formType.drugPriceOne"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d).*$/,'$1$2.$3')"
                    step="0.01"
                    @focus="aaa()"
                    @blur="checkone"
                  />
                </el-form-item>
<!--                <el-form-item label="是否关键物资：" prop="isMaterial">-->
<!--                  <el-radio-group v-model="formType.isMaterial" @change="$forceUpdate()">-->
<!--                    <el-radio :label="1">否</el-radio>-->
<!--                    <el-radio :label="0">是</el-radio>-->
<!--                  </el-radio-group>-->
<!--                </el-form-item>-->
                <el-form-item label="物资类别：" prop="materialType">
                  <el-select v-model="formType.materialType" filterable placeholder="请选择">
                    <el-option value="0" label="物资" />
                    <el-option value="1" label="药品" />
                  </el-select>
                </el-form-item>
                <el-form-item label="规格：">
                  <el-input v-model="formType.materialSpec" type="text" />
                </el-form-item>
              </el-col>
              <!--右侧-->
              <el-col :span="12">
                <el-form-item label="物资别名：" prop="materialCode">
                  <el-input v-model="formType.materialCode" />
                </el-form-item>
                <el-form-item label="物资价格2：" prop="drugPriceTwo">
                  <el-input
                    v-model="formType.drugPriceTwo"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d).*$/,'$1$2.$3')"
                    step="0.01"
                    @focus="bbb()"
                    @blur="checktwo"
                  />
                </el-form-item>
                <el-form-item label="物资描述：" prop="remark">
                  <el-input v-model="formType.remark" />
                </el-form-item>
                <el-form-item label="单位：">
                  <el-select v-model="formType.unitName" filterable placeholder="请选择">
                    <el-option
                      v-for="(item, index) in coump"
                      :key="index"
                      :label="item.productUnitName"
                      :value="item.productUnitName"
                    />
                  </el-select>
                  <el-button type="primary" size="mini" style="margin-top: 10px" @click="addspec" v-show="title=='新增物资'">
                    新建单位
                  </el-button>
                </el-form-item>
                <div :style="{position: 'absolute',left:'60px',top:'213px'}">
                  <span><span style="color: red;">*</span><span style="color: #666;margin-left: 3px">是否重要:</span></span>
                  <el-radio v-model="radio" label="0" style="margin-left: 20px">否</el-radio>
                  <el-radio v-model="radio" label="1">是</el-radio>

                </div>
                <el-form-item label="最小库存：">
                  <el-input v-model="formType.minStock" @focus="Stock()" />
                </el-form-item>
                <el-form-item label="是否显示：">
                  <el-radio-group v-model="formType.status" @change="$forceUpdate()">
                    <el-radio :label="1">否</el-radio>
                    <el-radio :label="0">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="默认产地（厂家）：" prop="defaultFacturer">
                  <el-input v-model="formType.defaultFacturer" :maxlength="240" />
                </el-form-item>
                <el-form-item label="默认注册证号：" prop="defaultNumber">
                  <el-input v-model="formType.defaultNumber" :maxlength="240" />
                </el-form-item>
                <el-form-item label="是否产品：" prop="porjectFlag">
                  <el-select
                    v-model="formType.porjectFlag"
                    style="width: 120px"
                    placeholder="请选择"
                    :disabled="title === '编辑物资'"
                    filterable
                    @change="changeporjectFlag(formType.porjectFlag)"
                  >
                    <el-option
                      v-for="dict in dict.type.whether"
                      :key="dict.value"
                      :value="dict.value"
                      :label="dict.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="information">
              <p style="font-size: 14px">产品信息</p>
              <el-row style="margin-bottom: 0">
                <!--左侧-->
                <el-col :span="12">
                  <el-form-item label="产品类型：" prop="categorys" style="position: relative">
                    <span style="position: absolute;color:red;left:-90px;top:0px;z-index: 1000">*</span>
                    <el-cascader
                      v-model="categorys"
                      :options="deptOption"
                      :props="{ children:'departmentInfoVos', value:'departmentId', label:'departmentName',expandTrigger: 'hover' }"
                      @change="handleNodeClicks"
                    />
                  </el-form-item>
                  <el-form-item label="药品价格1：" prop="priceOne">
                    <el-input
                      v-model="formType.priceOne"
                      oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d).*$/,'$1$2.$3')"
                      step="0.01"
                      @focus="aaaprice()"
                      @blur="priceone"
                    />
                  </el-form-item>
                  <el-form-item label="是否打折：" prop="isDiscount">
                    <el-select v-model="formType.isDiscount" filterable @change="isdout(formType.isDiscount)">
                      <el-option
                        v-for="dict in dict.type.discount"
                        :key="dict.value"
                        :value="dict.value"
                        :label="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="药品上架状态：" prop="priceStatus">
                    <el-select v-model="formType.priceStatus" filterable clearable>
                      <el-option
                        v-for="dict in dict.type.product_status"
                        :key="dict.value"
                        :value="dict.value"
                        :label="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="产品业务类型：" prop="businessType">
                    <el-select v-model="formType.businessType" filterable style="width: 100%;">
                      <el-option
                        v-for="item in ceunit"
                        :key="item.value"
                        :label="item.pbcName"
                        :value="item.pbcId"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="费用类型：" prop="costType">
                    <el-select v-model="formType.costType" filterable style="width: 120%;">
                      <el-option
                        v-for="item in costtype"
                        :key="item.value"
                        :label="item.expenseTypeName"
                        :value="item.expenseTypeId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!--右侧-->
                <el-col :span="12">
                  <el-form-item label="预留位">
                    <!--  <el-select v-model="formType.departmentId" filterable clearable @change="departmentIdChange">-->
                    <!--    <el-option-->
                    <!--      v-for="item in TriageDepartment"-->
                    <!--      :key="item.departmentId"-->
                    <!--      :value="item.departmentId"-->
                    <!--      :label="item.departmentName"-->
                    <!--    />-->
                    <!--  </el-select>-->
                  </el-form-item>
                  <el-form-item label="药品价格2：" prop="priceTwo">
                    <el-input
                      v-model="formType.priceTwo"
                      oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d).*$/,'$1$2.$3')"
                      step="0.01"
                      @focus="aaapriceTwo()"
                      @blur="checkTwo"
                    />
                  </el-form-item>
                  <el-form-item label="折扣：">
                    <el-input
                      v-model="formType.discountNumber"
                      :disabled="formType.isDiscount === '0' "
                      oninput="value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                      style="width: 50px;"
                    />
                  </el-form-item>
                  <el-form-item label="产品单位：" prop="priceUnit">
                    <el-select v-model="formType.priceUnit" filterable>
                      <el-option
                        v-for="item in coump"
                        :key="item.productUnitId"
                        :label="item.productUnitName"
                        :value="item.productUnitName"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="产品项目分类：" prop="productItemType">
                    <el-select v-model="formType.productItemType" filterable style="width: 100%;">
                      <el-option
                        v-for="item in productItem"
                        :key="item.value"
                        :label="item.productItemTypeName"
                        :value="item.productItemTypeId"
                      />
                    </el-select>
                  </el-form-item>
                  <!--<el-form-item label="用药单位：">-->
                  <!--  <el-input v-model="formType.priceUnit" />-->
                  <!--</el-form-item>-->
                </el-col>
              </el-row>
              <el-row style="margin-bottom: 0">
                <el-col :span="16">
                  <el-form-item label="规格：" prop="materialSpec">
                    <el-input v-model="formType.materialSpec" type="text" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="是否周期性产品：">
                    <el-select filterable v-model="formType.isPeriodic" style="width: 100px;">
                      <el-option
                        v-for="dict in dict.type.whether"
                        :key="dict.value"
                        :value="dict.value"
                        :label="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="医保编码：">
                    <el-input v-model="formType.socialCode" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否医保产品：">
                    <el-input v-model="formType.isMedical" disabled />
                  </el-form-item>
                  <el-form-item v-if="formType.isPeriodic == 1" label="产品周期:" style="width: 100%">
                    <el-input v-model="formType.cycleDays" placeholder="天数" style="width: 60px;" />
                  </el-form-item>
                  <el-form-item label="医保统一编码：">
                    <el-input v-model="formType.internalDirectoryCode" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-row style="margin-bottom: 0">
              <el-col :span="16">
                <p style="color: red; font-size: 16px">温馨提示：</p>
                <p style="color: red; font-size: 14px">1.物资编码的长度不能超过80字符!</p>
                <p style="color: red; font-size: 14px">2.物资名称的长度不能超过80字符!</p>
                <p style="color: red; font-size: 14px">3.物资描述的长度不能超过240字符！</p>
                <p style="color: red; font-size: 14px">4.默认产地(厂家) 的长度不能超过240字符！</p>
                <p style="color: red; font-size: 14px">5.默认注册证号 的长度不能超过240字符！</p>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <el-button type="primary" :loading="submitLoading" @click="submitForm">{{ determine }}</el-button>
                  <el-button @click="mathandleClose">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </sgDialog>
      <sgDialog :title="dialogTitle" size="380px" :dialog="newshowDialog" @handleClose="newhandleClose">
        <div slot="out">
          <el-form ref="productUnitInfo" :rules="newrules" :model="productUnitInfo" size="mini" label-width="120px">
            <el-form-item label="产品单位名称:" prop="productUnitName">
              <el-input v-model="productUnitInfo.productUnitName" placeholder="请输入产品单位名称" style="width: 145px;" />
            </el-form-item>
            <el-form-item label="产品状态" prop="status" style="display: none">
              <el-radio-group v-model="productUnitInfo.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="submitLoding" @click="newsubmitForm">确认</el-button>
              <el-button @click="newshowDialog = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </sgDialog>
      <!-- 导入组件 -->
      <import-template
        ref="import"
        :upload="upload"
        @downloadTemplate="downloadTemplate"
        @handleClose="handleClose"
        @handleFileUploadProgress="handleFileUploadProgress"
        @handleFileSuccess="handleFileSuccess"
        @handleFileClose="handleFileClose"
        @submitFileForm="submitFileForm"
      />
    </div>
  </el-scrollbar>

</template>

<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import importTemplate from '@/components/ImportTemplate'
import deptId from '@/api/index/deptId'
// let categorys=[];
// var
export default {
  dicts: ['Material_category', 'whether', 'discount', 'product_status','sys_normal_disable'],
  components: { SgTable, importTemplate, sgDialog },
  data() {
    var validCascader = (rule, value, callback) => {
      if (this.categorys.length == 0) {
        callback(new Error('请选择产品类型'))
      } else {
        callback();
      }
    }
    return {
      submitLoding:false,
      radio:'0',
      datapice: {}, // 物质信息
      Discount: false, // 是否打折
      matTypeId: '', // 三级树
      typeId: '', // 二级树
      dialogTitle:"添加产品单位名称",
      productUnitInfo: {
        productUnitName: '',
        status: '0',
        deptId:"",
      },
      // 搜索的值
      form: {
        materialCode: '',
        materialName: '',
        isMaterial: '',
        materialType: ''
        // matTypeId: ''
      },
      ceunit: [],
      information: false, // 是否显示产品
      // 弹框
      determine: '确定',
      title: '',
      showDialog: false,
      newshowDialog:false,
      costtype: [], // 费用类型
      formType: {
        porjectFlag:'0',
        isMaterial:1,
        status:1,
        // materialName: '',
        // materialCode: '',
        // drugPriceOne: 0,
        // drugPriceTwo: 0,
        // // matTypeId: '',
        // remark: '',
        // isMaterial: '1',
        // unitName: '',
        // materialType: '1',
        // minStock: 0,
        // materialSpec: '',
        // status: '0',
        // defaultFacturer: '',
        // defaultNumber: '',
        // porjectFlag: '0',
        // discountNumber: 1, // 折扣数
        // materialTypeId: '', // 一级库
        // typeId: '', // 二级库
        // matTypeId: '', // 三级库
        // categoryId: '', // 产品类型
        // priceOne: 0,
        // priceTwo: 0,
        // isDiscount: '1',
        // costType: '',
        // priceUnit: ''

      },
      // 产品信息
      TriageDepartment: [], // 科室数据
      // 产品表
      options: [{
        projectTypeId: '',
        projectTypeName: ''
      }],
      productItem: [],
      deptOption: [],
      defaultProp: {
        children: 'departmentInfoVos',
        label: 'departmentName'
      },
      submitLoading: false, // 确定按钮
      coump: [],
      newrules: {
        productUnitName: [
          { required: true, message: '请输入产品单位名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择产品单位状态', trigger: 'blur' }
        ]
      },
      rules: {
        materialName: [
          { required: true, message: '请填写物资名称', trigger: 'blur' },
          { max: 80, message: '物资名称的长度不能超过80字符!', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请填写物资描述', trigger: 'blur' },
          { max: 240, message: '物资描述的长度不能超过240字符!', trigger: 'blur' }
        ],
        drugPriceOne: [{ required: true, message: '请填写要品价格1', trigger: 'blur' }],
        // isMaterial: [{ required: true, message: '请选择是否关键物资', trigger: 'blur' }],
        materialType: [{ required: true, message: '请选择物资类别', trigger: 'blur' }],
        materialCode: [{ required: true, message: '请填写物资别名', trigger: 'blur' }],
        drugPriceTwo: [{ required: true, message: '请填写要品价格2', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择产品类型', trigger: 'blur' }],
        priceOne: [{ required: true, message: '请填写药品价格1', trigger: 'blur' }],
        priceTwo: [{ required: true, message: '请填写药品价格2', trigger: 'blur' }],
        isDiscount: [{ required: true, message: '请选择是否打折', trigger: 'blur' }],
        priceUnit: [{ required: true, message: '请选择产品单位', trigger: 'blur' }],
        costType: [{ required: true, message: '请选择费用类型', trigger: 'blur' }],
        businessType:[{ required: true, message: '请选择产品业务类型', trigger: 'blur' }],
        productItemType:[{ required: true, message: '请选择产品项目分类', trigger: 'blur' }],
        categorys:[{validator:validCascader, trigger: "change"}]
      },
      categorys: [],
      whouseName: '', // 库房名字
      // 导入
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
        url: '/api/confinement/projectInfo/importData'
      },
      showDataDialog: false,
      // 非单个禁用
      single: true,
      addBan: true,
      // 树结构
      deptOptions: [],
      defaultProps: {
        children: 'sonList',
        label: 'name'
      },
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      rowList: [],
      parentList: [],
      // 最终结果
      reqlist: [],
      tableData: [], // 表格数据
      // 操作
      operate: {
        name: '操作',
        width: '160',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['sorage:materialInfo:edit']
          },
          {
            lab: '复制',
            type: 'info'
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['sorage:materialInfo:delete']
          }
        ]
      },
      columns: [
        {
          lab: '物资类型',
          val: 'matTypeName',
          custom: 'matTypeName'
        },
        {
          lab: '物资类别',
          val: 'materialType',
          custom: 'materialType'
        },
        {
          lab: '物资简码',
          val: 'shortCode'
        },
        {
          lab: '物资编码',
          val: 'materialCode',
          showOverflowTooltip: true
          // custom: 'priceStatus'
        },
        {
          lab: '物资名称',
          val: 'materialName',
          showOverflowTooltip: true
        },
        {
          lab: '物资描述',
          val: 'remark',
          showOverflowTooltip: true
        },
        {
          lab: '规格',
          val: 'materialSpec',
          showOverflowTooltip: true
        },
        {
          lab: '是否关键物资',
          val: 'isMaterial',
          width: 120,
          custom: 'isMaterial'
        },
        {
          lab: '价格',
          val: 'drugPriceOne'
        },
        // {
        //   lab: '价格1',
        //   val: 'drugPriceOne'
        // },
        // {
        //   lab: '价格2',
        //   val: 'drugPriceTwo'
        // },
        {
          lab: '单位',
          val: 'unitName'
        },
        {
          lab: '最小库存',
          val: 'minStock'
        },
        {
          lab: '是否显示',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '默认产地(厂家)',
          val: 'defaultFacturer',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '默认注册证号',
          val: 'defaultNumber',
          width: 120,
          showOverflowTooltip: true
        }
      ] // 表格的列
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
      this.getData()
      this.fcosttype();
      this.getTreeselect()
    },
    'formType.porjectFlag'(newV){
         if(newV=='1'){
          this.information = true
         }
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getTreeselect()
    this.getData()
    this.getUitList()
    this.company()
    this.getTreese()
    this.cenit()
    this.fcosttype()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {

    newhandleClose(){
      this.newshowDialog=false
    },
    addspec(){
      this.productUnitInfo.productUnitName="";
      this.newshowDialog=true;
    },
    async newsubmitForm(){
      if (this.productUnitInfo.productUnitId) {
        this.productUnitInfo.deptId=this.deptId
        this.submitLoding=true
        await this.$api.product.productedit(this.productUnitInfo).then(res => {
          if (res) {
            this.getData()
            this.submitLoding=false
            this.productUnitInfo = {}
            this.productUnitId = ''
            this.showDialog = false
          }
        })
      } else {
        this.submitLoding=true
        await this.$refs.productUnitInfo.validate(async valid => {
          if (valid) {

            this.productUnitInfo.deptId=this.deptId
            await this.$api.product.productAdd(this.productUnitInfo).then(async res => {
              if (res) {
                this.$message.success(res.msg)
                this.newshowDialog = false;
                this.submitLoding=false
                this.company();
              }
            })
          }
        })
      }
    },
    // 是产品科室变化，引起产品类型选择框变化
    departmentIdChange() {

    },
    // 搜索
    getData: debounce(function(istrue) {
      var data = {
        deptId: this.deptId
      }
      this.form = Object.assign(this.form, data,this.pagination)
      if(istrue){
        delete  this.form.matTypeId
        delete  this.form.typeId
        delete this.form.materialTypeId
      }
      if(this.form.isMaterial==""){

        delete this.form.isMaterial
      }

      this.$api.storageRoom.materialInfoLst(this.form).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    }),
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handlecompile(e[1])
          break
        case '复制':
          this.handledcopy(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    // 添加
    addto() {
      this.title = '新增物资'
      this.showDialog = true
      this.formType.isMaterial=0;
      this.formType.status=0;
      this.formType.porjectFlag='0'
      this.$forceUpdate()
    },
    // 复制
    handledcopy(e) {
      this.$api.storageRoom.getRelationProjectfo(e.materId).then(res => {
        this.title = '复制物资'
        this.determine = '复制'
        if (res.data) {
          this.formType = res.data.materialInfo
          this.formType.price = null
          this.formType.allpurchasePrice = null
          this.formType.inventoryQuantity = null
          this.formType.drugPriceOne = 0
          this.formType.drugPriceTwo = 0
          this.formType.minStock = 0
          this.formType.materialName = '复制-' + res.data.materialInfo.materialName
          this.formType.materialCode = '复制-' + res.data.materialInfo.materialCode
          this.formType.unitName = res.data.materialInfo.unitName === '0' ? null : res.data.materialInfo.unitName
          // 有产品信息
          if (res.data.projectInfo) {
            // console.log('有产品信息', res.data.projectInfo)
            this.formType.porjectFlag = '1'
            this.information = true
            // 产品信息回显到表单
            const projectInfo = JSON.parse(JSON.stringify(res.data.projectInfo))
            this.formType.priceOne = projectInfo.priceOne // 价格
            this.formType.priceTwo = projectInfo.priceTwo // 结果
            this.formType.priceNum = projectInfo.priceNum // 产品次数
            this.formType.discountNumber = projectInfo.discountNumber // 折扣
            this.formType.cycleDays = projectInfo.cycleDays === 0 ? null : projectInfo.cycleDays // 周期
            this.formType.departmentId = projectInfo.departmentId // 产品类型一级
            this.formType.projectTypeId = projectInfo.projectTypeId // 产品类型二级
            this.formType.categoryId = projectInfo.categoryId // 产品类型三级
            this.$set(this.formType, 'businessType', projectInfo.businessType === 0 ? null : projectInfo.businessType) // 产品业务分类
            this.$set(this.formType, 'productItemType', projectInfo.productItemType === 0 ? null : projectInfo.productItemType) // 产品项目分类
            this.$set(this.formType, 'isDiscount', projectInfo.isDiscount) // 打折
            this.$set(this.formType, 'socialCode', projectInfo.socialCode) // 是否医保
            this.$set(this.formType, 'priceUnit', projectInfo.priceUnit) // 产品单位
            this.$set(this.formType, 'priceStatus', projectInfo.priceStatus) // 药品上架状态 也就是产品状态
            this.$set(this.formType, 'isPeriodic', projectInfo.isPeriodic) // 是否周期
            this.$set(this.formType, 'costType', projectInfo.costType) // 费用类型
            this.categorys = [projectInfo.departmentId, projectInfo.projectTypeId, projectInfo.categoryId]
          }
          this.showDialog = true
        }
      })
    },
    // 编辑
    handlecompile(e) {
      this.title = '编辑物资'
      // 查找物资产品关联表，有关联就是产品
      this.$api.storageRoom.getRelationProjectfo(e.materId).then(res => {
        if (res.data) {
          this.formType = res.data.materialInfo
          this.formType.unitName = res.data.materialInfo.unitName === '0' ? null : res.data.materialInfo.unitName
          // 有产品信息
          if(this.formType.assist!==''){
            this.radio='1'
          }else{
            this.radio='0'
          }
          if (res.data.projectInfo) {
            console.log('有产品信息', res.data.projectInfo)
            this.formType.porjectFlag = '1'
            this.information = true
            // 产品信息回显到表单
            const projectInfo = JSON.parse(JSON.stringify(res.data.projectInfo))
            this.formType.itemId = projectInfo.itemId // 产品id
            this.formType.priceOne = projectInfo.priceOne // 价格
            this.formType.priceTwo = projectInfo.priceTwo // 结果
            this.formType.priceNum = projectInfo.priceNum // 产品次数
            this.formType.discountNumber = projectInfo.discountNumber // 折扣
            this.formType.cycleDays = projectInfo.cycleDays === 0 ? null : projectInfo.cycleDays // 周期
            this.formType.departmentId = projectInfo.departmentId // 产品类型一级
            this.formType.projectTypeId = projectInfo.projectTypeId // 产品类型二级
            this.formType.categoryId = projectInfo.categoryId // 产品类型三级
            this.$set(this.formType, 'businessType', projectInfo.businessType === 0 ? null : projectInfo.businessType) // 产品业务分类
            this.$set(this.formType, 'productItemType', projectInfo.productItemType === 0 ? null : projectInfo.productItemType) // 产品项目分类
            this.$set(this.formType, 'isDiscount', projectInfo.isDiscount) // 打折
            this.$set(this.formType, 'socialCode', projectInfo.socialCode) // 是否医保
            this.$set(this.formType, 'priceUnit', projectInfo.priceUnit) // 产品单位
            this.$set(this.formType, 'priceStatus', projectInfo.priceStatus) // 药品上架状态 也就是产品状态
            this.$set(this.formType, 'isPeriodic', projectInfo.isPeriodic) // 是否周期
            this.$set(this.formType, 'costType', projectInfo.costType) // 费用类型
            this.$set(this.formType,'isMaterial',Number(this.formType.isMaterial))
            this.$set(this.formType,'status',Number(this.formType.status))
            this.categorys = [projectInfo.departmentId, projectInfo.projectTypeId, projectInfo.categoryId];
          }else{
            this.$set(this.formType,'isMaterial',Number(res.data.materialInfo.isMaterial))
            this.$set(this.formType,'status',Number(res.data.materialInfo.status))
          }
          this.showDialog = true
        }
      })
    },
    // 药品价格1-2判断大小
    checkone() {
      if (this.formType.drugPriceTwo !== 0) {
        if ((this.formType.drugPriceOne * 1) > (this.formType.drugPriceTwo * 1)) {
          this.$message('药品价格1不得大于价格2')
          this.formType.drugPriceTwo = this.formType.drugPriceOne
        }
      }
    },
    checktwo() {
      if ((this.formType.drugPriceOne * 1) > (this.formType.drugPriceTwo * 1)) {
        this.$message('药品价格1不得大于价格2')
        this.formType.drugPriceOne = this.formType.drugPriceTwo
      }
    },
    // 新增或修改
    submitForm() {

      this.$refs.formType.validate(async(valid) => {
        if (valid) {
          this.submitLoading=true
          this.$delete(this.formType, 'delFlag')
          if (this.title === '新增物资' || this.title === '复制物资') {
            // 是否产品this.formType.porjectFlag  0 是否 1是是
            // 添加物资同时添加产品
            if (this.formType.porjectFlag === '1') {
              // 产品保存
              this.datapice = {
                projectName: this.formType.materialName, // 产品名称
                priceOne: this.formType.priceOne, // 价格
                priceTwo: this.formType.priceTwo,
                priceNum: 1, // 产品次数
                priceUnit: this.formType.priceUnit, // 产品单位
                isDiscount: this.formType.isDiscount, // 是否打折
                discountNumber: this.formType.discountNumber, // 折扣
                priceStatus: this.formType.priceStatus, // 药品上架状态 也就是产品状态
                proiceDescribe: this.formType.remark, // 产品描述
                // 是否重点产品
                isPeriodic: this.formType.isPeriodic, // 是否周期
                cycleDays: this.formType.cycleDays === undefined ? '0' : this.formType.cycleDays,
                specs: this.formType.materialSpec, // 规格
                departmentId: this.categorys[0], // 科室，类型1
                projectTypeId: this.categorys[1], // 类型2
                categoryId: this.categorys[2], // 类型3
                productItemType: this.formType.productItemType, // 产品项目分类
                costType: this.formType.costType, // 费用类型
                businessType: this.formType.businessType, // 产品业务分类
                socialCode: this.formType.socialCode // 是否医保

                // 用药单位
                // 用法用量
                // 医保编码
                // 医保统一编码
              }
              this.$set(this.datapice, 'deptId', this.deptId)
              if (this.reqlist[2] === undefined) {
                this.formType.materialTypeId = this.reqlist[1] // 一级
                this.formType.typeId = this.reqlist[0] // 二级
              } else {
                this.formType.materialTypeId = this.reqlist[2] // 一级
                this.formType.typeId = this.reqlist[1] // 二级
                this.formType.matTypeId = this.reqlist[0] // 三级
              }
              this.$set(this.formType, 'deptId', this.deptId)
              this.$set(this.formType, 'whouseName', this.whouseName) // 物资类型
            } else {
              // 只添加物资
              if (this.reqlist[2] === undefined) {
                this.formType.materialTypeId = this.reqlist[1] // 一级
                this.formType.typeId = this.reqlist[0] // 二级
              } else {
                this.formType.materialTypeId = this.reqlist[2] // 一级
                this.formType.typeId = this.reqlist[1] // 二级
                this.formType.matTypeId = this.reqlist[0] // 三级
              }
              this.$set(this.formType, 'deptId', this.deptId)
              this.$set(this.formType, 'whouseName', this.whouseName) // 物资类型
              this.datapice = null
            }
            this.formType.params={
              insertion:this.radio
            }
            var insertMaterInfoProjectDto = {
              materialInfo: this.formType,
              projectInfoAddDto: {
                projectInfo: this.datapice,
                medicalInsuranceInfo: null
              }
            }
            // 物资信息保存 统一添加
            await this.$api.storageRoom.materialInfoAdd(insertMaterInfoProjectDto).then(res => {
              if (res) {
                this.$message.success('添加成功')
                this.submitLoading=false
                this.getData()
                this.mathandleClose()
              }
            })
          } else {
            this.submitLoading=true
            if (this.formType.porjectFlag === '1') {
              // 产品保存
              this.datapice = {
                itemId: this.formType.itemId, // 产品名称
                projectName: this.formType.materialName, // 产品名称
                priceOne: this.formType.priceOne, // 价格
                priceTwo: this.formType.priceTwo,
                priceNum: 1, // 产品次数
                priceUnit: this.formType.priceUnit, // 产品单位
                isDiscount: this.formType.isDiscount, // 是否打折
                discountNumber: this.formType.discountNumber, // 折扣
                priceStatus: this.formType.priceStatus, // 药品上架状态 也就是产品状态
                proiceDescribe: this.formType.remark, // 产品描述
                // 是否重点产品
                isPeriodic: this.formType.isPeriodic, // 是否周期
                cycleDays: this.formType.cycleDays === undefined ? '0' : this.formType.cycleDays,
                specs: this.formType.materialSpec, // 规格
                departmentId: this.categorys[0], // 科室，类型1
                projectTypeId: this.categorys[1], // 类型2
                categoryId: this.categorys[2], // 类型3
                productItemType: this.formType.productItemType, // 产品项目分类
                costType: this.formType.costType, // 费用类型
                businessType: this.formType.businessType, // 产品业务分类
                socialCode: this.formType.socialCode,
                isMedical:this.formType.isMaterial,
                status:this.formType.status,
         // 是否医保

                // 用药单位
                // 用法用量
                // 医保编码
                // 医保统一编码
              }
              this.$set(this.datapice, 'deptId', this.deptId)
              if (this.reqlist[2] === undefined) {
                this.formType.materialTypeId = this.reqlist[1] // 一级
                this.formType.typeId = this.reqlist[0] // 二级
              } else {
                this.formType.materialTypeId = this.reqlist[2] // 一级
                this.formType.typeId = this.reqlist[1] // 二级
                this.formType.matTypeId = this.reqlist[0] // 三级
              }
              this.$set(this.formType, 'deptId', this.deptId)
              this.$set(this.formType, 'whouseName', this.whouseName) // 物资类型
            } else {
              // 只添加物资
              if (this.reqlist[2] === undefined) {
                this.formType.materialTypeId = this.reqlist[1] // 一级
                this.formType.typeId = this.reqlist[0] // 二级
              } else {
                this.formType.materialTypeId = this.reqlist[2] // 一级
                this.formType.typeId = this.reqlist[1] // 二级
                this.formType.matTypeId = this.reqlist[0] // 三级
              }
              this.$set(this.formType, 'deptId', this.deptId)
              this.$set(this.formType, 'whouseName', this.whouseName) // 物资类型
              this.datapice = null
            }
            this.formType.params={
              insertion:this.radio
            }
            var editMaterInfoProjectDto = {
              materialInfo: this.formType,
              projectInfoAddDto: {
                projectInfo: this.datapice,
                medicalInsuranceInfo: null
              }
            }
            await this.$api.storageRoom.materialInfoEdit(editMaterInfoProjectDto).then(res => {
              if (res) {
                this.$message.success('修改成功')
                this.submitLoading=false
                this.getData()
                this.mathandleClose()
              }
            })
          }
        }
      })
    },
    // 是否打折
    isdout(val) {
      if (val === '0') {
        this.Discount = true
      } else {
        this.Discount = false
      }
    },
    // 删除
    handleDelete(e) {
      this.$confirm('此操作将永久此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.storageRoom.getRelationProjectfo(e.materId).then(res => {
          if (res.data.projectInfo) {
            this.$message.error('该物资有关联产品不能删除，请先解除关联')
          } else {
            this.$api.storageRoom.materialInfoDelete(e.materId).then(res => {
              if (res) {
                this.$message.success('删除成功')
                this.getData()
              }
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 关闭清空弹框
    mathandleClose() {
      this.formType = {}
      this.categorys = []
      this.information = false
      this.showDialog = false
    },
    // 树结构
    getTreeselect() {
      this.$api.storageRoom.materialTypeListTree({ deptId: this.deptId }).then(res => {
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
    // 分页
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    // 导入
    handleImport() {
      this.upload.title = '导入物资'
      this.upload.open = true
    },
    downloadTemplate() {
      this.$api.product.importTemplate()
    },
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.getData()
    },
    submitFileForm() {
      // this.$refs.upload.submit()
    },
    handleFileClose() {
      this.upload.open = false
    },
    handleClose() {
      this.upload.open = false
    },
    // 节点点击事件 禁用按钮
    handleNodeClick(data, val) {
      this.rowList = []
      this.getParent(val)
      // 同级tree点击时置空，也可以判断
      this.reqlist = this.rowList
      if (data.sonList === undefined || data.sonList.length === 0) {
        this.whouseName = data.name
        this.typeId = data.type
        this.single = false
        this.addBan = false
        // this.matTypeId = data.matTypeId
        if (this.reqlist[2] === undefined) {
          this.$set(this.form, 'materialTypeId', this.reqlist[1]) // 一级
          this.$set(this.form, 'typeId', this.reqlist[0]) // 二级
          this.$set(this.form, 'matTypeId', this.reqlist[2]) // 三级

        } else {
          this.$set(this.form, 'materialTypeId', this.reqlist[2]) // 一级
          this.$set(this.form, 'typeId', this.reqlist[1]) // 二级
          this.$set(this.form, 'matTypeId', this.reqlist[0]) // 三级
        }
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        this.form = Object.assign(this.form, this.pagination)
        this.$api.storageRoom.materialInfoLst(this.form).then(res => {
          if (res) {
            this.tableData = res.rows
            this.pagination.total = res.total
          }
        })
      } else {
        this.single = true
        this.addBan = true
      }
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      const ids = selection[1].map(item => item.itemId)
      this.departmentId = ids[0]
      this.single = selection[1].length === 0
    },
    // 是否产品 显示或隐藏产品信息
    changeporjectFlag(val) {
      if (val === '1') {
        this.information = true
      } else {
        this.information = false
      }
      // this.information = true
    },
    // 产品单位
    company() {
      var data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.product.productList(data).then(res => {
        if (res) {
          this.coump = res.rows
        }
      })
    },
    // 科室
    getUitList() {
      this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0', isDepartment: '1' }, 'get').then((res) => {
        if (res) {
          this.TriageDepartment = res.rows
        }
      })
    },
    getTreese() {
      this.$api.modules.netPower.projectTreeselect({ deptId: this.deptId, isFuZhu: '1' }).then(res => {
        this.deptOption = res.data
      })
    },
    handleNodeClicks(data) {
      // console.log(data)
      if (data[3] !== null || data[3] !== undefined) {
        this.formType.departmentId = data[0]
        this.formType.projectTypeId = data[1]
        this.formType.categoryId = data[2]
      } else {
        this.$message('请选择第三级或者先添加第三级')
      }
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
    // 点击清空
    aaaprice() {
      if (this.formType.priceOne === 0) {
        this.formType.priceOne = ''
      }
    },
    aaapriceTwo() {
      if (this.formType.priceTwo === 0) {
        this.formType.priceTwo = ''
      }
    },
    priceone() {
      if ((this.formType.priceOne * 1) > (this.formType.priceTwo * 1) && (this.formType.priceTwo * 1) !== 0) {
        this.$message.error('价格1不能大于价格2')
        this.formType.priceTwo = this.formType.priceOne
      }
    },
    checkTwo() {
      if ((this.formType.priceOne * 1) === '') {
        this.$message.error('请先输入价格1的价格')
        // eslint-disable-next-line no-self-compare
      } else if ((this.formType.priceTwo * 1) > (this.formType.priceTwo * 1)) {
        this.$message.error('价格2不能小于价格1')
        this.formType.priceTwo = 0
        this.formType.priceTwo = this.formType.priceOne
      }
    },
    aaa() {
      if (this.formType.drugPriceOne === 0) {
        this.formType.drugPriceOne = ''
      }
    },
    bbb() {
      if (this.formType.drugPriceTwo === 0) {
        this.formType.drugPriceTwo = ''
      }
    },
    Stock() {
      if (this.formType.minStock === 0) {
        this.formType.minStock = ''
      }
    },
    textCate() {
      this.$forceUpdate()
    },
    // 产品业务分类
    cenit() {
      const data = {
        status: '0',
        deptId: this.deptId
      }
      this.$api.product.classificaList(data).then(res => {
        if (res) {
          this.ceunit = res.rows
        }
      })
      this.$api.product.productitemtyList(data).then(res => {
        if (res) {
          this.productItem = res.rows
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';

> > > .el-dialog .el-dialog__body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.left {
  padding-bottom: 5px;
}

.herder {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: center;

  &:nth-child(1) div span {
    margin-left: 20px;
    font-size: 14px;

    .two {
      background-color: green;
      border: 1px solid green;
    }
  }
}

.formBody {
  width: 100%;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  padding: 15px 20px 20px 20px;
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

// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
