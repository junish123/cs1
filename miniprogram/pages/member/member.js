const app = getApp();

Page({
  data: {
    userInfo: {},
    memberInfo: {},
    couponCount: 3,
    collectCount: 12,
    unpaidCount: 2,
    unshippedCount: 1,
    unreceivedCount: 0,
    unreviewedCount: 3
  },

  onLoad() {
    this.loadUserInfo();
    this.loadMemberInfo();
  },

  onShow() {
    this.loadMemberInfo();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({ userInfo });
  },

  // 加载会员信息
  loadMemberInfo() {
    const db = wx.cloud.database();
    const openid = wx.getStorageSync('openid');
    
    if (!openid) {
      this.setDefaultMemberInfo();
      return;
    }

    db.collection('members').where({ _openid: openid }).get()
      .then(res => {
        if (res.data.length > 0) {
          this.setData({ memberInfo: res.data[0] });
        } else {
          this.setDefaultMemberInfo();
        }
      })
      .catch(() => {
        this.setDefaultMemberInfo();
      });
  },

  setDefaultMemberInfo() {
    this.setData({
      memberInfo: {
        points: 2580,
        balance: 128.50,
        levelName: '银卡会员',
        memberNo: '202406050001'
      }
    });
  },

  // 显示会员码
  showMemberCode() {
    wx.showModal({
      title: '会员码',
      content: '会员码功能开发中',
      showCancel: false
    });
  },

  // 页面跳转方法
  goToPoints() {
    wx.navigateTo({ url: '/pages/pointDetail/pointDetail' });
  },

  goToBalance() {
    wx.showToast({ title: '余额功能开发中', icon: 'none' });
  },

  goToCoupons() {
    wx.switchTab({ url: '/pages/coupons/coupons' });
  },

  goToCollect() {
    wx.showToast({ title: '收藏功能开发中', icon: 'none' });
  },

  goToOrders(e) {
    const type = e.currentTarget.dataset.type || '';
    wx.showToast({ title: '订单功能开发中', icon: 'none' });
  },

  goToAfterSale() {
    wx.showToast({ title: '售后功能开发中', icon: 'none' });
  },

  goToVipLevel() {
    wx.navigateTo({ url: '/pages/vipLevel/vipLevel' });
  },

  goToPointDetail() {
    wx.navigateTo({ url: '/pages/pointDetail/pointDetail' });
  },

  goToAddress() {
    wx.showToast({ title: '地址功能开发中', icon: 'none' });
  },

  goToParking() {
    wx.showToast({ title: '停车功能开发中', icon: 'none' });
  },

  goToFamily() {
    wx.showToast({ title: '亲友圈功能开发中', icon: 'none' });
  },

  goToFeedback() {
    wx.showToast({ title: '反馈功能开发中', icon: 'none' });
  },

  goToHelp() {
    wx.showToast({ title: '帮助功能开发中', icon: 'none' });
  },

  goToSetting() {
    wx.showToast({ title: '设置功能开发中', icon: 'none' });
  },

  goToAbout() {
    wx.showToast({ title: '关于功能开发中', icon: 'none' });
  }
});
