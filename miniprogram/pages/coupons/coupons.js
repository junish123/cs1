Page({
  data: {
    currentTab: 'available',
    statusFilter: 'unused',
    availableCoupons: [],
    myCoupons: []
  },

  onLoad: function () {
    this.loadAvailableCoupons()
  },

  onShow: function () {
    if (this.data.currentTab === 'my') {
      this.loadMyCoupons()
    }
  },

  // 切换标签
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    
    if (tab === 'available') {
      this.loadAvailableCoupons()
    } else {
      this.loadMyCoupons()
    }
  },

  // 筛选状态
  filterStatus: function (e) {
    const status = e.currentTarget.dataset.status
    this.setData({ statusFilter: status })
    this.loadMyCoupons()
  },

  // 加载可领取优惠券
  loadAvailableCoupons: function () {
    const db = wx.cloud.database()
    const _ = db.command
    
    db.collection('coupons').where({
      status: 'active',
      stock: _.gt(0),
      endDate: _.gte(new Date())
    }).orderBy('createTime', 'desc')
    .get().then(res => {
      const coupons = res.data.map(item => ({
        ...item,
        endDate: this.formatDate(item.endDate)
      }))
      this.setData({ availableCoupons: coupons })
    })
  },

  // 加载我的优惠券
  loadMyCoupons: function () {
    const db = wx.cloud.database()
    const _ = db.command
    
    let whereCondition = {
      _openid: '{openid}'
    }
    
    if (this.data.statusFilter === 'unused') {
      whereCondition.status = 'unused'
      whereCondition.expireDate = _.gte(new Date())
    } else if (this.data.statusFilter === 'used') {
      whereCondition.status = 'used'
    } else {
      whereCondition.status = 'unused'
      whereCondition.expireDate = _.lt(new Date())
    }
    
    db.collection('user_coupons').where(whereCondition)
      .orderBy('receiveTime', 'desc')
      .get().then(res => {
        const coupons = res.data.map(item => ({
          ...item,
          expireDate: this.formatDate(item.expireDate)
        }))
        this.setData({ myCoupons: coupons })
      })
  },

  // 领取优惠券
  receiveCoupon: function (e) {
    const couponId = e.currentTarget.dataset.id
    
    wx.showLoading({ title: '领取中...' })
    
    wx.cloud.callFunction({
      name: 'receiveCoupon',
      data: { couponId }
    }).then(res => {
      wx.hideLoading()
      
      if (res.result.success) {
        wx.showToast({ title: '领取成功', icon: 'success' })
        this.loadAvailableCoupons()
      } else {
        wx.showToast({ title: res.result.message, icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '领取失败', icon: 'none' })
    })
  },

  // 使用优惠券
  useCoupon: function (e) {
    const couponId = e.currentTarget.dataset.id
    wx.showModal({
      title: '使用优惠券',
      content: '请向店员出示此优惠券',
      showCancel: false,
      success: () => {
        // 这里可以生成二维码
      }
    })
  },

  // 格式化日期
  formatDate: function (date) {
    if (!date) return ''
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }
})
