<template>
  <div class="menu-bar">
    <search />
    <ul class="menu-item">
      <li>
        <i class="el-icon-tickets" />
        <el-popover
          v-if="bernum === true"
          popper-class="dealt-popover"
          placement="bottom"
          width="150"
          trigger="hover"
        >
          <!--          <el-scrollbar>-->
          <!--            <el-table-->
          <!--              :data="tableData"-->
          <!--              height="200"-->
          <!--              style="font-size: 12px;"-->
          <!--              border-->
          <!--              :show-header="false"-->
          <!--              max-height="200px"-->
          <!--              :header-cell-style="{'text-align':'center'}"-->
          <!--              :cell-style="{'text-align':'center','height':'10px'}"-->
          <!--              @row-click="rowClick"-->
          <!--            >-->
          <!--              <el-table-column prop="name" label="未回访人数" />-->
          <!--              <el-table-column prop="number" label="未回访人数" />-->
          <!--            </el-table>-->
          <!--            <el-pagination-->
          <!--              small-->
          <!--              layout="prev, pager, next"-->
          <!--              :current-page="currentPage"-->
          <!--              :page-size-opts="[10,20,30,40,50,100]"-->
          <!--              :page-size="pageSize"-->
          <!--              :total="handleList"-->
          <!--              @current-change="handleCurrentChange"-->
          <!--              @size-change="handleSizeChange"-->
          <!--            />-->
          <!--          </el-scrollbar>-->
          <div class="headerDialog" @click="rowClick(1)">
            <span>未到院需回访：</span>
            <span>{{ returnVisitRecordNum }}</span>
          </div>
          <div class="headerDialog" @click="rowClick(2)">
            <span>到院未成交回访：</span>
            <span>{{ returnVisitHospitalNum }}</span>
          </div>
          <span slot="reference" style="display: flex;align-items: center;">
            <el-badge v-if="bernum === true" :value="returnVisitRecordNum + returnVisitHospitalNum" :max="99">
              <label style="font-size: 9px;">事项</label>
            </el-badge>
          </span>
        </el-popover>
        <el-tooltip v-if="bernum === false" class="item" content="提醒事项" placement="bottom" effect="light">
          <label style="font-size: 9px;">事项</label>
        </el-tooltip>
      </li>
      <!-- <li>
        <i class="el-icon-s-claim" />
        <el-tooltip class="item" content="我的日程" placement="bottom" effect="light">
          <el-badge :value="12">
            <label>日程</label>
          </el-badge>
        </el-tooltip>
      </li>
      <li>
        <i class="el-icon-s-claim" />
        <el-tooltip class="item" content="系统消息" placement="bottom" effect="light">
          <el-badge :value="12">
            <label>消息</label>
          </el-badge>
        </el-tooltip>
      </li> -->
      <li @click.stop="toLocalScreen">
        <i class="el-icon-lock" />
        <el-tooltip class="item" content="一键锁屏" placement="bottom" effect="light">
          <label style="font-size: 9px;">锁屏</label>
        </el-tooltip>
      </li>
      <li>
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @click="clickHandle">
          <div class="avatar-wrapper">
            <img src="../../../assets/avatar.jpg" class="user-avatar">
            <span>{{ $store.getters.user.nickName }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="clickitem">个人中心</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
    <el-dialog title="个人中心" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <personalCenter @signout="signout" />
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取&nbsp;消</el-button>
        <el-button size="mini" type="primary" @click="dialogVisible = false" @keyup.native.native="keydialog">确&nbsp;定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import personalCenter from '@/views/SystemManagement/PersonalCenter'
import Search from '@/layout/components/MenuBar/Search'
// import SgTable from '@/components/Table'
export default {
  name: 'MenuBar',
  components: {
    Search, personalCenter
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
      bernum: false,
      returnVisitRecordNum: 0, // 事项上的数字
      returnVisitHospitalNum: 0, // 事项上的数字
      tableData: [], // 表单
      // 分页
      currentPage: 1,
      pageSize: 10,
      handleList: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    clickHandle(){
    //  alert('dsads')
    },
    getData() {
      this.$api.modules.netPower.returnVisitRecord().then(res => {
        if (res) {
          this.returnVisitRecordNum = res.data
          if (this.returnVisitRecordNum !== 0) {
            this.bernum = true
          }
        }
      })
      this.$api.modules.netPower.returnVisitHospital().then(res => {
        if (res) {
          this.returnVisitHospitalNum = res.data
          if (this.returnVisitHospitalNum !== 0) {
            this.bernum = true
          }
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/2
     * @Description: 行内点击跳转到未到院回访
    */
    rowClick(val) {
      if (val === 1) {
        this.getData()
        this.$router.push({ path: 'noReturnVisit' })
      } else if (val === 2) {
        this.getData()
        this.$router.push({ path: 'paidReturnVisit', query: { returnStage: '6' }})
      }
    },
    // 分页handleSizeChange
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    // ----------
    handleClose(done) {
      this.dialogVisible = false
    },
    handleClick(tab, event) {
    },
    goToPath(e) {
      this.$router.push({ name: 'personalCenter' })
    },
    clickitem() {
      this.dialogVisible = true
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const loadingInstance = this.$loading({ lock: true, text: '正在退出，请稍候', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' })
        await this.$store.dispatch('LogOut').then((res) => {
          window.location.href = '/login'
          // localStorage.clear()
        }).finally(() => {
          loadingInstance.close()
        })
      }).catch(() => {

      })
    },
    toLocalScreen() {
      this.$LocalScreen()
    },
    signout() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
$menu-width: 90px;
$menu-space: 10px;
$font-size: 16px;
$color: #d5d5d5;
$hover-color: #2e2e2e;

.menu-bar {
  float: right;
  display: flex;
  height: 100%;
  align-items: center;

  .menu-item {
    height: 100%;
    margin-left: 10px;
    overflow: hidden;

    li {
      height: 100%;
      list-style: none;
      display: inline-flex;
      align-items: center;
      //width: $menu-width;
      padding: 0 $menu-space;
      box-sizing: border-box;
      text-align: center;
      font-size: $font-size;
      color: $color;
      cursor: pointer;
      vertical-align: bottom;

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }
      .avatar-container {
        width: auto;
        height: 30px;
        .avatar-wrapper {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          position: relative;
          color: #d5d5d5;
          span{
            vertical-align: bottom;
            font-size: 14px;
            padding-left: 8px;
            width: 70px;
          }

          .user-avatar {
            display: block;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            // vertical-align: bottom;
          }
          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -11px;
            top: 35%;
            font-size: 12px;
          }
        }
      }
      .el-icon-arrow-down {
        vertical-align: middle;
        margin-left: 4px;
      }

      label {
        margin-left: -9px;
        cursor: pointer;
        vertical-align: middle;
        width: 50px;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis
      }
    }
    li:hover {
      background-color: $hover-color;
    }
  }
}

.dealt-title {
  background-color: #f2f2f2;
  padding: 6px 10px;
  box-sizing: border-box;
  color: #999999;
}

.headerDialog {
  margin-top: 5px;
  margin-bottom: 5px;
  cursor: pointer;
}

.dealt-content {
  width: 100%;
  height: 300px;
  max-height: 300px;
}
::v-deep .el-scrollbar {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
<style>
.el-popover.dealt-popover {
  min-width: 100px;
  padding: 10px;

}
</style>
