// 管理员账号配置
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// 初始化
function init() {
  console.log('=== 管理后台初始化 ===');
  
  // 绑定登录表单事件
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    console.log('找到登录表单，绑定提交事件');
    loginForm.addEventListener('submit', handleLogin);
  } else {
    console.error('未找到登录表单！');
  }
  
  // 检查登录状态
  checkLoginStatus();
}

// 检查登录状态
function checkLoginStatus() {
  console.log('检查登录状态...');
  const session = localStorage.getItem('adminSession');
  
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      if (sessionData.expires > Date.now()) {
        console.log('会话有效，显示管理后台');
        showDashboard();
        return;
      } else {
        console.log('会话已过期');
        localStorage.removeItem('adminSession');
      }
    } catch (e) {
      console.error('会话数据解析失败:', e);
      localStorage.removeItem('adminSession');
    }
  }
  
  console.log('未登录，显示登录页面');
  showLogin();
}

// 登录处理
function handleLogin(e) {
  e.preventDefault();
  console.log('=== 登录表单提交 ===');
  
  const usernameInput = document.getElementById('adminUsername');
  const passwordInput = document.getElementById('adminPassword');
  
  if (!usernameInput || !passwordInput) {
    console.error('未找到输入框！');
    alert('系统错误，请刷新页面重试');
    return;
  }
  
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  
  console.log('输入的账号:', username);
  console.log('密码长度:', password.length);
  
  if (!username || !password) {
    alert('请输入账号和密码');
    return;
  }
  
  // 验证账号密码
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    console.log('账号密码验证通过！');
    
    // 创建会话
    const session = {
      username: username,
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24小时过期
    };
    localStorage.setItem('adminSession', JSON.stringify(session));
    
    console.log('会话已保存，准备显示管理后台');
    showDashboard();
    alert('登录成功！');
  } else {
    console.log('账号或密码错误');
    alert('账号或密码错误');
  }
}

// 退出登录
function handleLogout() {
  console.log('退出登录');
  localStorage.removeItem('adminSession');
  showLogin();
}

// 显示登录页
function showLogin() {
  console.log('显示登录页面');
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
  
  // 绑定导航事件
  bindNavEvents();
  
  // 绑定退出登录
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

// 绑定导航事件
function bindNavEvents() {
  console.log('绑定导航事件');
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      console.log('切换到页面:', page);
      
      // 更新导航状态
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // 显示对应页面
      document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
      });
      
      const targetPage = document.getElementById(`page-${page}`);
      if (targetPage) {
        targetPage.classList.add('active');
      }
    });
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 如果 DOM 已经加载完成，立即初始化
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log('DOM 已加载，立即初始化');
  init();
}
