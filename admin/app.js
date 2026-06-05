// 商场会员管理系统 - 后台管理
const app = cloudbase.init({
    env: 'cs20260605-d7ge3qv3adead64a3'
});

const db = app.database();
const auth = app.auth();

// 全局状态
let currentUser = null;
let currentPage = 'dashboard';
let membersData = [];
let couponsData = [];
let productsData = [];
let recordsData = [];
let memberPage = 0;
const MEMBER_PAGE_SIZE = 10;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    checkLoginState();
    setupEventListeners();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

// 检查登录状态
function checkLoginState() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showMainApp();
        loadDashboardData();
    } else {
        showLoginPage();
    }
}

// 显示登录页
function showLoginPage() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

// 显示主应用
function showMainApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
}

// 设置事件监听
function setupEventListeners() {
    // 登录表单
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // 导航切换
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            switchPage(page);
        });
    });
    
    // 会员搜索
    document.getElementById('memberSearch').addEventListener('input', debounce(searchMembers, 300));
    document.getElementById('memberLevelFilter').addEventListener('change', filterMembers);
    
    // 分页
    document.getElementById('prevPage').addEventListener('click', () => changeMemberPage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changeMemberPage(1));
    
    // 优惠券弹窗
    document.getElementById('addCouponBtn').addEventListener('click', () => {
        document.getElementById('couponModal').classList.remove('hidden');
    });
    document.getElementById('closeCouponModal').addEventListener('click', () => {
        document.getElementById('couponModal').classList.add('hidden');
    });
    document.getElementById('couponForm').addEventListener('submit', handleCreateCoupon);
    
    // 商品弹窗
    document.getElementById('addProductBtn').addEventListener('click', () => {
        document.getElementById('productModal').classList.remove('hidden');
    });
    document.getElementById('closeProductModal').addEventListener('click', () => {
        document.getElementById('productModal').classList.add('hidden');
    });
    document.getElementById('productForm').addEventListener('submit', handleCreateProduct);
    
    // 导出会员
    document.getElementById('exportMembers').addEventListener('click', exportMembers);
    
    // 记录筛选
    document.getElementById('recordTypeFilter').addEventListener('change', filterRecords);
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // 简单的本地验证（生产环境应该使用云开发认证）
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        showMainApp();
        loadDashboardData();
    } else {
        alert('账号或密码错误！');
    }
}

// 处理退出
function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    showLoginPage();
}

// 切换页面
function switchPage(page) {
    currentPage = page;
    
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    // 隐藏所有页面
    document.querySelectorAll('.page-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // 显示目标页面
    document.getElementById(page + 'Page').classList.remove('hidden');
    
    // 更新页面标题
    const titles = {
        dashboard: '数据概览',
        members: '会员管理',
        coupons: '优惠券管理',
        products: '积分商品',
        records: '交易记录'
    };
    document.getElementById('pageTitle').textContent = titles[page];
    
    // 加载页面数据
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

// 加载仪表盘数据
async function loadDashboardData() {
    try {
        // 获取会员总数
        const membersCount = await db.collection('members').count();
        document.getElementById('totalMembers').textContent = membersCount.total;
        
        // 获取总积分
        const membersRes = await db.collection('members').get();
        let totalPoints = 0;
        membersRes.data.forEach(m => {
            totalPoints += m.points || 0;
        });
        document.getElementById('totalPoints').textContent = totalPoints.toLocaleString();
        
        // 获取优惠券领取数
        const couponsCount = await db.collection('user_coupons').count();
        document.getElementById('totalCoupons').textContent = couponsCount.total;
        
        // 获取今日兑换数
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayExchanges = await db.collection('point_records')
            .where({
                type: 'exchange',
                createTime: db.command.gte(today)
            })
            .count();
        document.getElementById('todayExchanges').textContent = todayExchanges.total;
        
        // 加载图表
        loadCharts();
        
        // 加载最近活动
        loadRecentActivities();
    } catch (error) {
        console.error('加载仪表盘数据失败:', error);
    }
}

// 加载图表
async function loadCharts() {
    // 会员增长趋势
    const memberCtx = document.getElementById('memberChart').getContext('2d');
    new Chart(memberCtx, {
        type: 'line',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '新增会员',
                data: [12, 19, 15, 25, 22, 30, 28],
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#a0a0a0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#a0a0a0' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
    
    // 积分使用情况
    const pointsCtx = document.getElementById('pointsChart').getContext('2d');
    new Chart(pointsCtx, {
        type: 'doughnut',
        data: {
            labels: ['积分获取', '积分兑换', '积分过期'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: ['#10b981', '#d4af37', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#ffffff' }
                }
            }
        }
    });
}

// 加载最近活动
async function loadRecentActivities() {
    try {
        const records = await db.collection('point_records')
            .orderBy('createTime', 'desc')
            .limit(5)
            .get();
        
        const container = document.getElementById('recentActivities');
        container.innerHTML = '';
        
        records.data.forEach(record => {
            const activity = document.createElement('div');
            activity.className = 'flex items-center justify-between py-3 border-b border-gray-800 last:border-0';
            
            let icon, color, text;
            switch(record.type) {
                case 'add':
                    icon = 'fa-plus-circle';
                    color = 'text-green-400';
                    text = '积分增加';
                    break;
                case 'exchange':
                    icon = 'fa-gift';
                    color = 'text-amber-400';
                    text = '兑换商品';
                    break;
                case 'coupon':
                    icon = 'fa-ticket-alt';
                    color = 'text-purple-400';
                    text = '领取优惠券';
                    break;
                default:
                    icon = 'fa-circle';
                    color = 'text-gray-400';
                    text = '其他';
            }
            
            activity.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center ${color}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div>
                        <p class="text-white font-medium">${text}</p>
                        <p class="text-gray-500 text-sm">${record.description || '-'}</p>
                    </div>
                </div>
                <span class="text-gray-500 text-sm">${formatTime(record.createTime)}</span>
            `;
            
            container.appendChild(activity);
        });
    } catch (error) {
        console.error('加载活动失败:', error);
    }
}

// 加载会员列表
async function loadMembers() {
    try {
        const res = await db.collection('members')
            .skip(memberPage * MEMBER_PAGE_SIZE)
            .limit(MEMBER_PAGE_SIZE)
            .get();
        
        membersData = res.data;
        renderMembersTable();
        updatePagination();
    } catch (error) {
        console.error('加载会员失败:', error);
    }
}

// 渲染会员表格
function renderMembersTable() {
    const tbody = document.getElementById('membersTable');
    tbody.innerHTML = '';
    
    membersData.forEach(member => {
        const levelNames = {
            1: '普通会员',
            2: '银卡会员',
            3: '金卡会员',
            4: '钻石会员'
        };
        
        const levelColors = {
            1: 'bg-gray-600',
            2: 'bg-blue-600',
            3: 'bg-amber-600',
            4: 'bg-purple-600'
        };
        
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-800 hover:bg-gray-800/50 transition-colors';
        tr.innerHTML = `
            <td class="py-4 px-4">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold-light flex items-center justify-center text-primary-dark font-bold">
                        ${member.nickName ? member.nickName.charAt(0) : '?'}
                    </div>
                    <div>
                        <p class="text-white font-medium">${member.nickName || '未知用户'}</p>
                        <p class="text-gray-500 text-sm">ID: ${member._id.slice(-8)}</p>
                    </div>
                </div>
            </td>
            <td class="py-4 px-4">
                <span class="px-3 py-1 rounded-full text-xs ${levelColors[member.level || 1]} text-white">
                    ${levelNames[member.level || 1]}
                </span>
            </td>
            <td class="py-4 px-4 font-mono text-accent-gold">${member.points || 0}</td>
            <td class="py-4 px-4 font-mono">¥${(member.totalSpend || 0).toFixed(2)}</td>
            <td class="py-4 px-4 text-gray-400">${formatDate(member.createTime)}</td>
            <td class="py-4 px-4">
                <button onclick="editMember('${member._id}')" class="text-accent-gold hover:text-accent-gold-light mr-3">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="adjustPoints('${member._id}')" class="text-blue-400 hover:text-blue-300">
                    <i class="fas fa-coins"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 搜索会员
function searchMembers() {
    const keyword = document.getElementById('memberSearch').value.toLowerCase();
    // 实现搜索逻辑
    console.log('搜索:', keyword);
}

// 筛选会员
function filterMembers() {
    const level = document.getElementById('memberLevelFilter').value;
    // 实现筛选逻辑
    console.log('筛选等级:', level);
}

// 切换会员页
function changeMemberPage(delta) {
    memberPage += delta;
    if (memberPage < 0) memberPage = 0;
    loadMembers();
}

// 更新分页
function updatePagination() {
    document.getElementById('membersPagination').textContent = 
        `第 ${memberPage + 1} 页`;
}

// 加载优惠券
async function loadCoupons() {
    try {
        const res = await db.collection('coupons').get();
        couponsData = res.data;
        renderCoupons();
    } catch (error) {
        console.error('加载优惠券失败:', error);
    }
}

// 渲染优惠券
function renderCoupons() {
    const container = document.getElementById('couponsList');
    container.innerHTML = '';
    
    couponsData.forEach(coupon => {
        const card = document.createElement('div');
        card.className = 'glass-card rounded-xl p-6 relative overflow-hidden';
        
        const typeText = coupon.type === 'discount' ? '折扣券' : '代金券';
        const amountText = coupon.type === 'discount' ? `${coupon.amount}折` : `¥${coupon.amount}`;
        
        card.innerHTML = `
            <div class="absolute top-0 right-0 w-24 h-24 bg-accent-gold/10 rounded-full -mr-12 -mt-12"></div>
            <div class="relative">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <span class="px-2 py-1 rounded text-xs bg-accent-gold/20 text-accent-gold">${typeText}</span>
                        <h4 class="font-display text-xl font-bold mt-2">${coupon.title}</h4>
                    </div>
                    <div class="text-right">
                        <p class="font-display text-3xl font-bold gold-gradient-text">${amountText}</p>
                    </div>
                </div>
                <p class="text-gray-400 text-sm mb-4">${coupon.description || '无使用门槛'}</p>
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">库存: ${coupon.stock || 0}</span>
                    <span class="text-gray-500">有效期: ${coupon.validDays || 30}天</span>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                    <span class="text-xs ${coupon.status === 'active' ? 'text-green-400' : 'text-red-400'}">
                        ${coupon.status === 'active' ? '进行中' : '已下架'}
                    </span>
                    <div class="space-x-2">
                        <button onclick="editCoupon('${coupon._id}')" class="text-accent-gold hover:text-accent-gold-light">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteCoupon('${coupon._id}')" class="text-red-400 hover:text-red-300">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// 创建优惠券
async function handleCreateCoupon(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        await db.collection('coupons').add({
            title: formData.get('title'),
            type: formData.get('type'),
            amount: parseFloat(formData.get('amount')),
            minAmount: parseFloat(formData.get('minAmount')),
            stock: parseInt(formData.get('stock')),
            validDays: parseInt(formData.get('validDays')),
            status: 'active',
            createTime: new Date()
        });
        
        document.getElementById('couponModal').classList.add('hidden');
        e.target.reset();
        loadCoupons();
        alert('优惠券创建成功！');
    } catch (error) {
        console.error('创建优惠券失败:', error);
        alert('创建失败，请重试');
    }
}

// 加载积分商品
async function loadProducts() {
    try {
        const res = await db.collection('point_products').get();
        productsData = res.data;
        renderProducts();
    } catch (error) {
        console.error('加载商品失败:', error);
    }
}

// 渲染商品
function renderProducts() {
    const container = document.getElementById('productsList');
    container.innerHTML = '';
    
    productsData.forEach(product => {
        const card = document.createElement('div');
        card.className = 'glass-card rounded-xl overflow-hidden';
        
        card.innerHTML = `
            <div class="h-40 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                ${product.image ? 
                    `<img src="${product.image}" class="w-full h-full object-cover">` :
                    `<i class="fas fa-gift text-4xl text-gray-600"></i>`
                }
            </div>
            <div class="p-6">
                <h4 class="font-display text-lg font-bold mb-2">${product.name}</h4>
                <p class="text-gray-400 text-sm mb-4 line-clamp-2">${product.description || '暂无描述'}</p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center text-accent-gold">
                        <i class="fas fa-coins mr-2"></i>
                        <span class="font-mono font-bold">${product.points}</span>
                    </div>
                    <span class="text-gray-500 text-sm">库存: ${product.stock}</span>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                    <span class="text-xs ${product.status === 'active' ? 'text-green-400' : 'text-red-400'}">
                        ${product.status === 'active' ? '上架中' : '已下架'}
                    </span>
                    <div class="space-x-2">
                        <button onclick="editProduct('${product._id}')" class="text-accent-gold hover:text-accent-gold-light">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteProduct('${product._id}')" class="text-red-400 hover:text-red-300">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// 创建商品
async function handleCreateProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
        await db.collection('point_products').add({
            name: formData.get('name'),
            description: formData.get('description'),
            points: parseInt(formData.get('points')),
            stock: parseInt(formData.get('stock')),
            image: formData.get('image'),
            status: 'active',
            createTime: new Date()
        });
        
        document.getElementById('productModal').classList.add('hidden');
        e.target.reset();
        loadProducts();
        alert('商品添加成功！');
    } catch (error) {
        console.error('添加商品失败:', error);
        alert('添加失败，请重试');
    }
}

// 加载交易记录
async function loadRecords() {
    try {
        const res = await db.collection('point_records')
            .orderBy('createTime', 'desc')
            .limit(50)
            .get();
        
        recordsData = res.data;
        renderRecords();
    } catch (error) {
        console.error('加载记录失败:', error);
    }
}

// 渲染记录
function renderRecords() {
    const tbody = document.getElementById('recordsTable');
    tbody.innerHTML = '';
    
    recordsData.forEach(record => {
        const typeConfig = {
            'add': { text: '积分增加', color: 'text-green-400', icon: 'fa-plus' },
            'deduct': { text: '积分扣除', color: 'text-red-400', icon: 'fa-minus' },
            'exchange': { text: '商品兑换', color: 'text-amber-400', icon: 'fa-gift' },
            'coupon': { text: '领取优惠券', color: 'text-purple-400', icon: 'fa-ticket-alt' }
        };
        
        const config = typeConfig[record.type] || typeConfig['add'];
        
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-800 hover:bg-gray-800/50 transition-colors';
        tr.innerHTML = `
            <td class="py-4 px-4 text-gray-400">${formatDateTime(record.createTime)}</td>
            <td class="py-4 px-4">${record.nickName || '未知用户'}</td>
            <td class="py-4 px-4">
                <span class="${config.color}">
                    <i class="fas ${config.icon} mr-2"></i>${config.text}
                </span>
            </td>
            <td class="py-4 px-4">${record.description || '-'}</td>
            <td class="py-4 px-4 font-mono ${record.points > 0 ? 'text-green-400' : 'text-red-400'}">
                ${record.points > 0 ? '+' : ''}${record.points || 0}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 筛选记录
function filterRecords() {
    const type = document.getElementById('recordTypeFilter').value;
    // 实现筛选逻辑
    console.log('筛选类型:', type);
}

// 导出会员
function exportMembers() {
    const csv = convertToCSV(membersData);
    downloadCSV(csv, 'members.csv');
}

// 工具函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateTime(date) {
    if (!date) return '-';
    const d = new Date(date);
    return `${formatDate(date)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatTime(date) {
    if (!date) return '-';
    const now = new Date();
    const d = new Date(date);
    const diff = now - d;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return formatDate(date);
}

function updateCurrentTime() {
    const now = new Date();
    document.getElementById('currentTime').textContent = 
        now.toLocaleString('zh-CN', { 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
}

function convertToCSV(data) {
    const headers = ['ID', '昵称', '等级', '积分', '累计消费', '注册时间'];
    const rows = data.map(item => [
        item._id,
        item.nickName,
        item.level,
        item.points,
        item.totalSpend,
        formatDate(item.createTime)
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// 占位函数
function editMember(id) {
    console.log('编辑会员:', id);
}

function adjustPoints(id) {
    console.log('调整积分:', id);
}

function editCoupon(id) {
    console.log('编辑优惠券:', id);
}

function deleteCoupon(id) {
    if (confirm('确定要删除这个优惠券吗？')) {
        console.log('删除优惠券:', id);
    }
}

function editProduct(id) {
    console.log('编辑商品:', id);
}

function deleteProduct(id) {
    if (confirm('确定要删除这个商品吗？')) {
        console.log('删除商品:', id);
    }
}
