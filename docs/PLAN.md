# Fake WeChat 微信群聊模拟 — 实施计划

## 项目概述

用 React 18 + Vite + Tailwind CSS 快速实现一个模拟微信群聊界面的 Web 应用，支持模拟消息发送、自动回复等交互。

## 技术选型

| 层级 | 技术 | 用途 |
|------|------|------|
| 框架 | React 18 + Vite | 快速启动，热更新 |
| 样式 | Tailwind CSS | 微信 UI 原子化样式 |
| 图标 | Lucide React | 微信功能图标 |
| 状态 | React Hooks (useState/useRef) | 消息数据管理 |
| 滚动 | 原生 scrollIntoView | 消息自动触底 |

---

## Phase 1 — 项目初始化

- [x] 1.1 用 Vite 初始化 React 项目
- [x] 1.2 安装依赖（tailwindcss, @tailwindcss/vite, lucide-react）
- [x] 1.3 配置 vite.config.js

## Phase 2 — 基础骨架

- [x] 2.1 `src/index.css` — Tailwind 导入 + WeChat 主题色 + 气泡三角 CSS + 隐藏滚动条
- [x] 2.2 `index.html` — 移动端 viewport + 禁止橡皮筋效果
- [x] 2.3 `src/data/mockData.js` — 用户信息、群信息、6 条初始消息

## Phase 3 — 核心组件

- [x] 3.1 `src/components/MessageBubble.jsx` — 单条消息气泡（区分自己/他人、头像、昵称、三角方向）
- [x] 3.2 `src/components/TimeDivider.jsx` — 时间分割线（刚刚 / X分钟前 / X月X日）
- [x] 3.3 `src/components/MessageList.jsx` — 消息列表（自动滚动 + 时间线判断 + 连续消息隐藏头像）
- [x] 3.4 `src/components/ChatInput.jsx` — 输入框（自适应高度、Enter 发送、文字状态切换）
- [x] 3.5 `src/components/ChatHeader.jsx` — 顶部导航栏

## Phase 4 — 组装 App

- [x] 4.1 `src/App.jsx` — 组装 Header + List + Input；发送消息 + 模拟随机回复

## Phase 5 — 验证运行

- [x] 5.1 `npm run dev` 启动开发服务器
- [ ] 5.2 浏览器 F12 移动端模式预览验证（开发者自行在 http://localhost:5176 查看）

## Phase 6 — 双模式架构 + Manifest 轮询引擎（已完成）

### 双模式路由（`src/main.jsx`）

| URL | 模式 | 说明 |
|-----|------|------|
| `/` （默认） | **MockData 模式** | 原始聊天页面，mockData 6 条消息 + 手动发送 + 随机回复 |
| `/?mode=chat-engine` | **Chat Engine 模式** | Manifest 轮询引擎，自动加载全部 3083 条消息 |

### Chat Engine 模式详情

- [x] 6.1 `src/modules/chat-engine/index.js` — manifest 轮询引擎
  - 读取 `/api/manifest.json` 获取 103 个 chunk 索引
  - 挨个 `fetch` 每个 chunk 文件（`messages_001.json` ~ `messages_103.json`）
  - 每个 chunk 对应一个**不同人物**（103 个唯一昵称 + DiceBear 头像）
  - `pollChunks(onChunk)` 每加载完一个 chunk 通过回调推送
- [x] 6.2 `src/ChatEngineApp.jsx` — 独立聊天引擎页面
  - 进入页面显示「开始模拟会话」按钮 + 提示信息（103 个帖子，3~5 秒/条）
  - 点击后自动轮询 manifest 并按 **3~5 秒/条** 逐条释放到聊天流
  - 实时进度条 + 剩余条数 + 速度提示
  - 暂停/继续按钮：点击暂停后停止新消息释放
  - 手动滚动检测：用户滚动时自动暂停新消息
  - 10 秒无滚动自动恢复模拟会话
  - 支持手动发送消息 + 自动回复（1.5~3.5 秒随机发信人回复）
- [x] 6.3 `src/components/MessageList.jsx` — 双模式兼容
  - mockData 模式：优先匹配 mockData 中的发信人
  - chat-engine 模式：动态从消息中提取发信人
- [x] 6.4 `src/components/MessageBubble.jsx` — 双模式兼容
  - 自动判断当前模式，展示对应头像 + 昵称 + reactions

### PC 端适配

- [x] 6.5 `src/index.css` — 新增 `.pc-scrollbar` 桌面端滚动条样式
- [x] 6.6 全部组件支持 `pc` prop，Chat Engine 模式使用 PC 桌面布局
  - 全宽布局（无 `max-w-md` 限制）
  - PC 风格 Header（更宽、更大字号、Search 图标）
  - PC 风格 Input（3 行文本框 + 右侧发送按钮）
  - PC 风格气泡（max-w-[55%]、更细的边框、更紧凑的内边距）
  - PC 滚动条（6px 宽度，半透明滑块）
  - 启动卡片（白色卡片 + 阴影，居中展示）

## Phase 7 — V1.1 图片消息（已完成）

- [x] 7.1 `src/modules/chat-engine/index.js` — `convertMessage` 支持 `type === 'image'`，存储 `imagePath` / `imageThumb`
- [x] 7.1 `src/data/mockData.js` — 默认模式添加 1 条模拟图片消息
- [x] 7.2 `src/components/MessageBubble.jsx` — 图片气泡渲染（PC max-h-64 / 移动端 max-h-48，下方显示描述文字）
- [x] 7.3 `src/index.css` — `.img-bubble` 样式

## Phase 8 — V1.4 右键菜单（已完成）

- [x] 8.1 `src/components/ContextMenu.jsx` — 新建右键菜单组件，支持**复制**功能
- [x] 8.2 `src/components/MessageBubble.jsx` — `onContextMenu` 集成右键菜单

## Phase 9 — V2.1 消息持久化（已完成）

- [x] 9.1 `src/utils/storage.js` — localStorage 工具（`saveUserMessages` / `loadUserMessages`）
- [x] 9.2 `src/App.jsx` — 默认模式加载 + 保存用户消息
- [x] 9.2 `src/ChatEngineApp.jsx` — Chat Engine 模式保存用户发送的消息

---

## 后期二开路线图

| 阶段 | 功能 | 实现方式 |
|------|------|---------|
| V1.1 | 图片消息 | `type === 'image'` 分支，`<img>` 展示 |
| V1.2 | 语音消息 | 波形动画，点击播放，模拟时长显示 |
| V1.3 | 红包/转账 | 特殊气泡样式，点击弹窗 |
| V1.4 | 长按菜单 | `onContextMenu` + 自定义菜单组件（撤回、复制、转发） |
| V2.0 | 后端接入 | WebSocket 或 Socket.io 替换模拟回复 |
| V2.1 | 消息持久化 | localStorage / IndexedDB 存储聊天记录 |
| V3.0 | 消息加解密 | Web Crypto API AES-GCM，PBKDF2 密钥派生 |

## Phase 11 — V3.0 消息加解密（规划中）

详见 [PLAN-ENCRYPTION.md](./PLAN-ENCRYPTION.md)

## Phase 10 — V3.0 多页面架构（进行中）

### 整体架构

- 响应式检测：`matchMedia('(max-width: 767px)')`
- 全局状态：`AppProvider` Context 管理 isMobile、activeTab、activeSessionId、mobileNavStack、searchQuery
- PC 端三栏布局：Sidebar(60px) + List Panel(280px) + Detail Panel(flex-1)
- 移动端：底部 Tab + Push 导航

### PC 端布局（≥768px）

```
+---------+-------------+-------------------+
| Sidebar |  List Panel |  Detail Panel     |
| (60px)  |  (~280px)   |  (flex-1)         |
+---------+-------------+-------------------+
```

### 移动端布局（<768px）

```
+-------------------------+
| [SearchBar]             |
+-------------------------+
| [ChatList / Contacts / Profile]
+-------------------------+
| [微信] [通讯录] [我]    |
+-------------------------+
```

### 新增组件

- [x] 10.1 `src/components/layout/AppProvider.jsx` — Context + 响应式 + 导航状态
- [x] 10.2 `src/components/layout/WeChatLayout.jsx` — PC 三栏 / 移动端 Tab+Push 布局分发
- [x] 10.3 `src/components/layout/Sidebar.jsx` — PC 左侧 60px 图标导航栏
- [x] 10.4 `src/components/layout/TabBar.jsx` — 移动端底部 Tab 栏
- [x] 10.5 `src/components/layout/SearchBar.jsx` — 搜索输入框（PC/Mobile 两种样式）
- [x] 10.6 `src/components/ui/Avatar.jsx` — 可复用头像组件（badge / size）
- [x] 10.7 `src/components/pages/ChatListPage.jsx` — 聊天列表（置顶/未读/免打扰/搜索）
- [x] 10.8 `src/components/pages/ChatDetailPage.jsx` — 聊天详情（复用现有组件）
- [x] 10.9 `src/components/pages/ContactsPage.jsx` — 通讯录（按拼音分组）
- [x] 10.10 `src/components/pages/ProfilePage.jsx` — 个人中心

### 数据扩展

- [x] 10.11 `src/data/mockData.js` — 新增 userProfile / contacts / chatSessions
- [x] 10.12 `src/utils/storage.js` — per-session 持久化

### 入口修改

- [x] 10.13 `src/App.jsx` — 重写为 `<WeChatLayout />`
- [x] 10.14 `src/main.jsx` — App 包裹 `<AppProvider>`，ChatEngineApp 不变
- [x] 10.15 `src/components/ChatHeader.jsx` — 添加 onBack prop
- [x] 10.16 `src/index.css` — 响应式 + push 动画
