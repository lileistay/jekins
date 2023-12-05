<template>
  <!--已预定-->
  <div class="header headers">
    <div>
      <slideSearch :options="options">
        <div slot="btnBar">
          <el-button
            size="mini"
            icon="el-icon-search"
            type="primary"
            plain
            @click.stop="getData"
            @keyup.enter.native="getDatakeyup"
          >查询
          </el-button>
        </div>
      </slideSearch>
    </div>
    <div>
      <div class="titmes">
        <span class="color-block-default" /> 已入住：10（S套：2&nbsp;普通：8）
        <span class="color-block-success" /> 空闲：10（S套：10&nbsp;普通：20）
        <span class="color-block-success" /> 入住率：50%（S套：30%&nbsp;普通：70%）
      </div>
      <!--房间-->
      <el-card v-for="(item, index) in list" :key="index" class="card">
        <div slot="header" style="height: 60px;">
          <div class="header">
            <div class="room" @click="information">
              <img src="../../../assets/images/room2.png" width="18" height="19">
              <span>普通房 {{ index+1 }}</span>
            </div>
            <div>
              <i class="el-icon-s-claim" @click="open(index)" />
              <span v-if="come" class="titme">未入住</span>
              <span v-if="comes" class="titme">已入住</span>
            </div>
          </div>
          <div class="header">
            <div style="margin-left: 10px">
              <p class="titme"><i class="el-icon-user-solid" />---</p>
              <p class="titme">年龄：--岁</p>
            </div>
            <div style="margin-right: 10px">
              <p class="titme">民族：--</p>
              <p class="titme">距离退房：--天</p>
            </div>
          </div>
        </div>
        <div class="header">
          <div class="statrs">
            <p class="titme statrs six">医生：---</p>
            <p class="titme six">状态：--</p>
          </div>
          <div class="statrs">
            <p class="titme statrs six">月嫂：---</p>
            <p class="titme six">产康：---</p>
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
                  <span style="width: 140px;">{{ form.name }}</span>
                </el-form-item>
                <el-form-item label="性别：">
                  <span style="width: 140px;">{{ form.resource }}</span>
                </el-form-item>
                <el-form-item label="地址：">
                  <span>{{ form.diqu }}</span>
                </el-form-item>
                <el-form-item label="推荐人：">
                  <span style="width: 140px;">{{ form.tui }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年龄：">
                  <span style="width: 140px;">{{ form.age }}</span>
                </el-form-item>
                <el-form-item label="入院时间">
                  <span style="width: 140px;">{{ form.region }}</span>
                </el-form-item>
                <el-form-item label="民族：">
                  <span style="width: 140px;">{{ form.min }}</span>
                </el-form-item>
                <el-form-item label="陪同人员：">
                  <span style="width: 140px;">{{ form.xiang }}</span>
                </el-form-item>
              </el-col>
              <el-form-item label="医生备注：">
                <span style="width: 400px;">{{ form.remekr }}</span>
              </el-form-item>
              <el-form-item label="饮食禁忌：">
                <span style="width: 400px;">{{ form.remekr }}</span>
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
import { todayTime } from '@/utils/time'
export default {
  name: 'NotScheduled',
  components: { sgDialog, slideSearch },
  data() {
    return {
      dialogVisible: false,
      come: true,
      comes: false,
      list: [1, 2, 3, 4, 1, 2, 3, 4, 4, 1, 2, 9, 10, 11, 12, 13, 14],
      form: {
        name: '张富贵',
        resource: '女',
        age: 24,
        region: '2022-2-25',
        diqu: '兰州市城关区',
        min: '0',
        tui: '张三',
        xiang: '富贵',
        remekr: '注意事项'
      },
      // 查询列表
      options: {
        createTime: {
          type: 'Tdatetime',
          label: '入住时间',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        data: {
          type: 'input',
          label: '入住天数'
        },
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        phone: {
          type: 'input',
          label: '手机号'
        },
        numroom: {
          type: 'input',
          label: '客户号'
        },
        statr: {
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
  methods: {
    information() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    open(index) {
      this.$confirm('到院情况', {
        confirmButtonText: '已到院',
        cancelButtonText: '未到院',
        center: true
      }).then(() => {
        this.come = false
        this.comes = true
        this.$message({
          type: 'success',
          message: '已到院!'
        })
      }).catch(() => {
        // 未到院操作
        this.come = true
        this.comes = false
      })
    }
  }
}
</script>

<style scoped>
>>> .el-card__body{
  /*background-color: #faa755;*/
  padding: 9px;
}
>>> .el-card__header{
  padding: 5px 1px;
  background-color: #faa755;
}
>>> .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow{
  border-radius: 8px;
  border: 1px solid #faa755;
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
.mation{
  margin-top: 5px;
}
.card{
  width: 210px;
  display: inline-block;
  margin: 5px 15px;
}
.room{
  float:left;
  cursor: pointer;
  width: 100px;
  font-size: 15px;
  background-color: #ffffff;
  border-radius: 0 7px 7px 0;
}
.titmes{
  font-size: 14px;
  margin-left: 15px;
  margin-bottom: 15px
}
.statrs{
  margin: 10px 0;
  padding: 0 3px;
}
.card:hover{
  cursor:pointer;
  transform:translate(0,-5px)
}
.six{
  border-bottom: 1px dashed #56dbb8;
}
.titme{
  padding-top: 1px;
  font-size: 11px;
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
