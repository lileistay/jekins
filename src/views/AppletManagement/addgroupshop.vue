<template>
  <div style="padding: 30px;">
    <el-form ref="formList" label-width="120px" style="display: flex;justify-content: space-between;flex-wrap: wrap"
      :rules="rules" :model="formList" size="mini">
      <el-row style="width: 100%;">
        <el-col :span="12">
          <el-form-item label="公司" prop="deptId">
            <el-select v-model="formList.deptId" filterable placeholder="请选择" size="mini" 
              @change="changeselect">
              <el-option v-for="item in deptList" :key="item.value" :label="item.deptName" :value="item.deptId">
              </el-option>
            </el-select>
          </el-form-item>
          <div style="margin-left:20px;margin-bottom:20px;">
            <span style="color:#F56C6C;margin-left:20px ">*</span>
            <span style="margin-left:5px;font-size:14px">活动类型</span>
            <el-radio v-model="newcustomerTypes" label="1" style="margin-left:13px" :disabled="xFlagnew">拼团</el-radio>
            <el-radio v-model="newcustomerTypes" label="2" :disabled="xFlagnew">秒杀</el-radio>
          </div>
          <div style="margin-left:20px;width:1500px;display:flex;justify-content:space-between;height:60px">
            <div>
              <span style="color:#F56C6C;margin-left:20px ">*</span>
              <span style="margin-left:5px;font-size:14px">商品类型</span>
              <el-radio v-model="customerTypes" label="0" style="margin-left:13px" :disabled="xFlagnew">商品</el-radio>
              <el-radio v-model="customerTypes" label="1" :disabled="xFlagnew">项目</el-radio>
            </div>
            <div style="margin-right:250px">
              <el-form-item label="活动过期时间" prop="activityEndTime" v-if="newcustomerTypes == 1">
                <el-date-picker v-model="formList.activityEndTime" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                </el-date-picker>
                <div class="text">时间到期自动下架</div>
              </el-form-item>
              <el-form-item label="秒杀过期时间" prop="activityEndTime" v-if="newcustomerTypes == 2">
                <el-date-picker v-model="formList.activityEndTime" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                </el-date-picker>
                <div class="text">时间到期自动下架</div>
              </el-form-item>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动开始时间" prop="activityStartTime" v-if="newcustomerTypes == 1">
            <el-date-picker v-model="formList.activityStartTime" type="datetime" format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="秒杀开始时间" prop="activityStartTime" v-if="newcustomerTypes == 2">
            <el-date-picker v-model="formList.activityStartTime" type="datetime" format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="拼团价格" prop="groupPrice" v-if="newcustomerTypes == 1">
            <el-input v-model="formList.groupPrice" style="width:220px" placeholder="请输入拼团价格" />
          </el-form-item>
          <el-form-item label="秒杀价格" prop="groupPrice" v-if="newcustomerTypes == 2">
            <el-input v-model="formList.groupPrice" style="width:220px" placeholder="请输入秒杀价格" />
          </el-form-item>
        </el-col>
        <el-col>
          <div
            style="display: flex;margin-bottom:40px;align-items:center;width:1500px;display:flex;justify-content:space-between;margin-top:20px">
            <div class="Group">
              <span style="color:#F56C6C;margin-left:35px">*</span> <span style="font-size:14px;margin-left:5px">商品分类</span>
              <el-select v-model="formList.productId" filterable placeholder="请选择" size="mini" style="margin-left:15px"
                @change="getlistproject">
                <el-option v-for="item in tableDatadel" :key="item.categoryId" :label="item.categoryName"
                  :value="item.categoryId">
                </el-option>
              </el-select>
              <span style="color:#F56C6C;margin-left:15px">*</span> <span style="font-size:14px;margin-left:5px">商品</span>
              <!-- <el-form-item label="商品" prop="categoryId" > -->
              <el-select v-model="formList.categoryId" filterable placeholder="请选择" size="mini" @change="getspace"
                style="margin-left:10px">
                <el-option v-for="item in tableDatashop" :key="item.value" :label="item.projectName"
                  :value="item.productId">
                </el-option>
              </el-select>
              <!-- </el-form-item> -->
              <span style="color:#F56C6C;margin-left:15px">*</span> <span style="font-size:14px;margin-left:5px">规格</span>
              <!-- <el-form-item label="规格" prop="categoryId" > -->
              <el-select v-model="formList.specsId" filterable placeholder="请选择" size="mini" style="margin-left:10px">
                <el-option v-for="item in spaceList" :key="item.specsId"
                  :label="item.specs + ' / ' + item.originalPrice + ' / ' + item.sellingPrice" :value="item.specsId">
                </el-option>
              </el-select>
            </div>
            <div style="margin-right:350px;height:20px;margin-bottom:10px">
              <el-form-item label="拼团等待时间" prop="effectiveTime" v-if="newcustomerTypes == 1">
                <el-input v-model="formList.effectiveTime" style="width: 100px" />
                <div class="text">1=1min</div>
              </el-form-item>
              <el-form-item label="删除时间" prop="effectiveTime" v-if="newcustomerTypes == 2" >
                <div style="position:relative;">
                  <div></div>
                  <img src="@/assets/images/wh.png" style="margin-top:5px;position:absolute;left:-10px;z-index:10000" title="未支付订单进行删除，回收库存" />
                <el-input v-model="formList.effectiveTime" style="width: 100px;margin-left:10px" />
                <div class="text" style="margin-left:10px">1=1min</div>
                </div>
  
              </el-form-item>
              <el-form-item label="排序" prop="orderDisplay" v-if="newcustomerTypes == 2">
                <el-input v-model="formList.orderDisplay" style="width: 100px;" />
                <div class="text">
                  数字越大排在越前
                </div>
              </el-form-item>
            </div>
            <!-- </el-form-item> -->
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品头图" prop="">
            <upload :limit="1" title="上传图片" @remove="toothImgDel" :fileList="newfilelist" @successFile="gettoothSuccess"
              :fileSize="10"></upload>
            <span class="text">默认第一个为列表缩略图。支持ipg,jpeg,png,bmp。文件最大不能超过600KB。图片尺寸建议750*460</span>
          </el-form-item>

        </el-col>

        <el-col :span="12">
          <!-- <el-form-item label="拼团等待时间" prop="effectiveTime" v-if="newcustomerTypes==0">
            <el-input v-model="formList.effectiveTime" style="width: 100px" />
            <div class="text">1=1min</div>
          </el-form-item> -->
          <el-form-item label="成团人数" prop="number" v-if="newcustomerTypes == 1">
            <el-input v-model="formList.number" style="width: 100px" />
          </el-form-item>
          <el-form-item label="排序" prop="orderDisplay" v-if="newcustomerTypes == 1">
            <el-input v-model="formList.orderDisplay" style="width: 100px;" />
            <div class="text">
              数字越大排在越前
            </div>
          </el-form-item>
          <el-form-item label="客源限制" prop="customerType" v-if="newcustomerTypes == 1">
            <el-radio v-model="formList.customerType" label="0">不限</el-radio>
            <el-radio v-model="formList.customerType" label="1">限老客户</el-radio>
            <el-radio v-model="formList.customerType" label="2">限新客户</el-radio>
            <div class="text">
              新老客定义为已购买商品并且到院核销为老客，否则为新客
            </div>
          </el-form-item>
        </el-col>
        <!--            <el-col :span="12"><el-form-item label="是否首页显示" prop="">-->
        <!--              <el-switch v-model="formList.isHomeDisplay" active-color="#409eff" inactive-color="#dcdfe6"-->
        <!--                         style="margin-left: 38px;">-->
        <!--              </el-switch>-->
        <!--            </el-form-item>-->
        <!--            </el-col>-->
      </el-row>
      <el-row style="width: 100%;">
        <el-col :span="12"><el-form-item label="限购件数" prop="restrictionNum" v-if="newcustomerTypes == 3">
            <el-input v-model="formList.restrictionNum" style="width: 100px;" />
            <div class="text">
              每个用户限制购买件数，0为不限制
            </div>
          </el-form-item>
          <el-form-item label="库存" prop="inventory">
            <el-input v-model="formList.inventory" style="width: 100px" @blur="inputsalesVolume" />
            <div class="text" >
              <span v-if="xFlag==1">库存数量应大于或等于购买数量(<span style="color: red;">当前购买数量:{{ this.inputsalesVolumevalue }}</span>)</span>
              <span v-else>0为不限制库存</span>
              
            </div>
          </el-form-item>
          <!-- <el-form-item label="隐藏价格">
            <el-switch v-model="formList.hidePrice" active-value="1" inactive-value="0" active-color="#409eff"
              inactive-color="#dcdfe6" style="margin-left: 38px;">
            </el-switch>
          </el-form-item> -->
          <el-form-item label="是否首页显示" prop="isHomeDisplay">
            <!--                <el-radio v-model="formList.isHomeDisplay" label="0">否</el-radio>-->
            <!--                <el-radio v-model="formList.isHomeDisplay" label="1">是</el-radio>-->
            <el-switch v-model="formList.isHomeDisplay" active-value="1" inactive-value="0" active-color="#409eff"
              inactive-color="#dcdfe6" style="margin-left: 38px;">
            </el-switch>
          </el-form-item>
          <el-form-item label="是否上架" prop="isArrive">
            <el-switch v-model="formList.isArrive" active-value="1" inactive-value="0" active-color="#409eff"
              inactive-color="#dcdfe6" style="margin-left: 38px;">
            </el-switch>
          </el-form-item>
        </el-col>

        <el-col :span="12">

          <el-form-item label="成团设置" prop="groupSetting" v-if="newcustomerTypes == 1">
            <el-radio v-model="formList.groupSetting" label="0">过期自动成团</el-radio>
            <el-radio v-model="formList.groupSetting" label="1">过期自动退款</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="text-align: right;width: 100%">
        <el-button type="primary" icon="el-icon-folder-opened" size="mini" :loading="submitLoading"
          @click="submit">保存</el-button>
        <el-button type="danger" size="mini" @click="cancel">取消</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import vm from '@/utils/util'
import upload from '@/components/newUpload'
const serverPath = process.env.VUE_APP_BASE_API + '/file'
export default {
  watch: {
    customerTypes(newV) {
      if (this.deptIdlist == '') {
      
      } else {
        if (newV == 0) {
          this.selectflag=false;
          if(this.formList.productId!==undefined){
            this.formList.categoryId = ''
            this.formList.specsId = '';
            this.getlistproject(this.formList.categoryId)
          }else{
          this.formList.categoryId = ''
          this.$delete(this.formList, 'specsId')
          this.tableDatashop=[];
          this.spaceList=[];
          this.formList.specsId = '';
          }
        } else {
          if(this.selectflag){
            this.getlistproject(this.formList.categoryId)
            this.selectflag=false;
          }else{
          this.formList.specsId = '';
          this.formList.categoryId='';
          this.getlistproject(this.formList.categoryId)
          this.spaceList = [];
          this.tableDatashop=[]
          }

        }
      }

    }
  },
  name: "Addgroupshop",
  components: {
    upload
  },
  data() {
    return {
      deptIdlist: "",
      xFlagnew:false,
      newcustomerTypes: "1",
      selectflag:false,
      projectType: [],
      tableDatadel: [],
      //销量
      inputsalesVolumevalue:"",
      //库存
      salesVolumeiven:"",
      newlistData: [],
      productItemTypeId: "",
      formList: {
        categoryId: '',
        customerType: '2',
        groupSetting: '0'
      },
      customerTypes: "0",
      rules: {
        deptId: [{ required: true, message: '请选择公司', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择', trigger: 'blur' }],
        activityStartTime: [{ required: true, message: '请选择活动过期时间', trigger: 'blur' }],
        groupPrice: [{ required: true, message: '请输入拼团价格', trigger: 'groupPrice' }],
        activityEndTime: [{ required: true, message: '请选择活动过期时间', trigger: 'blur' }],
        number: [{ required: true, message: '请输入成团人数', trigger: 'blur' }],
        restrictionNum: [{ required: true, message: '请输入限购件数', trigger: 'blur' }],
        inventory: [{ required: true, message: '请输入库存', trigger: 'blur' }],
        groupSetting: [{ required: true, message: '请选择成团设置', trigger: 'blur' }],
        customerType: [{ required: true, message: '请选择客源限制', trigger: 'blur' }],
        isHomeDisplay: [{ required: true, message: '请选择是否首页显示', trigger: 'blur' }],
        isArrive: [{ required: true, message: '请选择是否上架', trigger: 'blur' }],
        orderDisplay: [{ required: true, message: '请输入', trigger: 'blur' }],
        specsId: [{ required: true, message: '请选择规格', trigger: 'blur' }],
        effectiveTime: [{ required: true, message: '请输入拼团等待时间', trigger: 'blur' }],
        specsIdtype:[{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      submitLoading: false,
      deptList: [],
      tableDatashop: [],
      // upload:{
      //   url:"/api/file/upload"
      // },
      xFlag: '',
      ggId: '',
      detailList: {},
      newfilelist: [],
      spaceList: []

    }
  },
  created() {
    this.getDeptlist()
    // this.getproductInfo()
    // this.getspacs()
    this.xFlag = this.$route.query.xFlag
    if(this.xFlag==1){
      this.xFlagnew=true
      this.selectflag=true
    }else{
      this.xFlagnew=false;
    }
    this.ggId = this.$route.query.id
    if (this.ggId) {
      this.getdetaInfo()
    }
  },
  methods: {
    inputsalesVolume(e){
        if(this.xFlag==1){
          if(Number(e.target.value)<Number(this.inputsalesVolumevalue)){
            this.$message.warning('库存数应大于等于购买数量')
            this.formList.inventory=this.salesVolumeiven
          }
        }
    },
    getlistproject(e) {
      let data = {
        categoryId: e,
        deptId: this.deptIdlist
      }
      if (this.customerTypes == '0') {
        data.productType = '1'
      } else {
        data.productType = '2'
      }


      this.$api.confinementRoom.productInfo(data).then(res => {
        if (res) {
          this.tableDatashop = res.rows;
        }
      })
    },
    getprojectType(e) {
      let data = {
        deptId: e
      }
      this.$api.confinementRoom.productCategorylist(data).then(res => {
        this.tableDatadel = res.rows;
      })
    },
    changeproject(value) {
      this.getspacs(value)
    },
    // 修改/删除
    edit() {
      if (this.xFlag == 0) {
       
        this.formList = {
          deptId: '',
          categoryId: '',
          activityStartTime: '',
          groupPrice: '',
          isArrive: 1,
          activityEndTime: '',
          number: '',
          orderDisplay: '',
          restrictionNum: 0,
          inventory: '',
          hidePrice: "",
          customerType: '',
          groupSetting: '',
          isHomeDisplay: '',
          specsId: '',
          effectiveTime: '',
          productId:"",
        }
      } else {
        this.deptIdlist=this.detailList.deptId
        this.inputsalesVolumevalue=this.detailList.salesVolume;
        this.salesVolumeiven=this.detailList.inventory
        this.formList = {
          isArrive: this.detailList.isArrive,//是否上架
          prodImage: this.detailList.prodImage,//商品头图
          restrictionNum: this.detailList.restrictionNum,//限购件数
          inventory: this.detailList.inventory,//库存
          hidePrice: this.detailList.hidePrice,//隐藏价格
          number: this.detailList.number,//成团人数
          groupPrice: this.detailList.groupPrice,//拼团价格
          activityEndTime: this.detailList.activityEndTime,//活动过期时间
          categoryId: this.detailList.productId,//商品
          deptId: this.detailList.deptId,
          orderDisplay: this.detailList.orderDisplay,
          groupSetting: this.detailList.groupSetting,
          activityStartTime: this.detailList.activityStartTime,
          customerType: this.detailList.customerType,//客源限制
          isHomeDisplay: this.detailList.isHomeDisplay,//是否显示首页
          specsId: this.detailList.specsId,
          effectiveTime: this.detailList.effectiveTime,
          productId:this.detailList.categoryId //商品分类
        }
        this.newcustomerTypes=this.detailList.activityType;
        this.customerTypes=this.detailList.productType==2?'1':'0'
        if(this.customerTypes=='0'){
          this.selectflag=false;
        }
        this.getprojectType(this.detailList.deptId);
        this.formList.specsIdtype = 7
        if (this.detailList.prodImage) {
          this.newfilelist.push({
            name: "活动",
            url: serverPath + this.detailList.prodImage
          })
        } else {
          this.newfilelist = []
        }

        // this.newfilelist.url=serverPath+this.detailList.prodImage,
        //   this.newfilelist.name='12121'
      }
    },
    getdetaInfo() {
      const ggId = this.ggId
      this.$api.modules.groupGoods.groupGoodsInfo(ggId).then(res => {
        if (res.code == 200) {
          this.detailList = res.data;
          this.edit()
          this.getlistproject(this.detailList.categoryId);
          this.getspacs(this.detailList.productId);
        }

      })
    },
    getDeptlist() {

      this.$api.dept.deptList({ status: '0' }, 'get').then(res => {
        if (res) {
          res.data.forEach(item => {
            let list = []
            list = item.ancestors.split(',')
            item.list = list
            if (list.length == 4) {
              item.ancestorsId = Number(list[item.list.length - 1])

              this.deptList.push(item)
            }
          })
        }
      })
    },
    // 获取商品
    changeselect(e) {
      this.deptIdlist = e;
      this.getprojectType(e)


    },
    // 获取规格
    getspace(val) {
      this.getspacs(val)
      this.$delete(this.formList, 'specsId')
      // this.formList.specsId=''
    },
    getspacs(val) {
      this.$api.confinementRoom.productSpecInfo({ productId: val }).then(res => {
        this.spaceList = res.rows;
      })
    },
    getproductInfo(e) {
      this.$api.confinementRoom.productInfo({ deptId: e }).then(res => {
        this.tableDatashop = res.rows;
        this.getspacs(this.formList.categoryId)
      })
    },

    // 删除照片
    toothImgDel(val) {
      this.newfilelist = []
      this.formList.prodImage = ''
    },
    gettoothSuccess(file) {
      this.formList.prodImage = file.url
    },
    submit() {
      this.$refs.formList.validate((valid) => {
        if (valid) {
          const query = {
            isArrive: this.formList.isArrive == 1 ? 1 : 0,//是否上架
            prodImage: this.formList.prodImage,//商品头图
            restrictionNum: this.formList.restrictionNum,//限购件数
            inventory: this.formList.inventory,//库存
            hidePrice: this.formList.hidePrice == 1 ? 1 : 0,//隐藏价格
            number: this.formList.number,//成团人数
            groupPrice: this.formList.groupPrice,//拼团价格
            activityEndTime: this.formList.activityEndTime,//活动过期时间
            productId: this.formList.categoryId,//商品
            deptId: this.formList.deptId,
            orderDisplay: this.formList.orderDisplay,
            groupSetting: this.formList.groupSetting,
            activityStartTime: this.formList.activityStartTime,
            customerType: this.formList.customerType,//客源限制
            ggId: this.ggId ? this.ggId : '',
            isHomeDisplay: this.formList.isHomeDisplay,//是否显示首页
            specsId: this.formList.specsId,
            effectiveTime: this.formList.effectiveTime,
            activityType:this.newcustomerTypes,//1 拼团 2 秒杀,
            productType:this.customerTypes==0?'1':"2",//1 商品 2 项目
            categoryId:this.formList.productId
            //秒杀开始时间
            //秒杀结束时间
            //秒杀价格
            //删除时间

          }
          if (this.xFlag == 0) {
            this.submitLoading = true
            this.$api.modules.groupGoods.groupGoodsInfoListAdd(query).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.closeTag()
                this.submitLoading = false
              }
            }).catch(
              this.submitLoading = false
            )
          } else {
            this.$api.modules.groupGoods.groupGoodsInfoListEdit(query).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.closeTag()
              }
            }).catch(
              this.submitLoading = false
            )
          }

        }
      })
    },
    cancel() {
      this.closeTag()
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
  }
}
</script>

<style scoped>
.text {
  color: #9f9b9b;
  font-size: 12px;
}
</style>