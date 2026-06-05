Page({
  data: {
    memberInfo: {
      points: 2580
    },
    hasSignedToday: false,
    todayPoints: 10,
    consecutiveDays: 3,
    currentYear: 2024,
    currentMonth: 1,
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    weekSignin: [
      { day: 1, label: '周一', signed: true, points: 10, bonus: false },
      { day: 2, label: '周二', signed: true, points: 10, bonus: false },
      { day: 3, label: '周三', signed: true, points: 10, bonus: false },
      { day: 4, label: '周四', signed: false, points: 10, bonus: false, today: true },
      { day: 5, label: '周五', signed: false, points: 15, bonus: true },
      { day: 6, label: '周六', signed: false, points: 20, bonus: true },
      { day: 7, label: '周日', signed: false, points: 30, bonus: true }
    ],
    calendarDays: [],
    rewards: [
      { days: 3, desc: '额外奖励50积分', achieved: true },
      { days: 7, desc: '神秘大礼包', achieved: false },
      { days: 15, desc: '双倍积分卡', achieved: false },
      { days: 30, desc: '超级会员体验', achieved: false }
    ]
  },

  onLoad() {
    this.generateCalendar();
  },

  // 生成日历
  generateCalendar() {
    const { currentYear, currentMonth } = this.data;
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const calendarDays = [];
    
    // 填充空白天数
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ empty: true });
    }
    
    // 填充日期
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() + 1 === currentMonth;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = isCurrentMonth && day === today.getDate();
      
      // 模拟签到数据（1-15号已签到）
      const signed = day <= 15;
      
      calendarDays.push({
        day,
        date,
        signed,
        today: isToday
      });
    }
    
    this.setData({ calendarDays });
  },

  // 执行签到
  doSignIn() {
    if (this.data.hasSignedToday) {
      wx.showToast({
        title: '今日已签到',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '签到中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 更新数据
      const memberInfo = this.data.memberInfo;
      memberInfo.points += this.data.todayPoints;
      
      // 更新今日签到状态
      const weekSignin = this.data.weekSignin.map(item => {
        if (item.today) {
          return { ...item, signed: true };
        }
        return item;
      });
      
      // 更新日历
      const calendarDays = this.data.calendarDays.map(item => {
        if (item.today) {
          return { ...item, signed: true };
        }
        return item;
      });
      
      this.setData({
        hasSignedToday: true,
        memberInfo,
        weekSignin,
        calendarDays,
        consecutiveDays: this.data.consecutiveDays + 1
      });
      
      wx.showToast({
        title: `签到成功 +${this.data.todayPoints}积分`,
        icon: 'none'
      });
    }, 1000);
  },

  // 上一个月
  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth--;
    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }
    this.setData({ currentYear, currentMonth }, () => {
      this.generateCalendar();
    });
  },

  // 下一个月
  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
    this.setData({ currentYear, currentMonth }, () => {
      this.generateCalendar();
    });
  }
});
