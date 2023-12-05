<template>
  <!--  已到院的 来院个人信息记录  基本信息 -->
  <div class="details">
    <div class="flexx">
      <!-- 左侧 -->
      <div class="portrait">
        <div class="portraitmini">
          <div class="circular" style="">
            <el-row class="demo-avatar demo-basic">
              <el-col :span="6">
                <div class="yuan" style="">
                  <div style="width: 150px;height: 150px;border-radius: 50%;">
                      <img :src="squareUrl" style="width: 150px;height: 150px;border-radius: 50%" />
                  </div>
<!--                  <el-avatar-->
<!--                    shape="square"-->
<!--                    style=" width: 150px; height: 150px; border-radius: 50%;margin-left: 0px;"-->
<!--                    :src="squareUrl"-->
<!--                  />-->
                </div>
              </el-col>
            </el-row>
            <div>
              <div style="margin-top: 10px;">会员等级：{{ item.gradeName }}</div>
              <div style="margin-top: 10px;display: flex;min-height: 100px;flex-wrap: wrap;width: 165px;">
                <span>消费等级：</span>
                <div style="width: 73px;height: 100px;" ref="money">

                </div>

              </div>
            </div>

          </div>
          <div class="Department">
            <p class="Concerns-title"><i class="el-icon-s-order" />分院信息</p>
            <el-table>
              <el-table-column label="分院" />
              <el-table-column label="最后到院" />
              <el-table-column label="是否消费" />
            </el-table>
          </div>
          <div class="Department">
            <p class="Concerns-title"><i class="el-icon-s-promotion" />客户标签</p>
            正客标签：
            <div class="treatment">
              <span v-for="temporary in labelTypeName" :key="temporary.customerLabelId" class="customerLabelRelation">
                <el-button class="btnmark" size="mini">{{ temporary.labelTypeName }}</el-button>
              </span>
            </div>
            临客标签：
            <div class="treatment" style="margin-bottom: 10px">
              <span v-for="ite in objlist" :key="ite.customerLabelId" class="customerLabelRelation">
                <el-button class="btnmark" size="mini">{{ ite.labelTypeName }}</el-button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="information">
        <div class="container-basic">
          <div class="lili">
            <div class="title"><i class="el-icon-user-solid" />基本信息</div>
            <ul class="basic-item-box">
              <li>建档时间：{{ item.createTime }}</li>
              <li>客户新老：<span style="color: green">{{ cuomet(item.customerStatus) }}</span>
                <el-button type="text">
                  {{ nodeal(item.receptionStatus) }}
                </el-button>
<!--                <button>{{ nodeal(item.receptionStatus) }}</button>-->
              </li>
              <li style="height: 40px">身份证：
                <el-input v-model="item.card" size="mini" style="width: 150px"></el-input>
                <button @click="saveCard">保存</button>
              </li>
              <li class="setbody" style="display: flex;height: 22px">生日：
                <el-select filterable v-model="yearsModel" placeholder="请选择" style="width:100px; display: none" @change="dateChange(1)">
                  <el-option
                    v-for="item in years"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select filterable v-model="monthsModel" placeholder="请选择" style="margin-left: 14px" @change="dateChange(2)" size="mini">
                  <el-option
                    v-for="item in months"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select filterable v-model="daysModel" placeholder="请选择" style="margin-left: 20px" @change="dateChange(3)" size="mini">
                  <el-option
                    v-for="item in days"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <button @click="saveBirthday" style="margin-left: 10px">保存</button>
<!--                {{ item.birthday }}-->
              </li>
              <li style="height: 10px"></li>
              <li>年龄：       <el-input-number v-model="item.customAge" size="mini" style="width: 100px;margin-left: 12px" :min="0"></el-input-number>
                <button @click="saveAge">保存</button>
              </li>

              <li>身高/体重：暂无</li>
              <li>职业：{{ occup(item.occupation) }}</li>
              <li>婚姻状况：{{ marriag(item.marriageType) }}</li>
            </ul>
          </div>
          <div class="lili gai">
            <ul class="basic-item-box">
              <li>血型：暂无</li>
              <li>经济能力：{{ ecome(item.economicCapacity) }}</li>
              <li>怀孕几周：{{ item.pregnantWeek }}周</li>
              <li>预产期：{{ item.preProduction }}</li>
              <li>房间类型：{{ item.roomType }}</li>
              <li>胎数：{{ item.fertility }}</li>
              <li>是否有小孩：暂无</li>
            </ul>
          </div>
          <div class="lili">
            <div class="title"><i class="el-icon-phone" />联系方式</div>
            <ul class="basic-item-box">
              <!-- <span v-show="show">{{title.phone | mobileFilter}}</span><span v-show ="load">{{title.phone}}</span>  <el-button size="mini" @click="toshow" round type="success">显示电话</el-button> -->
              <!--<li>主电话号码：-->
              <!--  <span> {{ item.customPhone }} </span>-->
              <!--  &lt;!&ndash;  <span v-show="load">{{phone}}</span>&ndash;&gt;-->
              <!--  <el-button v-show="show" type="text" size="mini" plain @click="toshow">显示电话</el-button>-->
              <!--</li>-->
              <!--<li v-if="phones.length>0">副电话号码：-->
              <!--  <span> {{ phones.length + '条记录' }} </span>-->
              <!--  &lt;!&ndash;  <span v-show="load">{{phone}}</span>&ndash;&gt;-->
              <!--  <el-button type="text" size="mini" plain @click="phoneDetailDialog=true">查看详情</el-button>-->
              <!--</li>-->
              <li>电话号码：
                <el-button type="text" size="mini" plain @click="getPhone">查看详情</el-button>
              </li>
              <li>微信：{{ item.wechat }}</li>
              <li>QQ：{{ item.qq }}</li>
              <li>地区：{{ item.province }}-{{ item.city }}-{{ item.area }}</li>
              <li>地址：{{ item.addr }}</li>
            </ul>
          </div>
          <div class="lili">
            <div class="title"><i class="el-icon-s-unfold" />其他信息</div>
            <ul class="basic-item-box">
              <li>媒介：{{ item.channelName }}</li>
              <li>推荐人：{{ item.refereeName }}</li>
              <li>
                <span class="remarks">客户备注：
                  <el-input v-model="item.reachRemarks" type="textarea" disabled style="width: 300px;" :rows="5" />
                </span>
              </li>
              <li>
                可用收益：<span style="color: #e95b24">暂无</span>
              </li>
              <li>
                <span>员工推荐人：{{ item.refereeuserName }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 电话详情弹窗 -->
        <sg-dialog
          title="电话详情"
          :dialog="phoneDetailDialog"
          :inner-dialog="addPhoneDialog"
          :size="'600px'"
          @innerHandleClose="addPhoneDialogHandleClose"
          @handleClose="phoneDetailDialogHandleClose"
        >
          <div slot="out">
            <div class="dialog-box">
              <div class="title">
                主号码信息
                <el-button
                  v-has-permi="['confinement:customPhoneList:add']"
                  type="text"
                  size="mini"
                  @click="addDialog = true">
                  添加副号码
                </el-button>
              </div>
              <div class="content">
                <el-table ref="mainPhoneTable" :data="mainPhone" :border="true" size="mini" style="width: 100%">
                  <el-table-column type="index" align="center" width="50" />
                  <el-table-column prop="showPhone" align="center" label="电话">
                    <template #default="scope">
                      <!--{{ scope.row.customPhone }}-->
                      <template v-if="scope.row.showPhone">{{ scope.row.truePhone }}</template>
                      <template v-else>{{ scope.row.phone }}</template>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createBy" label="创建人" align="center" width="100" />
                  <el-table-column prop="createTime" label="创建时间" align="center" width="140" />
                  <el-table-column label="操作" align="center" width="80">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click.native.prevent="showPhone(scope.row)">
                        {{ scope.row.showPhone ? '隐藏' : '查看' }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div v-if="phones.length > 0" class="dialog-box">
              <div class="title">
                副号码信息
              </div>
              <div class="content">
                <el-table :data="phones" :border="true" size="mini" style="width: 100%">
                  <el-table-column type="index" align="center" width="50" />
                  <el-table-column prop="showPhone" align="center" label="电话">
                    <template #default="scope">
                      <template v-if="scope.row.showPhone">{{ scope.row.truePhone }}</template>
                      <template v-else>{{ scope.row.phone }}</template>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createBy" label="创建人" align="center" width="100" />
                  <el-table-column prop="createTime" label="创建时间" align="center" width="140" />
                  <el-table-column label="操作" align="center" width="80">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click.native.prevent="showPhone(scope.row)">
                        {{ scope.row.showPhone ? '隐藏' : '查看' }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </sg-dialog>

        <!-- 添加号码弹框-->
        <sg-dialog title="添加电话" :dialog="addDialog" size="400px" @handleClose="addPhoneDialogClose">
          <div slot="out">
            <el-form ref="addPhoneForm" :model="addPhoneForm" :rules="phoneRules">
              <el-form-item label="姓名" prop="customerName">
                <el-input v-model="addPhoneForm.customerName" size="mini" placeholder="姓名" disabled />
              </el-form-item>
              <el-form-item label="电话" prop="phone">
                <el-input v-model="addPhoneForm.phone" size="mini" placeholder="电话" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" plain @click="addPhoneSubmit">添加</el-button>
              </el-form-item>
            </el-form>
          </div>
        </sg-dialog>

        <div>
          <p class="Concerns-title"><i class="el-icon-s-marketing" />客户指标</p>
          <div class="time">
            <el-row>
              <el-col :span="4">
                <p class="numtime">{{ item.lastArrivalTime }}</p>
                <span>最后到院时间</span>
              </el-col>
              <el-col :span="4">
                <p class="numtime">{{ item.lastReturnVisitTime == null ? "" : item.lastReturnVisitTime }}</p>
                <span>最后回访时间</span>
              </el-col>
              <el-col :span="4">
                <p class="numtime">{{ item.returnNum +item.hreturnNum }}</p>
                <span>回访总次数 </span>
              </el-col>
              <el-col :span="4">
                <p class="numtime">{{ item.hehe == undefined ? '0' : item.hehe.countNmber }}</p>
                <span>消费总次数</span>
              </el-col>
              <el-col :span="4">
                <p class="numtime">{{ item.hehe== undefined ? '0' : item.hehe.billingPerformance }}</p>
                <span>消费总金额</span>
              </el-col>
              <el-col :span="4">
                <p class="numtime">暂无数据</p>
                <span>介绍客户数</span>
              </el-col>
            </el-row>
          </div>
          <p class="Concerns-title"><i class="el-icon-s-finance" />客户账户</p>
          <div class="time">
            <el-row>
              <el-col :span="4">
                <p class="numtime">{{ customCardSum.totalStoredValue }}</p>
                <span>储值总额</span>
              </el-col>
              <el-col :span="4">
                <p class="numtime">{{ customCardSum.storedValuePrincipal }}</p>
                <span>储值本金</span>
              </el-col>
              <el-col :span="4">
                <p class="numtime">{{ customCardSum.storedValueGift }}</p>
                <span>储值赠送</span>
              </el-col>
              <el-col :span="4">
                <p class="numtime">{{ customCardSum.deposit }}</p>
                <span>住院押金</span>
              </el-col>
              <el-col :span="4">
                <p class="numtime">{{ customCardSum.advancePayment }}</p>
                <span>预约金</span>
              </el-col>
              <el-col :span="4">
                <p class="numtime">{{ item.hehe ==undefined ? '0' : item.hehe.debtAmount }}</p>
                <span>欠款金额</span>
              </el-col>
            </el-row>
          </div>
          <div>
            <p class="Concerns-title"><i class="el-icon-alarm-clock" />临客预约记录列表</p>
            <el-table
              :data="tionform"
              border
              style="font-size: 10px"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column label="预约单时间" prop="appointmentTime" />
              <el-table-column label="意向度" prop="degreeIntention" :formatter="formatter" show-overflow-tooltip />
              <el-table-column label="项目名称" prop="bookingPeojectName" />
              <el-table-column label="科室" prop="departmentName" />
              <el-table-column label="项目备注" prop="projectTypeName" />
              <el-table-column label="下单时间" prop="dsingleTime" />
              <el-table-column label="下单人/回访人" prop="dsingleName" show-overflow-tooltip />
            </el-table>
          </div>
          <div>
            <p class="Concerns-title"><i class="el-icon-alarm-clock" />正式客户二次预约记录</p>
            <el-table
              border
              style="font-size: 10px"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column label="预约单时间" width="180" />
              <el-table-column label="意向度" />
              <el-table-column label="项目名称" width="200" />
              <el-table-column label="二级项目" />
              <el-table-column label="科室" />
              <el-table-column label="项目备注" />
              <el-table-column label="下单时间" />
              <el-table-column label="下单人/回访人" show-overflow-tooltip />
            </el-table>
          </div>
          <!-- 临客信息 -->
          <p class="Concerns-title"><i class="el-icon-alarm-clock" />临客信息</p>
          <div class="container-basic">
            <div class="lili">
              <ul class="basic-item-box">
                <li>建档时间：{{ item.createTime }}</li>
                <li>建档人：{{ item.cdName }}</li>
                <li>线上客服：{{ item.oudName }}</li>
                <li>建档类型：{{ item.typeThreeName }}</li>
                <li>媒介：{{ item.channelName }}</li>
              </ul>
            </div>
            <div class="lili">
              <ul class="basic-item-box">
                <li>预约时间：{{ item.appointmentTime }}</li>
                <li>意向度：{{ degretion(item.degreeIntention) }}</li>
                <li>预约专家：暂无</li>
                <li>关注问题：{{ item.concerns }}</li>
              </ul>
            </div>
            <div class="lili" style=" padding-right: 44px;padding-top: 24px;margin-bottom: 10px">
              <p style="font-size: 12px" class="">临客备注: </p>
              <el-input v-model="item.remarks" :rows="8" type="textarea" disabled />
            </div>
          </div>
          <div style="margin-bottom: 90px;">
            <p class="Concerns-title"><i class="el-icon-alarm-clock" />跟进记录</p>
            <el-form>
              <el-input v-model="followUpRecord.remark" type="textarea" />
              <p class="remark">先填写记录，再点击按钮，保存信息</p>
              <el-button
                v-has-permi="['confinement:followUpRecord:add']"
                icon="el-icon-circle-plus-outline"
                type="primary"
                size="mini"
                plain
                :loading="submitLoading"
                @click="recordadd"
              >添加跟进记录
              </el-button>
            </el-form>
            <el-table
              :data="recorlist"
              border
              style="font-size: 10px"
              max-height="220"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
            >
              <el-table-column label="时间" prop="createTime" width="180" />
              <el-table-column label="添加人" prop="createBy" width="180" />
              <el-table-column label="内容" prop="remark" show-overflow-tooltip />
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handleClick(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 节流
import SgDialog from '@/components/Dialog/index.vue'
import { validPhone } from '@/utils/validate'
const serverPath = process.env.VUE_APP_BASE_API+'/file'
export default {
  components: { SgDialog },
  props: ['item', 'status', 'noDeal', 'objlist', 'labelTypeName', 'follow', 'tionform', 'ids', 'recorlist', 'searchValue', 'customCardSum'],
  dicts: ['economic_capacity', 'whether_deal', 'whether_Newguest', 'occupation', 'marital_status', 'whether', 'mutual_relationship', 'degree_intention_list'],
  data() {
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
      addPhoneDialog: false,
      yearsModel:'',
      monthsModel:'',
      daysModel:'',
      years:[],
      months:[],
      days:[],
      phoneDetailDialog: false,
      submitLoading: false,
      phone: '',
      customerInfo: this.item,
      // 客户id
      id: this.item.id,
      // 客户电话
      mainPhone: [],
      phones: [],
      consumption: '',
      showList: [],

      // 添加电话表单
      addPhoneForm: {
        id: this.item.id,
        customerName: this.item.customerName,
        phone: null
      },
      // 添加号码弹窗
      addDialog: false,
      phoneRules: {
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' },
          { validator: validatePhone, trigger: 'change' }
        ]
      },
      customerTypeo: '', // 正客标签
      customerTypee: '', // 临客标签
      squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      load: false, // 手机好隐藏和显示
      show: true,
      followUpRecord: {
        remark: ''
      }
    }
  },
  watch: {
    // 监听 item的id属性，等id变化后发起获取电话列表请求，
    // 如果直接create发起请求，item还未初始化，请求会报错
    'item': function(val) {
      if(val.birthday){
        this.monthsModel=val.birthday.split('-')[0];
        this.daysModel=val.birthday.split('-')[1]
      }
      this.id = val.id
     this.$api.confinementRoom.customInfoImg({
       customerId:this.id
     }).then(res=>{
       if(res.rows.length!==0){
         this.squareUrl=serverPath+res.rows[0].imgUrl
       }else{
         this.squareUrl='https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
       }
     })
      this.customerInfo = val
      this.mainPhone = []
      this.mainPhone.push({
        showPhone: false,
        phone: val.customPhone,
        truePhone: val.phone,
        createBy: val.createName,
        createTime: val.createTime
      })
      this.addPhoneForm.id = val.id
      this.addPhoneForm.customerName = val.customerName
      // this.getPhonesByCustomerId()
      let h = 0
      if (this.item.hehe) {
        this.consumption = this.item.hehe.billingPerformance
        h = Number(this.item.hehe.billingPerformance)
      }
      this.$nextTick(function() {

      })
      this.$refs.money.innerHTML = ''
      if (h < 4000 && h >= 1000) {
        const xx = Math.floor(h / 1000) // 显示星星数量
        for (let i = 0; i < xx; i++) {
          const span = document.createElement('img')
          span.style.width = '16px'
          span.style.height = '16px'
          span.src = require('@/assets/images/start.png')
          this.$refs.money.appendChild(span)
        }
      }
      if (h >= 4000 && h < 16000) {
        // 要显示几个月亮的逻辑
        const yueliang = Math.floor(h / 4000) // 月亮数量
        const b = h - Math.floor(h / 4000) * 4000
        const xx = Math.floor(b / 1000)// 显示星星数量
        for (let i = 0; i < yueliang; i++) {
          const span = document.createElement('img')
          span.style.width = '16px'
          span.style.height = '16px'
          span.src = require('@/assets/images/yl.png')
          this.$refs.money.appendChild(span)
        }
        for (let i = 0; i < xx; i++) {
          const span = document.createElement('img')
          span.style.width = '16px'
          span.style.height = '16px'
          span.src = require('@/assets/images/start.png')
          this.$refs.money.appendChild(span)
        }
        // alert(yueliang)
        // alert(xx)
      }
      if (h >= 16000) {
        const sun = Math.floor(h / 16000) // 月亮数量
        for (let i = 0; i < sun; i++) {
          const span = document.createElement('img')
          span.style.width = '16px'
          span.style.height = '16px'
          span.src = require('@/assets/images/sun.png')
          this.$refs.money.appendChild(span)
        }
        const sum = h - sun * 16000
        if (sum < 4000 && sum >= 1000) {
          const xx = Math.floor(sum / 1000) // 显示星星数量
          for (let i = 0; i < xx; i++) {
            const span = document.createElement('img')
            span.style.width = '16px'
            span.style.height = '16px'
            span.src = require('@/assets/images/start.png')
            this.$refs.money.appendChild(span)
          }
        }

        if (sum >= 4000 && sum < 16000) {
          // 要显示几个月亮的逻辑
          const yueliang = Math.floor(sum / 4000) // 月亮数量
          const b = sum - Math.floor(sum / 4000) * 4000
          const xx = Math.floor(b / 1000)// 显示星星数量
          for (let i = 0; i < yueliang; i++) {
            const span = document.createElement('img')
            span.style.width = '16px'
            span.style.height = '16px'
            span.src = require('@/assets/images/yl.png')
            this.$refs.money.appendChild(span)
          }
          for (let i = 0; i < xx; i++) {
            const span = document.createElement('img')
            span.style.width = '16px'
            span.style.height = '16px'
            span.src = require('@/assets/images/start.png')
            this.$refs.money.appendChild(span)
          }
        }
      }
      if (h < 1000) {

      }
    }
  },
  created() {
    this.init();
    // if (this.item.id) {
    //   this.getPhonesByCustomerId()
    // }
    // this.getCustomCardSum()
    // this.getPhonesByCustomerId()
  },
  methods: {
    saveBirthday(){
      let data={
        birthday:this.monthsModel+'-'+this.daysModel,
        id:this.item.id
      }
      this.$api.user.updateUserInfo(data).then(res => {
        if (res) {
          this.$message.success('修改成功')
        }
      })
    },
    saveCard(){
      let data={
        card:this.item.card,
        id:this.item.id
      }
      this.$api.user.updateUserInfo(data).then(res => {
        if (res) {
          this.$message.success('修改成功')
        }
      })
    },
    saveAge(){
      let data={
        customAge:this.item.customAge,
        id:this.item.id
      }
      this.$api.user.updateUserInfo(data).then(res => {
        if (res) {
          this.$message.success('修改成功')
        }
      })
    },
    initSelectYear(year) {
      this.years = []
      for (let i = 0; i < 30; i++) {
        this.years.push({ value: (year - i), label: (year - i) + '年' })
      }
    },
    initSelectMonth() {
      this.months = []
      // this.months.push({ value: 0, label: '全部' })
      for (let i = 1; i <= 12; i++) {
        this.months.push({ value: i, label: i })
      }
    },
    initSelectDay(year, month) {
      var maxDay = this.getMaxDay(year, month)
      this.days = []
      // this.days.push({ value: 0, label: '全部' })
      for (var i = 1; i <= maxDay; i++) {
        this.days.push({ value: i, label: i })
      }
    },
    init() {
      var myDate = new Date()
      var year = myDate.getFullYear()// 获取当前年
      var month = myDate.getMonth() + 1// 获取当前月
      var day = myDate.getDate()// 获取当前日
      this.initSelectYear(year)
      this.initSelectMonth()
      this.initSelectDay(year, month)
      this.yearsModel = year
      this.monthsModel = month
      this.daysModel = day
      const obj = { year: this.yearsModel, month: this.monthsModel, day: this.daysModel }
    },
    getMaxDay(year, month) {
      var new_year = year // 取当前的年份
      var new_month = month++// 取下一个月的第一天，方便计算（最后一天不固定）
      if (month > 12) // 如果当前大于12月，则年份转到下一年
      {
        new_month -= 12 // 月份减
        new_year++ // 年份增
      }
      var new_date = new Date(new_year, new_month, 1)// 取当年当月中的第一天
      return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate()// 获取当月最后一天日期
    },
    initSelectDay(year, month) {
      var maxDay = this.getMaxDay(year, month)
      this.days = []
      // this.days.push({ value: 0, label: '全部' })
      for (var i = 1; i <= maxDay; i++) {
        this.days.push({ value: i, label: i })
      }
    },
    dateChange(type) {
      // 1年 2月 3日 4 左 5右
      if (type === 1 || type === 2) {
        if (this.monthsModel === 0) {
          this.daysModel = 0
          this.initSelectDay(this.yearsModel, 1)
        } else {
          this.initSelectDay(this.yearsModel, this.monthsModel)
        }
      }
      if (type == 4) {
        this.dayleft()
      }
      if (type == 5) {
        this.dayright()
      }
      this.form.birthday = this.monthsModel + '-' + this.daysModel
    },
    getPhone(){
      this.phoneDetailDialog = true
      this.getPhonesByCustomerId()
    },
    // 添加电话表单关闭
    addPhoneDialogClose() {
      this.addPhoneForm.phone = ''
      this.addDialog = false
    },
    // 添加电话
    addPhoneSubmit() {
      // console.log('提交')
      this.$refs.addPhoneForm.validate((valid) => {
        if (valid) {
          this.addPhoneForm.deptId = this.$store.getters.departmentId
          this.$api.customerCmt.addCustomPhone(this.addPhoneForm).then(res => {
            // console.log(res)
            if (res.code === 200) {
              // 弹窗提示操作成功
              this.$message({ type: 'success', message: res.msg })
              // 重新获取电话列表
              this.getPhonesByCustomerId()
            } else {
              this.$message({ type: 'error', message: res.msg })
            }
          })
          // 提交后关闭弹窗
          this.addPhoneDialogClose()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 显示隐藏号码
    showPhone(row) {
      // console.log(row)
      row.showPhone = !row.showPhone
      this.$refs.mainPhoneTable.$forceUpdate()
    },
    // 电话详情弹窗关闭
    phoneDetailDialogHandleClose() {
      this.phoneDetailDialog = false
    },
    // 添加电话弹窗关闭
    addPhoneDialogHandleClose() {

    },
    // 获取电话列表
    getPhonesByCustomerId() {
      this.$api.user.getPhonesByCustomerId(this.id).then(res => {
        res.data.forEach(item => {
          item.showPhone = false
        })
        console.log('this.phones', this.phones)
        this.phones = res.data.filter(item => item.isMain === '0')
      })
    },
    // getCustomCardSum() {
    //   this.$api.RechargeableCard.customCardSum({
    //     id: this.ids
    //   }).then(res => {
    //     if (res.rows.length !== 0) {
    //       this.totalStoredValue = math.add(res.rows[0].groupPrincipal, res.rows[0].groupGift, res.rows[0].companyPrincipal,
    //         res.rows[0].companyGift, res.rows[0].departmentalPrincipal, res.rows[0].departmentalGift)
    //       this.storedValuePrincipal = math.add(res.rows[0].groupPrincipal, res.rows[0].companyPrincipal, res.rows[0].departmentalPrincipal)
    //       this.storedValueGift = math.add(res.rows[0].groupGift, res.rows[0].companyGift, res.rows[0].departmentalGift)
    //       this.deposit = res.rows[0].deposit
    //       this.advancePayment = res.rows[0].advancePayment
    //     }
    //   })
    // },
    formatter(row) {
      const obj = this.dict.type.degree_intention_list.find(items => items.value === row.degreeIntention)
      return obj ? obj.label : '未知'
    },
    // 手机号隐藏显示
    toshow() {
      this.show = !this.show
      this.$api.user.customidGetPhone({ customeerId: this.ids }).then(res => {
        if (res) {
          // eslint-disable-next-line vue/no-mutating-props
          this.item.customPhone = res.msg
        }
      })
    },
    addPhone() {

    },
    // 跟进记录添加
    recordadd() {
      if (this.followUpRecord.remark === '') {
        this.$message({
          type: 'info',
          message: '请输入内容'
        })
        document.querySelector('.further').style.border='1px solid red'
      //  this.$refs.further.style.border='1px solid red'
        return
      }
      this.followUpRecord.id = this.ids
      this.submitLoading = true
      this.$api.user.recordAdd(this.followUpRecord).then(res => {
        if (res) {
          this.followUpRecord.remark = ''
          this.$message.success('添加成功')
          document.querySelector('.further').style.border=''
          this.submitLoading = false
          this.$emit('recoremove')
        }
      })
    },
    // 删除
    handleClick(row) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.user.recordremove(row.followId).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this.$emit('recoremove')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 字典
    ecome(str) {
      const obj = this.dict.type.economic_capacity.find(items => items.value === str)
      return obj ? obj.label : '未知'
    },
    cuomet(str) {
      const obj = this.dict.type.whether_Newguest.find(items => items.value === str)
      return obj ? obj.label : '未知'
    },
    nodeal(str) {
      const obj = this.dict.type.whether_deal.find(items => items.value === str)
      return obj ? obj.label : '未知'
    },
    occup(str) {
      const obj = this.dict.type.occupation.find(items => items.value === str)
      return obj ? obj.label : '未知'
    },
    marriag(str) {
      const obj = this.dict.type.marital_status.find(items => items.value === str)
      return obj ? obj.label : '未知'
    },
    childs(str) {
      const obj = this.dict.type.whether.find(items => items.value === str)
      return obj ? obj.label : '未知'
    },
    // relatio(str) {
    //   const obj = this.dict.type.mutual_relationship.find(items => items.value === str)
    //   return obj ? obj.label : '未知'
    // },
    degretion(str) {
      const obj = this.dict.type.degree_intention_list.find(items => items.value === str)
      return obj ? obj.label : '未知'
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-textarea__inner {
  font-weight: bolder !important;
  color: #555555 !important;
}
::v-deep .el-input-number__decrease{
  display: none;
}
::v-deep .el-input-number__increase{
  display: none;
}
::v-deep .setbody .el-input {
  width: 60px !important;
}
.customerLabelRelation {
  display: inline; //一行显示
}

.dialog-box {
  width: 100%;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0;
  font-size: 14px;

  .title {
    display: flex;
    justify-content: space-between;
    //width: 100%;
    height: 30px;
    background-color: #eeeeee;
    padding: 0 10px;
    line-height: 30px;
    box-sizing: border-box;

    span {
      color: #7ec5b7;
    }

  }

  .content {
    padding: 10px;
    box-sizing: border-box;
  }
}

// 左侧
.details {
  background-color: #e0f0fb;
  width: 100%;

  .portrait {
    float: left;
    height: 100%;
    // flex-direction: row;
    width: 18%;
    // height: 200px;
    background-color: #e0f0fb;

    // 左侧内部整个
    .portraitmini {
      width: 95%;
      margin: 0 auto;
    }

    .Department {
      margin-top: 6px;
      border-radius: 10%;
    }

    .circular {

      display: flex;
      margin-left: 20px;

    }

    .yuan {
      margin-top: 12%;
    }
  }

  .Concerns-title {
    // height: 45px;
    font-size: 15px;
    font-weight: 600;
    line-height: 45px;
    padding-left: 20px;
    background-color: #ebfaff;
  }

  .treatment {
    // height: 100px;
    // line-height: 59px;
    // font-size: 12px;
    font-weight: 400;
    padding-left: 15px;
    border-top: 1px solid #c1c1c1;
    background-color: #ffffff;
  }

  // .btn{
  //   width: 53px;
  //   margin-left: 12px;
  //   color: #ffffff;
  //   background-color: #5bc0de;
  // }
  .btnmark {
    font-size: 12px;
    vertical-align: middle;
    text-align: center;
    background-color: #5bc0de;
    color: #ffffff;
    padding: 4px 11px;
  }

  .remark {
    color: green;
    font-size: 14px;
  }

  ul {
    li {
      list-style: none;
      line-height: 27px;
      margin-left: 10px;
    }
  }

  .container-basic {
    width: 100%;
    display: flex;
    justify-content: space-between;

    &>div {
      width: 100%;

      &>.title {
        font-size: 16px;
        font-weight: bold;
        color: #555555;
        margin: 10px 10px;

        &>i {
          margin-right: 4px;
        }
      }

      &:last-child .basic-item-box {
        border-right: none;
      }
    }
  }
}

// 右侧
.information {
  .family {
    font-weight: 600;
    color: #5f94de;
  }

  .remarks {
    color: #0066cc;
  }

  width: 81%;
  float: left;
  margin-left: 5px;
  margin-top: 5px;
  background-color: #ffffff;

  ul>li {
    line-height: 30px;
    font-size: 12px;
  }

  .lili {
    padding-left: 20px;
  }

  .gai {
    margin-top: 42px;
    font-size: 12px;
    list-style: none;
  }

  .time {
    height: 70px;
    font-size: 14px;
    padding: 0 30px;
  }

  .numtime {
    padding-top: 26px;
    line-height: 11px;
    color: #43bf43;
  }
}
</style>
