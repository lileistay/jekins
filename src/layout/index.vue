<template>
  <!-- 界面 -->
  <div class="header-bar">

    <div ref="nav-header" class="nav-header">
      <div class="header-content">
        <choice-mechanism />
        <menu-bar />
      </div>
      <div class="nav-menu">
        <div class="nav-menu-content">
          <ul class="navmenu">
            <li v-for="(nav, navIndex) in navMenu" :key="navIndex" @click.stop="stepMenu(nav, true, navIndex)">
              <i :class="nav.meta.icon" />
              <label>{{ nav.meta.title }}</label>
            </li>
          </ul>
          <div  class="showmenus">
            <div class="showChildren" v-for="(item, index) in menu_list" :key="index" @click="handrouter(item.path)">
              {{ item.meta.title }}
            </div>
          </div>
        </div>
      </div>
      <tags-bar @getTagData="getTagData" />
    </div>
    <div v-if="refresh" class="content" :style="{ height: height }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view v-if="this.$route.meta.noCache !== true" :key="key" />
        </keep-alive>
      </transition>
      <transition name="fade-transform" mode="out-in">
        <router-view v-if="this.$route.meta.noCache === true" :key="key" />
      </transition>
    </div>
  </div>
</template>

<script>
import ChoiceMechanism from '@/layout/components/HeaderBar/choiceMechanism'
import MenuBar from '@/layout/components/MenuBar/menuBar'
import { mapGetters } from 'vuex'
import TagsBar from '@/layout/components/TagsView/tagsBar'
import { index } from 'mathjs'

export default {
  name: 'Layout',
  components: {
    ChoiceMechanism,
    MenuBar,
    TagsBar
  },
  data() {
    return {
      height: 0,
      navMenu: undefined,
      refresh: true,
      menu_list: [],
    }
  },
  computed: {
    ...mapGetters(['sidebarRouters']),
    key() {
      return this.$route.fullPath
    },
    name() {
      return this.$route.name
    }
  },
  mounted() {
    let that = this;
    document.querySelector('body').addEventListener('click', function () {
      that.showmenuList = false;
      if(document.querySelector('.showmenus')){
        document.querySelector('.showmenus').style.height = '0px';
      }
     
    })
    if(this.sidebarRouters[0].path=='/customerInfo'){
      this.sidebarRouters.shift();
    }
    this.navMenu = this.sidebarRouters;
    const permissions = this.$store.getters && this.$store.getters.permissions;
    if (permissions.length !== 1) {
      if (permissions.indexOf('showerOrdernumber:button') !== -1) {
        this.$store.dispatch('setbutton', { setShowButton: true })
      } else {
        this.$store.dispatch('setbutton', { setShowButton: false })
      }
    }else{
      this.$store.dispatch('setbutton', { setShowButton: true })
    }
    localStorage.setItem('menu', JSON.stringify(this.navMenu))
    if (this.$route.path == '/') {
      if (this.navMenu[0].children == undefined) {
      } else {
        let Path = this.navMenu[0].children[0].path;
        this.navMenu[0].path = Path
        this.$router.push('/' + Path);
      }
    }
    this.$nextTick(() => {
      const height = document.documentElement.clientHeight - 132
      if (height < 400) {
        this.height = 400 + 'px'
      } else {
        this.height = height + 'px'
      }
    })

    document.querySelector('.header-bar').onscroll = function (e) {
      if (e.target.scrollTop > 0) {
        document.querySelector('.nav-header').style.position = 'absolute';
        document.querySelector('.nav-header').style.width = '100%'
        document.querySelector('.nav-header').style.zIndex = '100';
        document.querySelector('.content').style.marginTop = document.querySelector('.nav-header').offsetHeight + 'px'
        document.querySelector('.nav-header').style.marginLeft = ((document.documentElement.clientWidth - document.querySelector('.nav-header').offsetWidth) / 2) + 'px'
      }
      if (e.target.scrollTop == 0) {
        document.querySelector('.nav-header').style.position = 'relative';
        document.querySelector('.content').style.marginTop = '0px'
      }
    }
  },
  methods: {
    handrouter(path) {
      this.$router.push('/' + path);
      this.showmenuList = false;
    },
    getTagData(path) {
      this.refresh = false
      if (path) {
        setTimeout(() => {
          this.refresh = true
        }, 100)
      }
    },
    stepMenu(nav, isFirst, index) {
      let children = document.querySelector('.navmenu').children;
      let newchildren = Array.prototype.slice.call(children, null)
      newchildren.forEach(value => {
        value.classList.remove('active')
      })
      if (index == 0) {
        if (nav.children.length > 1) {
          this.menu_list = nav.children;
          setTimeout(() => {
            document.querySelector('.showmenus').style.height = (nav.children.length) * 40 + 'px';
            document.querySelector('.showmenus').style.transition = 'all 0.5s'
          }, 1)

          return
        }
        newchildren[index].style.borderTopLeftRadius = '15px';
      } else {
        setTimeout(()=>{
          document.querySelector('.showmenus').style.height = '0px';
          document.querySelector('.showmenus').style.transition = 'all 0.5s'
        },1)
     
      }
      newchildren[index].classList.add('active');

      this.$router.push('/' + nav.path);

    },
    styleObjectFun(v) {
      return {
        '--height': v.length * 40 + 'px'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/transition.scss";

$bg: #333333;
$color: #fff;
$height: 60px;
$width: 1440px;
$nav-menu-bg: #1abc9c;
$nav-menu-border-radius: 16px;
$nav-hover-bg-color: #1fa087;
$content-bg: #f8f8f8;

.showmenus {
  width: 200px;
  position: absolute;
  background-color: #fff;
  color: black;
  cursor: pointer;
  left: 0;
  top: 50px;
  z-index: 10000;
  border-radius: 5px;
  height: 0px;
  overflow: hidden;
}

.showChildren {
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border: 1px solid #eee;
  border-top-color: transparent;
  font-weight: 700;
  color: #666666;
}

.header-bar {
  width: 100%;
  margin: auto;
  color: $color;
  overflow-x: hidden;
  overflow-y: auto;


  .nav-header {
    background-color: $bg;


    .header-content {
      width: $width;
      margin: auto;
      height: $height;
      padding: 0 20px;
      box-sizing: border-box;
    }

    // .navmenu li:nth-of-type(1){
    //    display: none !important;
    // }
    .nav-menu {
      width: 100%;
      height: 40px;
      background-color: $bg;
      border-bottom: 2px solid $nav-menu-bg;

      .nav-menu-content {
        width: $width;
        height: 100%;
        margin: auto;
        background-color: $nav-menu-bg;
        border-radius: $nav-menu-border-radius $nav-menu-border-radius 0 0;
        position: relative;

        ul {
          list-style: none;
          height: 100%;
          white-space: nowrap;

          li {
            position: relative;
            font-size: 12px;
            display: inline-block;
            height: 100%;
            width: calc(100% / 13);
            line-height: 28px;
            text-align: center;
            padding: 6px 5px;
            box-sizing: border-box;
            cursor: pointer;
            position: relative;

            &:after {
              position: absolute;
              content: '';
              top: 50%;
              right: 0;
              transform: translateY(-50%);
              display: block;
              height: 20px;
              width: 1px;
              background-color: #7ec5b7;
            }

            label {
              cursor: pointer;
            }

            .nav-child {
              position: absolute;
              top: 40px;
              left: 0;
              width: 100%;
              background-color: $nav-menu-bg;
              display: block;
              z-index: 999;

              ul {
                width: 100%;
                height: 0;
                white-space: break-spaces;
                overflow: hidden;
                transition: 0.42s;

                li {
                  font-size: 14px;
                  display: inline-block;
                  height: 40px;
                  width: 100%;
                  line-height: 28px;
                  text-align: center;
                  padding: 6px 5px;
                  box-sizing: border-box;
                  cursor: pointer;
                  border-top: 1px solid #ffffff;

                  &:after {
                    display: none;
                  }

                  label {
                    cursor: pointer;
                  }
                }

                li:hover {
                  border-radius: 0;
                }
              }
            }
          }

          li:last-child:after {
            display: none;
          }

          li:hover {
            background-color: $nav-hover-bg-color;
          }

          li:last-child:hover {
            border-radius: 0 16px 0 0;
          }

          li:hover .nav-child ul {
            transition: all 0.3s;
            height: var(--height);
          }

          li:first-child:hover {
            border-radius: 16px 0 0 0;
          }
        }
      }
    }
  }

  .content {
    width: 100%;
    background-color: $content-bg;
    color: #454545;
  }
}

::v-deep .el-scrollbar {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}

.active {
  background-color: #1fa087;
}</style>
