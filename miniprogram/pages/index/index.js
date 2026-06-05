const app = getApp();

Page({
  data: {
    userInfo: {},
    memberInfo: {},
    couponCount: 3,
    banners: [
      { id: 1, image: 'https://picsum.photos/800/400?random=1' },
      { id: 2, image: 'https://picsum.photos/800/400?random=2' },
      { id: 3, image: 'https://picsum.photos/800/400?random=3' }
    ],
    events: [
      { id: 1, title: '夏日清凉节 - 全场5折起', time: '06.01-06.30', location: '全场', status: '报名中', cover: 'https://picsum.photos/400/300?random=4' },
      { id: 2, title: '亲子嘉年华 - 欢乐无限', time: '06.15-06.16', location: '1楼中庭', status: '报名中', cover: 'https://picsum.photos/400/300?random=5' }
    ],
    shops: [
      { id: 1, name: '优衣库', category: '服饰', logo: 'https://picsum.photos/200/200?random=6' },
      { id: 2, name: '星巴克', category: '餐饮', logo: 'https://picsum.photos/200/200?random=7' },
      { id: 3, name: 'Apple', category: '数码', logo: 'https://picsum.photos/200/200?random=8' },
      { id: 4, name: '海底捞', category: '餐饮', logo: 'https://picsum.photos/200/200?random=9' },
      { id: 5, name: 'ZARA', category: '服饰', logo: 'https://picsum.photos/200/200?random=10' }
    ],
    tasks: [
      { id: 1, title: '每日签到', desc: '连续签到奖励更多', points: 10, icon: 'icon-calendar', completed: false },
      { id: 2, title: '完善资料', desc: '首次完善个人信息', points: 50, icon: 'icon-user', completed: true },
      { id: 3, title: '分享活动', desc: '分享给微信好友', points: 20, icon: 'icon-share', completed: false }
    ]
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
          const member = res.data[0];
          this.setData({
            memberInfo: {
              ...member,
              nextLevel: '金卡会员',
              needAmount: 2500,
              growthProgress: 60,
              pointMultiplier: 1.5
            }
          });
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
        memberNo: '202406050001',
        nextLevel: '金卡会员',
        needAmount: 2500,
        growthProgress: 60,
        pointMultiplier: 1.5
      }
    });
  },

  // 扫码积分
  scanCode() {
    wx.scanCode({
      success: (res) => {
        wx.showToast({ title: '扫码成功', icon: 'success' });
      }
    });
  },

  // 页面跳转方法
  goToParking() {
    wx.showToast({ title: '停车功能开发中', icon: 'none' });
  },

  goToPointShop() {
    wx.navigateTo({ url: '/pages/points/points' });
  },

  goToVipLevel() {
    wx.navigateTo({ url: '/pages/vipLevel/vipLevel' });
  },

  goToMallGuide() {
    wx.navigateTo({ url: '/pages/mallGuide/mallGuide' });
  },

  goToRecords() {
    wx.navigateTo({ url: '/pages/records/records' });
  },

  goToPoints() {
    wx.navigateTo({ url: '/pages/pointDetail/pointDetail' });
  },

  goToCoupons() {
    wx.switchTab({ url: '/pages/coupons/coupons' });
  },

  showMemberCode() {
    wx.showModal({
      title: '会员码',
      content: '会员码功能开发中',
      showCancel: false
    });
  },

  onBannerTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '查看活动 ' + id, icon: 'none' });
  },

  onEventTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '查看活动详情 ' + id, icon: 'none' });
  },

  onShopTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '查看店铺 ' + id, icon: 'none' });
  },

  doTask(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '去完成任务', icon: 'none' });
  },

  goToMoreEvents() {
    wx.showToast({ title: '更多活动', icon: 'none' });
  },

  goToMoreShops() {
    wx.showToast({ title: '更多店铺', icon: 'none' });
  },

  goToMoreTasks() {
    wx.showToast({ title: '更多任务', icon: 'none' });
  }
});
