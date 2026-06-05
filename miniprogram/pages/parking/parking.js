Page({
  data: {
    currentParking: null,
    vehicles: [],
    parkingRecords: [],
    showPayModal: false,
    showAddModal: false,
    payInfo: {
      plateNumber: '',
      amount: 0,
      finalAmount: 0
    },
    selectedCoupon: null,
    availableCoupons: [],
    newPlateNumber: '',
    vehicleTypes: ['小型车', '中型车', '大型车'],
    typeIndex: 0
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    // 模拟加载数据
    this.setData({
      currentParking: {
        plateNumber: '京A·88888',
        duration: '2小时35分',
        entryTime: '2024-01-15 10:30',
        estimatedFee: 25
      },
      vehicles: [
        { id: 1, plateNumber: '京A·88888', type: '小型车', isDefault: true },
        { id: 2, plateNumber: '京B·66666', type: '小型车', isDefault: false }
      ],
      parkingRecords: [
        {
          id: 1,
          plateNumber: '京A·88888',
          entryTime: '01-15 10:30',
          exitTime: '01-15 13:05',
          location: '地下停车场B2层',
          fee: 25,
          status: 'paid',
          statusText: '已支付'
        },
        {
          id: 2,
          plateNumber: '京A·88888',
          entryTime: '01-10 14:20',
          exitTime: '01-10 16:45',
          location: '地下停车场B1层',
          fee: 18,
          status: 'paid',
          statusText: '已支付'
        }
      ],
      availableCoupons: [
        { id: 1, amount: 5, title: '停车券' },
        { id: 2, amount: 10, title: '满20减10' }
      ]
    });
  },

  // 支付停车费
  payParkingFee() {
    const currentParking = this.data.currentParking;
    this.setData({
      showPayModal: true,
      payInfo: {
        plateNumber: currentParking.plateNumber,
        amount: currentParking.estimatedFee,
        finalAmount: currentParking.estimatedFee
      }
    });
  },

  // 关闭支付弹窗
  closePayModal() {
    this.setData({
      showPayModal: false,
      selectedCoupon: null
    });
  },

  // 选择优惠券
  selectCoupon() {
    if (this.data.availableCoupons.length === 0) {
      wx.showToast({
        title: '暂无可用优惠券',
        icon: 'none'
      });
      return;
    }
    
    const items = this.data.availableCoupons.map(c => `${c.title} -${c.amount}元`);
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        const coupon = this.data.availableCoupons[res.tapIndex];
        const finalAmount = Math.max(0, this.data.payInfo.amount - coupon.amount);
        this.setData({
          selectedCoupon: coupon,
          'payInfo.finalAmount': finalAmount
        });
      }
    });
  },

  // 确认支付
  confirmPay() {
    wx.showLoading({ title: '支付中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      });
      this.setData({
        showPayModal: false,
        currentParking: null
      });
    }, 1500);
  },

  // 添加车辆
  addVehicle() {
    this.setData({
      showAddModal: true,
      newPlateNumber: '',
      typeIndex: 0
    });
  },

  // 关闭添加弹窗
  closeAddModal() {
    this.setData({
      showAddModal: false
    });
  },

  // 输入车牌
  onPlateInput(e) {
    this.setData({
      newPlateNumber: e.detail.value.toUpperCase()
    });
  },

  // 选择车辆类型
  onTypeChange(e) {
    this.setData({
      typeIndex: parseInt(e.detail.value)
    });
  },

  // 确认添加
  confirmAdd() {
    const plateNumber = this.data.newPlateNumber.trim();
    if (!plateNumber) {
      wx.showToast({
        title: '请输入车牌号',
        icon: 'none'
      });
      return;
    }

    const newVehicle = {
      id: Date.now(),
      plateNumber: plateNumber,
      type: this.data.vehicleTypes[this.data.typeIndex],
      isDefault: this.data.vehicles.length === 0
    };

    this.setData({
      vehicles: [...this.data.vehicles, newVehicle],
      showAddModal: false
    });

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  // 设为默认
  setDefault(e) {
    const id = e.currentTarget.dataset.id;
    const vehicles = this.data.vehicles.map(v => ({
      ...v,
      isDefault: v.id === id
    }));
    this.setData({ vehicles });
  },

  // 删除车辆
  deleteVehicle(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定删除该车辆吗？',
      success: (res) => {
        if (res.confirm) {
          const vehicles = this.data.vehicles.filter(v => v.id !== id);
          this.setData({ vehicles });
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看全部记录
  viewAllRecords() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
});
