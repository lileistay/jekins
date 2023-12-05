<template>
  <div class="container">
    <div class="left" style="">
      <div class="left-title">
        {{ searchTitle ? searchTitle : '查询条件' }}
      </div>
      <div class="left-content">
        <slot name="left" />
        <el-scrollbar class="scrollbar">
          <el-form ref="form" size="mini" label-position="top" label-width="80px">
            <el-form-item v-for="(formItem, formIndex) in options" :key="formIndex" :label="formItem.label">
              <el-select @keyup.enter.native="getDatakeyup" v-if="formItem.type === 'select'" v-model="formItem.values"
                filterable :clearable="formItem.clearable" class="inputWidth" placeholder="请选择" :filter-method="may"
                @click.native="addnext(formItem)" @clear="clearselect" @change="changeselect">
                <el-option v-for="(optionsItem, optionsIndex) in formItem.options" :key="optionsIndex + 'op'"
                  :label="optionsItem.label" :value="optionsItem.value" />
              </el-select>
              <el-select multiple collapse-tags @keyup.enter.native="getDatakeyup" v-if="formItem.type === 'select1'"
                v-model="formItem.values" filterable :clearable="formItem.clearable" class="inputWidth" placeholder="请选择"
                :filter-method="mayol">
                <el-option v-for="(optionsItem, optionsIndex) in formItem.options" :key="optionsIndex + 'op'"
                  :label="optionsItem.label" :value="optionsItem.value" />
              </el-select>
              <el-select   @keyup.enter.native="getDatakeyup" :remote-method="querySearchAsync" @click.native="clickNative(formItem)" v-if="formItem.type === 'selectsearch'"
                         v-model="formItem.values" filterable :clearable="formItem.clearable" class="inputWidth" placeholder="请选择"
                         filterable
                         remote
                         reserve-keyword
                         value-key="arr"
                         >
                <el-option v-for="(optionsItem, optionsIndex) in formItem.options" :key="optionsIndex + 'op'"
                           :label="optionsItem.label" :value="optionsItem.value" />
              </el-select>
              <el-input v-else-if="formItem.type == 'input'" v-model="formItem.values" placeholder="请输入"
                class="inputWidth" clearable @keyup.enter.native="getDatakeyup" />
              <span v-else-if="formItem.type == 'Tinput'">
                <el-input @keyup.enter.native="getDatakeyup" v-model="formItem.values[0]" placeholder="请输入"
                  class="inputHalfLimWidth" type="number" />至
                <el-input @keyup.enter.native="getDatakeyup" v-model="formItem.values[1]" placeholder="请输入" type="number"
                  class="inputHalfLimWidth" />
              </span>
              <span v-else-if="formItem.type == 'Tdatetime'">
                <el-date-picker @keyup.enter.capture.native="getDatakeyup" v-model="formItem.values[0]"
                  :clearable="formItem.clearable" :disabled="formItem.disabled" class="inputHalfLimWidth" type="datetime" placeholder="开始时间"
                  default-time="00:00:00" />至
                <el-date-picker @keyup.enter.capture.native="getDatakeyup" v-model="formItem.values[1]"
                  :clearable="formItem.clearable" :disabled="formItem.disabled" class="inputHalfLimWidth" type="datetime" placeholder="结束时间"
                  default-time="23:59:59" />
              </span>
              <span v-else-if="formItem.type == 'Tdatetime1'">
                <el-date-picker @keyup.enter.capture.native="getDatakeyup" v-model="formItem.values[0]"
                  :clearable="formItem.clearable" class="inputHalfLimWidth" type="datetime" placeholder="开始时间"
                  default-time="00:00:00" />至
                <el-date-picker @keyup.enter.capture.native="getDatakeyup" v-model="formItem.values[1]"
                  :clearable="formItem.clearable" class="inputHalfLimWidth" type="datetime" placeholder="结束时间"
                  default-time="23:59:59" />
              </span>
              <el-date-picker
              v-else-if="formItem.type == 'date'"
      v-model="formItem.values"
      type="date"
      :placeholder="formItem.placeholder"
      :clearable="formItem.clearable"
      class="inputWidth"
      >
    </el-date-picker>
              <el-date-picker @keyup.enter.capture.native="getDatakeyup" v-else-if="formItem.type == 'daterange'"
                v-model="formItem.values" :clearable="formItem.clearable" class="inputWidth" type="daterange"
                unlink-panels format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始"
                end-placeholder="结束" :default-time="['00:00:00', '23:59:59']" />
              <el-date-picker @keyup.enter.capture.native="getDatakeyup" v-else-if="formItem.type == 'datetimerange'"
                v-model="formItem.values" class="inputWidth" type="datetimerange" align="right" unlink-panels
                format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd HH:MM:SS" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
              <el-date-picker @keyup.enter.capture.native="getDatakeyup"
                v-else-if="formItem.type == 'datetimerangeopentions'" v-model="formItem.values" class="inputWidth"
                type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" />
              <span v-else-if="formItem.type == 'Tselect'">
                <el-select @keyup.enter.native="getDatakeyup" v-model="formItem.values[0]" class="inputHalfWidth"
                  placeholder="请选择" clearable filterable :filter-method="mays"
                  @click.native="addnexts(formItem, formItem.options[0])" @clear="clearselecttwo" @change="selecttwo">
                  <el-option v-for="(optionsItem, optionsIndex) in formItem.options[0]" :key="optionsIndex + 'op1'"
                    :label="optionsItem.label" :value="optionsItem.value" />
                </el-select>
                <el-select @keyup.enter.native="getDatakeyup" v-model="formItem.values[1]" clearable
                  class="inputHalfWidth" placeholder="请选择" filterable :filter-method="maysl"
                  @click.native="addnextsl(formItem, formItem.options[1])">
                  <el-option v-for="(optionsItem, optionsIndex) in formItem.options[1]" :key="optionsIndex + 'op2'"
                    :label="optionsItem.label" :value="optionsItem.value" />
                </el-select>
              </span>
              <el-cascader @keyup.enter.native="getDatakeyup" v-else-if="formItem.type == 'cascader'"
                v-model="formItem.values" class="inputWidth" collapse-tags :show-all-levels="false"
                :props="formItem.props" :options="formItem.options" />
              <el-radio v-for="(optionsItem, optionsIndex) in formItem.options" v-else-if="formItem.type == 'radio'"
                :key="optionsIndex" v-model="formItem.values" :label="optionsItem.label" :value="optionsItem.value" />
              <!-- 复选框 -->
              <el-checkbox v-for="(optionsItem, optionsIndex) in formItem.options" v-else-if="formItem.type == 'checkbox'"
                :key="optionsIndex" v-model="formItem.values" class="checkbox" :label="optionsItem.label"
                :value="optionsItem.value" />
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <div class="left-footer">
        <slot name="btnBar" />
      </div>
    </div>
    <div class="right">
      <slot />
    </div>
  </div>
</template>

<script>
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter, lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear,
  todayTime
} from '@/utils/time'
import { cos } from 'mathjs';
import PinyinMatch from "pinyin-match";
export default {
  name: 'SlideSearchBar',
  props: {
    searchTitle: {
      type: String
    },
    options: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      newlist: "",
      newlists: [],
      newlistsl: [],
      listone: [],
      listname: "",
      listnamel: "",
      obj: {},
      newobj: {},
      saveList:{},
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', beforeDayTime(1))
            }
          },
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', todayTime())
            }
          },
          {
            text: '上周',
            onClick(picker) {
              picker.$emit('pick', beforeWeek(1))
            }
          },
          {
            text: '本周',
            onClick(picker) {
              picker.$emit('pick', thisWeek())
            }
          },
          {
            text: '上月',
            onClick(picker) {
              picker.$emit('pick', lastMonth())
            }
          },
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', monthData())
            }
          },
          {
            text: '上季度',
            onClick(picker) {
              picker.$emit('pick', lastQuarter())
            }
          },
          {
            text: '本季度',
            onClick(picker) {
              picker.$emit('pick', thisQuarter())
            }
          },
          {
            text: '上年',
            onClick(picker) {
              picker.$emit('pick', lastYear())
            }
          },
          {
            text: '本年',
            onClick(picker) {
              picker.$emit('pick', thisYear())
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(7)[0], todayTime()[1]])
            }
          },
          {
            text: '最近一月',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(30)[0], todayTime()[1]])
            }
          }
        ]
      }
    }
  },
  methods: {
    // 远程搜索
    querySearchAsync(query) {
      this.$emit('getSearchpeople',query)
      // console.log('sss')
    },
    clickNative(formItem){
      this.$emit('clickNative',formItem)
    },
    getDatakeyup() {
      this.$emit('getDatakeyup')
    },
    //两级联动清除
    clearselecttwo(row) {
      for (let i in this.options) {
        if (this.options[i].label == this.listname.label) {
          this.options[i].options = this.obj[i].options
          this.$forceUpdate()
        }
      }
    },
    //清除选择框使用
    clearselect(row) {
      for (let i in this.options) {
        if (this.options[i].label == this.newlist.label) {
          this.options[i].options = this.obj[i].options
        }
      }
    },
    //选择下拉选项后重新赋值
    changeselect(row) {
      for (let i in this.options) {
        if (this.options[i].label == this.newlist.label) {
          this.options[i].values = row
          this.$forceUpdate()
          // this.options[i].values=row
        }
      }
    },
    selecttwo(row){
     console.log('我选择的是联动下拉')
    },
    addnextsl(row, rows) {
      this.newlistsl = rows;
      this.listnamel = row
    },
    addnexts(row, rows) {
      this.newlists = rows;
      this.listname = row
    },
    addnext(row) {
      this.newlist = row;
      this.saveList=this.deepClone(this.newlist);
    },
    maysl(val) {
      if (val) {
        if(this.newlistsl==undefined){
              
        }else{
          let newlist = this.newlistsl.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
        for (let x in this.options) {
          if (this.options[x].label == this.listnamel.label) {
            if (this.listone.length == 0) {
              this.options[x].options = [this.newlists, newlist]
            } else {
              this.options[x].options = [this.listone, newlist]
            }

          }
        }
        }
      } else {
        for (let i in this.options) {
          if (this.options[i].label == this.listnamel.label) {
            // this.options[i].options = this.obj[i].options;
            // console.log(,'看见')
            this.$forceUpdate()
          }
        }
      }
    },
    mays(val) {
      if (val) {
        let newlist = this.newlists.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
        for (let x in this.options) {
          if (this.options[x].label == this.listname.label) {
            this.options[x].options = [newlist]
            this.options[x].values[0]=val;
            this.listone = newlist
          }
        }
      } else {
        for (let i in this.options) {
          if (this.options[i].label == this.listname.label) {
            this.options[i].values[0]=''
            this.$forceUpdate()
            this.options[i].options = this.obj[i].options;
          }
        }
      }
    },
    //单选下拉输入框逻辑
    may(val) {
      if (val) {
        //取值
        this.newlist=this.deepClone(this.saveList);
        let newlist = this.newlist.options.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }

          return PinyinMatch.match(item.label, val)
        })
        //赋值
        for (let x in this.options) {
          if (this.options[x].label == this.newlist.label) {
            this.options[x].options = newlist
            this.options[x].values = val
          }
        }
      } else {
        //下拉输入框为空时，自动回显初始数据
        for (let i in this.options) {
          if (this.options[i].label == this.newlist.label) {
            this.options[i].values =''
            this.options[i].options = this.obj[i].options
            this.$forceUpdate()
          }
        }
      }
    },
    //深拷贝
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
  },
  created() {
    let that = this;
    //这一部分主要是深拷贝数据，如果选择输入框为空时给相应的选择框赋值使用
    setTimeout(() => {
      this.obj = this.deepClone(this.options)
    }, 1000)
    this.$nextTick(function () {
      this.reloadSearch = this.$store.getters.reloadSearch
      let prefix = document.querySelectorAll(".el-input__prefix");
      prefix.forEach(v => {
        v.remove();
      })
      if (that.$route.path == '/confinementBulletinBoard') {
        document.querySelector('.left').style.height = document.documentElement.clientHeight - 162 + "px"
      } else {
        if (that.$route.path == '/maternityHotels' || that.$route.path == '/nurseCenter') {
          document.querySelector('.left').style.height = document.documentElement.clientHeight - 212 + "px"
        }
        else {
          document.querySelector('.left').style.height = document.documentElement.clientHeight - 132 + "px"
        }

      }


    })
    window.addEventListener('resize', function () {
      if (that.$route.path == '/confinementBulletinBoard') {
        document.querySelector('.left').style.height = document.documentElement.clientHeight - 172 + "px";
      }
      else if (that.$route.path == '/maternityHotels' || that.$route.path == '/nurseCenter') {
        document.querySelector('.left').style.height = document.documentElement.clientHeight - 212 + "px"
      }
      else {
        if (document.querySelector('.left')) {
          document.querySelector('.left').style.height = document.documentElement.clientHeight - 132 + "px"
        } else {

        }

      }

    })
  }
}
</script>

<style></style>

<style scoped lang="scss">
::v-deep .el-form-item__label {
  font-size: 12px;
  padding-bottom: 0;
}

::v-deep .el-date-editor .el-input__inner {
  padding: 10px !important;
  margin: 0 !important;
}

::v-deep .el-form-item {
  margin-bottom: 0 !important;
}

$left-width: 226px;

.container {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .left {
    width: $left-width;
    // height: 100%;
    // height: 95%;
    background-color: #f8f8f8;
    color: #999999;
    border-right: 1px solid #eee;

    .left-title {
      width: 100%;
      height: 40px;
      text-align: left;
      line-height: 40px;
      padding: 0 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      position: relative;
      font-size: 14px;
      font-weight: bold;
      background-color: #f2f2f2;

      &:before {
        display: block;
        position: absolute;
        left: 10px;
        top: 50%;
        height: 15px;
        transform: translateY(-50%);
        content: "";
        width: 3px;
        background-color: #1abc9c;
        border-radius: 6px;
      }
    }

    ::v-deep .el-form-item__content {
      margin: 0 !important;
    }

    .left-content {
      padding: 10px 0 0 10px;
      box-sizing: border-box;
      width: 100%;
      height: calc(100% - 80px);

      ::v-deep .scrollbar {
        height: 100%;
      }
    }

    .left-footer {
      width: 100%;
      height: 40px;
      padding: 0 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-top: 1px solid #eee;
    }
  }

  .right {
    width: calc(100% - 226px);
    height: 100%;
  }
}

.inputWidth {
  width: 197px;
}

.inputHalfWidth {
  width: 99px;
}

.inputHalfLimWidth {
  width: 91px;
}

::v-deep .el-input__inner {
  paddingl-left: 5px !important;
  padding-right: 5px !important;
}

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}
</style>
