<template>
  <!--已预定-->
  <div class="header headers">
    <div style="width: 18%;">
      <slideSearch :options="options">
        <div slot="btnBar">
          <el-button
            size="mini"
            icon="el-icon-search"
            type="primary"
            plain
            @click.stop="getData"
          >查询
          </el-button>
        </div>
      </slideSearch>
    </div>
    <div style="width: 88%;">
      <div class="titmes">
        <span class="color-block-default" /> 已入住：10（S套：2&nbsp;普通：8）
        <span class="color-block-success" /> 空闲：10（S套：10&nbsp;普通：20）
        <span class="color-block-success" /> 入住率：50%（S套：30%&nbsp;普通：70%）
      </div>
      <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextMenu">
        <li style="cursor: pointer;" @click="personal()">查看</li>
        <li style="cursor: pointer;" @click="cancel">取消</li>
      </ul>
      <!--房间-->
      <el-card v-for="(item, index) in list" :key="index" class="card">
        <div slot="header" @contextmenu.prevent="openMenu($event,item)">
          <div class="header">
            <div class="room" @click="information($event,item)">
              <div class="header">
                <div style="width: 20%;">
                  <img src="../../../assets/images/room1.png" width="18" height="19">
                </div>
                <div style="width: 76%; padding-top: 2px">
                  {{ item.roomType }}&nbsp;{{ item.roomNumber }}
                </div>
              </div>
            </div>
            <div class="horn">
              <div class="ticks">
                <img class="imgtick" src="../../../assets/images/tick.png" width="18" height="19">
              </div>
            </div>
          </div>
          <div class="header mation">
            <div style="margin-left: 10px">
              <p class="titme"><i class="el-icon-user-solid" />&nbsp;---</p>
              <div class="header">
                <div style="width: 20%"><img src="../../../assets/images/surface2.png" width="16" height="17"></div>
                &nbsp;
                <div style="width: 65%; font-size: 12px;color: #ffffff; margin-top: 2px;padding-left: -10px">26岁</div>
              </div>
            </div>
            <div style="margin-right: 10px">
              <p class="titme six" style="margin-left: 25px">民族：--</p>
              <p class="titme six">距离退房：{{ item.defaultDays }}天</p>
            </div>
          </div>
        </div>
        <div class="header">
          <div class="statrs">
            <p class="titme six" style="color: #333333">现场咨询：---</p>
            <p class="titme six" style="color: #333333;margin-left: 3px">状态：---</p>
            <p class="titme six" style="color: #333333;margin-left: 3px">忌口：{{ item.remark }}</p>
          </div>
          <div class="statrs">
            <p class="titme six" style="color: #333333">责任月嫂：---</p>
            <p class="titme six" style="color: #333333;margin-left: 3px">责任护士：---</p>
            <p class="titme six" style="color: #333333;margin-left: 3px">产康师：---</p>
          </div>
        </div>
      </el-card>
      <!--弹框-->
      <sgDialog title="顾客详细信息" size="560px" :dialog="dialogVisible" @handleClose="closeDialog">
        <div slot="out">
          <el-form ref="form" :model="form" size="mini" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名：">
                  <span style="width: 140px;">{{ form.customerName }}</span>
                </el-form-item>
                <el-form-item label="性别：">
                  <span style="width: 140px;">{{ form.customSex }}</span>
                </el-form-item>
                <el-form-item label="推荐人：">
                  <span style="width: 140px;">{{ form.createBy }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年龄：">
                  <span style="width: 140px;">{{ form.customAge }}</span>
                </el-form-item>
                <el-form-item label="入院时间">
                  <span style="width: 140px;">{{ form.createTime }}</span>
                </el-form-item>
                <el-form-item label="民族：">
                  <span style="width: 140px;">{{ form.nation }}</span>
                </el-form-item>
                <el-form-item label="陪同人员：">
                  <span style="width: 140px;">{{ form.xiang }}</span>
                </el-form-item>
              </el-col>
              <el-form-item label="医生备注：">
                <span style="width: 400px;">{{ form.remark }}</span>
              </el-form-item>
              <el-form-item label="饮食禁忌：">
                <span style="width: 400px;">{{ form.remark }}</span>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </sgDialog>
    </div>
  </div>
</template>

<script>
import sgDialog from '@/components/Dialog/index'
import slideSearch from '@/components/SlideSearchBar/index'
import moment from 'moment'
// import { todayTime } from '@/utils/time'
export default {
  // dicts: ['Room_status', 'nation_list'],
  name: 'NotScheduled',
  components: { sgDialog, slideSearch },
  props: ['floorId', 'roomType', 'nation'],
  data() {
    return {
      // 鼠标
      visible: false,
      top: 0,
      left: 0,
      dialogVisible: false, // 弹框
      come: true,
      comes: false,
      list: [],
      form: {
        customerName: '',
        customSex: '',
        customAge: 0,
        createTime: '',
        nation: '汉',
        createBy: '',
        xiang: '',
        remark: ''
      },
      // 查询列表
      options: {
        createTime: {
          type: 'Tdatetime',
          label: '入住时间',
          clearable: true,
          values: []
        },
        defaultDays: {
          type: 'input',
          label: '已入住天数'
        },
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        customPhone: {
          type: 'input',
          label: '手机号'
        },
        numroom: {
          type: 'input',
          label: '客户号'
        },
        roomType: {
          type: 'select',
          label: '房间状态',
          clearable: true,
          options: []
        },
        nation: {
          type: 'select',
          label: '民族',
          clearable: true,
          options: []
        }
      }
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    // this.options.roomType.options = this.dict.type.Room_status
    // this.options.nation.options = this.dict.type.nation_list
    this.options.roomType.options = this.roomType
    this.options.nation.options = this.nation
    this.getData()
  },
  methods: {
    // 鼠标右键事件
    openMenu(e, item) {
      this.form = item
      const x = e.clientX
      const y = e.clientY
      this.top = y
      this.left = x
      this.visible = true
    },
    closeMenu() {
      this.visible = false
      this.form = {
        customerName: '',
        customSex: '',
        customAge: 0,
        createTime: '',
        nation: '汉',
        createBy: '',
        xiang: '',
        remark: ''
      }
    },
    cancel() {
      this.visible = false
    },
    personal() {
      this.dialogVisible = true
    },
    getData() {
      const floorId = this.floorId
      const data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      this.$api.finance.roomInfolist({ ...data, floorId: floorId }).then(res => {
        if (res) {
          this.list = res.rows
        }
      })
    },
    information(val, item) {
      this.dialogVisible = true
      this.form = item
    },
    closeDialog() {
      this.dialogVisible = false
      this.form = {
        customerName: '',
        customSex: '',
        customAge: 0,
        createTime: '',
        nation: '汉',
        createBy: '',
        xiang: '',
        remark: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
//鼠标右键弹出位置
.contextMenu{
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: fixed;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);
  text-align: center;
  width: 5%;
}
.contextMenu li {
  margin: 8px;
}
</style>
<style scoped lang="scss">
::v-deep .el-card__body{
  //background-color: #faa755;
  padding: 9px;
}
::v-deep .el-card__header{
  padding: 5px 1px;
  background-color: #56dbb8;
}
::v-deep .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow{
  border-radius: 8px;
  border: 1px solid #56dbb8;
}
.headers{
  width: 100%;
  height: 100%;
}
.header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  /*background-color: #56dbb8;*/
}
.horn{
  width: 0px;
  height: 0px;
  border-top: 22px solid #f19739;
  border-bottom: 14px solid #56dbb8;
  border-left: 35px solid #56dbb8;
  border-right: 23px solid #f19739;
  margin-top: -6px;
  margin-right: -1px;
}
.ticks{
  display: flex;
  .imgtick{
    margin-top: -17px;
  }
}
.imgticks{
  display: flex;
}
.mation{
  margin-top: 5px;
}
.card{
  width: 240px;
  display: inline-block;
  margin: 5px 10px;
}
.room{
  float:left;
  cursor: pointer;
  width: 110px;
  height: 20px;
  font-size: 12px;
  background-color: #ffffff;
  border-radius: 0 5px 5px 0;

}
.titmes{
  font-size: 14px;
  margin-left: 15px;
  margin-bottom: 15px
}
.statrs{
  margin: 5px 0;
  padding: 0 3px;
}
.card:hover{
  transform:translate(0,-5px)
}
.six{
  border-bottom: 1px dashed #56dbb8;
}
.titme{
  padding-top: 1px;
  margin-bottom: 4px;
  font-size: 12px;
  color: #ffffff;
}
/*小方块*/
.color-block-default {
  display: inline-block;
  width: 14px;
  height: 10px;
  background-color: #56dbb8;
  border-radius: 2px;
  border: 1px solid #56dbb8;
}
.color-block-success{
  display: inline-block;
  width: 14px;
  height: 10px;
  background-color: #fcbf64;
  border-radius: 2px;
  border: 1px solid #fcbf64;
}
</style>
