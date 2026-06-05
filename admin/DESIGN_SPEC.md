# 商场会员小程序后台管理页面 - 设计规范

## DESIGN SPECIFICATION

### 1. Purpose Statement
为商场会员小程序创建一个专业的后台管理界面，让管理员能够高效地管理会员数据、优惠券、积分商品和查看统计数据。界面需要简洁直观，同时具有专业感和品牌识别度。

### 2. Aesthetic Direction
**Luxury/Refined (奢华精致)**
- 采用深色主题配合金色点缀，营造高端商务感
- 使用精致的排版和充足的留白
- 强调数据可视化和信息层级

### 3. Color Palette
```
--primary-dark: #1a1a2e      /* 深邃蓝黑 - 主背景 */
--secondary-dark: #16213e    /* 深蓝 - 卡片背景 */
--accent-gold: #d4af37       /* 金色 - 强调色 */
--accent-gold-light: #f4e4c1 /* 浅金色 - 悬停状态 */
--text-primary: #ffffff      /* 纯白 - 主要文字 */
--text-secondary: #a0a0a0    /* 灰色 - 次要文字 */
--success: #10b981           /* 翡翠绿 - 成功状态 */
--warning: #f59e0b           /* 琥珀色 - 警告状态 */
--danger: #ef4444            /* 红色 - 危险状态 */
--info: #3b82f6              /* 蓝色 - 信息状态 */
```

### 4. Typography
```
标题字体: 'Playfair Display', serif    /* 优雅衬线字体 */
正文字体: 'Source Sans Pro', sans-serif /* 清晰无衬线字体 */
数据字体: 'JetBrains Mono', monospace  /* 等宽字体用于数字 */
```

### 5. Layout Strategy
- **侧边导航栏**: 固定左侧，深色背景，金色激活指示器
- **主内容区**: 采用非对称网格布局，卡片错落排列
- **数据卡片**: 使用微妙的阴影和边框高亮
- **响应式设计**: 移动端侧边栏可折叠
