Page({
  data: {
    userInfo: {
      nickName: '微信用户',
      avatarUrl: ''
    },
    phone: '13800138000',
    maskedPhone: '138****8000',
    cacheSize: '12.5MB',
    notification: {
      activity: true,
      coupon: true,
      points: true,
      parking: false
    },
    privacy: {
      publicInfo: false,
      location: true
    },
    showPhoneModal: false,
    newPhone: '',
    verifyCode: '',
    countdown: 0
  },

  onLoad() {
    this.loadUserInfo();
  },

  // 加载用户信息
  loadUserInfo() {
    // 从本地存储或云开发获取用户信息
    const userInfo = wx.getStorageSync('userInfo') || this.data.userInfo;
    this.setData({ userInfo });
  },

  // 切换通知设置
  toggleNotification(e) {
    const type = e.currentTarget.dataset.type;
    const value = e.detail.value;
    this.setData({
      [`notification.${type}`]: value
    });
    
    wx.showToast({
      title: value ? '已开启' : '已关闭',
      icon: 'none'
    });
  },

  // 切换隐私设置
  togglePrivacy(e) {
    const type = e.currentTarget.dataset.type;
    const value = e.detail.value;
    this.setData({
      [`privacy.${type}`]: value
    });
    
    wx.showToast({
      title: value ? '已开启' : '已关闭',
      icon: 'none'
    });
  },

  // 修改手机号
  changePhone() {
    this.setData({
      showPhoneModal: true,
      newPhone: '',
      verifyCode: '',
      countdown: 0
    });
  },

  // 关闭弹窗
  closePhoneModal() {
    this.setData({
      showPhoneModal: false
    });
  },

  // 输入手机号
  onPhoneInput(e) {
    this.setData({
      newPhone: e.detail.value
    });
  },

  // 输入验证码
  onCodeInput(e) {
    this.setData({
      verifyCode: e.detail.value
    });
  },

  // 发送验证码
  sendCode() {
    const phone = this.data.newPhone;
    if (!phone || phone.length !== 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    // 开始倒计时
    this.setData({ countdown: 60 });
    const timer = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(timer);
        this.setData({ countdown: 0 });
      } else {
        this.setData({ countdown: this.data.countdown - 1 });
      }
    }, 1000);

    wx.showToast({
      title: '验证码已发送',
      icon: 'none'
    });
  },

  // 确认修改手机号
  confirmChangePhone() {
    const { newPhone, verifyCode } = this.data;
    
    if (!newPhone || newPhone.length !== 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    if (!verifyCode || verifyCode.length !== 6) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '修改中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      
      // 更新手机号显示
      const maskedPhone = newPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      this.setData({
        phone: newPhone,
        maskedPhone: maskedPhone,
        showPhoneModal: false
      });
      
      wx.showToast({
        title: '修改成功',
        icon: 'success'
      });
    }, 1500);
  },

  // 修改密码
  changePassword() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 绑定微信
  bindWechat() {
    wx.showToast({
      title: '已绑定',
      icon: 'none'
    });
  },

  // 查看用户协议
  viewUserAgreement() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://example.com/agreement'
    });
  },

  // 查看隐私政策
  viewPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://example.com/privacy'
    });
  },

  // 关于我们
  viewAbout() {
    wx.showModal({
      title: '关于我们',
      content: '商场会员小程序 v1.0.0\n\n为您提供便捷的会员服务、积分兑换、优惠券领取等功能。',
      showCancel: false
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '提示',
      content: '确定清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '清除中...' });
          setTimeout(() => {
            wx.hideLoading();
            this.setData({ cacheSize: '0KB' });
            wx.showToast({
              title: '清除成功',
              icon: 'success'
            });
          }, 1000);
        }
      }
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '退出中...' });
          setTimeout(() => {
            wx.hideLoading();
            // 清除登录状态
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('token');
            
            wx.showToast({
              title: '已退出登录',
              icon: 'success'
            });
            
            // 返回首页
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 1000);
        }
      }
    });
  }
});
