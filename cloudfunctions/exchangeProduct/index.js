const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { productId } = event
  const { OPENID } = cloud.getWXContext()
  
  try {
    // 获取商品信息
    const productRes = await db.collection('point_products').doc(productId).get()
    const product = productRes.data
    
    if (!product || product.status !== 'active') {
      return { success: false, message: '商品不存在或已下架' }
    }
    
    if (product.stock <= 0) {
      return { success: false, message: '商品已兑完' }
    }
    
    // 获取会员信息
    const memberRes = await db.collection('members').where({
      _openid: OPENID
    }).get()
    
    if (memberRes.data.length === 0) {
      return { success: false, message: '会员信息不存在' }
    }
    
    const member = memberRes.data[0]
    
    if (member.points < product.points) {
      return { success: false, message: '积分不足' }
    }
    
    // 开启事务
    const transaction = await db.startTransaction()
    
    try {
      // 减少商品库存
      await transaction.collection('point_products').doc(productId).update({
        data: {
          stock: _.inc(-1),
          exchangeCount: _.inc(1)
        }
      })
      
      // 扣除会员积分
      await transaction.collection('members').doc(member._id).update({
        data: {
          points: _.inc(-product.points),
          updateTime: db.serverDate()
        }
      })
      
      // 记录积分变动
      await transaction.collection('points').add({
        data: {
          _openid: OPENID,
          type: 'exchange',
          points: -product.points,
          balance: member.points - product.points,
          description: `兑换商品：${product.name}`,
          relatedId: productId,
          createTime: db.serverDate()
        }
      })
      
      // 记录兑换记录
      await transaction.collection('exchange_records').add({
        data: {
          _openid: OPENID,
          productId: productId,
          productName: product.name,
          productImage: product.image,
          points: product.points,
          status: 'pending',
          createTime: db.serverDate()
        }
      })
      
      await transaction.commit()
      
      return { success: true, message: '兑换成功' }
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  } catch (err) {
    console.error('兑换商品失败:', err)
    return { success: false, message: '兑换失败，请重试' }
  }
}
