Page({
  data: {
    feedbackType: 'complaint',
    feedbackContent: '',
    contactPhone: '',
    uploadImages: [],
    canSubmit: false,
    faqList: [
      {
        id: 1,
        question: '如何获得积分？',
        answer: '您可以通过以下方式获得积分：1.每日签到；2.消费累计积分；3.参与活动；4.邀请好友注册。',
        expanded: false
      },
      {
        id: 2,
        question: '优惠券如何使用？',
        answer: '在结算页面选择可用的优惠券即可自动抵扣。请注意查看优惠券的使用条件和有效期。',
        expanded: false
      },
      {
        id: 3,
        question: '停车券怎么领取？',
        answer: '停车券可通过积分兑换或在领券中心领取。领取后可在停车缴费时自动抵扣。',
        expanded: false
      },
      {
        id: 4,
        question: '会员等级如何提升？',
        answer: '会员等级根据您的消费金额自动提升。消费越多，等级越高，享受的权益也越多。',
        expanded: false
      },
      {
        id: 5,
        question: '如何修改绑定手机号？',
        answer: '进入"我的"-"设置"-"修改手机号"，按照提示完成验证后即可修改。',
        expanded: false
      }
    ]
  },

  onLoad() {
    this.checkCanSubmit();
  },

  // 选择反馈类型
  selectType(e) {
    this.setData({
      feedbackType: e.currentTarget.dataset.type
    });
  },

  // 输入反馈内容
  onContentInput(e) {
    this.setData({
      feedbackContent: e.detail.value
    });
    this.checkCanSubmit();
  },

  // 输入手机号
  onPhoneInput(e) {
    this.setData({
      contactPhone: e.detail.value
    });
  },

  // 检查是否可以提交
  checkCanSubmit() {
    const canSubmit = this.data.feedbackContent.trim().length > 0;
    this.setData({ canSubmit });
  },

  // 选择图片
  chooseImage() {
    const remaining = 6 - this.data.uploadImages.length;
    wx.chooseImage({
      count: remaining,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = [...this.data.uploadImages, ...res.tempFilePaths];
        this.setData({
          uploadImages: newImages
        });
      }
    });
  },

  // 预览图片
  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.uploadImages
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.uploadImages.filter((_, i) => i !== index);
    this.setData({ uploadImages: images });
  },

  // 提交反馈
  submitFeedback() {
    if (!this.data.canSubmit) return;

    wx.showLoading({ title: '提交中...' });
    
    // 模拟提交
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      });
      
      // 重置表单
      this.setData({
        feedbackContent: '',
        contactPhone: '',
        uploadImages: [],
        canSubmit: false
      });
    }, 1500);
  },

  // 展开/收起FAQ
  toggleFAQ(e) {
    const id = e.currentTarget.dataset.id;
    const faqList = this.data.faqList.map(item => {
      if (item.id === id) {
        return { ...item, expanded: !item.expanded };
      }
      return item;
    });
    this.setData({ faqList });
  },

  // 拨打电话
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: '4008888888'
    });
  },

  // 在线客服
  openOnlineChat() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 查看常见问题
  goToFAQ() {
    wx.pageScrollTo({
      selector: '.faq-list',
      duration: 300
    });
  },

  // 查看历史记录
  viewFeedbackHistory() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
});
