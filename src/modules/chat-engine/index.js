/**
 * Chat Engine Module
 *
 * 从 manifest.json 读取全量消息索引，挨个轮询每个 chunk 文件。
 * 每个 chunk 代表一个新的发帖人（不同头像 + 不同昵称）。
 * 消息逐步追加到聊天页面，支持发送后自动回复。
 */

// ── 常量 ──────────────────────────────────────────────
const BASE_URL = '/api';
const MANIFEST_URL = '/api/manifest.json';

// 用于为每个 chunk 生成不同的人物
const maleNames = [
  '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
  '郑哥', '刘哥', '陈兄', '林兄', '黄哥', '朱兄', '何哥', '马兄',
  '胡哥', '郭兄', '罗哥', '梁兄', '宋哥', '谢兄', '唐哥', '韩兄',
  '冯哥', '曹兄', '邓哥', '萧兄', '程哥', '袁兄', '蔡哥', '蒋兄',
  '余哥', '陆兄', '潘哥', '董兄', '袁哥', '叶兄', '蒋哥', '余兄',
  '沈哥', '韩兄', '杨哥', '朱兄', '秦哥', '许兄', '何哥', '吕兄',
];

const femaleNames = [
  '小芳', '小红', '小丽', '小美', '小燕', '小娜', '小玲', '小雪',
  '小琳', '小婷', '小静', '小慧', '小颖', '小蕾', '小薇', '小莹',
  '小洁', '小霞', '小凤', '小兰', '小菊', '小梅', '小竹', '小琴',
  '小玉', '小翠', '小萍', '小青', '小春', '小秋', '小冬', '小夏',
];

const allNames = [...maleNames, ...femaleNames];

// 生成每个 chunk 对应的发信人（103 个）
function generateSenders(total) {
  const senders = [];
  for (let i = 0; i < total; i++) {
    const name = allNames[i % allNames.length] + (i >= allNames.length ? `${Math.floor(i / allNames.length) + 1}` : '');
    senders.push({
      id: `chunk_${String(i + 1).padStart(3, '0')}`,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    });
  }
  return senders;
}

// ── 配置 ──────────────────────────────────────────────
export const chatConfig = {
  groupInfo: {
    name: '树洞-情感吃瓜、匿名爆料',
    memberCount: 103,
  },

  currentUser: {
    id: 'me',
    name: '我',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  },

  autoReply: {
    enabled: true,
    delayMin: 1500,
    delayMax: 3500,
    fallbackReplies: [
      '收到 👌',
      '确实如此',
      '哈哈哈哈',
      '学到了',
      '马上试试',
      '这个思路不错',
      '+1',
    ],
  },
};

// ── 数据转换 ──────────────────────────────────────────

/**
 * JSON → App 消息格式转换
 */
export function convertMessage(jsonMsg, senderInfo) {
  const photoMedia = jsonMsg.media?.find(m => m.type === 'photo');

  return {
    id: jsonMsg.id,
    userId: senderInfo.id,
    type: photoMedia ? 'image' : (jsonMsg.media?.length ? 'image' : 'text'),
    content: jsonMsg.text,
    timestamp: new Date(jsonMsg.datetime).getTime(),
    reactions: jsonMsg.reactions || [],
    // 图片消息字段
    imagePath: photoMedia ? `/api/${photoMedia.path}` : null,
    imageThumb: photoMedia ? `/api/${photoMedia.thumbnail}` : null,
  };
}

/**
 * 从 manifest.json 读取索引并挨个轮询所有 chunk
 * 每加载完一个 chunk 就通过 onChunk 回调推送
 */
export async function pollChunks(onChunk) {
  const manifestResp = await fetch(MANIFEST_URL);
  if (!manifestResp.ok) throw new Error('Failed to fetch manifest.json');
  const manifest = await manifestResp.json();

  const totalFiles = manifest.chunks.length;
  const senders = generateSenders(totalFiles);

  for (let i = 0; i < manifest.chunks.length; i++) {
    const chunk = manifest.chunks[i];
    const sender = senders[i];
    const url = `${BASE_URL}/${chunk.file}`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Failed to fetch ${url}`);
      const jsonMessages = await resp.json();
      const messages = jsonMessages.map(msg => convertMessage(msg, sender));
      onChunk({ chunkIndex: i + 1, totalFiles, sender, messages });
    } catch (err) {
      console.error(`Chunk load error [${chunk.file}]:`, err);
      onChunk({ chunkIndex: i + 1, totalFiles, sender, messages: [], error: err.message });
    }
  }
}

/**
 * 获取自动回复内容
 */
export function getRandomReply(existingMessages) {
  if (existingMessages.length > 0 && Math.random() > 0.3) {
    const randomMsg = existingMessages[Math.floor(Math.random() * existingMessages.length)];
    return randomMsg.content.substring(0, 80);
  }
  const replies = chatConfig.autoReply.fallbackReplies;
  return replies[Math.floor(Math.random() * replies.length)];
}

/**
 * 获取随机回复延迟（1.5 ~ 3.5 秒）
 */
export function getRandomDelay() {
  const { delayMin, delayMax } = chatConfig.autoReply;
  return delayMin + Math.random() * (delayMax - delayMin);
}

/**
 * 获取所有已加载的发信人 ID 列表（用于自动回复随机选人）
 */
export function getRandomMemberIdFrom(senders) {
  if (!senders.length) return 'me';
  return senders[Math.floor(Math.random() * senders.length)].id;
}
