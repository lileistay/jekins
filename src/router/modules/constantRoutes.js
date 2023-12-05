import Layout from '@/layout/index'

// 公共路由
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    // redirect: 'index',
    children: [
      // {
      //   path: 'index',
      //   component: () => import('@/views/index'),
      //   name: 'Index',
      //   meta: { title: '首页', icon: 'dashboard', affix: true }
      // },
      /**
       * @author 李尚
       * @date 2022/8/13
       * @Description: 路由权限固定使其分配下的子权限也有该页面
       */
      {
        path: '/customerInfo', // 用户已到院 个人详情
        name: 'customerInfo',
        meta: { title: '已到院个人详情' },
        component: () => import('@/views/ReturnVisitManagement/Components/customerInfo'),
        hidden: true
      },
      {
        path: '/notInHospital', // 用户未到院 个人详情
        name: 'notInHospital',
        meta: { title: '未到院个人详情' },
        component: () => import('@/views/ReturnVisitManagement/Components/notInHospital'),
        hidden: true
      },
      // 添加预约
      {
        path: '/addBuildRecord', // 添加预约
        name: 'addBuildRecord',
        meta: { title: '添加预约' },
        component: () => import('@/views/NetworkPowerManagement/NetworkPowerReservation/addBuildRecord'),
        hidden: true
      },
      // ReturnVisitRecordList
      {
        path: '/ReturnVisitRecordList', // 修改顾客信息
        name: 'ReturnVisitRecordList',
        meta: { title: '修改顾客信息' },
        component: () => import('@/views/NetworkPowerManagement/NetworkPowerReservationQery/returnVisitRecordList'),
        hidden: true
      },
      {
        path: '/modifyReservationForm', // 修改预约单
        name: 'modifyReservationForm',
        meta: { title: '修改预约单' },
        component: () => import('@/views/NetworkPowerManagement/NetworkPowerReservationQery/modifyReservationForm'),
        hidden: true
      },
      // 收费单页面
      // {
      //   path: '/billDetails', // 所有收费单页面
      //   name: 'billDetails',
      //   meta: { title: '收费单详情' },
      //   component: () => import('@/views/FinancialManagement/CashierManagement/billDetails'),
      //   hidden: true
      // },
      // 月子登记治疗 客户需求
      {
        path: '/customerDemand', // 所有客户需求
        name: 'customerDemand',
        meta: { title: '客户需求' },
        component: () => import('@/views/SiteManagement/ReceptionManagement/Components/customerDemand'),
        hidden: true
      },
      // 开单管理
      // {
      //   path: 'customerBilling', // 开单
      //   name: 'customerBilling',
      //   meta: { title: '开单' },
      //   component: () => import('@/views/SiteManagement/JumpPage/customerBilling'),
      //   hidden: true
      // },
      // 交预约金
      {
        path: 'advancePayment', // 预约金
        name: 'advancePayment',
        meta: { title: '预约金' },
        component: () => import('@/views/SiteManagement/JumpPage/advancePayment'),
        hidden: true
      },
      // 交储值
      // {
      //   path: 'pepositValue', // 交储值
      //   name: 'pepositValue',
      //   meta: { title: '交储值' },
      //   component: () => import('@/views/SiteManagement/JumpPage/pepositValue'),
      //   hidden: true
      // },
      // 辅助治疗开单
      // {
      //   path: 'adjuvantBillingTherapy', // 辅助治疗开单
      //   name: 'adjuvantBillingTherapy',
      //   meta: { title: '辅助治疗开单' },
      //   component: () => import('@/views/SiteManagement/JumpPage/adjuvantBillingTherapy'),
      //   hidden: true
      // },
      // 检验开单
      // {
      //   path: 'inspectionBilling', // 检验开单
      //   name: 'inspectionBilling',
      //   meta: { title: '检验开单' },
      //   component: () => import('@/views/SiteManagement/JumpPage/inspectionBilling'),
      //   hidden: true
      // },
      // 放射开单
      // {
      //   path: 'radiationBilling', // 放射开单
      //   name: 'radiationBilling',
      //   meta: { title: '放射开单' },
      //   component: () => import('@/views/MedicalManagement/RadiologyDepartment/RadiationBilling'),
      //   hidden: true
      // },
      // 套餐开单
      {
        path: 'packageBilling', // 套餐开单
        name: 'packageBilling',
        meta: { title: '套餐开单' },
        component: () => import('@/views/SiteManagement/JumpPage/packageBilling'),
        hidden: true
      },
      // 我的接诊列表
      {
        path: 'supplementaryReception', // 补充接诊信息
        name: 'supplementaryReception',
        meta: { title: '补充接诊信息' },
        component: () => import('@/views/SiteManagement/JumpPage/packageBilling'),
        hidden: true
      },
      // 补充客户信息
      {
        path: 'customerInformation', // 补充客户信息
        name: 'customerInformation',
        meta: { title: '补充客户信息' },
        component: () => import('@/views/SiteManagement/ReceptionManagement/Components/customerInformation'),
        hidden: true
      },
      // 月子登记
      {
        path: 'confinermentInitiateTreatment', // 发起治疗
        name: 'confinermentInitiateTreatment',
        meta: { title: '发起治疗' },
        component: () => import('@/views/MedicalManagement/MaternityHotels/confinermentInitiateTreatment'),
        hidden: true
      },
      // 通用排期分诊登记
      // {
      //   path: 'triageRegistrations', // 通用排期分诊登记
      //   name: 'triageRegistrations',
      //   meta: { title: '分诊登记' },
      //   component: () => import('@/views/MedicalManagement/SkinCenter/triageRegistrations'),
      //   hidden: true
      // },
      {
        path: '/maintainGuestPhoneDetail', // 维护临客信息 号码详情
        name: 'MaintainGuestPhoneDetail',
        meta: { title: '号码详情' },
        component: () => import('@/views/SystemManagement/BackStageManagement/maintainGuestPhoneDetail.vue'),
        hidden: true
      },
      {
        path: '/GuestAscriptionChangeDetail', // 维护临客信息 号码详情
        name: 'GuestAscriptionChangeDetail',
        meta: { title: '归属修改详情' },
        component: () => import('@/views/SystemManagement/BackStageManagement/GuestAscriptionChangeDetail.vue'),
        hidden: true
      },
      {
        path: 'NewlyAddedCustomerBriefing/:time',
        name: 'NewlyAddedCustomerBriefing',
        props: true,
        meta: { title: '数据简报-新增顾客' },
        component: () => import('@/views/DataBriefing/NewlyAddedCustomerBriefing.vue'),
        hidden: true
      },
      {
        path: 'customerArrive/:time/:customerType/:isSecondary',
        name: 'customerArrive',
        props: true,
        meta: { title: '数据简报-客户到诊' },
        component: () => import('@/views/DataBriefing/CustomerArrive.vue'),
        hidden: true
      }
    ]
  },
  // {
  //   path: 'customerInfo',
  //   component: () => import('@/views/ReturnVisitManagement/Components/customerInfo'),
  //   meta: { title: '个人详情' },
  //   hidden: true
  // },
  // {
  //   path: '/unArriveReturnVisitPlan',
  //   componen: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/return-visit-details/:id',
  //       componen: () => import('@/views/customer/returnVisit/returnVisitDetial')
  //     }
  //   ]
  // },
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   meta: { title: '回访详情' },
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path(.*)',
  //       component: () => import('@/views/redirect')
  //     }
  //   ]
  // },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '*',
    component: () => import('@/views/error/NotFind'),
    hidden: true
  }
]
