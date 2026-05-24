export const currentUser = {
  id: 'me',
  name: '我',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
};

export const groupInfo = {
  name: '前端交流群',
  memberCount: 8,
};

export const members = [
  { id: 'u1', name: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三' },
  { id: 'u2', name: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李四' },
  { id: 'u3', name: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王五' },
  { id: 'u4', name: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=赵六' },
];

export const initialMessages = [
  {
    id: 1,
    userId: 'u1',
    type: 'text',
    content: '大家晚上好！今天讨论什么话题？',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).getTime(),
  },
  {
    id: 2,
    userId: 'u2',
    type: 'text',
    content: '最近在学 React，有点头大 😂',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).getTime(),
  },
  {
    id: 3,
    userId: 'me',
    type: 'text',
    content: 'hooks 确实需要适应一下，但用熟了很爽',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).getTime(),
  },
  {
    id: 4,
    userId: 'u3',
    type: 'text',
    content: '推荐看 React 官方文档，比教程靠谱',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).getTime(),
  },
  {
    id: 5,
    userId: 'u4',
    type: 'text',
    content: '我已经把项目迁到 Vite 了，构建速度快了十倍',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).getTime(),
  },
  {
    id: 6,
    userId: 'u1',
    type: 'text',
    content: 'Vite 确实香，热更新秒开',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).getTime(),
  },
  {
    id: 7,
    userId: 'u2',
    type: 'image',
    content: '看这个截图，React Fiber 架构',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).getTime(),
    imagePath: '/api/photos/photo_1@15-06-2025_10-09-18.jpg',
    imageThumb: '/api/photos/photo_1@15-06-2025_10-09-18_thumb.jpg',
  },
];

// ── 用户个人信息 ──────────────────────────────────────
export const userProfile = {
  id: 'me',
  name: '前端开发小王',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  wechatId: 'wang_dev_2024',
  region: '中国 上海',
  signature: '写代码，看世界',
  phone: '138****8888',
};

// ── 通讯录 ─────────────────────────────────────────
export const contacts = [
  { id: 'u1', name: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三', pinyin: 'Z', remark: '张-技术总监' },
  { id: 'u2', name: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李四', pinyin: 'L', remark: null },
  { id: 'u3', name: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=王五', pinyin: 'W', remark: null },
  { id: 'u4', name: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=赵六', pinyin: 'Z', remark: '赵-产品' },
  { id: 'u5', name: '钱七', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=钱七', pinyin: 'Q', remark: null },
  { id: 'u6', name: '孙八', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=孙八', pinyin: 'S', remark: null },
  { id: 'u7', name: '小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=小明', pinyin: 'X', remark: null },
  { id: 'u8', name: 'Alice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', pinyin: 'A', remark: null },
  { id: 'u9', name: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', pinyin: 'B', remark: null },
  { id: 'u10', name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', pinyin: 'C', remark: null },
];

// ── 聊天会话 ─────────────────────────────────────
export const chatSessions = [
  {
    id: 'session_u1',
    type: 'private',
    contactId: 'u1',
    name: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=张三',
    lastMessage: { content: '明天开会记得带电脑', timestamp: Date.now() - 1000 * 60 * 5 },
    unreadCount: 2,
    muted: false,
    pinned: true,
    messages: [
      { id: 's1_m1', userId: 'u1', type: 'text', content: '在吗？有个需求想聊聊', timestamp: Date.now() - 1000 * 60 * 60 },
      { id: 's1_m2', userId: 'me', type: 'text', content: '你说', timestamp: Date.now() - 1000 * 60 * 55 },
      { id: 's1_m3', userId: 'u1', type: 'text', content: '客户端要加一个夜间模式', timestamp: Date.now() - 1000 * 60 * 30 },
      { id: 's1_m4', userId: 'me', type: 'text', content: '可以，我来排期', timestamp: Date.now() - 1000 * 60 * 20 },
      { id: 's1_m5', userId: 'u1', type: 'text', content: '明天开会记得带电脑', timestamp: Date.now() - 1000 * 60 * 5 },
    ],
  },
  {
    id: 'session_group',
    type: 'group',
    contactId: null,
    name: '前端交流群',
    avatar: null,
    memberIds: ['u1', 'u2', 'u3', 'u4'],
    memberCount: 8,
    lastMessage: { content: 'Vite 确实香，热更新秒开', timestamp: Date.now() - 1000 * 60 * 3 },
    unreadCount: 0,
    muted: true,
    pinned: true,
    messages: [
      { id: 'g1', userId: 'u1', type: 'text', content: '大家晚上好！今天讨论什么话题？', timestamp: Date.now() - 1000 * 60 * 30 },
      { id: 'g2', userId: 'u2', type: 'text', content: '最近在学 React，有点头大', timestamp: Date.now() - 1000 * 60 * 25 },
      { id: 'g3', userId: 'me', type: 'text', content: 'hooks 确实需要适应一下，但用熟了很爽', timestamp: Date.now() - 1000 * 60 * 20 },
      { id: 'g4', userId: 'u3', type: 'text', content: '推荐看 React 官方文档，比教程靠谱', timestamp: Date.now() - 1000 * 60 * 15 },
      { id: 'g5', userId: 'u4', type: 'text', content: '我已经把项目迁到 Vite 了，构建速度快了十倍', timestamp: Date.now() - 1000 * 60 * 10 },
      { id: 'g6', userId: 'u1', type: 'text', content: 'Vite 确实香，热更新秒开', timestamp: Date.now() - 1000 * 60 * 3 },
    ],
  },
  {
    id: 'session_u2',
    type: 'private',
    contactId: 'u2',
    name: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=李四',
    lastMessage: { content: '哈哈哈哈', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
    unreadCount: 0,
    muted: false,
    pinned: false,
    messages: [
      { id: 's2_m1', userId: 'u2', type: 'text', content: '看了你发的文章，写得真好', timestamp: Date.now() - 1000 * 60 * 60 * 3 },
      { id: 's2_m2', userId: 'me', type: 'text', content: '谢谢！还在完善中', timestamp: Date.now() - 1000 * 60 * 60 * 2.5 },
      { id: 's2_m3', userId: 'u2', type: 'text', content: '哈哈哈哈', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
    ],
  },
  {
    id: 'session_u4',
    type: 'private',
    contactId: 'u4',
    name: '赵六',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=赵六',
    lastMessage: { content: '原型图已更新，你看看', timestamp: Date.now() - 1000 * 60 * 60 * 24 },
    unreadCount: 1,
    muted: false,
    pinned: false,
    messages: [
      { id: 's4_m1', userId: 'u4', type: 'text', content: '新版原型的交互逻辑调整了', timestamp: Date.now() - 1000 * 60 * 60 * 48 },
      { id: 's4_m2', userId: 'me', type: 'text', content: '我看看', timestamp: Date.now() - 1000 * 60 * 60 * 47 },
      { id: 's4_m3', userId: 'u4', type: 'text', content: '原型图已更新，你看看', timestamp: Date.now() - 1000 * 60 * 60 * 24 },
    ],
  },
  {
    id: 'session_u5',
    type: 'private',
    contactId: 'u5',
    name: '钱七',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=钱七',
    lastMessage: { content: '周五团建去不去？', timestamp: Date.now() - 1000 * 60 * 60 * 48 },
    unreadCount: 0,
    muted: false,
    pinned: false,
    messages: [
      { id: 's5_m1', userId: 'u5', type: 'text', content: '周五团建去不去？', timestamp: Date.now() - 1000 * 60 * 60 * 48 },
    ],
  },
];
