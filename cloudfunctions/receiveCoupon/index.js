const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { couponId } = event
  const { OPENID } = cloud.getWXContext()
  
  try {
    // 检查优惠券是否存在且有效
    const couponRes = await db.collection('coupons').doc(couponId).get()
    const coupon = couponRes.data
    
    if (!coupon || coupon.status !== 'active') {
      return { success: false, message: '优惠券不存在或已下架' }
    }
    
    if (coupon.stock <= 0) {
      return { success: false, message: '优惠券已领完' }
    }
    
    if (new Date(coupon.endDate) < new Date()) {
      return { success: false, message: '优惠券已过期' }
    }
    
    // 检查用户是否已领取
    const userCouponRes = await db.collection('user_coupons').where({
      _openid: OPENID,
      couponId: couponId,
      status: _.in(['unused', 'used'])
    }).get()
    
    if (userCouponRes.data.length > 0) {
      return { success: false, message: '您已领取过该优惠券' }
    }
    
    // 开启事务
    const transaction = await db.startTransaction()
    
    try {
      // 减少优惠券库存
      await transaction.collection('coupons').doc(couponId).update({
        data: {
          stock: _.inc(-1),
          receivedCount: _.inc(1)
        }
      })
      
      // 添加用户优惠券
      const expireDate = new Date()
      expireDate.setDate(expireDate.getDate() + (coupon.validDays || 30))
      
      await transaction.collection('user_coupons').add({
        data: {
          _openid: OPENID,
          couponId: couponId,
          couponInfo: {
            title: coupon.title,
            description: coupon.description,
            type: coupon.type,
            amount: coupon.amount,
            discount: coupon.discount,
            minAmount: coupon.minAmount
          },
          status: 'unused',
          receiveTime: db.serverDate(),
          expireDate: expireDate,
          useTime: null,
          createTime: db.serverDate()
        }
      })
      
      await transaction.commit()
      
      return { success: true, message: '领取成功' }
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  } catch (err) {
    console.error('领取优惠券失败:', err)
    return { success: false, message: '领取失败，请重试' }
  }
}
