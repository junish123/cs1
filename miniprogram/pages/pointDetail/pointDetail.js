Page({
  data: {
    currentTab: 'all',
    memberInfo: {
      points: 2580
    },
    records: [
      { id: 1, type: 'income', title: '每日签到', desc: '连续签到第5天', points: 10, time: '2026-06-05 09:30', icon: 'icon-checkin' },
      { id: 2, type: 'income', title: '消费奖励', desc: '在优衣库消费 ¥299', points: 299, time: '2026-06-04 15:20', icon: 'icon-shopping' },
      { id: 3, type: 'expense', title: '积分兑换', desc: '兑换10元优惠券', points: 100, time: '2026-06-03 18:45', icon: 'icon-coupon' },
      { id: 4, type: 'income', title: '完善资料', desc: '首次完善个人信息', points: 50, time: '2026-06-02 10:15', icon: 'icon-user' },
      { id: 5, type: 'income', title: '分享奖励', desc: '分享活动给好友', points: 20, time: '2026-06-01 14:30', icon: 'icon-share' },
      { id: 6, type: 'expense', title: '积分抽奖', desc: '参与幸运大转盘', points: 50, time: '2026-05-31 20:00', icon: 'icon-gift' },
      { id: 7, type: 'income', title: '消费奖励', desc: '在星巴克消费 ¥45', points: 45, time: '2026-05-30 16:20', icon: 'icon-coffee' }
    ],
    filteredRecords: [],
    tasks: [
      { id: 1, title: '每日签到', desc: '连续签到奖励更多', points: 10, icon: 'icon-calendar', bgColor: '#E94560', completed: false },
      { id: 2, title: '完善资料', desc: '完善个人信息', points: 50, icon: 'icon-edit', bgColor: '#4361EE', completed: true },
      { id: 3, title: '分享活动', desc: '分享给微信好友', points: 20, icon: 'icon-share', bgColor: '#06D6A0', completed: false },
      { id: 4, title: '发布动态', desc: '发布一条社区动态', points: 30, icon: 'icon-camera', bgColor: '#F72585', completed: false },
      { id: 5, title: '邀请好友', desc: '成功邀请1位好友', points: 100, icon: 'icon-friends', bgColor: '#F8961E', completed: false }
    ]
  },

  onLoad() {
    this.filterRecords();
  },

  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab }, () => {
      this.filterRecords();
    });
  },

  // 筛选记录
  filterRecords() {
    const { currentTab, records } = this.data;
    let filtered = records;
    
    if (currentTab === 'income') {
      filtered = records.filter(r => r.type === 'income');
    } else if (currentTab === 'expense') {
      filtered = records.filter(r => r.type === 'expense');
    }
    
    this.setData({ filteredRecords: filtered });
  },

  // 做任务
  doTask(e) {
    const id = e.currentTarget.dataset.id;
    const task = this.data.tasks.find(t => t.id === id);
    
    if (task && !task.completed) {
      wx.showToast({ title: '任务功能开发中', icon: 'none' });
    }
  }
});
