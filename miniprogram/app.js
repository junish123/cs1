App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cs20260605-d7ge3qv3adead64a3',
        traceUser: true,
      })
    }
    
    // 获取用户信息
    this.getUserInfo()
  },
  
  globalData: {
    userInfo: null,
    memberInfo: null
  },
  
  // 获取用户信息
  getUserInfo: function() {
    const that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              that.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  }
})
