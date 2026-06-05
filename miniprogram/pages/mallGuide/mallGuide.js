Page({
  data: {
    currentFloor: 1,
    floors: [5, 4, 3, 2, 1, -1, -2, -3],
    categories: [
      { id: 1, name: '餐饮', icon: 'icon-food', color: '#E94560' },
      { id: 2, name: '服饰', icon: 'icon-clothes', color: '#4361EE' },
      { id: 3, name: '美妆', icon: 'icon-makeup', color: '#F72585' },
      { id: 4, name: '数码', icon: 'icon-digital', color: '#06D6A0' },
      { id: 5, name: '亲子', icon: 'icon-baby', color: '#F8961E' },
      { id: 6, name: '娱乐', icon: 'icon-game', color: '#4CC9F0' },
      { id: 7, name: '超市', icon: 'icon-cart', color: '#7209B7' },
      { id: 8, name: '影院', icon: 'icon-movie', color: '#1A1A2E' }
    ],
    shops: [
      { id: 1, name: '优衣库', category: '服饰', logo: 'https://picsum.photos/200/200?random=1', tags: ['人气'], location: 'L1-01' },
      { id: 2, name: '星巴克', category: '餐饮', logo: 'https://picsum.photos/200/200?random=2', tags: ['新品'], location: 'L1-02' },
      { id: 3, name: 'Apple Store', category: '数码', logo: 'https://picsum.photos/200/200?random=3', tags: ['官方'], location: 'L1-03' },
      { id: 4, name: '海底捞', category: '餐饮', logo: 'https://picsum.photos/200/200?random=4', tags: ['24H'], location: 'L1-05' },
      { id: 5, name: 'ZARA', category: '服饰', logo: 'https://picsum.photos/200/200?random=5', tags: ['折扣'], location: 'L1-06' }
    ],
    facilities: [
      { id: 1, name: '母婴室', icon: 'icon-baby', location: 'L2' },
      { id: 2, name: '无障碍卫生间', icon: 'icon-accessible', location: '各层' },
      { id: 3, name: '电梯', icon: 'icon-elevator', location: '中庭' },
      { id: 4, name: '服务台', icon: 'icon-service', location: 'L1' },
      { id: 5, name: '充电宝', icon: 'icon-charge', location: '各层' },
      { id: 6, name: 'ATM', icon: 'icon-atm', location: 'B1' }
    ]
  },

  onLoad() {
    this.loadShops();
  },

  // 切换楼层
  switchFloor(e) {
    const floor = e.currentTarget.dataset.floor;
    this.setData({ currentFloor: floor });
    this.loadShops();
  },

  // 加载店铺
  loadShops() {
    // 根据当前楼层加载对应店铺
    // 这里使用模拟数据
  },

  // 导航到店铺
  navigateToShop(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '导航功能开发中', icon: 'none' });
  }
});
