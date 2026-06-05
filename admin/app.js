// CloudBase 配置
const CLOUDBASE_ENV = 'cs20260605-d7ge3qv3adead64a3';

// 初始化 CloudBase
let app = null;
let db = null;
let isCloudBaseReady = false;

// 管理员账号配置（实际项目中应使用云开发认证）
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// 当前登录状态
let isLoggedIn = false;

// 初始化
async function init() {
  console.log('开始初始化...');
  
  try {
    // 初始化 CloudBase
    app = cloudbase.init({
      env: CLOUDBASE_ENV
    });
    
    console.log('CloudBase 初始化成功，环境ID:', CLOUDBASE_ENV);
    
    // 获取数据库实例
    db = app.database();
    isCloudBaseReady = true;
    
    console.log('数据库实例创建成功');
    
    // 检查登录状态
    checkLoginStatus();
    
    // 绑定事件
    bindEvents();
    
    console.log('应用初始化完成');
  } catch (error) {
    console.error('CloudBase 初始化失败:', error);
    showError('系统初始化失败，请刷新页面重试');
    // 即使没有 CloudBase，也允许本地登录
    checkLoginStatus();
    bindEvents();
  }
}

// 检查登录状态
function checkLoginStatus() {
  console.log('检查登录状态...');
  
  try {
    const session = localStorage.getItem('adminSession');
    if (session) {
      const sessionData = JSON.parse(session);
      if (sessionData.expires > Date.now()) {
        isLoggedIn = true;
        console.log('已登录，显示管理后台');
        showDashboard();
        if (isCloudBaseReady) {
          loadDashboardData();
        }
      } else {
        localStorage.removeItem('adminSession');
        console.log('会话已过期，显示登录页');
        showLogin();
      }
    } else {
      console.log('未登录，显示登录页');
      showLogin();
    }
  } catch (error) {
    console.error('检查登录状态失败:', error);
    showLogin();
  }
}

// 绑定事件
function bindEvents() {
  console.log('绑定事件...');
  
  // 登录表单
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    console.log('登录表单事件绑定成功');
  }
  
  // 退出登录
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // 导航菜单
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      navigateTo(page);
    });
  });
  
  // 点击模态框外部关闭
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

// 登录处理
function handleLogin(e) {
  e.preventDefault();
  console.log('开始登录处理...');
  
  const usernameInput = document.getElementById('adminUsername');
  const passwordInput = document.getElementById('adminPassword');
  
  if (!usernameInput || !passwordInput) {
    console.error('找不到输入框元素');
    alert('页面加载错误，请刷新重试');
    return;
  }
  
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  
  console.log('用户名:', username);
  
  if (!username || !password) {
    alert('请输入账号和密码');
    return;
  }
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    console.log('登录成功');
    
    // 创建会话
    const session = {
      username: username,
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24小时过期
    };
    
    try {
      localStorage.setItem('adminSession', JSON.stringify(session));
      console.log('会话已保存');
    } catch (e) {
      console.error('保存会话失败:', e);
    }
    
    isLoggedIn = true;
    showDashboard();
    
    if (isCloudBaseReady) {
      loadDashboardData();
    } else {
      console.warn('CloudBase 未就绪，跳过数据加载');
      // 显示空数据状态
      showEmptyDataState();
    }
  } else {
    console.log('登录失败：账号或密码错误');
    alert('账号或密码错误');
  }
}

// 显示空数据状态
function showEmptyDataState() {
  document.getElementById('statTotalMembers').textContent = '-';
  document.getElementById('statNewMembers').textContent = '-';
  document.getElementById('statTotalPoints').textContent = '-';
  document.getElementById('statCouponCount').textContent = '-';
  
  const recentMembers = document.getElementById('recentMembers');
  if (recentMembers) {
    recentMembers.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-plug"></i></div>
        <p class="empty-text">数据库连接失败，请检查网络</p>
      </div>
    `;
  }
}

// 退出登录
function handleLogout() {
  localStorage.removeItem('adminSession');
  isLoggedIn = false;
  showLogin();
}

// 显示登录页
function showLogin() {
  console.log('显示登录页');
  const loginPage = document.getElementById('loginPage');
  const adminDashboard = document.getElementById('adminDashboard');
  
  if (loginPage) loginPage.style.display = 'flex';
  if (adminDashboard) adminDashboard.style.display = 'none';
}

// 显示管理后台
function showDashboard() {
  console.log('显示管理后台');
  const loginPage = document.getElementById('loginPage');
  const adminDashboard = document.getElementById('adminDashboard');
  
  if (loginPage) loginPage.style.display = 'none';
  if (adminDashboard) adminDashboard.style.display = 'block';
}

// 页面导航
function navigateTo(page) {
  console.log('导航到页面:', page);
  
  // 更新导航状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === page) {
      item.classList.add('active');
    }
  });
  
  // 显示对应页面
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.remove('active');
  });
  
  const targetPage = document.getElementById(`page-${page}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // 加载页面数据
  if (isCloudBaseReady) {
    switch(page) {
      case 'dashboard':
        loadDashboardData();
        break;
      case 'members':
        loadMembers();
        break;
      case 'coupons':
        loadCoupons();
        break;
      case 'products':
        loadProducts();
        break;
      case 'records':
        loadRecords();
        break;
    }
  }
}

// 加载仪表盘数据
async function loadDashboardData() {
  if (!isCloudBaseReady) {
    console.warn('CloudBase 未就绪');
    return;
  }
  
  console.log('加载仪表盘数据...');
  
  try {
    // 获取会员总数
    const membersCount = await db.collection('members').count();
    const totalMembersEl = document.getElementById('statTotalMembers');
    if (totalMembersEl) {
      totalMembersEl.textContent = membersCount.total || 0;
    }
    
    // 获取今日新增
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMembers = await db.collection('members')
      .where({
        createTime: db.command.gte(today)
      })
      .count();
    const newMembersEl = document.getElementById('statNewMembers');
    if (newMembersEl) {
      newMembersEl.textContent = todayMembers.total || 0;
    }
    
    // 获取总积分
    const members = await db.collection('members').get();
    const totalPoints = members.data.reduce((sum, m) => sum + (m.points || 0), 0);
    const totalPointsEl = document.getElementById('statTotalPoints');
    if (totalPointsEl) {
      totalPointsEl.textContent = formatNumber(totalPoints);
    }
    
    // 获取优惠券领取数
    const couponCount = await db.collection('user_coupons').count();
    const couponCountEl = document.getElementById('statCouponCount');
    if (couponCountEl) {
      couponCountEl.textContent = couponCount.total || 0;
    }
    
    // 加载最近会员
    loadRecentMembers();
  } catch (error) {
    console.error('加载仪表盘数据失败:', error);
  }
}

// 加载最近会员
async function loadRecentMembers() {
  if (!isCloudBaseReady) return;
  
  try {
    const members = await db.collection('members')
      .orderBy('createTime', 'desc')
      .limit(5)
      .get();
    
    const container = document.getElementById('recentMembers');
    if (!container) return;
    
    if (members.data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fas fa-users"></i></div>
          <p class="empty-text">暂无会员数据</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>会员等级</th>
            <th>积分</th>
            <th>累计消费</th>
            <th>注册时间</th>
          </tr>
        </thead>
        <tbody>
          ${members.data.map(m => `
            <tr>
              <td>
                <span class="tag ${getLevelTagClass(m.level)}">${m.levelName || '普通会员'}</span>
              </td>
              <td class="font-mono">${m.points || 0}</td>
              <td class="font-mono">¥${(m.totalSpend || 0).toFixed(2)}</td>
              <td>${formatDate(m.createTime)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('加载最近会员失败:', error);
  }
}

// 加载会员列表
async function loadMembers() {
  if (!isCloudBaseReady) return;
  
  try {
    const members = await db.collection('members')
      .orderBy('createTime', 'desc')
      .limit(50)
      .get();
    
    const container = document.getElementById('membersTable');
    if (!container) return;
    
    if (members.data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fas fa-users"></i></div>
          <p class="empty-text">暂无会员数据</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>会员等级</th>
            <th>积分</th>
            <th>余额</th>
            <th>累计消费</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${members.data.map(m => `
            <tr>
              <td>
                <span class="tag ${getLevelTagClass(m.level)}">${m.levelName || '普通会员'}</span>
              </td>
              <td class="font-mono">${m.points || 0}</td>
              <td class="font-mono">¥${(m.balance || 0).toFixed(2)}</td>
              <td class="font-mono">¥${(m.totalSpend || 0).toFixed(2)}</td>
              <td>${formatDate(m.createTime)}</td>
              <td>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="adjustPoints('${m._id}', ${m.points || 0})">
                  调整积分
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('加载会员列表失败:', error);
    document.getElementById('membersTable').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-exclamation-circle"></i></div>
        <p class="empty-text">加载失败，请重试</p>
      </div>
    `;
  }
}

// 加载优惠券列表
async function loadCoupons() {
  if (!isCloudBaseReady) return;
  
  try {
    const coupons = await db.collection('coupons')
      .orderBy('createTime', 'desc')
      .get();
    
    const container = document.getElementById('couponsTable');
    if (!container) return;
    
    if (coupons.data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fas fa-ticket-alt"></i></div>
          <p class="empty-text">暂无优惠券</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>优惠券名称</th>
            <th>类型</th>
            <th>优惠</th>
            <th>最低消费</th>
            <th>剩余库存</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${coupons.data.map(c => `
            <tr>
              <td>${c.title}</td>
              <td>${c.type === 'discount' ? '折扣券' : '代金券'}</td>
              <td>${c.type === 'discount' ? (c.amount * 10) + '折' : '¥' + c.amount}</td>
              <td>¥${c.minAmount || 0}</td>
              <td>${c.stock || 0}</td>
              <td>
                <span class="tag ${c.status === 'active' ? 'tag-success' : 'tag-danger'}">
                  ${c.status === 'active' ? '进行中' : '已下架'}
                </span>
              </td>
              <td>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="toggleCouponStatus('${c._id}', '${c.status}')">
                  ${c.status === 'active' ? '下架' : '上架'}
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('加载优惠券失败:', error);
  }
}

// 加载积分商品
async function loadProducts() {
  if (!isCloudBaseReady) return;
  
  try {
    const products = await db.collection('point_products')
      .orderBy('createTime', 'desc')
      .get();
    
    const container = document.getElementById('productsTable');
    if (!container) return;
    
    if (products.data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fas fa-gift"></i></div>
          <p class="empty-text">暂无积分商品</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>商品名称</th>
            <th>所需积分</th>
            <th>库存</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${products.data.map(p => `
            <tr>
              <td>${p.name}</td>
              <td class="font-mono" style="color: #E94560; font-weight: 600;">${p.points}</td>
              <td>${p.stock || 0}</td>
              <td>
                <span class="tag ${p.status === 'active' ? 'tag-success' : 'tag-warning'}">
                  ${p.status === 'active' ? '可兑换' : '已下架'}
                </span>
              </td>
              <td>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="toggleProductStatus('${p._id}', '${p.status}')">
                  ${p.status === 'active' ? '下架' : '上架'}
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('加载积分商品失败:', error);
  }
}

// 加载兑换记录
async function loadRecords() {
  if (!isCloudBaseReady) return;
  
  try {
    // 获取积分兑换记录
    const pointRecords = await db.collection('point_records')
      .orderBy('createTime', 'desc')
      .limit(30)
      .get();
    
    // 获取优惠券领取记录
    const couponRecords = await db.collection('user_coupons')
      .orderBy('receiveTime', 'desc')
      .limit(30)
      .get();
    
    const container = document.getElementById('recordsTable');
    if (!container) return;
    
    // 合并并排序记录
    const allRecords = [
      ...pointRecords.data.map(r => ({...r, type: 'points'})),
      ...couponRecords.data.map(r => ({...r, type: 'coupon'}))
    ].sort((a, b) => {
      const timeA = a.createTime || a.receiveTime;
      const timeB = b.createTime || b.receiveTime;
      return new Date(timeB) - new Date(timeA);
    }).slice(0, 30);
    
    if (allRecords.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fas fa-history"></i></div>
          <p class="empty-text">暂无记录</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>类型</th>
            <th>内容</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          ${allRecords.map(r => `
            <tr>
              <td>
                <span class="tag ${r.type === 'points' ? 'tag-warning' : 'tag-success'}">
                  ${r.type === 'points' ? '积分兑换' : '领取优惠券'}
                </span>
              </td>
              <td>
                ${r.type === 'points' 
                  ? `兑换商品: ${r.productName || '未知商品'} (-${r.points || 0}积分)`
                  : `领取: ${r.couponInfo?.title || '未知优惠券'}`
                }
              </td>
              <td>${formatDate(r.createTime || r.receiveTime)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('加载记录失败:', error);
  }
}

// 打开优惠券模态框
function openCouponModal() {
  const modal = document.getElementById('couponModal');
  const form = document.getElementById('couponForm');
  if (form) form.reset();
  if (modal) modal.classList.add('active');
}

// 打开商品模态框
function openProductModal() {
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');
  if (form) form.reset();
  if (modal) modal.classList.add('active');
}

// 关闭模态框
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// 保存优惠券
async function saveCoupon() {
  if (!isCloudBaseReady) {
    alert('数据库未连接，请刷新页面');
    return;
  }
  
  const title = document.getElementById('couponTitle').value;
  const type = document.getElementById('couponType').value;
  const amount = parseFloat(document.getElementById('couponAmount').value);
  const minAmount = parseFloat(document.getElementById('couponMinAmount').value) || 0;
  const stock = parseInt(document.getElementById('couponStock').value);
  const validDays = parseInt(document.getElementById('couponValidDays').value) || 30;
  
  if (!title || isNaN(amount) || isNaN(stock)) {
    alert('请填写完整信息');
    return;
  }
  
  try {
    await db.collection('coupons').add({
      data: {
        title,
        type,
        amount,
        minAmount,
        stock,
        validDays,
        status: 'active',
        createTime: new Date()
      }
    });
    
    closeModal('couponModal');
    loadCoupons();
    alert('优惠券创建成功');
  } catch (error) {
    console.error('创建优惠券失败:', error);
    alert('创建失败，请重试');
  }
}

// 保存积分商品
async function saveProduct() {
  if (!isCloudBaseReady) {
    alert('数据库未连接，请刷新页面');
    return;
  }
  
  const name = document.getElementById('productName').value;
  const description = document.getElementById('productDesc').value;
  const points = parseInt(document.getElementById('productPoints').value);
  const stock = parseInt(document.getElementById('productStock').value);
  const image = document.getElementById('productImage').value;
  
  if (!name || isNaN(points) || isNaN(stock)) {
    alert('请填写完整信息');
    return;
  }
  
  try {
    await db.collection('point_products').add({
      data: {
        name,
        description,
        points,
        stock,
        image: image || '/images/default-product.png',
        status: 'active',
        createTime: new Date()
      }
    });
    
    closeModal('productModal');
    loadProducts();
    alert('商品添加成功');
  } catch (error) {
    console.error('添加商品失败:', error);
    alert('添加失败，请重试');
  }
}

// 切换优惠券状态
async function toggleCouponStatus(id, currentStatus) {
  if (!isCloudBaseReady) {
    alert('数据库未连接');
    return;
  }
  
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  try {
    await db.collection('coupons').doc(id).update({
      data: { status: newStatus }
    });
    loadCoupons();
  } catch (error) {
    console.error('更新优惠券状态失败:', error);
    alert('操作失败');
  }
}

// 切换商品状态
async function toggleProductStatus(id, currentStatus) {
  if (!isCloudBaseReady) {
    alert('数据库未连接');
    return;
  }
  
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  try {
    await db.collection('point_products').doc(id).update({
      data: { status: newStatus }
    });
    loadProducts();
  } catch (error) {
    console.error('更新商品状态失败:', error);
    alert('操作失败');
  }
}

// 调整积分
async function adjustPoints(memberId, currentPoints) {
  if (!isCloudBaseReady) {
    alert('数据库未连接');
    return;
  }
  
  const points = prompt(`当前积分: ${currentPoints}\n请输入要调整的积分值（正数为增加，负数为减少）:`);
  if (points === null) return;
  
  const adjustValue = parseInt(points);
  if (isNaN(adjustValue)) {
    alert('请输入有效的数字');
    return;
  }
  
  try {
    await db.collection('members').doc(memberId).update({
      data: {
        points: db.command.inc(adjustValue)
      }
    });
    
    // 添加积分记录
    await db.collection('point_records').add({
      data: {
        memberId,
        points: adjustValue,
        type: adjustValue > 0 ? 'add' : 'deduct',
        reason: '管理员调整',
        createTime: new Date()
      }
    });
    
    loadMembers();
    alert('积分调整成功');
  } catch (error) {
    console.error('调整积分失败:', error);
    alert('调整失败');
  }
}

// 刷新会员列表
function refreshMembers() {
  loadMembers();
}

// 获取等级标签样式
function getLevelTagClass(level) {
  switch(level) {
    case 1: return 'tag-secondary';
    case 2: return 'tag-success';
    case 3: return 'tag-warning';
    case 4: return 'tag-danger';
    default: return 'tag-secondary';
  }
}

// 格式化数字
function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  return num.toString();
}

// 格式化日期
function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 显示错误
function showError(message) {
  console.error(message);
}

// 启动应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
