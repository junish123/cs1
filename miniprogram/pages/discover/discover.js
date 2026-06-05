const app = getApp();

Page({
  data: {
    currentTopic: 'all',
    topics: [
      { id: 'food', name: '美食探店', count: 1234 },
      { id: 'fashion', name: '时尚穿搭', count: 856 },
      { id: 'lifestyle', name: '生活方式', count: 642 },
      { id: 'mom', name: '宝妈育儿', count: 423 },
      { id: 'beauty', name: '美妆护肤', count: 389 },
      { id: 'pet', name: '萌宠天地', count: 256 }
    ],
    posts: [],
    leftPosts: [],
    rightPosts: [],
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad() {
    this.loadPosts();
    this.loadTopics();
  },

  onReachBottom() {
    if (this.data.hasMore) {
      this.loadMorePosts();
    }
  },

  // 加载帖子
  loadPosts() {
    // 模拟数据
    const mockPosts = this.generateMockPosts();
    this.splitPosts(mockPosts);
    this.setData({ posts: mockPosts });
  },

  // 生成模拟数据
  generateMockPosts() {
    const posts = [];
    const titles = [
      '周末来商场打卡啦！发现一家超好吃的日料店',
      'OOTD | 今日穿搭分享，这件外套太显气质了',
      '带着宝宝来逛商场，儿童区真的太棒了',
      '发现了宝藏美妆店，试用了一下就爱上了',
      '停车免费福利来了，大家快来薅羊毛',
      '这家咖啡店的拿铁是我喝过最好喝的',
      '会员积分兑换的礼品到了，品质超好',
      '周末亲子活动，小朋友玩得很开心'
    ];
    const tags = ['美食', '打卡', '探店', '穿搭', '亲子', '福利'];

    for (let i = 0; i < 10; i++) {
      posts.push({
        id: i,
        title: titles[i % titles.length],
        images: [`https://picsum.photos/300/${400 + Math.random() * 200}?random=${i}`],
        tags: [tags[Math.floor(Math.random() * tags.length)], tags[Math.floor(Math.random() * tags.length)]],
        authorAvatar: `https://picsum.photos/100/100?random=${i + 100}`,
        authorName: `用户${i + 1}`,
        likes: Math.floor(Math.random() * 500) + 10
      });
    }
    return posts;
  },

  // 分割帖子到两列
  splitPosts(posts) {
    const left = [];
    const right = [];
    posts.forEach((post, index) => {
      if (index % 2 === 0) {
        left.push(post);
      } else {
        right.push(post);
      }
    });
    this.setData({ leftPosts: left, rightPosts: right });
  },

  // 加载更多
  loadMorePosts() {
    const morePosts = this.generateMockPosts().map(p => ({...p, id: p.id + this.data.posts.length}));
    const allPosts = [...this.data.posts, ...morePosts];
    this.splitPosts(allPosts);
    this.setData({
      posts: allPosts,
      page: this.data.page + 1,
      hasMore: this.data.page < 3
    });
  },

  // 切换话题
  switchTopic(e) {
    const topic = e.currentTarget.dataset.topic;
    this.setData({ currentTopic: topic, page: 1 });
    this.loadPosts();
  },

  // 搜索输入
  onSearchInput(e) {
    console.log('搜索:', e.detail.value);
  },

  // 去发布
  goToPublish() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 查看帖子详情
  goToPostDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '查看帖子 ' + id, icon: 'none' });
  },

  // 加载话题
  loadTopics() {
    // 从数据库加载话题数据
  }
});
