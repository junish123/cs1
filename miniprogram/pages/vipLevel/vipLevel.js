Page({
  data: {
    currentLevel: {
      level: 2,
      name: '银卡会员',
      shortName: '银卡',
      multiplier: 1.5,
      birthdayGift: 50,
      parkingHours: 3,
      color: '#C0C0C0',
      icon: 'icon-silver'
    },
    nextLevel: {
      level: 3,
      name: '金卡会员',
      shortName: '金卡'
    },
    needAmount: 2500,
    progress: 60,
    levels: [
      {
        level: 1,
        name: '普通会员',
        shortName: '普通',
        condition: '注册即送',
        multiplier: 1,
        birthdayGift: 0,
        parkingHours: 1,
        color: '#CD7F32',
        icon: 'icon-member',
        benefits: ['积分累计 x1', '生日祝福', '1小时免费停车'],
        current: false
      },
      {
        level: 2,
        name: '银卡会员',
        shortName: '银卡',
        condition: '累计消费满 ¥1,000',
        multiplier: 1.5,
        birthdayGift: 50,
        parkingHours: 3,
        color: '#C0C0C0',
        icon: 'icon-silver',
        benefits: ['积分累计 x1.5', '生日礼券 ¥50', '3小时免费停车', '会员专享价'],
        current: true
      },
      {
        level: 3,
        name: '金卡会员',
        shortName: '金卡',
        condition: '累计消费满 ¥5,000',
        multiplier: 2,
        birthdayGift: 100,
        parkingHours: 5,
        color: '#FFD700',
        icon: 'icon-gold',
        benefits: ['积分累计 x2', '生日礼券 ¥100', '5小时免费停车', '专属客服', '优先参与活动'],
        current: false
      },
      {
        level: 4,
        name: '黑卡会员',
        shortName: '黑卡',
        condition: '累计消费满 ¥20,000',
        multiplier: 3,
        birthdayGift: 500,
        parkingHours: 24,
        color: '#1A1A2E',
        icon: 'icon-vip',
        benefits: ['积分累计 x3', '生日礼券 ¥500', '全天免费停车', '专属顾问', 'VIP专享活动', '贵宾休息室'],
        current: false
      }
    ],
    benefitsList: [
      { name: '积分倍数', values: ['x1', 'x1.5', 'x2', 'x3'] },
      { name: '生日礼券', values: ['-', '¥50', '¥100', '¥500'] },
      { name: '免费停车', values: ['1h', '3h', '5h', '24h'] },
      { name: '会员专享价', values: [false, true, true, true] },
      { name: '专属客服', values: [false, false, true, true] },
      { name: '贵宾休息室', values: [false, false, false, true] }
    ]
  },

  onLoad() {
    this.loadMemberLevel();
  },

  loadMemberLevel() {
    const db = wx.cloud.database();
    // 从数据库加载会员等级信息
  }
});
