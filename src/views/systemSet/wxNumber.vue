<template>
<!--  模板信息-->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay">
      <template v-slot:company>
        <div class="dept-table">
          <sg-table
            v-if="true"
            index="序号"
            size="mini"
            :table-data="tableData"
            :columns="columns"
            :operate="operate"
            hide-search-bar
            :pagination="pagination"
            @size-change="sizeChange"
            @current-change="currentChange"
            @operateClick="operateClick"
            @selection-change="handleSelectionChange"
          >
            <div slot="header" style="width: 100%;">
              <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
              <div style="float: right">
                <el-button v-has-permi="['client:markdownTemplates:add']" size="mini" plain type="primary" icon="el-icon-plus" :disabled="addBan" @click="handleAdd">添加</el-button>

              </div>
              <!--          <el-button size="mini" @click="resetFormSearch">重置</el-button>-->
            </div>
            <template #custom="data">
              <div v-if="data.props=='msgtype'">
                <show-dict-data :options="dict.type.markdown_type" :value="data.custom.msgtype" />
              </div>
            </template>
          </sg-table>
          <sgDialog :title="dialogTitle" size="1000px" :dialog="showDialog" v-if="showDialog" @handleClose="handleClose">
            <div slot="out">
              <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="95px" label-position="right">
                <div style="display: flex;justify-content: space-between;">
                  <el-form-item label="模板名称" prop="makName" >
                    <el-input clearable v-model.number="form.makName" style="width: 360px;"></el-input>
                  </el-form-item>
                  <el-form-item label="企业应用id" prop="agentid">
                    <el-input v-model.number="form.agentid"  clearable oninput="value=value.replace(/^(0+)|[^\d]+/g,'')" style="width: 360px;"></el-input>
                  </el-form-item>
                </div>
                <div style="display: flex;justify-content: space-between;">
                  <el-form-item label="用户id" prop="userid">
<!--                    修改用户id为可输入搜索-->
                    <el-select   v-model="form.userid" filterable :filter-method="selectInput"  multiple   style="width: 360px;" size="mini"   placeholder="请选择用户id" @change="changeselect">
                      <el-option
                        v-for="item in selectList"
                        :key="item.userid"
                        :label="item.name"
                        :value="item.userid"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="消息类型" prop="msgtype">
                    <el-select  v-model="form.msgtype"  style="width: 360px;" size="mini" clearable filterable  placeholder="请选择消息类型">
                      <el-option
                        v-for="item in dict.type.markdown_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <el-form-item label="内容" prop="type">
                  <div>
                    <mavon-editor
                      v-model="content"
                      ref="md"
                      @change="change"
                      style="min-height: 300px"
                      :toolbars="toolbars"
                    />
                  </div>
                </el-form-item>
                <el-form-item label="标签" prop="type">
                  <div style="display: flex;flex-wrap: wrap">
                    <div v-for="(item,index) in TagList" :key="index" style="margin-right: 10px;margin-bottom: 10px">
                      <el-tooltip class="item" effect="dark" :content="item.pushTags" placement="top-start">
                        <el-button type="primary" plain @click="addTag(item.pushTags)">{{ item.pushPrompt }}</el-button>
                      </el-tooltip>
                    </div>
                  </div>


                  <!--              <el-button type="primary" plain @click="addTag('age')">age</el-button>-->
                </el-form-item>
                <div style="text-align: right">
                  <el-button type="primary" :loading="submitLoading" size="mini" @click="submitForm">确认</el-button>
                  <el-button @click="showDialog = false" size="mini">取消</el-button>
                </div>
              </el-form>
            </div>
          </sgDialog>
        </div>
      </template>

    </Tree>
  </div>

</template>

<script>
import sgTable from '@/components/Table'
import Treeselect from '@riophae/vue-treeselect'
import sgDialog from '@/components/Dialog'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import toolbars from '@/utils/markDownToolbars'
import Tree from '@/components/newTree/index'
import PinyinMatch from "pinyin-match";

export default {
  dicts: ['markdown_type'],
  name: 'wxNumber',
  components: {
    sgTable,
    Tree,
    Treeselect,
    sgDialog,
    mavonEditor
  },
  data() {
    var validateType = (rule, value, callback) => {
      if (this.form.type === undefined || this.form.type.length <= 0) {
        callback(new Error('请选择渠道'))
      }
      callback()
    }
    return {
      toolbars: toolbars,  // markdown提示栏
      deptName: undefined,
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ids: [],
      submitLoading: false,
      selectBoxDisabled: false,
      // 类型渠道数据
      typeData: [],
      props: { multiple: true },

      dialogTitle: undefined,
      showDialog: false,
      deptTypeData: [],
      // 分页 搜索
      pagination: {
        show: true,
        deptId: undefined,
        pageSize: 20,
        pageNum: 1,
        currentPage: 1
      },
      showDataDialog: false,
      tableData: [],
      // 表单数据
      form: {
        deptId: '',
        agentid:'',
        userid:[],
        msgtype:'',
        makName:''
      },
      rules: {
        agentid: [{ required: true, message: '企业应用id不能为空', trigger: 'blur' }],
        userid: [{ required: true, message: '用户id不能为空', trigger: 'blur' }],
        msgtype: [{ required: true, message: '消息类型不能为空', trigger: 'blur' }],
        makName: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
      },
      // 表格数据列
      columns: [
        {
          lab: '模板名称',
          val: 'makName'
        },
        {
          lab: 'makID',
          val: 'makId',
          width:100
        },
        {
          lab: '接收人姓名',
          val: 'names'
        },
        {
          lab: '消息类型',
          val: 'msgtype',
          custon:'msgtype'
        },
        {
          lab: '内容',
          val: 'content',
          showOverflowTooltip:true
        },
        {
          lab: '创建人',
          val: 'createBy'
        },
        {
          lab: '创建时间',
          val: 'createTime'
        },
      ],
      // 操作列
      operate: {
        name: '操作',
        width: '100',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['client:markdownTemplates:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['client:markdownTemplates:remove']
          }

        ]
      },
      content:'',
      html: '',
      selectList:[],
      recordselectList:[],//记录用户id
      addBan:true
    }
  },
  watch: {
    // 根据名称筛选公司树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeselect()
    this.getType()
    this.getTag()
    this.getOption();
  },
  methods: {
    selectInput(val){
      if (val) {
        //取值
        this.selectList=this.recordselectList;
        let newlist = this.selectList.filter((item) => {
          if (item.name.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }

          return PinyinMatch.match(item.name, val)
        })
        //赋值
       this.selectList=newlist
      } else {
        this.selectList=this.recordselectList;
      }
    },
    changeselect(e){
      this.form.userid=e;
      this.$forceUpdate()
    },
    changeCompay(id,item){

      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      this.pagination.pageSize = 20
      if (item.children!==undefined){
        this.addBan = true
      }else {
        this.addBan = false
        this.pagination.deptId=id
        this.getData()
      }
      // this.$store.dispatch('department', { departmentId: id })


    },
    getTag(val){
      this.$api.modules.systemset.pushLabelInfo().then(res=>{
        if (res.code==200){
          this.TagList=res.rows
          console.log(res)
        }
      })
    },
    addTag(e){
      this.content=this.content+e+' '
    },
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render
    },
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.deptChannel)
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
    },
    getOption(){
      const query={
        deptId:this.pagination.deptId
      }
      this.$api.modules.systemset.wechatUserList({...query}).then(res => {
        if (res) {
          this.selectList = res.rows
          this.recordselectList=this.selectList//将用户id保存起来，用于搜索展示
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 添加
    handleAdd() {

      if (this.pagination.deptId==1){
        this.$message.warning('请选择公司')
        return
      }
      this.form= {
        deptId: '',
          agentid:'',
          userid:[],
          msgtype:'',
        makName:''
      },
        this.content=''
      // this.getOption()
      this.showDialog = true
      this.dialogTitle = '添加模板'
    },
    // 分页
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    // 节点点击事件
    handleNodeClick(data) {
      if (this.pagination.deptId !== data.id) {
        this.pagination.deptId = data.id
        if (data.children == undefined){
          this.getData()
        }
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 操作列
    operateClick(e) {
      switch (e[0].lab) {
        case '删除':
          this.handleDelete(e[1])
          break
        case '修改':
          this.handlecompile(e[1])
      }
    },
    handlecompile(e) {

      // this.getOption()
      this.dialogTitle = '修改模板'
      this.form = e
      this.content=e.content
      this.$set(this.form,'userid',e.touser.split('|'))
      this.showDialog = true
      this.$forceUpdate()
    },
    // 删除操作
    handleDelete(e) {
      const makId = e.makId
      this.$confirm('是否确认删除编号为' + makId + '的数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.modules.systemset.markdownTemplatesDelete(makId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    // 重置表单
    resetForm(form) {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
        this.form = {
          deptId: undefined,
          type: undefined
        }
      }
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.dialogTitle === '添加模板') {
            const data = {
              deptId: this.pagination.deptId,
              content: this.content,
              agentid:this.form.agentid,
              msgtype:this.form.msgtype,
              touser:this.form.userid,
              makName:this.form.makName,
            }
            data.touser=data.touser.toString().replaceAll(",", "|")
            this.$api.modules.systemset.markdownTemplatesAdd(data).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.showDialog = false
                this.getData()
              }
            }).finally(() => {
              this.submitLoading = false
            })
          } else if(this.dialogTitle === '修改模板'){
            const query = {
              deptId: this.pagination.deptId,
              content: this.content,
              agentid:this.form.agentid,
              msgtype:this.form.msgtype,
              touser:this.form.userid,
              makId:this.form.makId,
              makName:this.form.makName
            }
            this.$set(query, 'userid',this.form.userid)
            query.touser=query.touser.toString().replaceAll(",", "|")
            this.$api.modules.systemset.markdownTemplatesPut(query).then(res => {
              if (res) {
                this.$message.success(res.msg)
                this.showDialog = false
                this.getData()
              }
            }).finally(() => {
              this.submitLoading = false
            })
          }
        }
      })
    },
    /** 查询公司下拉树结构 */
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.pagination.deptId = res.data[0].id
          this.deptOptions = res.data
          this.getData()
        }
      })
    },
    resetFormSearch() {
      this.pagination.typeId = undefined
      this.getData(true)
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        if (this.pagination.deptId==1){
          this.$message.warning('请选择公司查询')
          return
        }
      }
      this.showDataDialog = true
      this.$api.modules.systemset.markdownTemplates(this.pagination).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    getType() {
      this.$api.modules.channel.noPageTypeList({ status: '0' }).then(res => {
        if (res) {
          this.deptTypeData = res.rows
          this.$api.modules.channel.noPageList({ status: '0' }).then(sres => {
            if (sres) {
              res.rows.forEach(item => {
                item.children = []
                item.value = item.typeId
                item.label = item.typeName
                sres.rows.forEach(citem => {
                  if (item.typeId === citem.typeId) {
                    citem.value = citem.channelId
                    citem.label = citem.channelName
                    item.children.push(citem)
                  }
                })
              })
              this.typeData = res.rows
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.department-list {
  width: 250px;
  padding: 5px;
  box-sizing: border-box;

  .down-tree {
    height: 730px;
    display: block;
    overflow-y: scroll;
  }

  .el-tree {
    background-color: #f8f8f8;
  }
}
.dept-table{
  width: calc(100% - 0px);
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}


</style>
