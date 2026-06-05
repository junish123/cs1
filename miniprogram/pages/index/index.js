const app = getApp()

Page({
  data: {
    userInfo: {},
    memberInfo: {
      level: 1,
      levelName: '普通会员',
      points: 0,
      balance: 0,
      totalSpend: 0
    },
    couponCount: 0,
    levelProgress: 0,
    nextLevelNeed: 0,
    nextLevelName: '银卡会员',
    latestCoupons: [],
    pointProducts: []
  },

  onLoad: function () {
    this.loadUserInfo()
    this.loadMemberInfo()
    this.loadCoupons()
    this.loadPointProducts()
  },

  onShow: function () {
    this.loadMemberInfo()
    this.loadCoupons()
  },

  // 加载用户信息
  loadUserInfo: function () {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({ userInfo })
    } else {
      wx.getUserInfo({
        success: res => {
          this.setData({ userInfo: res.userInfo })
          app.globalData.userInfo = res.userInfo
        }
      })
    }
  },

  // 加载会员信息
  loadMemberInfo: function () {
    const db = wx.cloud.database()
    const _ = db.command
    
    db.collection('members').where({
      _openid: '{openid}'
    }).get().then(res => {
      if (res.data.length > 0) {
        const memberInfo = res.data[0]
        this.setData({ memberInfo })
        this.calculateLevelProgress(memberInfo)
        app.globalData.memberInfo = memberInfo
      } else {
        // 创建新会员
        this.createMember()
      }
    })
  },

  // 创建新会员
  createMember: function () {
    const db = wx.cloud.database()
    db.collection('members').add({
      data: {
        level: 1,
        levelName: '普通会员',
        points: 0,
        balance: 0,
        totalSpend: 0,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    }).then(res => {
      this.loadMemberInfo()
    })
  },

  // 计算等级进度
  calculateLevelProgress: function (memberInfo) {
    const levels = [
      { level: 1, name: '普通会员', minSpend: 0 },
      { level: 2, name: '银卡会员', minSpend: 1000 },
      { level: 3, name: '金卡会员', minSpend: 5000 },
      { level: 4, name: '钻石会员', minSpend: 20000 }
    ]
    
    const currentLevel = levels.find(l => l.level === memberInfo.level) || levels[0]
    const nextLevel = levels.find(l => l.level === memberInfo.level + 1)
    
    if (nextLevel) {
      const progress = ((memberInfo.totalSpend - currentLevel.minSpend) / 
        (nextLevel.minSpend - currentLevel.minSpend)) * 100
      this.setData({
        levelProgress: Math.min(progress, 100),
        nextLevelNeed: nextLevel.minSpend - memberInfo.totalSpend,
        nextLevelName: nextLevel.name
      })
    } else {
      this.setData({
        levelProgress: 100,
        nextLevelNeed: 0,
        nextLevelName: '已满级'
      })
    }
  },

  // 加载优惠券数量
  loadCoupons: function () {
    const db = wx.cloud.database()
    db.collection('user_coupons').where({
      _openid: '{openid}',
      status: 'unused'
    }).count().then(res => {
      this.setData({ couponCount: res.total })
    })
  },

  // 加载最新优惠券
  loadLatestCoupons: function () {
    const db = wx.cloud.database()
    db.collection('coupons').where({
      status: 'active',
      stock: db.command.gt(0),
      endDate: db.command.gte(new Date())
    }).orderBy('createTime', 'desc')
    .limit(3)
    .get().then(res => {
      this.setData({ latestCoupons: res.data })
    })
  },

  // 加载积分商品
  loadPointProducts: function () {
    const db = wx.cloud.database()
    db.collection('point_products').where({
      status: 'active',
      stock: db.command.gt(0)
    }).limit(6).get().then(res => {
      this.setData({ pointProducts: res.data })
    })
  },

  // 领取优惠券
  receiveCoupon: function (e) {
    const couponId = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'receiveCoupon',
      data: { couponId }
    }).then(res => {
      if (res.result.success) {
        wx.showToast({ title: '领取成功', icon: 'success' })
        this.loadCoupons()
      } else {
        wx.showToast({ title: res.result.message, icon: 'none' })
      }
    })
  },

  // 兑换商品
  exchangeProduct: function (e) {
    const productId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/points/points?productId=${productId}`
    })
  },

  // 显示会员码
  showQRCode: function () {
    wx.showModal({
      title: '会员码',
      content: '会员码功能开发中...',
      showCancel: false
    })
  },

  // 扫码
  scanCode: function () {
    wx.scanCode({
      success: res => {
        console.log('扫码结果：', res)
      }
    })
  },

  // 页面跳转
  goToPoints: function () {
    wx.switchTab({ url: '/pages/points/points' })
  },

  goToCoupons: function () {
    wx.switchTab({ url: '/pages/coupons/coupons' })
  },

  goToRecords: function () {
    wx.navigateTo({ url: '/pages/records/records' })
  }
})
