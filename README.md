# 时光集团业务管理系统 前端开发文档

## 1.生产环境：

| 插件  |  vue   | vue-cli  | node | elementUi | axios | vue-router | js-cookie| sass |
| ---- |  ----  | ----  | ---- | ---- | ---- | ---- | ---- | ---- |
|  版本 | ^2.6.11 | ^4.5.0 | ^12.21.0 | ^2.15.6 | ^0.24.0 | ^3.5.3 | ^3.0.1 | ^1.26.2 |


## 2. 项目目录结构

```
├── build                      # 构建相关
├── plop-templates             # 基本模板
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 全局公用组件
│   ├── directive              # 全局指令
│   ├── icons                  # 项目所有 svg icons
│   ├── layout                 # 全局 layout
│   ├── plugins                # 权限相关 
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
├── tests                      # 测试
├── .env                       # 环境变量配置
├── .env.development           # 开发环境
├── .env.production            # 正式环境
├── vue.config.js              # vue-cli 配置
└── package.json               # package.json 
```

## 3. 安装

```
    cd shiguang             # 进入项目根目录
    
    npm install             # 安装依赖
    
    npm run serve           # 运行项目
```

## 4. api说明
 ```
 ├── api
 │   ├── dict       字典相关api
 │   │── login      登录相关api
 │   │── modules    api 模块文件
 │   │── sysManger  系统管理相关api
 │── api            api入口文件，除了在modules中的文件外，所有api模块都需要在api入口文件中引入
 │── menu           菜单相关api
 │── request        是将utils中得 request在次封装
 ```
+ 注：新增得api模块直接写在modules中，不用在api入口文件中引入，模块会自动引入
```
页面接口请求实例

this.$api.login.login(data).then(res=>{
    console.log(res)
}).catch(err=>{
    console.log(err)
})
```

## 5. assets静态资源文件
    存放静态相关文件，如 图片，css ,js等

## 6. 组件 components

 ```
 ├── components
 │   │── CardListMenu       显示菜单最后一级得列表
 │   │── Dialog             弹窗
 │   │── DictData           获取字典数据的组件
 │   │── DictTag            用于显示字典的组件
 │   │── InnerLink          页面跳转的组件
 │   │── LocalScreen        锁屏
 │   │── ManualSubmission   手工上报回访       
 │   │── ReturnRecord       回访记录
 │   │── SendMessage        发送短信
 │   │── ShowDictData       用于显示字典id对应数据的组件
 │   │── SlideSearchBar     侧边搜索栏
 │   │── Table              表格组件 基本与elementui table 方法等类似
 │   │── Waterfall          瀑布流组件
 |   |—— Print              打印
 ```

## 7.全局自定义指令

```
├── directive
│   │── permission       权限相关
│   │    │── hasPermi    操作权限处理
│   │    │── hasRole     角色权限处理
│   │── index            注册指令

```
## 8. 图标 icon

## 9. layout 系统整体布局
```
├── layout
│   │── components        组件
│   │    │── HeaderBar    头部导航
│   │    │── MenuBar      菜单
│   │    │── TagsView     快捷导航
│   │── index             layout入口文件

```

## 10. plugins 权限验证相关函数

    验证是否有相关权限

## 11. 路由 router

```
├── router
│   │── modules           
│   │    │── constantRoutes     固定路由文件
│   │── index                   router入口文件以及相关配置

```

## 12. store vuex相关

```
├── store
│   │── modules           
│   │    │── permission     权限相关
│   │    │── userInfo       用户信息相关
│   │── getters             vuex getters相关
│   │── index               vuex入口文件

```

## 13. styles 全局scss

```
├── styles
│   │── index              公共scss样式
│   │── transition         页面切换动画

```

## 14. utils 公共工具包

```
├── utils
│   │── dict                字典相关
│   │── area                全国地址文件
│   │── auth                cookie相关方法
│   │── calculation         根据生日计算年龄
│   │── errorCode           状态码
│   │── linkedList          链表
│   │── request             axios请求封装函数
│   │── shiguang            公共使用方法
│   │── throttleAndDebounce 节流和防抖
│   │── time                时间相关方法
│   │── validate            公共表单验证规则

```

## 15. views 页面

```
├── views
│   │── customer                客户管理相关
│   │    │── netPower             网电管理
│   │    │── returnVisit          回访管理
|   |
│   │── error                   错误页
│   │── index                   首页
│   │── login                    登录相关
|   |
│   │── project                 项目相关
│   │    │── bookProject          预约项目
|   |
│   │── sysManger               系统管理相关
│   │    │── channel              渠道管理
│   │    │── custLabel            顾客标签
│   │    │── filing               建档类型
│   │    │── sysComponents        系统组件
│   │    │── sysManger            系统管理相关
|   |    |
│   │── redirect                页面重定向
|   |
|   |——ExamineAndApprove        审批
|   |
|   |——FinancialManagement      财务管理
|   |   |——balanceTableQuery      平衡表查询
|   |   |——cashierManagement      收银管理
|   |   |——performanceManagement  业绩管理
|   |
|   |——WarehouseManagement      库房管理
|   |   |——drugAdministration     药品管理
|   |   |——materialWarehousing    物资出入库
|   |   |——warehouseBasicData     仓库基础数据
|   |   |——warehouseQuery         库房查询
```

## 16. 路由劫持 permission


## 17. 为按钮等添加权限相关操作

+ table 封装的表格中operate列按钮添加权限

```
<sg-table
     
     selection
     size="mini"
     :operate="operate"
     >
</sg-table>

// 操作
      operate: {
        name: '操作',
        width: 210,
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['system:user:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['system:user:remove']
          },
          {
            lab: '重置密码',
            type: 'info',
            permi: ['system:user:resetPwd']
          },
          {
            lab: '分配角色',
            type: 'info',
            permi: ['system:user:edit']
          }
        ]
      }
      
      + 添加permi字段，方括号中添加 需要添加的权限信息
```

+ 页面按钮上添加权限

```
 <el-button
 v-if="scope.row.parentId != 0"
 size="mini"
 type="text"
 icon="el-icon-delete"
 @click="handleDelete(scope.row)"
 v-hasPermi="['system:dept:remove']"
 >删除</el-button>
 
 
 + 使用自定义指令 v-hasPermi 添加对应权限
```


## 18. 后台添加菜单注意事项
 + 菜单列表展示最后一级菜单时，必须组件为 sysManger/sysManger/index，且路由不能重复
 	 				 <view class="" style="width: 680rpx;height: 600px;">
		 				 	<view class="container_middle" style="height:180px;" v-for="(item,index) in leavelList " >
		 				 		<view class="partgoal">
		 				 			<text class="goal">
		 				 				<text class="shu"></text>
		 				 				<text style="margin-left: 20rpx;">来院信息</text> <text style="margin-left: 20rpx;">{{item.returnVisit}}</text>  </text>
		 				 		</view>
		 				 		<view class="guest">
		 				 			<text class="Times" style="left:20rpx;font-size: 24rpx;">来院时间</text>
		 				 			<view class="" class="Times">
		 				 				{{item.receptionTime}}
		 				 			</view>
		 				 		</view>
		 						
		 						<view class="guest" style="margin-top: 50rpx;">
		 							<text class="Times" style="left:20rpx;font-size: 24rpx;">客户状态</text>
		 							<view class="" class="Times">
		 								{{customState(item.customerStatus)}}
		 							</view>
		 						</view>
		 						<view class="guest" style="margin-top: 50rpx;">
		 							<text class="Times" style="left:20rpx;font-size: 24rpx;">是否二次来院</text>
		 							<view class="" class="Times">
		 								{{ customFrequency(item.isSecondary) }}
		 							</view>
		 						</view>
		 						<view class="guest" style="margin-top: 50rpx;">
		 							<text class="Times" style="left:20rpx;font-size: 24rpx;">科室</text>
		 							<view class="" class="Times">
		 							{{ item.departmentName==undefined?'':item.departmentName }}
		 							</view>
		 						</view>
		 						<view class="guest" style="margin-top: 50rpx;">
		 							<text class="Times" style="left:20rpx;font-size: 24rpx;">美学顾问</text>
		 							<view class="" class="Times">
		 								{{ item.acName==undefined?'':item.acName }}
		 							</view>
		 						</view>
		 	<!-- 						<view class="guest" style="margin-top: 50rpx;">
		 								<text class="Times" style="left:20rpx;font-size: 24rpx;">咨询备注</text>
		 								<view class="" class="Times">
		 							{{ item.consultationNotes==undefined?'':item.consultationNotes }}
		 								</view>
		 				 		</view> -->
		 				 	</view>
		 				 </view>
<template>
	<view class="" style="position: fixed;height: 100%;background-color: #f9f9fc;">
		<view class="search">
			<view class="search_left" v-for="(item,index) in list" :key="index" :style="{marginLeft:index>0?'20rpx':'',background:item.back,color:item.color}" @click="change(index)">
				{{item.label}}
			</view>
		</view>
		<scroll-view style="height: 684px;" scroll-y="true" @scroll="scroll">
			<view class="container_middle" style="height:180px;"  v-for="(item,index) in infant" :key="index">
				<view class="partgoal">
					<text class="goal">
						<text class="shu"></text>
						<text style="margin-left: 20rpx;">{{item.name}}</text> <text style="margin-left: 20rpx;"></text>  </text>
				</view>
				<view class="project_item" >
				       <view class="project_item_children" v-for="(newitem,indexs) in item.values" :key="indexs">
				       	    <view class="" style="width: 100%;height: 45rpx;border: 1px solid red;display: flex;align-items: center;font-size: 24rpx;">
				       	    	<text style="margin-left: 20rpx;display: inline-block;width: 250rpx;border: 1px solid black;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">项目名称：{{newitem.projectName}}</text>
								<text >发起时间：{{newitem.checkoutTime}}</text>
				       	    </view>
							<text style="font-size: 24rpx;">实际操作人:{{newitem.customerName}}</text>
				       </view>
				</view>
				</view>
				</scroll-view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				deptId:"",
				id:"",
				infant:[],
				list:[{
					label:"项目排期",
					back:"#45d294",
					color:"#fff"
				}],
			}
		},
		onLoad() {
				this.deptId = uni.getStorageSync('deptId');
				this.id = uni.getStorageSync('id');
			this.$axios('/share/departmentInfo/list', {
				deptId: '4',
			}, 'GET').then(res => {
				res.rows.forEach(value => {
					if (value.isDepartment == '0') {} else {
						let object = {
							name: value.departmentName,
							values: [],
							departmentId: value.departmentId
						};
						this.infant.push(object)
						
					}
				})
				console.log(this.infant,'哈哈哈')
				this.$axios('/payment/wforservice/skinTriageList', {
					deptId:'4',
					id:'15378',
				}, 'GET').then(res => {
					console.log(res,'sdhfjshf')
					res.rows.forEach(value => {
						this.infant.forEach(newvalue => {
							if (value.departmentId == newvalue.departmentId) {
								newvalue.values.push(value)
							}
						})
			
					})
				})
			})
		},
		methods:{
			scroll(e){
				
			}
		}
	}
</script>

<style>
	.project_item_children{
		width: 100%;
		height: 100rpx;
		border: 1px solid black;
		/* background-color: ; */
	}
	.project_item{
		width:650rpx;
		height:250rpx;
		margin-left: 25rpx;
		border: 1px solid #eee;
		margin-top: 20rpx;
	}
	.Times {
			position: absolute;
			font-size: 20rpx;
			right: 20rpx;
			margin-top: 5rpx;
		}
		.partgoal {
			margin-left: 20rpx;
			margin-top: 20rpx;
			font-family: MicrosoftYaHei;
			font-weight: 700;
			position: relative;
		}
		.shu {
			width: 10rpx;
			height: 30rpx;
			display: inline-block;
			position: absolute;
			margin-top: 8rpx;
			background-color: #45d294;
			border-radius: 25rpx;
		}
		
		.guest {
			margin-left: 20rpx;
			font-size: 28rpx;
			color: #959595;
			margin-top: 30rpx;
			position: relative;
			display: flex;
			align-items: center;
		
		}
		.search{
			width: 700rpx;
			height: 40px;
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			margin-left: 40rpx;
			
		}
		.container_middle {
			width: 700rpx;
			border: 1px solid #eee;
			margin-left: 25rpx;
			background-color: #fff;
			border-radius: 12rpx;
			overflow: hidden;
			margin-top: 10px;
		}
		.search_left{
			width: 150rpx;
			height: 40rpx;
			border-radius: 20rpx;
			font-size: 28rpx;
			text-align: center;
	/* 		background-color: #45d294;
			color: #fff; */
		}
</style>


<template>

	<view class="my_read">
		<view class="my">
			<view class="my_header">
				<image src="../../static/avator.png" mode=""
					style="border-radius: 50%;height: 100rpx;width: 100rpx;margin-left: 20rpx;"></image>
				<text style="margin-left: 20rpx;color: #fff;">李磊</text>
				<view class="back" @click="back">退出</view>
			</view>
			<view style="margin-left: 20rpx;color: #fff;font-size: 28rpx;">机器码:</view>
			<view style="margin-left: 20rpx;color: #fff;">
				<text style="font-size: 28rpx;">机器码</text><text class="copy">复制</text>
			</view>

			<view class="newmy_contain">
				<!-- 	<view class="my_contain">
		  		<image src="../../static/CRM.png" mode="" style="width: 50rpx;height: 50rpx;margin-left: 20rpx;"></image>
		  		<text class="Left">是否支持CRM直接拨打</text>
		  	      <switch checked @change="switch1Change" style="margin-left: 200rpx;" />
		  		
		  	</view>
		  	<view class="my_contain">
		  		<image src="../../static/message.png" mode="" style="width: 50rpx;height: 50rpx;margin-left: 20rpx;"></image>
		  		<text class="Left">是否默认拨打设备</text>
		  		 <switch checked @change="switch1Changes" style="margin-left: 280rpx;" />
		  	</view> -->
				<view class="my_contain">
					<image src="../../static/people.png" mode="" style="width: 50rpx;height: 50rpx;margin-left: 20rpx;">
					</image>
					<text class="Left">切换组织:</text>
					<text>兰州时光激光整形美容医院</text>
					<image src="../../static/right.png" mode="" style="width: 50rpx;height: 50rpx;margin-left: 70rpx;">
					</image>
				</view>
				<!-- 	<view class="my_contain">
		  		<image src="../../static/record.png" mode="" style="width: 40rpx;height: 30rpx;margin-left: 20rpx;"></image>
		  		<text class="Left">录音文件路径:/Record/call</text>
		  		<image src="../../static/right.png" mode="" style="width: 50rpx;height: 50rpx;margin-left: 210rpx;"></image>
		  	</view>
		  	<view class="my_contain">
		  		<image src="../../static/success.png" mode="" style="width: 50rpx;height: 50rpx;margin-left: 20rpx;"></image>
		  		<text class="Left">录音上传查询</text>
		  		<image src="../../static/right.png" mode="" style="width: 50rpx;height: 50rpx;margin-left: 400rpx;"></image>
		  	</view>
		  	<view class="my_contain">
		  		<image src="../../static/success.png" mode="" style="width: 50rpx;height: 50rpx;margin-left: 20rpx;"></image>
		  		<text class="Left">软件版本</text>
		  	<image src="../../static/right.png" mode="" style="width: 50rpx;height: 50rpx;" class="Image"></image>
		  	</view> -->
				<!-- 			<view class="my_contain" @click="toTest">
				<view style="margin-left: 20rpx;"><u-icon name="info-circle-fill" color="#2979ff" size="30"></u-icon></view>
				<text class="Left">测试功能</text>
			<image src="../../static/right.png" mode="" style="width: 50rpx;height: 50rpx;" class="Image"></image>
			</view> -->
			</view>

<u-popup :show="show" @close="close" @open="open">
            <view>
   <ly-tree :tree-data="treeData" :ready="ready" node-key="id" @node-expand="handleNodeExpand"
   	@node-click="handleNodeClick">
   </ly-tree>
            </view>
		</u-popup>

		</view>
	</view>
</template>

<script>
	import LyTree from '@/components/ly-tree/ly-tree.vue'
	export default {
		components: {
			LyTree
		},
		data() {
			return {
				value: true,
				ready: false, // 这里用于自主控制loading加载状态，避免异步正在加载数据的空档显示“暂无数据”
				treeData: [],
				show:true,
			}
		},
		onLoad() {
	this.$axios('/system/dept/list',{
		status: '0'
	},'GET').then(res=>{
		console.log(res,'dshajdhsahd')
	})
				this.treeData = [{
					id: 1,
					label: '一级 1',
					children: [{
						id: 11,
						label: '二级 1-1',
						children: [{
							id: 111,
							label: '三级 1-1-1'
						}]
					}]
				}, {
					id: 2,
					label: '一级 2',
					children: [{
						id: 21,
						label: '二级 2-1',
						children: [{
							id: 211,
							label: '三级 2-1-1'
						}]
					}, {
						id: 22,
						label: '二级 2-2',
						children: [{
							id: 221,
							label: '三级 2-2-1'
						}]
					}]
				}, {
					id: 3,
					label: '一级 3',
					children: [{
						id: 31,
						label: '二级 3-1',
						children: [{
							id: 311,
							label: '三级 3-1-1'
						}]
					}, {
						id: 32,
						label: '二级 3-2',
						children: [{
							id: 321,
							label: '三级 3-2-1'
						}]
					}]
				}];

				this.ready = true;
		},
		methods: {
			handleNodeClick(obj) {
				// console.log('handleNodeClick', JSON.stringify(obj));
			},
			handleNodeExpand(obj) {
				// console.log('handleNodeExpand', JSON.stringify(obj));
			},
			close(){
				
			},
			open(){
				
			},
			toTest() {
				uni.navigateTo({
					url: '/pages/test/test'
				})
			},
			switch1Change() {

			},
			switch1Changes() {

			},
			back() {
				var that = this
				uni.showModal({
					title: "确定退出登录吗?",
					success: function(res) {
						if (res.confirm) {
							that.$api.login.logout().then(res => {
								console.log('fffff,', res)
								if (res.code == 200) {
									uni.navigateTo({
										url: '../login/index'
									})
								}
							})

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			}
		}

	}
</script>

<style>
	.Image {
		margin-left: 460rpx;
	}

	.Left {
		margin-left: 20rpx;
	}

	.my_contain {
		width: 750rpx;
		height: 100rpx;
		border: 1px solid #eee;
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		background-color: #fff;

	}

	.my {
		width: 750rpx;
		height: 200rpx;
		background-color: #36c2aa;

	}

	.my_header {
		width: 750rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
	}

	.back {
		width: 100rpx;
		height: 48rpx;
		text-align: center;
		line-height: 48rpx;
		margin-left: 400rpx;
		background-color: #1f841e;
		border-radius: 15rpx;
		color: #fff;
		font-size: 24rpx;
	}

	.copy {
		width: 80rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		margin-left: 40rpx;
		border: 1px solid #fff;
		color: #fff;
		display: inline-block;
		font-size: 24rpx;
	}

	.newmy_contain {
		background-color: aliceblue;
	}
</style>