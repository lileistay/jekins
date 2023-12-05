<template>
  <!--首次护理记录-->
  <div class="box" style="position: relative;">
    <div class="box-top">
      <div class="title">住院信息</div>
      <el-form size="mini" label-width="100px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="姓名：">
              <el-input :placeholder="customerList.customerName" disabled />
            </el-form-item>
            <el-form-item label="电话：">
              <el-input :placeholder="customerList.customPhone" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="年龄：">
              <el-input :placeholder="customerList.customAge" disabled />
            </el-form-item>
            <el-form-item label="性别：">
              <el-input :placeholder="customerList.customSex == 0 ? '男' : '女'" disabled />
              <!-- <el-select v-model="form.sex" placeholder="请选择活动区域">
                <el-option label="男" value="0" />
                <el-option label="女" value="1" />
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="床号:">
              <el-input :placeholder="customerList.bedNumber" disabled />
            </el-form-item>
            <el-form-item label="职业：">
              <!-- <el-select v-model="form.sex" placeholder="请选择活动区域">
                <el-option label="男" value="0" />
                <el-option label="女" value="1" />
              </el-select> -->
              <el-input :placeholder="occupation" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="住院号码：">
              <el-input :placeholder="customerList.medicalRecordId" disabled />
              <!-- <el-select v-model="form.sex" placeholder="请选择活动区域">
                <el-option label="男" value="0" />
                <el-option label="女" value="1" />
              </el-select> -->
            </el-form-item>
            <!-- <el-form-item label="入院时间：">
              <el-date-picker
                style="width: 100%;"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-form-item> -->
          </el-col>
          <el-col :span="4">
            <el-form-item label="婚姻状况：">
              <el-input :placeholder="marriageType" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="资料来源：">
          <el-radio-group v-model="zlly">
            <el-radio label="患者"></el-radio>
            <el-radio label="家属" />
            <el-radio label="朋友" />
            <el-radio label="其他" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="日常照顾着者：" label-width="120px">
          <el-radio-group v-model="rczgz">
            <el-radio label="自我照顾" />
            <el-radio label="夫/妻" />
            <el-radio label="朋友" />
            <el-radio label="其他" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="入院诊断：">
          <el-input type="textarea" style="width: 60%" v-model="ryzd" />
        </el-form-item>
        <el-form-item label="入院方式：">
          <el-radio-group v-model="ryfs">
            <el-radio label="扶行" />
            <el-radio label="步行" />
            <el-radio label="平车" />
            <el-radio label="轮椅" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="过敏史：">
          <el-radio-group v-model="gms">
            <el-radio label="无" />
            <el-radio label="有" />
            <el-radio label="不明确" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="医疗费用支付方式：" label-width="140px">
          <el-radio-group v-model="fyzffs">
            <el-radio label="自费" />
            <el-radio label="公费治疗" />
            <el-radio label="医保" />
            <el-radio label="社保" />
            <el-radio label="商业保障" />
            <el-radio label="他人赔付" />
            <el-radio label="其他" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="box-main">
      <div class="title">
        首次护理记录
      </div>
      <el-form size="mini">
        <el-form-item label="生命特征：">
          T：<el-input style="width: 10%" v-model="tc" />C &numsp;
          P：<el-input style="width: 10%" v-model="p" />次/min&numsp;
          R：<el-input style="width: 10%" v-model="r" />次/min&numsp;
          BP：<el-input style="width: 10%" v-model="bp" />mmHg
        </el-form-item>
        <el-form-item label="意识状态：呼之">
          <el-radio-group v-model="ysztHz">
            <el-radio label="能应" />
            <el-radio label="不应" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="口腔黏膜：">
          <el-radio-group v-model="kqnm">
            <el-radio label="完整" />
            <el-radio label="溃疡" />
            <el-radio label="白斑" />
            <el-radio label="红肿" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="饮食：">
          <el-radio-group v-model="ys">
            <el-radio label="普食物" />
            <el-radio label="半流" />
            <el-radio label="全流" />
            <el-radio label="禁食" />
            <el-radio label="治疗饮食:">
              治疗饮食
              (<el-radio-group v-model="ysZlys">
                <el-radio label="低盐" />
                <el-radio label="低脂" />
                <el-radio label="低胆固醇" />
                <el-radio label="低糖" />
                <el-radio label="高蛋白" />
              </el-radio-group>
              )
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="睡眠：">
          <el-radio-group v-model="sm">
            <el-radio label="正常" />
            <el-radio label="难入眠" />
            <el-radio label="易醒" />
            <el-radio label="多梦" />
            <el-radio label="辅助药物" />
            <el-input v-model="smFz" style="width: 20%" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排尿：">
          <el-radio-group v-model="pn">
            <el-radio label="未发现异常" />
            <el-radio label="尿频" />
            <el-radio label="尿急" />
            <el-radio label="尿痛" />
            <el-radio label="排尿困难" />
            <el-radio label="血尿" />
            <el-radio label="尿失禁" />
            <el-radio label="尿潴留" />
            <el-radio label="留置尿管" />
            <el-radio label="其他" />
            <el-input v-model="pnQt" style="width: 10%" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排便：">
          <el-radio-group v-model="pb">
            <el-radio label="正常" />
            <!-- <el-input v-model="pbZc" style="width: 5%" size="mini" /> -->
            <el-radio label="便秘 " />
            <el-radio label="腹泻" />
            <el-radio label="失禁" />
            <el-radio label="造瘘" />
            <el-radio label="其他" />
            <el-input v-model="pbBm" style="width: 10%" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="四肢活动：">
          <el-radio-group v-model="szhd">
            <el-radio label="自如" />
            <el-radio label="无力" />
            <el-radio label="偏瘫" />
            <el-radio label="左上肢" />
            <el-radio label="右下肢" />
            <el-radio label="右上肢" />
            <el-radio label="左下肢" />
            <el-radio label="截瘫" />
            <el-radio label="全瘫" />
            <el-radio label="其他" />
            <el-input v-model="szhdPt" style="width: 10%" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生活能力：">
          <el-radio-group v-model="shnl">
            <el-radio label="自理" />
            <el-radio label="协助">
              协助
              (
                <el-radio-group v-model="shnlXz">
              <el-radio label="进食" />
              <el-radio label="个人卫生" />
              <el-radio label="如厕" />
            </el-radio-group>
              )
            </el-radio>
            <el-radio label="不能自理" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="皮肤粘膜：">
          <el-radio-group v-model="pfnm">
            <el-radio label="正常" />
            <el-radio label="潮红" />
            <el-radio label="苍白" />
            <el-radio label="发绀" />
            <el-radio label="黄染" />
            <el-radio label="干燥" />
            <el-radio label="出点血" />
            <el-radio label="皮疹" />
            <el-radio label="水肿">
              水肿
              (
              <el-radio label="Ⅰ" />
              <el-radio label="Ⅱ" />
              <el-radio label="Ⅲ" />
              <el-radio label="Ⅳ" />
              )
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="性质：">
          <el-radio-group v-model="pfnmXz">
            <el-radio label="凹陷性" />
            <el-radio label="非凹陷性" />
            <el-radio label="压疮/破损" />
            <el-radio label="水肿">
              (
              部位：
              <el-input v-model="pfnmYcBw" style="width: 15%;border: none;" />

              范围：
              <el-input v-model="pfnmYcFw" style="width: 15%" />
              程度：
              <el-input v-model="pfnmYcCd" style="width: 15%" />
              )
            </el-radio>
            <el-radio label="其他" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="伤口：">
          <el-radio-group v-model="sk">
            <el-radio label="无" />
            <el-radio label="有 ">
              部位
              <el-input style="width: 20%" v-model="skBw" />
            </el-radio>
          </el-radio-group>
          敷料：
          <el-radio-group v-model="skFl">
            <el-radio label="干燥" />
            <el-radio label="渗液" />
            <el-radio label="渗血" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="留置引流管：">
          <el-radio-group v-model="lzylg">
            <el-radio label="无" />
            <el-radio label="有 ">
              有
              部位：
              <el-input v-model="lzylgBw" style="width: 10%" />
              类型：
              <el-input v-model="lzylgLx" style="width: 10%" />

            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="疼痛：">
          <el-radio-group v-model="tt">
            <el-radio label="无" />
            <el-radio label="有 " />
            <el-radio label="持续性" />
            <el-radio label="间歇性 " />
          </el-radio-group>
          部位：<input type="text" v-model="ttBw" style="border: none;height: 30px;">
          <!-- 程度： -->
          <!-- <el-radio-group v-model="ttCd">
            <el-radio label="轻度" />
            <el-radio label="中度 " />
            <el-radio label="重度" />
          </el-radio-group> -->

          <span style="margin-left: 200px">程度：</span>
          <el-radio-group v-model="ttCd">
            <el-radio label="轻度" />
            <el-radio label="中度 " />
            <el-radio label="重度" />
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          引流物形状: <el-input v-model="lzylgXz" style="width: 20%" />
          颜色: <el-input v-model="lzylgYs" style="width: 20%" />
        </el-form-item>
        <el-form-item label="月经情况：">
          <el-radio-group v-model="yjqk">
            <el-radio label="末次月经">
              末次月经
              <el-date-picker v-model="value1" type="date" placeholder="选择日期" />
            </el-radio>
            <el-radio label="月经失调" />
            <el-radio label="痛经" />
            <el-radio label="未来潮" />
            <el-radio label="绝经" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="语言沟通：">
          <el-radio-group v-model="yygt">
            <el-radio label="普通话" />
            <el-radio label="家乡话" />
            <el-radio label="其他" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="嗜好：">
          <el-radio-group v-model="sh">
            <el-radio label="无" />
            <el-radio label="吸烟" />
            <el-radio label="其他" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="其他症状和体征：">
          <el-input v-model="qtzz" style="width: 20%;" />
        </el-form-item>
        <el-form-item label="住院须知：" />
        <el-form-item>
          <el-checkbox-group v-model="zyxz">
            <el-checkbox label="住院须知" />
            <el-checkbox label="物品管理" />
            <el-checkbox label="作息" />
            <el-checkbox label="探陪" />
            <el-checkbox label="订餐" />
            <el-checkbox label="介绍主管医生" />
            <el-checkbox label="介绍主管护士" />
            <el-checkbox label="其他 " />
            <el-input v-model="zyxzQt" style="width: 20%" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="基础护理：">
          <el-input v-model="jchl" style="width: 30%" />
        </el-form-item>
        <el-form-item label="专科护理：">
          <el-input v-model="zkhl" style="width: 30%" />
        </el-form-item>
        <el-form-item label="患者安全：">
          <el-radio-group v-model="hzaq">
            <el-radio label="防压疮">
              防压疮
              压疮风险评分
              <el-input v-model="hzaqYc" style="width: 30%" />
            </el-radio>
            <el-radio label="防跌到">
              防跌到
              防跌倒评分得分
              <el-input v-model="hzaqQt" style="width: 30%" />
            </el-radio>
            <el-radio label="其他" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="护班交接重点：">
          <el-input v-model="hbjjzd" style="width: 30%" />
        </el-form-item>
        <el-form-item label="提醒医生予以关怀：">
          <el-input v-model="txysyygh" style="width: 30%" />
        </el-form-item>
        <el-form-item label="提醒家属予以关爱：">
          <el-input v-model="txjsyyga" style="width: 30%" />
        </el-form-item>
      </el-form>
    </div>
    <div style="display: flex;position:fixed;bottom:15px;right: 70px;">
      <el-button type="primary" size="mini" @click="save" style="width: 70px;">保存</el-button>
      <!-- <el-button type="primary" size="mini" @click="cancle" style="width: 70px;">取消</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'FirstCareRecord',
  data() {
    return {
      form: {
        label: '',
        val: '',
        sex: ''
      },
      occupation: "",
      marriageType: "",
      customerList: "",
      zlly: "1",
      rczgz: "",
      ryzd: "",
      ryfs: "",
      gms: "",
      fyzffs: "",
      value1: '',
      tc: "",
      p: "",
      r: "",
      bp: "",
      ysztHz: "",
      kqnm: "",
      ys: '',
      ysZlys:"",
      sm: "",
      pn: "",
      pb: "",
      szhd: '',
      shnl: "",
      shnlXz:'',
      pfnm: "",
      pfnmXz: "",
      skFl: "",
      sk: "",
      lzylg: "",
      lzylgBw: "",
      lzylgLx: "",
      tt: "",
      ttBw: "",
      ttCd: "",
      lzylgXz: "",
      lzylgYs: "",
      yjqk: "",
      yygt: "",
      sh: "",
      qtzz: "",
      zyxz: "",
      jchl: "",
      zkhl: "",
      hzaq: "",
      hbjjzd: "",
      txysyygh: "",
      txjsyyga: "",
      skBw: "",
      pfnmYcBw: "",
      pfnmYcFw: "",
      pfnmYcCd: "",
      szhdPt: "",
      smFz: '',
      pnQt: "",
      pbZc: "",
      pbBm: "",
      zyxz: [],
      hzaqYc: '',
      hzaqQt: '',
      checkList: ['选中且禁用', '复选框 A'],
      flag: false,
      zyxzQt: "",
      firstnursingRecordId: "",
      zyxzList: [],
    }
  },
  props: ['czHis'],
  watch: {
    'czHis': {
      deep: true,
      handler: function (newV) {
        this.search();
      },
    },
    deptId(){
      this.search();
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId;
      }
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId;
    localStorage.setItem('deptIds',this.deptId);
    this.search();

  },

  methods: {
    search() {
      let deptIds=localStorage.getItem('deptIds')
      let inHospitalId = localStorage.getItem("inHospitalId")
      if (inHospitalId == null) {
        inHospitalId = ''
      }
      let data = {
        inHospitalId: String(inHospitalId),
        deptId: deptIds
      }
      let datas = {
        inHospitalId: inHospitalId,
        deptId: deptIds,
      }
      this.$api.confinementRoom.getHospitalInfoList(data).then(res => {
        console.log('住院信息',res)
        if(res.data.length==0){
          return
        };
        
        this.customerList = res.data[0]
        this.zlly = this.customerList.zlly;
        this.rczgz = this.customerList.rczgz;
        this.ryzd = this.customerList.ryzd;
        this.ryfs = this.customerList.ryfs;
        this.gms = this.customerList.gms;
        this.fyzffs = this.customerList.fyzffs;
        if (this.customerList.marriageType == 0) {
          this.marriageType = '未知'
        }
        if (this.customerList.marriageType == 1) {
          this.marriageType = '未婚'
        }
        if (this.customerList.marriageType == 2) {
          this.marriageType = '已婚'
        }
        if (this.customerList.marriageType == 3) {
          this.marriageType = '离异'
        }
        if (this.customerList.occupation == '1') {
          this.occupation = '学生'
        }
        else if (this.customerList.occupation == '2') {
          this.occupation = '老师'
        }
        else if (this.customerList.occupation == '3') {
          this.occupation = '退休'
        }
        else if (this.customerList.occupation == '5') {
          this.occupation = '其他'
        }
        else if (this.customerList.occupation == '4') {
          this.occupation = '上班族'
        }

      })
      this.$api.confinementRoom.getInfoByInHospitalId(datas).then(res => {
               console.log(res.data,'护理记录')
        if (res.data == undefined) {
          this.value1= '';
      this.tc= "",
      this.p= "",
      this.r= "",
      this.bp= "",
      this.ysztHz= "",
      this.kqnm= "",
      this.ys= '',
      this.ysZlys="",
      this.sm= "",
      this.pn= "",
      this.pb= "",
      this.szhd= '',
      this.shnl= "",
      this.shnlXz='',
      this.pfnm= "",
      this.pfnmXz= "",
      this.skFl= "",
      this.sk= "",
      this.lzylg= "",
      this.lzylgBw= "",
      this.lzylgLx= "",
      this.tt= "",
      this.ttBw= "",
      this.ttCd= "",
      this.lzylgXz= "",
      this.lzylgYs= "",
      this.yjqk= "",
      this.yygt= "",
      this.sh= "",
      this.qtzz= "",
      this.zyxz= "",
      this.jchl= "",
      this.zkhl= "",
      this.hzaq= "",
      this.hbjjzd= "",
      this.txysyygh= "",
      this.txjsyyga= "",
      this.skBw= "",
      this.deptId= "",
      this.pfnmYcBw= "",
      this.pfnmYcFw= "",
      this.pfnmYcCd= "",
      this.szhdPt= "",
      this.smFz= '',
      this.pnQt= "",
      this.pbZc= "",
      this.pbBm= "",
      this.zyxz= [],
      this.hzaqYc= '',
      this.hzaqQt= '',
      this.checkList= ['选中且禁用', '复选框 A'],
      this.zyxzQt= "",
      this.firstnursingRecordId= "",
      this.zyxzList= [],
          this.flag = true;
          return
        } else {
          this.flag = false
        }
        let Advice = res.data;
        this.firstnursingRecordId = Advice.firstnursingRecordId

        // console.log(Advice.zyxz,'快乐加倍')
        let str = Advice.zyxz.split(',');
        this.zyxzList = str;
        console.log(str,'he1')
        this.shnlXz=Advice.shnlXz;
        this.value1 = Advice.yjqkMcyj == 'NaN-NaN-NaN 00:00:00' ? '' : Advice.yjqkMcyj
        this.ysZlys=Advice.ysZlys;
        this.tc = Advice.tc,
          this.p = Advice.p,
          this.r = Advice.r,
          this.bp = Advice.bp,
          this.ysztHz = Advice.ysztHz,
          this.kqnm = Advice.kqnm,
          this.ys = Advice.ys,
          this.sm = Advice.sm,
          this.pn = Advice.pn,
          this.pb = Advice.pb,
          this.szhd = Advice.szhd,
          this.shnl = Advice.shnl,
          this.pfnm = Advice.pfnm,
          this.pfnmXz = Advice.pfnmXz,
          this.skFl = Advice.skFl,
          this.sk = Advice.sk,
          this.lzylg = Advice.lzylg,
          this.lzylgBw = Advice.lzylgBw,
          this.lzylgLx = Advice.lzylgLx,
          this.tt = Advice.tt,
          this.ttBw = Advice.ttBw,
          this.ttCd = Advice.ttCd,
          this.lzylgXz = Advice.lzylgXz,
          this.lzylgYs = Advice.lzylgYs,
          this.yjqk = Advice.yjqk,
          this.yygt = Advice.yygt,
          this.sh = Advice.sh,
          this.qtzz = Advice.qtzz,
          this.zyxz = str,
          this.jchl = Advice.jchl,
          this.zkhl = Advice.zkhl,
          this.hzaq = Advice.hzaq,
          this.hbjjzd = Advice.hbjjzd,
          this.txysyygh = Advice.txysyygh,
          this.txjsyyga = Advice.txjsyyga,
          this.skBw = Advice.skBw,
          this.pfnmYcBw = Advice.pfnmYcBw,
          this.pfnmYcFw = Advice.pfnmYcFw,
          this.pfnmYcCd = Advice.pfnmYcCd,
          this.szhdPt = Advice.szhdPt,
          this.smFz = Advice.smFz,
          this.pnQt = Advice.pnQt,
          this.pbZc = Advice.pbZc,
          this.pbBm = Advice.pbBm,
          this.hzaqYc = Advice.hzaqYc,
          this.hzaqQt = Advice.hzaqQt,
          this.zyxzQt = Advice.zyxzQt
      })
     

    },
    cancle() {

    },
    newDate(time) {
      var date = new Date(time)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    save() {
      if(this.zyxzList[0]==''){
     
      }else{
        this.zyxz = this.zyxzList
      }
  

      if (this.zyxz.length == 0) {
        this.zyxz = ''
      } else {
        let str = '';
        this.zyxz.forEach((value, index) => {
          if (index == this.zyxz.length - 1) {
            str += value
          } else {
            str += value + ","
          }
        })
        this.zyxz = str;
      }
      let inHospitalId = localStorage.getItem("inHospitalId")
      let his = JSON.parse(localStorage.getItem('val'));
      let or = ''

      if (this.value1 == '' || this.value1 == undefined) {
        or = ''
      } else {
        or = this.newDate(this.value1) + ' ' + '00:00:00'
      }
      let datas = {
        yjqkMcyj: or,
        tc: this.tc,
        p: this.p,
        r: this.r,
        bp: this.bp,
        ysztHz: this.ysztHz,
        kqnm: this.kqnm,
        ys: this.ys,
        sm: this.sm,
        pn: this.pn,
        pb: this.pb,
        szhd: this.szhd,
        shnl: this.shnl,
        pfnm: this.pfnm,
        pfnmXz: this.pfnmXz,
        skFl: this.skFl,
        sk: this.sk,
        lzylg: this.lzylg,
        lzylgBw: this.lzylgBw,
        lzylgLx: this.lzylgLx,
        tt: this.tt,
        ysZlys:this.ysZlys,
        shnlXz:this.shnlXz,
        ttBw: this.ttBw,
        ttCd: this.ttCd,
        lzylgXz: this.lzylgXz,
        lzylgYs: this.lzylgYs,
        yjqk: this.yjqk,
        yygt: this.yygt,
        sh: this.sh,
        qtzz: this.qtzz,
        zyxz: this.zyxz,
        jchl: this.jchl,
        zkhl: this.zkhl,
        hzaq: this.hzaq,
        hbjjzd: this.hbjjzd,
        txysyygh: this.txysyygh,
        txjsyyga: this.txjsyyga,
        skBw: this.skBw,
        pfnmYcBw: this.pfnmYcBw,
        pfnmYcFw: this.pfnmYcFw,
        pfnmYcCd: this.pfnmYcCd,
        szhdPt: this.szhdPt,
        smFz: this.smFz,
        pnQt: this.pnQt,
        pbZc: this.pbZc,
        pbBm: this.pbBm,
        hzaqYc: this.hzaqYc,
        hzaqQt: this.hzaqQt,
        inHospitalId: inHospitalId,
        id: his.id,
        zyxzQt: this.zyxzQt

      }
      // alert(this.zyxzQt);
      // alert(this.yjqk)
      // let data={
      //   zlly:this.zlly,
      // rczgz:this.rczgz,
      // value1: this.value1,
      // ryzd:this.ryzd,
      // ryfs:this.ryfs,
      // gms:this.gms,
      // fyzffs:this.fyzffs,
      // };

      his.zlly = this.zlly;
      his.rczgz = this.rczgz;
      his.value1 = this.value1;
      his.ryzd = this.ryzd;
      his.ryfs = this.ryfs;
      his.gms = this.gms;
      his.fyzffs = this.fyzffs;

      this.$api.confinementRoom.hospitalInfo(his).then(res => {
        if (res.code == 200) {
          this.search()
          this.$message.success('保存成功');
          return
        }
      });
      if (this.flag) {
        this.$api.confinementRoom.hospitalFirstnursingRecord(datas).then(res => {
          this.search()
          console.log(res, 'sdfgfgdsf')
        })
      } else {
        datas.firstnursingRecordId = this.firstnursingRecordId
        this.$api.confinementRoom.newhospitalFirstnursingRecord(datas).then(res => {
          if (res.code == 200) {
            this.search()
            // this.$message.success('修改成功');
            return
          }
        })

      }


    }
  },
}
</script>

<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  background-color: #e0f0fb;
  height: 600px;
  overflow: auto;

  .box-top {
    position: relative;
    padding: 10px 10px;
    margin-top: 10px;
    border: 1px solid #c3ced5;
    border-radius: 5px;
    //overflow: hidden;
    margin-bottom: 10px;
  }

  .title {
    position: absolute;
    margin-top: -22px;
    background-color: #e0f0fb;
  }
}

.box-main {
  position: relative;
  padding: 10px 10px;
  margin-top: 10px;
  border: 1px solid #c3ced5;
  border-radius: 5px;
}
</style>
