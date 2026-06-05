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
    }
  },

  onLoad: function () {
    this.loadUserInfo()
    this.loadMemberInfo()
  },

  onShow: function () {
    this.loadMemberInfo()
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
    
    db.collection('members').where({
      _openid: '{openid}'
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({ memberInfo: res.data[0] })
      }
    })
  },

  // 页面跳转
  goToRecords: function () {
    wx.navigateTo({ url: '/pages/records/records' })
  },

  goToPoints: function () {
    wx.switchTab({ url: '/pages/points/points' })
  },

  goToCoupons: function () {
    wx.switchTab({ url: '/pages/coupons/coupons' })
  },

  // 显示会员码
  showMemberCode: function () {
    wx.showModal({
      title: '会员二维码',
      content: '会员码功能开发中...',
      showCancel: false
    })
  },

  // 联系客服
  contactService: function () {
    wx.openCustomerServiceChat({
      extInfo: {url: ''},
      corpId: '',
      success(res) {}
    })
  },

  // 退出登录
  logout: function () {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: res => {
        if (res.confirm) {
          // 清除登录状态
          app.globalData.userInfo = null
          app.globalData.memberInfo = null
          wx.reLaunch({ url: '/pages/index/index' })
        }
      }
    })
  }
})
