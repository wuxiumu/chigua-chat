const OLD_STORAGE_KEY = 'fake-wechat-user-messages';

/**
 * 保存某个会话的用户消息（userId === 'me'）到 localStorage
 */
export function saveSessionMessages(sessionId, messages) {
  try {
    const key = `wechat-session-${sessionId}`;
    const userMsgs = messages.filter(m => m.userId === 'me');
    localStorage.setItem(key, JSON.stringify(userMsgs));
  } catch (e) {
    // localStorage 不可用时的降级处理
  }
}

/**
 * 加载某个会话的用户消息
 */
export function loadSessionMessages(sessionId) {
  try {
    const key = `wechat-session-${sessionId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

/**
 * 保存用户发送的消息（userId === 'me'）到 localStorage
 * @deprecated 使用 saveSessionMessages 替代
 */
export function saveUserMessages(messages) {
  try {
    const userMsgs = messages.filter(m => m.userId === 'me');
    localStorage.setItem(OLD_STORAGE_KEY, JSON.stringify(userMsgs));
  } catch (e) {
    // localStorage 不可用时的降级处理
  }
}

/**
 * 从 localStorage 加载用户发送的消息
 * @deprecated 使用 loadSessionMessages 替代
 */
export function loadUserMessages() {
  try {
    const raw = localStorage.getItem(OLD_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
