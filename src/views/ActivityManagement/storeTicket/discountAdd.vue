<template>
  <div>
    <div class="bottom">
      <div style="width: 200px;height:80px;">
        <el-button type="primary" size="mini" style="margin-left: 70px;margin-top: 30px;" @click="submit">
          提交
        </el-button>
      </div>
    </div>
    <div class="discount">
      <div class="discount_left">
        <div class="discount_children">
          <span style="color:red">*</span>
          <span>优惠券名称</span>
          <el-input v-model="couponName" style="width: 600px;margin-left: 20px;"></el-input>
        </div>
        <div class="discount_children" style="height:150px;display: flex;">
          <span style="color:red">*</span>
          <span>使用说明</span>
          <el-input v-model="remarks" style="width: 600px;margin-left: 35px;margin-top: 20px;" type="textarea"
                    :rows="6"></el-input>
        </div>
        <!-- <div class="discount_children" style="display: flex;">
            <span style="color:red">*</span>
            <span>发放类型</span>
            <div style="margin-left: 35px;">
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div> -->
        <div class="discount_children" style="display: flex;">
          <span>发放日期</span>
          <div style="margin-left: 38px;">
            <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class="discount_children">

          <span>发放数量</span>
          <el-input-number v-model="quantity" style="width: 150px;margin-left: 40px;" :min="0"></el-input-number>
        </div>
        <!-- <div class="discount_children">

            <span>剩余数量</span>
            <el-input v-model="name" style="width: 100px;margin-left: 40px;"></el-input>
        </div>
        <div class="discount_children">

            <span>每人限额</span>
            <el-input v-model="name" style="width: 100px;margin-left: 40px;"></el-input>
        </div> -->
        <!-- <div class="discount_children">

            <span>仅会员可领</span>
            <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949" style="margin-left: 30px;">
            </el-switch>
        </div> -->
        <div class="discount_children">
          <span>是否上架</span>
          <el-switch v-model="couponState" active-color="#409eff" inactive-color="#dcdfe6"
                     style="margin-left: 38px;">
          </el-switch>
        </div>
        <div class="discount_children">
          <span>顺序号</span>
          <el-input-number v-model="weightSort" style="width: 150px;margin-left: 50px;"
                           :min="0"></el-input-number>
        </div>
      </div>
      <div class="discount_right">

        <div class="discount_children" style="display: flex;">
          <span style="color:red">*</span>
          <span>使用时间类型</span>
          <div style="display: flex;margin-left: 10px;" class="children">
                        <span v-for="(item, index) in newlist" :style="{ background: item.back, color: item.color }"
                              @click="add(index)">{{ item.name }}</span>
          </div>
        </div>
        <div class="discount_children" style="display: flex;">
          <span>使用时间</span>
          <div style="margin-left: 50px;">
            <el-date-picker v-model="value2" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <!-- <div class="discount_children">
            <span>领取后</span>
            <el-input v-model="name" style="width: 100px;margin-left: 65px;"></el-input>
            <span>天有效</span>
        </div> -->
        <div class="discount_children" style="display: flex;">
          <span style="color:red">*</span>
          <span>优惠券类型</span>
          <div style="margin-left: 35px;">
            <el-select v-model="newvalue" filterable placeholder="请选择">
              <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 团购券 -->
        <!-- <div v-show="value == 0">
            <div class="discount_children">
                <span>团购商品</span>
                <el-input v-model="name" style="width: 300px;margin-left: 55px;"></el-input>
            </div>
            <div class="discount_children">
                <span>团购价格</span>
                <el-input v-model="name" style="width: 100px;margin-left: 55px;"></el-input>
            </div>
        </div> -->


        <!-- 现金券 -->
        <div v-show="value == 1">
          <div class="discount_children">
            <span>可与营销叠加</span>
            <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"
                       style="margin-left: 38px;">
            </el-switch>
          </div>
          <div class="discount_children" style="display: flex;">
            <span style="color:red">*</span>
            <span>使用范围</span>
            <div style="display: flex;margin-left: 60px;" class="children">
                            <span v-for="item in list" :style="{ background: item.back, color: item.color }"
                                  @click="addlist(index)">{{ item.name }}</span>
            </div>
          </div>
          <div class="discount_children">
            <span>兑换指定分类</span>
            <el-input v-model="name" style="width: 600px;margin-left: 20px;"></el-input>
          </div>
          <div class="discount_children">
            <span>兑换指定商品</span>
            <el-input v-model="newproductids" style="width: 600px;margin-left: 20px;"></el-input>
          </div>
          <div class="discount_children">

            <span>门槛金额</span>
            <el-input v-model="name" style="width: 100px;margin-left: 50px;"></el-input>
          </div>
          <div class="discount_children">
            <span>优惠金额</span>
            <el-input v-model="name" style="width: 100px;margin-left: 50px;"></el-input>
          </div>
        </div>

        <!-- 折扣券 -->
        <div v-show="newvalue == 0">
          <!-- <div class="discount_children">
              <span>可与营销叠加</span>
              <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"
                  style="margin-left: 38px;">
              </el-switch>
          </div> -->
          <div class="discount_children" style="display: flex;">
            <span style="color:red">*</span>
            <span>使用范围</span>
            <div style="display: flex;margin-left: 60px;" class="children">
                            <span v-for="(item, index) in list" :style="{ background: item.back, color: item.color }"
                                  @click="addlist(index)">{{ item.name }}</span>

            </div>
          </div>
          <div class="discount_children" v-show="Index == 4">
            <span>兑换指定分类</span>
            <el-input v-model="productids" style="width: 600px;margin-left: 40px;"></el-input>
          </div>
          <div class="discount_children" v-show="Index == 5">
            <span>兑换指定商品</span>
            <el-input v-model="newproductids" style="width: 600px;margin-left: 40px;"></el-input>
          </div>
          <div class="discount_children">
            <span>门槛金额</span>
            <el-input-number v-model="meetAmount" style="width: 150px;margin-left: 65px;"
                             :min="0"></el-input-number>
          </div>
          <div class="discount_children">
            <span>折扣百分比</span>
            <el-input-number v-model="couponValue" style="width: 150px;margin-left: 50px;" :min="0"
                             :step="2"></el-input-number>
          </div>
        </div>
        <div v-show="value == 3">
          <div class="discount_children">
            <span>兑换指定商品</span>
            <el-input v-model="name" style="width: 300px;margin-left: 28px;"></el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vm from '@/utils/util'
export default {
  dicts: ['discount_type'],
  mounted() {
    this.deptId = this.$store.getters.departmentId
    let that = this;
    setTimeout(() => {
      // that.type = that.dict.type.discount_type[2];
      // console.log(that.type)
    }, 100);
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
  data() {
    return {
      value: 0,
      newvalue: '0',
      name: "",
      type: [
        { value: "0", label: "折扣券" }
      ],
      weightSort: "",
      Index: 3,
      couponName: '',
      remarks: "",
      value1: "",
      releaseStartTime: "",
      releaseEndTime: "",
      quantity: 0,
      couponState: true,
      value2: "",
      meetAmount: "",
      couponValue: "",
      productids: "",
      newproductids: "",
      usageType: '',
      Indexs: "",
      // <span>全场可用</span>
      //                 <span>指定分类</span>
      //                 <span>指定商品</span>
      list: [
        { name: "全场可用", back: "#1890ff", color: "#fff", index: 3 },
        { name: "指定分类", back: "", color: "", index: 4 },
        { name: "指定商品", back: "", color: "", index: 5 }
      ],
      newlist: [
        { name: "固定使用时间有效", back: "#1890ff", color: "#fff", index: 1 },
        { name: "领取后X天有效", back: "", color: "", index: 2 },
      ]
    }
  },
  methods: {
    newgetData(value) {
      let DateObj = new Date(value)
      // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
      let year = DateObj.getFullYear()
      let month = DateObj.getMonth() + 1
      let day = DateObj.getDate()
      let hh = DateObj.getHours()
      let mm = DateObj.getMinutes()
      let ss = DateObj.getSeconds()
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      if (hh >= 0 && hh <= 9) {
        hh = "0" + hh;
      }
      if (mm >= 0 && mm <= 9) {
        mm = "0" + mm;
      }
      if (ss >= 0 && ss <= 9) {
        ss = "0" + ss;
      }
      // 最终时间
      return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
    },
    submit() {
      if (this.couponName == '') {
        this.$message.warning('请输入优惠券名称');
        return;
      }
      if (this.remarks == '') {
        this.$message.warning('请输入使用说明');
        return;
      }
      let data = {
        couponName: this.couponName,
        remarks: this.remarks,
        releaseStartTime: this.value1 == '' || this.value1 == null ? '' : this.newgetData(this.value1[0]),
        releaseEndTime: this.value1 == '' || this.value1 == null ? '' : this.newgetData(this.value1[1]),
        quantity: this.quantity,
        couponState: this.couponState == true ? 1 : 0,
        alidityStartTime: this.value2 == '' || this.value2 == null ? '' : this.newgetData(this.value2[0]),
        validityEndTime: this.value2 == '' || this.value2 == null ? '' : this.newgetData(this.value2[1]),
        meetAmount: this.meetAmount,
        couponValue: this.couponValue,
        productids: this.Index == 4 ? this.productids : this.newproductids,
        useTimeType: this.Indexs,
        // newproductids:this.newproductids,
        // 3:全场通用 4:指定类型 5:指定商品
        usageType: this.Index,
        deptId: this.deptId
      }

      this.$api.confinementRoom.couponInfo(data).then(res => {
        if (res) {
          this.$message.success('添加优惠券成功');
          vm.$emit('closeTag', this.$route.path);
          // this.$router.go(-1);
        }
      })

    },
    add(index) {
      this.newlist.forEach(value => {
        value.back = '';
        value.color = '';
      })
      this.Indexs = this.newlist[index].index
      this.newlist[index].back = '#1890ff'
      this.newlist[index].color = '#fff'
    },
    addlist(index) {
      this.list.forEach(value => {
        value.back = '';
        value.color = '';
      })
      this.Index = this.list[index].index;
      this.list[index].back = '#1890ff'
      this.list[index].color = '#fff'
    }
  }
}
</script>

<style scoped>
* {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
  font-size: 14px;
}

::v-deep .el-input-number__decrease {
  display: none !important;
}

::v-deep .el-input-number__increase {
  display: none !important;
}

.bottom {
  position: fixed;
  width: 100%;
  height: 80px;
  bottom: 0;
  background-color: #fff;
  z-index: 1000;
  display: flex;
  align-items: center;

  justify-content: center;
}

.discount_children {
  width: 800px;
  height: 40px;
  /* border: 1px solid black; */
  line-height: 40px;
  padding-left: 100px;
  margin-top: 20px;
}

.discount {
  width: 100%;
  height: 100%;
  position: fixed;
  /* border: 1px solid black; */
  display: flex;
}

.discount_left {
  width: 50%;
  height: 100%;
  margin-top: 20px;
  /* border: 1px solid red; */
}

.discount_right {
  width: 50%;
  height: 100%;
  margin-top: 20px;
  /* border: 1px solid red; */
}

.children span {
  height: 20px;
  display: inline-block;
  border: 1px solid #eee;
  padding: 5px;
  line-height: 20px;
  text-align: center;
  cursor: pointer;

}
</style>