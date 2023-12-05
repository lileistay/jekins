<template>
  <!--库房首页-->
  <div style="padding: 10px 20px 5px 20px;background: #f8f8f8;">
    <el-scrollbar class="el-scrollbar">
      <div class="header">
        <!-- 问候语和搜索框 -->
        <el-card class="block" style="margin-bottom: 20px">
          <div class="search">
            <span style="font-weight: 300;font-size: 15px;margin-right: 1px">{{ welcomeMessage }}&nbsp;&nbsp;&nbsp;&nbsp;{{
              nickName
            }}</span>
            <div>
              <el-input
                v-model="searchText"
                style="float: right"
                autocomplete="off"
                size="mini"
                placeholder="搜索库存物资/药品"
                @keyup.enter.native="searchMaterial(true)"
              >
                <template #append>
                  <el-button
                    icon="el-icon-search"
                    style="width: 50px;text-align: center;padding: 0"
                    @click.native.stop="searchMaterial(true)"
                  />
                </template>
              </el-input>
            </div>
          </div>
        </el-card>
        <!-- 数据统计 -->
        <div class="block" style="margin-bottom: 20px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card shadow="none">
                <div class="name">库存成本</div>
                <div class="num">{{ statistic.stockCost |numberToCurrency }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="none">
                <div class="name"> 库存告急</div>
                <div class="num_red">{{ statistic.materialWarning |numberToCurrency }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="none">
                <div class="search">
                  <div class="name">出库金额</div>
                  <div style="display: flex;flex-wrap: nowrap;float: right">
                    <el-button
                      size="mini"
                      :class="{ buttonbg: timeType === 'day' }"
                      style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none;"
                      @click="getStatistic('day')"
                    >日
                    </el-button>
                    <el-button
                      size="mini"
                      :class="{ buttonbg: timeType === 'month' }"
                      style=" height: 25px;border-radius: 0 8px 8px 0;border-left: none"
                      @click="getStatistic('month')"
                    >月
                    </el-button>
                  </div>
                </div>
                <div class="num">{{ statistic.outAmount |numberToCurrency }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="none">
                <div class="search">
                  <div class="name">入库金额</div>
                  <div style="display: flex;flex-wrap: nowrap;float: right">
                    <el-button
                      size="mini"
                      :class="{ buttonbg: timeType === 'day' }"
                      style="height: 25px; margin-right: -10px;border-radius: 8px 0 0 8px;border-right: none;"
                      @click="getStatistic('day')"
                    >日
                    </el-button>
                    <el-button
                      size="mini"
                      :class="{ buttonbg: timeType === 'month' }"
                      style=" height: 25px;border-radius: 0 8px 8px 0;border-left: none"
                      @click="getStatistic('month')"
                    >月
                    </el-button>
                  </div>
                </div>
                <div class="num">{{ statistic.insertAmount |numberToCurrency }}</div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <div class="block">
          <el-card shadow="none">
            <!--                 <div>常用功能 </div>-->
            <div class="route">
              <div v-has-permi="['sorage:insertInfo:add']" class="route-item">
                <router-link :to="{path:'Warehousing'}">
                  <div class="icon"><i class="el-icon-sell" /></div>
                  <div>入库</div>
                </router-link>
              </div>
              <div v-has-permi="['sorage:outList:list']" class="route-item">
                <router-link :to="{path:'exWarehouse'}">
                  <div class="icon"><i class="el-icon-sold-out" /></div>
                  <div>出库</div>
                </router-link>
              </div>
              <div v-has-permi="['sorage:ineysheetInfo:add']" class="route-item">
                <router-link :to="{path:'inventoryMaterials'}">
                  <div class="icon"><i class="el-icon-coin" /></div>
                  <div>盘点</div>
                </router-link>
              </div>
              <div v-has-permi="['sorage:removeInfo:add']" class="route-item">
                <router-link class="" :to="{path:'materialTransfer'}">
                  <div class="icon"><i class="el-icon-receiving" /></div>
                  <div>移库</div>
                </router-link>
              </div>
              <div v-has-permi="['sorage:outInfo:list']" class="route-item">
                <router-link class="" :to="{path:'IssueDocQuery'}">
                  <div class="icon"><i class="el-icon-document-checked" /></div>
                  <div>查出库单</div>
                </router-link>
              </div>
              <div v-has-permi="['sorage:insertInfo:list']" class="route-item">
                <router-link class="" :to="{path:'receiptDocQuery'}">
                  <div class="icon"><i class="el-icon-document" /></div>
                  <div>查入库单</div>
                </router-link>
              </div>
              <div v-has-permi="['sorage:storehouseInfo:list']" class="route-item">
                <router-link class="" :to="{path:'inventoryQuery'}">
                  <div class="icon"><i class="el-icon-guide" /></div>
                  <div>进销存</div>
                </router-link>
              </div>
              <div v-has-permi="['sorage:materialInfo:list']" class="route-item">
                <router-link class="" :to="{path:'inventoryDetails'}">
                  <div class="icon"><i class="el-icon-notebook-2" /></div>
                  <div>明细查询</div>
                </router-link>
              </div>
            </div>
          </el-card>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="物资低库存预警" name="first">
            <el-card shadow="none" class="block">
              <div class="seacr" style="justify-content: space-between">
                <div>物资低库存预警</div>
                <div style="width: 710px;display: flex">
                  <div style="margin-left: 50px;font-size: 12px">
                    物资名称：
                    <el-input v-model="materialName" size="mini" style="width: 150px" clearable placeholder="请输入物资名称"></el-input>
                  </div>
                  <div style="margin-left: 20px;font-size: 12px" class="tabblenew">
                    库存剩余：
                    <el-input-number v-model="remnantInventory" size="mini" :min="0" clearable placeholder="请输入库存剩余" style="width: 50"></el-input-number>
                  </div>
                  <div style="font-size: 12px;margin-left: 50px">
                    <span>库房：</span>
                    <el-select
                      v-model="warehousesId"
                      size="mini"
                      :clearable="true"
                      filterable
                      placeholder="请选择库房"

                      style="width: 130px"
                    >
                      <el-option
                        v-for="item in warehouses"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <el-button type="primary" size="mini" style="margin-left: 20px" @click="Search">搜索</el-button>
                </div>

              </div>
              <el-table size="mini" height="400" :border="true" :stripe="true" :data="stockWarningData">
                <el-table-column type="index" label="编号" align="center" />
                <el-table-column prop="materialName" label="物资名称" width="250" align="center" >
                  <template #default="scope">
                    <a v-if="checkPermi(['statistics:storageStatistic:DrugReceiveStatistics'])" @click.stop="toStatistic(scope.row.materId,scope.row.materialName)">{{ scope.row.materialName }}</a>
                    <p v-else>{{ scope.row.materialName }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="物资别名" prop="materialCode" align="center" width="250" show-overflow-tooltip>

                </el-table-column>
                <el-table-column label="所在库房" prop="whouseName" align="center" />
                <el-table-column label="库存剩余" prop="remnantInventory" align="center" />
                <el-table-column label="物资编码" prop="shortCode" align="center" width="200">
                </el-table-column>
                <el-table-column label="物资类别" prop="materialType" align="center">
                  <template #default="scope">
                    <dict-tag :options="dict.type.Material_category" :value="scope.row.materialType" />
                  </template>
                </el-table-column>
                <el-table-column label="库存数量" prop="inventoryQuantity" align="center" />
                <el-table-column label="最小库存" prop="minStock" align="center" />
                <el-table-column label="物资规格" prop="materialSpec" align="center" width="200" />
                <el-table-column label="单位" prop="unitName" align="center" />
                <el-table-column label="一级类型" prop="materialTypeName" align="center" />
                <el-table-column label="二级类型" prop="typeName" align="center" />
                <el-table-column label="三级类型" prop="matTypeName" align="center" />
                <el-table-column label="是否关键物资" prop="isMaterial" align="center" width="100">
                  <template #default="scope">
                    <el-tag v-if="scope.row.isMaterial ==='0'" type="success">是</el-tag>
                    <el-tag v-else type="info">否</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="是否产品" prop="porjectFlag" align="center">
                  <template #default="scope">
                    <span>{{ scope.row.porjectFlag === '1' ? '是' : '否' }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                style="text-align: center;margin-top: 10px"
                size="mini"
                :background="true"
                :page-sizes="[20, 30, 40, 50]"
                :page-size.sync="pagination.pageSize"
                :layout="'total, sizes, prev, pager, next, jumper'"
                :total="pagination.total"
                :current-page.sync="pagination.pageNum"
                @size-change="getStockWarning(null)"
                @current-change="getStockWarning(null)"
              />
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="物资临期/过期预警" name="second">
            <el-card shadow="none" class="block">
              <div class="seacr" style="display: flex;justify-content: space-between">
                <div style="float: left">物资临期/过期预警</div>
                <div style="display: flex;align-items: center;width: 1200px">
                  <div style="margin-left: 50px;font-size: 12px">
                    物资名称：
                    <el-input v-model="materialNames" size="mini" style="width: 150px" clearable placeholder="请输入物资名称"></el-input>
                  </div>
                  <div style="margin-left: 20px;font-size: 12px" class="tabblenew">
                    库存剩余：
                    <el-input-number v-model="remnantInventorys" size="mini" :min="0" clearable placeholder="请输入库存剩余" style="width: 50"></el-input-number>
                  </div>
                  <span class="span" style="margin-left: 50px">预警周期：</span>
                  <el-date-picker
                    v-model="expireTime"
                    size="mini"
                    class="inputWidth"
                    type="datetimerange"
                    align="right"
                    unlink-panels
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    :default-time="['00:00:00', '23:59:59']"

                  />
                  <span class="span">库房：</span>
                  <el-select
                    v-model="expireWarehousesId"
                    size="mini"
                    filterable
                    :clearable="true"
                    placeholder="请选择库房"

                    style="width: 130px"

                  >
                    <el-option
                      v-for="item in warehouses"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-button type="primary" size="mini" style="margin-left: 20px" @click="searchnow">搜索</el-button>
                </div>
              </div>
              <el-table size="mini" height="400" :border="true" :stripe="true" :data="expireWarningData">
                <el-table-column type="index" align="center" label="编号" />
                <el-table-column prop="materialName" label="物资名称" width="250" align="center" show-overflow-tooltip>
                  <template #default="scope">
                    <a v-if="checkPermi(['statistics:storageStatistic:DrugReceiveStatistics'])" @click.stop="toStatistic(scope.row.materId,scope.row.materialName)">{{ scope.row.materialName }}</a>
                    <p v-else>{{ scope.row.materialName }}</p>
                  </template>
                </el-table-column>

                <el-table-column label="物资别名" prop="materialCode" align="center" width="200" show-overflow-tooltip />
                <el-table-column label="所在库房" prop="whouseName" align="center" />
                <el-table-column label="库存剩余" prop="remnantInventory" align="center" />
                <el-table-column label="物资编码" prop="shortCode" align="center" width="200" />
                <el-table-column label="物资类别" prop="materialType" align="center">
                  <template #default="scope">
                    <dict-tag :options="dict.type.Material_category" :value="scope.row.materialType" />
                  </template>
                </el-table-column>
                <el-table-column label="入库单号" prop="inDocumentNo" align="center" width="150"/>
                <el-table-column label="存货数量" prop="availableNumber" align="center" />
                <el-table-column label="有效期始" prop="startTime" align="center" width="100"/>
                <el-table-column label="有效期止" prop="endTime"  align="center" width="100"/>
                <el-table-column label="物资规格" prop="materialSpec" align="center" />
                <el-table-column label="单位" prop="unitName" align="center" />
                <el-table-column label="一级类型" prop="materialTypeName" align="center" />
                <el-table-column label="二级类型" prop="typeName" align="center" width="150" />
                <el-table-column label="三级类型" prop="matTypeName" align="center" />
                <el-table-column label="是否关键物资" prop="isMaterial" width="150" align="center">
                  <template #default="scope">
                    <el-tag v-if="scope.row.isMaterial ==='0'" type="success">是</el-tag>
                    <el-tag v-else type="info">否</el-tag>
                  </template>
                </el-table-column>
                <!--            <el-table-column label="是否产品" prop="porjectFlag">-->
                <!--              <template #default="scope">-->
                <!--                <span>{{ scope.row.porjectFlag === '1' ? '是' : '否' }}</span>-->
                <!--              </template>-->
                <!--            </el-table-column>-->
              </el-table>
              <el-pagination
                style="text-align: center;margin-top: 10px"
                size="mini"
                :background="true"
                :page-sizes="[20, 30, 40, 50]"
                :page-size.sync="paginationExpire.pageSize"
                :layout="'total, sizes, prev, pager, next, jumper'"
                :total="paginationExpire.total"
                :current-page.sync="paginationExpire.pageNum"
                @size-change="getExpireWarning"
                @current-change="getExpireWarning"
              />
            </el-card>
          </el-tab-pane>
        </el-tabs>


        <div />
      </div>
    </el-scrollbar>
    <!-- 搜库存弹窗 -->
    <sg-dialog title="搜索库存物资" size="1200px" :dialog="searchDialog" @handleClose="searchDialogClose">
      <template #out>
        <el-input
          v-model="searchText"
          style="float: right;width: 300px;margin-bottom: 10px"
          autocomplete="off"
          size="mini"
          placeholder="搜索库存物资"
          @keyup.enter.native="searchMaterial(true)"
        >
          <template #append>
            <el-button
              icon="el-icon-search"
              style="width: 50px;text-align: center;padding: 0"
              @click.native.stop="searchMaterial(true)"
            />
          </template>
        </el-input>
        <el-table size="mini" :border="true" :stripe="true" height="400" :data="searchData">
          <el-table-column type="index" align="center" />
          <el-table-column label="物资名称" prop="materialName" />
          <el-table-column label="物资别名" prop="materialCode" />
          <el-table-column label="物资编码" prop="shortCode" />
          <el-table-column label="物资类别" prop="materialType" width="70" align="center">
            <template #default="scope">
              <dict-tag :options="dict.type.Material_category" :value="scope.row.materialType" />
            </template>
          </el-table-column>
          <el-table-column label="库房" prop="whouseName" width="150" />
          <el-table-column label="库存数量" prop="inventoryQuantity" width="70" align="center" />
          <el-table-column label="最小库存" prop="minStock" width="70" align="center" />
          <el-table-column label="物资规格" prop="materialSpec" />
          <el-table-column label="单位" prop="unitName" />
          <el-table-column label="关键物资" prop="isMaterial" width="70" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.isMaterial ==='0'" type="success">是</el-tag>
              <el-tag v-else type="info">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否产品" prop="porjectFlag" width="70" align="center">
            <template #default="scope">
              <span>{{ scope.row.porjectFlag === '1' ? '是' : '否' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center;margin-top: 10px"
          size="mini"
          :background="true"
          :page-sizes="[20, 30, 40, 50]"
          :page-size.sync="searchPagination.pageSize"
          :layout="'total, sizes, prev, pager, next, jumper'"
          :total="searchPagination.total"
          :current-page.sync="searchPagination.pageNum"
          @size-change="searchMaterial"
          @current-change="searchMaterial"
        />
      </template>
    </sg-dialog>
  </div>
</template>

<script>

import {
  monthData,
  monthLater, thisWeek,
  todayTime,
  weekLater,
  yearLater
} from '@/utils/time'
import { checkPermi } from '@/utils/permission' // 权限判断函数
import SgDialog from '@/components/Dialog/index.vue'

export default {
  name: 'StorageIndex',
  components: { SgDialog },
  dicts: ['Material_category'],
  data() {
    return {
      // 欢迎语
      welcomeMessage: '',
      activeName:"first",

      remnantInventory:undefined,
      materialName:"",
      remnantInventorys:undefined,
      materialNames:"",
      // 搜索库存
      searchText: '',
      // 搜索出的数据
      searchData: [],
      // 搜索分页
      searchPagination: {
        pageSize: 20,
        total: 0,
        pageNum: 1
      },
      // 搜素库存弹出框
      searchDialog: false,
      // 库存预警表格数据
      stockWarningData: [],
      // 仓库列表
      warehouses: [],
      // 分页
      pagination: {
        pageSize: 20,
        total: 0,
        pageNum: 1
      },
      // 临期预警的查询库房
      expireWarehousesId: null,
      // 临期预警的查询周期
      expireCycle: 'already',
      // 查询的时间范围
      expireTime: monthData(),
      // 临期预警的查询周期设置
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [
          {
            text: '一周内',
            onClick(picker) {
              picker.$emit('pick', weekLater())
            }
          },
          {
            text: '一月内',
            onClick(picker) {
              picker.$emit('pick', monthLater())
            }
          },
          {
            text: '三月内',
            onClick(picker) {
              picker.$emit('pick', monthLater(3))
            }
          },
          {
            text: '一年内',
            onClick(picker) {
              picker.$emit('pick', yearLater())
            }
          }
        ]
      },
      // 库存到期预警表格数据
      expireWarningData: [],
      // 药品分页
      paginationExpire: {
        pageSize: 20,
        total: 0,
        pageNum: 1
      },
      // 头部统计
      statistic: {
        stockCost: 0,
        materialWarning: 0,
        outAmount: 0,
        insertAmount: 0
      },
      // 预警库房选择框绑定值
      warehousesId: '',
      // 统计时间周期
      timeType: 'month'
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId
      }
    },
    userId: {
      get() {
        return this.$store.getters.user.userId
      }
    },
    nickName: {
      get() {
        return this.$store.getters.user.nickName
      }
    }
  },
  watch: {
    deptId() {
      this.getWarehouse()
      this.getStatistic('month')
      this.getStockWarning()
      this.getExpireWarning()
    }
  },
  created() {
    // 获取有权限的仓库
    this.getWarehouse()
    // 获取头部统计
    this.getStatistic('month')
    // 获取物资和药品库存预警
    this.getStockWarning()
    // 获取物资和药品的临期或过期预警
    // this.getExpireWarning()
  },
  updated() {
    this.welcome()
  },
  methods: {
    checkPermi,
    // 搜索物资
    searchMaterial(isSearch) {
      const data = {
        searchText: this.searchText,
        deptId: this.deptId,
        pageSize: isSearch ? 20 : this.searchPagination.pageSize,
        pageNum: isSearch ? 1 : this.searchPagination.pageNum
      }
      this.$api.storageRoom.searchMaterial(data).then(res => {
        // inventoryQuantity = null表示有物资但是没有在任何库房入库过，过滤掉这些没有库存的物资
        this.searchData = res.rows.filter(item => item.inventoryQuantity !== null)
        this.searchPagination.total = res.total
        this.searchDialog = true
      })
    },
    searchnow(){
      this.getExpireWarning(this.expireWarehousesId)

    },
    handleClick(e){
      if(e.index==1){
        this.getExpireWarning()
      }else{
        this.getStockWarning()
      }
    },
    Search(){
     this.getStockWarning(this.warehousesId)
    },
    // 关闭搜索弹窗
    searchDialogClose() {
      this.searchDialog = false
    },
    // 获取统计数据
    getStatistic(timeType) {
      this.timeType = timeType
      let time = []
      switch (timeType) {
        case 'day':
          time = todayTime()
          break
        default:
          time = monthData()
      }
      const date = {
        deptId: this.deptId,
        startTime: time[0],
        endTime: time[1]
      }
      this.$api.storageStatistic.getHeaderStatistic(date).then(res => {
        this.statistic = res.data
      })
    },
    // 获取库房列表
    getWarehouse() {
      const data = {
        userId: this.$store.getters.user.userId,
        deptId: this.deptId
      }
      this.$api.storageRoom.selectInWarehouseAuthoritiesByUserId(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.whouseName
            item.value = item.whouseId
          })
          this.warehouses = res.data
        }
      })
    },
    // 获取库存预警
    getStockWarning(val) {
      const data = {
        deptId: this.deptId,
        whouseId: val || null,
        // materialType: 0, 0物资 1药品
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        materialName:this.materialName,
        remnantInventory:this.remnantInventory==undefined?'':Number(this.remnantInventory)
      }
      this.$api.storageRoom.stockWarning(data).then(res => {
        this.stockWarningData = res.rows
        this.pagination.total = res.total
      })
    },
    // 获取临期及过期预警
    getExpireWarning() {
      const data = {
        deptId: this.deptId,
        whouseId: this.expireWarehousesId,
        startTime: this.expireTime ? this.expireTime[0] : null,
        endTime: this.expireTime ? this.expireTime[1] : null,
        // materialType: 1,
        pageNum: this.paginationExpire.pageNum,
        pageSize: this.paginationExpire.pageSize,
        materialName:this.materialNames,
        remnantInventory:this.remnantInventorys==undefined?'':Number(this.remnantInventorys)
      }
      this.$api.storageRoom.getExpireWarning(data).then(res => {
        this.expireWarningData = res.rows
        this.paginationExpire.total = res.total
      })
    },
    toStatistic(materId,materialName) {
      this.$router.push({ path: 'materialStatistics', query: { materId: materId,materialName:materialName }})
    },
    // 问候
    welcome() {
      const date = new Date()
      const h = date.getHours()
      switch (true) {
        case h === 0 || h >= 23 && h <= 24:
          this.welcomeMessage = '午夜啦，早点休息喔'
          break
        case h >= 1 && h <= 4:
          this.welcomeMessage = '凌晨啦，注意身体喔'
          break
        case h >= 5 && h <= 6:
          this.welcomeMessage = '清晨啦，准备迎接新的一天吧'
          break
        case h >= 7 && h <= 8:
          this.welcomeMessage = '早上好，记得吃早餐喔'
          break
        case h >= 9 && h <= 10:
          this.welcomeMessage = '上午好，时刻保持好心情呀'
          break
        case h >= 11 && h <= 12:
          this.welcomeMessage = '中午好，午餐时间到啦'
          break
        case h >= 13 && h <= 16:
          this.welcomeMessage = '下午好，别太辛苦了'
          break
        case h >= 17 && h <= 18:
          this.welcomeMessage = '傍晚啦，看看窗外的风景吧'
          break
        case h >= 19 && h <= 22:
          this.welcomeMessage = '晚上好，不要太累啦'
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width:8px !important;
  height: 8px;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  background: transparent;
}
::v-deep .tabblenew  .el-input__inner{
  padding: 0 !important;
  width:100px;
}
::v-deep .tabblenew .el-input-number{
  width: 70px !important;
}
::v-deep .el-input-number__decrease{
  display: none;
}
::v-deep .el-input-number__increase{
  display: none;
}
.block {


  .seacr {
    display: flex;
    margin-bottom: 15px;
  }

  .span {
    margin-left: 20px;
    color: #444343;
    font-size: 12px;
  }

  .search {
    display: flex;
    justify-content: space-between;
  }

  .route {
    display: flex;
    justify-content: start;
    margin-top: 5px;

    .route-item {
      margin: 0 40px;
    }

    .icon {
      text-align: center;
      font-size: 30px;
      color: #1ABC9C;
      text-decoration: none !important;
    }

    a {
      text-decoration: none;
      font-size: 14px;
      color: #434443
    }
  }
}

.header {
  padding: 0 8%;

  .searchbar {
    display: flex;
    justify-content: space-between;
    /*background: #ffffff;*/
    /*padding: 10px 5px;*/

  }
}

.month {
  width: 20px;
  height: 20px;
  background-color: #8f9295;
}

.num {
  font-size: 25px;
  font-weight: bold;
  margin-top: 16px;
}

.num_red {
  font-size: 25px;
  font-weight: bold;
  margin-top: 16px;
  color: #ff0000;
}

.name {
  height: 25px;
  font-size: 14px;
  color: #8f9295;
}

.buttonbg {
  background-color: rgb(242, 242, 242);
  color: #272727;
}
</style>
