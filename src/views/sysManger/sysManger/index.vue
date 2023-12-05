<template>
  <el-scrollbar>
    <div class="sys-manger">
      <waterfull :data="menuList(menuArray)" :departmentList="depDate" />
    </div>
  </el-scrollbar>
</template>

<script>
import Waterfull from '@/components/Waterfall'
export default {
  name: 'SysManger',
  components: { Waterfull },
  data() {
    return {
      menuArray: [],
      path: undefined,
      //公司树
      deptOptions:[],
      allMenu:[],
      depDate:[]
    }
  },
  computed:{
    departmentId(){
      return this.$store.state.department.departmentId
    }
  },

  created() {
    this.getTreeselect()
    this.path = this.$route.path.substr(this.$route.path.lastIndexOf('/') + 1)
    this.getMenu(this.$store.getters.sidebarRouters)
  },
  watch:{
    departmentId(old,newVal){
        if(old!==newVal && this.departmentId && this.path === "healthcareManagement"){
          this.getDept()
       }
    }
  },
  methods: {
    /**
     * @auther wanghu
     * @date   2023/2/23
     * @desc   处理医务管理菜单问题
     * */
    getDept(){
      this.menuArray = []
      this.$api.dept.DepartmentList({ deptId: this.departmentId}).then(res => {
        if(res && res.rows.length>0){
          //v.isDepartment==="1" 查询是科室的菜单
          let depDate = res.rows.filter(v=> v.isOperateDepartment==="1")
          this.depDate = depDate
          this.allMenu.forEach(item => {
            depDate.forEach(v=>{
              if(item.meta.title === v.departmentName){
                this.menuArray.push(item)
              }
            })
          })
        }
      })
    },
    getMenu(sidebarRouters) {
      sidebarRouters.forEach(item => {
        if (item.path === this.path) {
          if(this.path === "healthcareManagement"){
            this.menuArray = []
            this.allMenu = item.children
            this.getDept()
          }else {
            this.menuArray = item.children
          }
        } else {
          if (item.children !== undefined) {
            this.getMenu(item.children)
          }
        }
      })
    },
    menuList() {
      const list = []
      if (this.menuArray && this.menuArray.length > 0) {
        this.menuArray.forEach(item => {
          if (item.children === undefined) {
            const menu = Object.assign({}, item)
            item.children = []
            item.children.push(menu)
          }
          list.push(item)
        })
      }
      return Array.from(new Set(list))
    },
    /** 查询公司下拉树结构 */
    getTreeselect() {
      // this.$api.dept.deptTree().then(res => {
      //   if (res) {
      //     let tempDept = res.data[0].children[0]?.children
      //     tempDept.forEach(item=>{
      //       item.children.forEach(val=>{
      //         this.deptOptions.push(val)
      //       })
      //     })
      //   }
      // })
    }
  }
}
</script>
