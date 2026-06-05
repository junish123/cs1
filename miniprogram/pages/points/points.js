const app = getApp()

Page({
  data: {
    memberInfo: {
      points: 0
    },
    products: []
  },

  onLoad: function () {
    this.loadMemberInfo()
    this.loadProducts()
  },

  onShow: function () {
    this.loadMemberInfo()
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

  // 加载积分商品
  loadProducts: function () {
    const db = wx.cloud.database()
    const _ = db.command
    
    db.collection('point_products').where({
      status: 'active',
      stock: _.gt(0)
    }).get().then(res => {
      this.setData({ products: res.data })
    })
  },

  // 兑换商品
  exchangeProduct: function (e) {
    const productId = e.currentTarget.dataset.id
    const product = this.data.products.find(p => p._id === productId)
    
    if (!product || product.stock <= 0) {
      wx.showToast({ title: '商品已兑完', icon: 'none' })
      return
    }
    
    if (this.data.memberInfo.points < product.points) {
      wx.showToast({ title: '积分不足', icon: 'none' })
      return
    }
    
    wx.showModal({
      title: '确认兑换',
      content: `确定使用 ${product.points} 积分兑换 ${product.name} 吗？`,
      success: res => {
        if (res.confirm) {
          this.doExchange(productId)
        }
      }
    })
  },

  // 执行兑换
  doExchange: function (productId) {
    wx.showLoading({ title: '兑换中...' })
    
    wx.cloud.callFunction({
      name: 'exchangeProduct',
      data: { productId }
    }).then(res => {
      wx.hideLoading()
      
      if (res.result.success) {
        wx.showToast({ title: '兑换成功', icon: 'success' })
        this.loadMemberInfo()
        this.loadProducts()
      } else {
        wx.showToast({ title: res.result.message, icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '兑换失败', icon: 'none' })
    })
  },

  // 显示积分规则
  showPointsRules: function () {
    wx.showModal({
      title: '积分规则',
      content: '1. 消费1元获得1积分\n2. 银卡会员1.5倍积分\n3. 金卡会员2倍积分\n4. 积分可用于兑换商品\n5. 积分有效期为1年',
      showCancel: false
    })
  }
})
