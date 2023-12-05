<template>
  <!----- 页面上方标签 ------->
  <div v-if="showTags" class="tags" @click="cancel">
    <!--鼠标右击事件-->
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextMenu" @mouseleave="onMouseOut">
      <li @click="refreshPage"><i class="el-icon-refresh-right" />刷新页面</li>
      <li @click="currentLose"><i class="el-icon-close" />关闭当前</li>
      <li @click="tabelOtherLose"><i class="el-icon-circle-close" />关闭其他</li>
      <li v-show="leftlose" @click="leftLose"><i class="el-icon-back" />关闭左侧</li>
      <li v-show="rightlose" @click="rightLose"><i class="el-icon-right" />关闭右侧</li>
      <li @click="tabelAllLose"><i class="el-icon-circle-close" />全部关闭</li>
    </ul>
    <ul class="menuTabs">
      <li v-for="(item, index) in tagsList" :key="index" class="tags-li" :class="{ 'active': isActive(item.path) }"
        @contextmenu.prevent="openMenu($event, item, index)">
        <router-link :to="item.path" class="tags-li-title">
          <el-popover :ref="'popoverRef_' + index" placement="bottom" width="50" v-model="showPower" trigger="click">
            <span slot="reference">{{ item.title }}</span>
            <!--             <span slot="reference">{{ item }}</span>-->
          </el-popover>
        </router-link>
        <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close" /></span>
        <!--        @contextmenu.prevent.native="rightShow(index)"-->
      </li>
    </ul>
    <!--    标签-->
    <!--    <div class="tags-close-box" :style="{display: tagsList.length >= 2 ? '' : 'none'}">-->
    <!--      <el-dropdown @command="handleTags">-->
    <!--        <el-button size="mini" style="background-color: #1abc9c; color:#ffff">-->
    <!--          标签选项<i class="el-icon-arrow-down el-icon&#45;&#45;right" />-->
    <!--        </el-button>-->
    <!--        <el-dropdown-menu slot="dropdown" size="small">-->
    <!--          <el-dropdown-item command="other">关闭其他</el-dropdown-item>-->
    <!--          <el-dropdown-item command="all">关闭所有</el-dropdown-item>-->
    <!--        </el-dropdown-menu>-->
    <!--      </el-dropdown>-->
    <!--    </div>-->
  </div>
</template>

<script>
import vm from '@/utils/util'
import { flatten } from 'mathjs'
import { title } from 'process'

export default {
  data() {
    return {
      tagsList: [],
      fixedTag: '',
      fixedTagPath: '',
      pathRoute: '',
      menus: [],
      // 鼠标右击事件
      visible: false,
      leftlose: false,
      rightlose: false,
      indexlose: 0,
      top: 0,
      left: 0,
      showPower: false,
      count: 0,
    }
  },
  computed: {
    showTags() {
      return this.tagsList.length > 0
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue)
    }
  },
  mounted() {
    vm.$on('closeTag', this.closeTag)
  },
  created() {
    this.setTags(this.$route)
  },
  methods: {
    cancel() {
      this.showPower = false;
      this.visible = false
    },
    onMouseOut() {
      this.visible = false
    },
    // 鼠标右击事件
    openMenu(e, item, index) {
      this.pathRoute = item.path
      this.indexlose = index
      const x = e.clientX
      const y = e.clientY
      this.top = y
      this.left = x
      this.visible = true
      // 左右侧关闭显示隐藏
      if (index + 1 > 1 && this.tagsList.length > 1 && index + 1 === this.tagsList.length) { // 点击最右侧时
        this.leftlose = true
        this.rightlose = false
      } else if (index + 1 === 1 && this.tagsList.length > 1) { // 点击最左侧时
        this.leftlose = false
        this.rightlose = true
      } else if (index + 1 < this.tagsList.length && this.tagsList.length !== index + 1) { // 点击中间任意时
        this.leftlose = true
        this.rightlose = true
      } else if (index + 1 === 1 && this.tagsList.length === 1) { // 只有一个标签时
        this.leftlose = false
        this.rightlose = false
      }
    },
    // 关闭当前页面
    currentLose() {
      this.closeTags(this.indexlose)

      this.visible = false
    },
    // 刷新页面
    refreshPage() {
      this.$refs['popoverRef_' + this.indexlose][0].doClose()
      this.$emit('getTagData', this.pathRoute)
      this.visible = false
    },
    rightShow(id) {
      this.$refs['popoverRef_' + id][0].doShow()
    },
    // 关闭其他
    tabelOtherLose() {
      this.closeOther()
      this.visible = false
    },
    // 关闭左侧
    leftLose() {
      for (var i = 0; i < this.indexlose; i++) {
        this.closeTags(0)
      }
      this.visible = false
    },
    // 关闭右侧
    rightLose() {
      for (var y = this.tagsList.length; y >= 0; y--) {
        this.closeTags(this.indexlose + 1)
      }
      this.visible = false
    },
    // 全部关闭
    tabelAllLose() {
      this.closeAll()
      this.visible = false
    },
    isDisplay() {
      return this.tagsList.length > 10
    },
    isActive(path) {
      return path === this.$route.fullPath
    },
    // 关闭单个标签
    closeTag(path) {
      if (path == 'close') {
        let Index = this.tagsList.length;
        while (Index--) {
          if (this.tagsList[Index].title == '添加预约') {
            this.tagsList.splice(Index, 1)
          }
        }
        return
      }
      const delItem = this.tagsList.filter(item => {
        return item.path.indexOf(path)
      })
      this.tagsList = delItem
      const item = this.tagsList[delItem.length - 1]
      if (item) {
        if(this.$route.path == '/consultInput'){
          this.$router.push(item.path);
        }else{
          this.$router.go(-1);
        }
      } else {
        this.$router.push('/')
      }
    },
    // 关闭单个标签
    closeTags(index) {
      const delItem = this.tagsList.splice(index, 1)[0]
      const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1]
      if (item) {
        delItem.path === this.$route.fullPath && this.$router.push(item.path)
      } else {
        this.$router.push('/')
      }
    },
    // 关闭全部标签
    closeAll() {
      this.tagsList = []
      this.$router.push('/')
    },
    // 关闭其他标签
    closeOther() {
      this.tagsList = this.tagsList.filter(item => {
        return item.path === this.$route.fullPath
      })
    },
    //设置tab切换问题

    changeTab(menu, route) {
      let flag = false
      menu.forEach(value => {
        if (value.meta.title == route.meta.title) {
          flag = true
        }
      })
      if (flag) {
        this.tagsList.unshift({
          title: route.meta.title,
          path: route.fullPath
        })
      } else {
       
        this.tagsList.push({
          title: route.path=='/channel'? decodeURI(route.fullPath.split('&')[1].split('=')[1])+'-'+route.meta.title:route.meta.title,
          path: route.fullPath
        })
      }
    },
    // 设置标签
    setTags(route) {
      if (this.$route.path == '/') {
        return
      }
      const isExist = this.tagsList.some(item => {
        return item.path === route.fullPath
      })
      let menu = JSON.parse(localStorage.getItem('menu'));
      if (!isExist) {
        if (this.tagsList.length >= 15) {
          this.tagsList.shift()
        }
        this.changeTab(menu, route)
      } else {
        let flag = false;
        menu.forEach(value => {
          if (value.meta.title == route.meta.title) {
            flag = true
          }
        })
        if (flag) {
          for (let men = this.tagsList.length - 1; men >= 0; men--) {
            if (this.tagsList[men].title == route.meta.title) {
              this.tagsList.splice(men, 1);
              this.tagsList.unshift({
                title: route.meta.title,
                path: route.fullPath
              })
            }
          }
        }

      }
    }
  }
}

</script>
<style>
/* 鼠标右键弹出位置*/
.contextMenu {
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
  /*box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);*/
  text-align: center;
  width: 5%;
}

.contextMenu li {
  margin: 8px;
  cursor: pointer;
}

.contextMenu li:hover {
  background-color: #F2F6FC;
}

.el-button--primary:focus,
.el-button--primary:hover {
  background: #1fa087;
  border-color: #1fa087;
  color: #fff;
}

.el-popover {
  min-width: 50px;
  padding: 5px;
  cursor: pointer;
}

.el-button--primary {
  color: #fff;
  background-color: #1abc9c;
  border-color: #1abc9c;
}

.tags {
  position: relative;
  height: 30px;
  overflow: hidden;
  background: #fff;
  padding-right: 120px;
  box-shadow: 0 5px 10px #ddd;
}

/*.tags ul {*/
/*  box-sizing: border-box;*/
/*  width: 100%;*/
/*  height: 100%;*/
/*}*/

.tags-li {
  float: left;
  margin: 3px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all .3s ease-in;
  -moz-transition: all .3s ease-in;
  transition: all .3s ease-in;
  position: relative;
}

.showright {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 0 5px;
  color: #000;
  background-color: #fff;
}

/*.tags-li.active {*/
/*  color: #fff;*/
/*}*/

.tags-li-title {
  float: left;
  /*max-width: 80px;*/
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: none;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #1abc9c;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
  z-index: 10;
}

.display {
  display: none;
}

/* .el-popper[x-placement^=bottom] {
  display: none;
} */
</style>
