# 消息加解密架构 — 实施计划

## 概述

为 Fake WeChat 项目添加端到端消息加解密能力。消息在持久化到 localStorage 之前加密，加载时解密。使用 Web Crypto API（AES-GCM），密钥由用户密码派生（PBKDF2），不依赖任何第三方加密库。

---

## 为什么做这件事

- 当前所有消息（包括 `userId === 'me'` 的用户消息）明文存储在 localStorage，打开 DevTools → Application → Local Storage 即可直接看到完整内容
- 添加加密层后，即使他人访问浏览器，也无法直接读取历史消息内容

---

## 技术选型

| 层级 | 技术 | 理由 |
|------|------|------|
| 对称加密 | Web Crypto API `AES-GCM` | 浏览器原生，无需 polyfill，认证加密防篡改 |
| 密钥派生 | PBKDF2 (`SHA-256`, 100000 次迭代) | 从用户密码派生密钥，加盐防彩虹表 |
| 存储格式 | `JSON.stringify({ iv, ct })` | IV + Ciphertext 一体存储，每条消息独立 IV |
| 零依赖 | 全部使用 `window.crypto.subtle` | 不引入第三方库，打包体积不变 |

---

## 数据格式

### 加密前（localStorage 明文）
```json
[
  { "id": "msg_1", "userId": "me", "type": "text", "content": "你好", "timestamp": 1716556800000 }
]
```

### 加密后（localStorage 密文）
```json
{
  "v": 1,
  "iv": "a1b2c3d4e5f6...",
  "data": "encrypted_base64..."
}
```

---

## 架构设计

### 加密模块 `src/utils/crypto.js`

```
encryptMessage(messages, password) → encryptedBlob
decryptMessage(encryptedBlob, password) → messages
```

**核心流程：**
1. 从用户密码 + 固定 salt 派生 AES-GCM 密钥（PBKDF2）
2. 将 messages 数组序列化 → `TextEncoder` → `ArrayBuffer`
3. 生成随机 IV（12 bytes）
4. AES-GCM 加密 → 得到密文 + auth tag
5. 打包为 `{ v: 1, iv: base64, data: base64 }`

**密钥派生流程：**
```
用户密码 → PBKDF2(salt="wechat-encrypt-salt", 100000 次) → AES-GCM 256-bit 密钥
```

### 加解密管理器 `src/utils/cryptoManager.js`

封装 storage 调用，在读写时自动加解密：
```
saveSessionMessagesSecure(sessionId, messages, password) → 先加密再写 localStorage
loadSessionMessagesSecure(sessionId, password) → 先读再解密
```

- 如果检测到明文数据（首次使用或旧数据），自动跳过解密或返回空
- 如果检测到密文数据（`{ v: 1, iv, data }`），自动解密

### 密码管理 UI

#### 1. 设置密码页面 `src/components/pages/EncryptionSetupPage.jsx`

用户首次进入时，如果没有设置过密码，弹出密码设置弹窗：
- 输入密码 + 确认密码
- 密码强度指示（弱/中/强）
- 选择"暂不设置"（保持明文模式）
- 密码存储在 sessionStorage（页面关闭后清除），下次重新输入

#### 2. 密码输入弹窗 `src/components/ui/PasswordPrompt.jsx`

- 密文模式下打开 App 时弹出
- 输入密码解锁消息
- 密码错误时提示重试
- 支持"清除数据重新开始"

#### 3. 设置入口 `ProfilePage.jsx` 中添加

在"我"的页面中添加"消息加密"菜单项：
- 未设置 → "开启消息加密"
- 已设置 → "关闭消息加密" / "修改密码"

---

## 实施步骤

### Phase 1 — 加密核心

- [ ] 1.1 `src/utils/crypto.js` — AES-GCM 加密/解密函数
  - `encrypt(messages, password)` → `{ v, iv, data }`
  - `decrypt(blob, password)` → messages[]
  - 使用 `window.crypto.subtle` API
  - PBKDF2 密钥派生（salt 固定为 `"wechat-encrypt-salt"`）

### Phase 2 — 安全存储层

- [ ] 2.1 `src/utils/cryptoManager.js` — 安全存储封装
  - `saveSecure(sessionId, messages, password)` — 先加密再写 localStorage
  - `loadSecure(sessionId, password)` — 先读再解密，检测明文/密文格式
  - `isEncrypted(raw)` — 判断数据是否为密文格式

### Phase 3 — 密码管理

- [ ] 3.1 `AppProvider` 中添加 `encryptionKey`（存储在 sessionStorage）
  - `setEncryptionPassword(pwd)` — 设置密码并存入 sessionStorage
  - `isEncryptionEnabled` — 是否开启了加密
  - `encryptionPassword` — 从 sessionStorage 读取，不持久化

- [ ] 3.2 `src/components/ui/PasswordPrompt.jsx` — 密码输入弹窗
  - 密文模式启动时显示
  - 输入密码 → 尝试解密 → 成功则存储 key 到 session
  - 密码错误提示重试

- [ ] 3.3 `src/components/pages/EncryptionSetupPage.jsx` — 首次设置引导
  - 密码输入 + 确认
  - 密码强度指示
  - "稍后设置"按钮

### Phase 4 — 集成到现有流程

- [ ] 4.1 `ChatDetailPage.jsx` — 使用 `saveSecure` / `loadSecure` 替代原有 storage 调用
- [ ] 4.2 `ChatEngineApp.jsx` — `saveUserMessages` 替换为加密版本
- [ ] 4.3 `App.jsx` — 启动时检测是否已加密，未加密且未设置过则弹出设置引导

### Phase 5 — 设置入口

- [ ] 5.1 `ProfilePage.jsx` — "我"页面添加"消息加密"菜单项
  - 点击进入加密设置/关闭/改密码

- [ ] 5.2 `EncryptionSettings.jsx` — 加密设置页（从 Profile 进入）
  - 当前状态：已开启/未开启
  - 开启/关闭/修改密码按钮
  - 关闭时提示并清除加密数据

---

## 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/utils/crypto.js` | 新建 | AES-GCM 加解密核心函数 |
| `src/utils/cryptoManager.js` | 新建 | 安全存储封装层 |
| `src/components/ui/PasswordPrompt.jsx` | 新建 | 密码输入弹窗 |
| `src/components/pages/EncryptionSetupPage.jsx` | 新建 | 首次密码设置引导 |
| `src/components/pages/EncryptionSettings.jsx` | 新建 | 加密设置页面 |
| `src/components/layout/AppProvider.jsx` | 修改 | 添加 encryption 状态管理 |
| `src/components/pages/ChatDetailPage.jsx` | 修改 | 使用加密存储 |
| `src/ChatEngineApp.jsx` | 修改 | 使用加密存储 |
| `src/components/pages/ProfilePage.jsx` | 修改 | 添加"消息加密"菜单 |
| `src/App.jsx` | 修改 | 启动时加密状态检测 |
| `docs/PLAN-ENCRYPTION.md` | 新建 | 本文档 |

---

## 安全注意事项

1. **密钥不持久化**：密码存储在 `sessionStorage`，关闭标签页后清除，下次需要重新输入
2. **固定 salt**：使用固定 salt `"wechat-encrypt-salt"`，因为是单用户场景
3. **不存储密码本身**：只存储派生的 CryptoKey，不存储原始密码
4. **兼容明文数据**：loadSecure 能检测旧数据格式，自动降级返回明文
5. **关闭加密可清除**：关闭加密时可选择清除旧密文数据

---

## 验证

1. **加密读写**：设置密码后发送消息 → localStorage 中内容为密文格式 → 刷新页面 → 输入密码 → 消息正常显示
2. **密码错误**：输入错误密码 → 显示提示 → 不泄露任何数据
3. **明文兼容**：未设置密码时 → 消息正常读写（明文）
4. **关闭加密**：从设置页关闭 → 选择清除密文 → 后续消息以明文存储
5. **Chat Engine 模式**：`?mode=chat-engine` 同样受加密保护
6. **sessionStorage 清除**：关闭标签页重新打开 → 需要重新输入密码
