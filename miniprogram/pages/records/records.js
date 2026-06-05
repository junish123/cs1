Page({
  data: {
    records: [],
    totalCount: 0,
    totalAmount: 0,
    hasMore: false,
    page: 1,
    pageSize: 20
  },

  onLoad: function () {
    this.loadRecords()
    this.loadStats()
  },

  // 加载记录
  loadRecords: function () {
    const db = wx.cloud.database()
    const _ = db.command
    
    db.collection('transactions').where({
      _openid: '{openid}'
    }).orderBy('createTime', 'desc')
    .skip((this.data.page - 1) * this.data.pageSize)
    .limit(this.data.pageSize)
    .get().then(res => {
      const records = res.data.map(item => ({
        ...item,
        typeName: this.getTypeName(item.type),
        createTime: this.formatDate(item.createTime)
      }))
      
      this.setData({
        records: this.data.page === 1 ? records : [...this.data.records, ...records],
        hasMore: records.length === this.data.pageSize
      })
    })
  },

  // 加载统计
  loadStats: function () {
    const db = wx.cloud.database()
    const _ = db.command
    
    // 消费次数
    db.collection('transactions').where({
      _openid: '{openid}',
      type: 'consume'
    }).count().then(res => {
      this.setData({ totalCount: res.total })
    })
    
    // 消费总额
    db.collection('transactions').where({
      _openid: '{openid}'
    }).get().then(res => {
      const total = res.data.reduce((sum, item) => {
        if (item.type === 'consume') {
          return sum + item.amount
        } else if (item.type === 'refund') {
          return sum - item.amount
        }
        return sum
      }, 0)
      this.setData({ totalAmount: total.toFixed(2) })
    })
  },

  // 加载更多
  loadMore: function () {
    this.setData({ page: this.data.page + 1 })
    this.loadRecords()
  },

  // 获取类型名称
  getTypeName: function (type) {
    const typeMap = {
      'consume': '消费',
      'recharge': '充值',
      'refund': '退款'
    }
    return typeMap[type] || '其他'
  },

  // 格式化日期
  formatDate: function (date) {
    if (!date) return ''
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
})
