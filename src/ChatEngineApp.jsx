import { useState, useCallback, useRef, useEffect } from 'react';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import {
  chatConfig,
  pollChunks,
  getRandomDelay,
  getRandomReply,
  getRandomMemberIdFrom,
} from './modules/chat-engine';
import { saveUserMessages, loadUserMessages } from './utils/storage';

/**
 * 聊天引擎页面 — 通过 URL ?mode=chat-engine 进入
 *
 * PC 端布局，自动轮询 manifest.json，所有消息打平后按指定间隔逐条显示。
 */
const SPEED_OPTIONS = [1, 2, 3, 5, 10, 15, 30];

function ChatEngineApp() {
  const [messages, setMessages] = useState([]);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [paused, setPaused] = useState(false);
  const [interval, setInterval] = useState(5);
  const [customSpeed, setCustomSpeed] = useState('');

  const queueRef = useRef([]);
  const senderSetRef = useRef([]);
  const timerRef = useRef(null);

  // draining 函数
  const drainOne = useCallback(() => {
    const queue = queueRef.current;
    if (queue.length === 0) {
      setDone(true);
      setLoading(false);
      return;
    }

    const next = queue[0];
    queueRef.current = queue.slice(1);
    setMessages(prev => [...prev, next]);

    if (queueRef.current.length > 0) {
      timerRef.current = setTimeout(drainOne, interval * 1000);
    }
  }, [interval]);

  // 轮询全部消息
  useEffect(() => {
    if (!started) return;

    pollChunks(({ chunkIndex, totalFiles, sender, messages: chunkMsgs }) => {
      queueRef.current = [...queueRef.current, ...chunkMsgs];
      senderSetRef.current = [...senderSetRef.current, sender];
      setProgress({ loaded: chunkIndex, total: totalFiles });

      if (chunkIndex === totalFiles) {
        // 全部加载完毕，开始逐条释放
        const first = queueRef.current[0];
        if (first) {
          queueRef.current = queueRef.current.slice(1);
          setMessages([first]);

          if (queueRef.current.length > 0) {
            timerRef.current = setTimeout(drainOne, interval * 1000);
          } else {
            setDone(true);
            setLoading(false);
          }
        }
      }
    });
  }, [started]);

  // 监听暂停状态变化
  useEffect(() => {
    if (paused) {
      // 暂停 → 清除定时器
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      // 继续 → 立即显示下一条，然后按间隔继续
      if (queueRef.current.length > 0 && !done) {
        drainOne();
      }
    }
  }, [paused]);

  // 监听间隔变化
  useEffect(() => {
    if (!paused && !done && queueRef.current.length > 0 && started) {
      if (timerRef.current) clearTimeout(timerRef.current);
      drainOne();
    }
  }, [interval]);

  // 清理
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSend = useCallback((content) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      userId: chatConfig.currentUser.id,
      type: 'text',
      content,
      timestamp: Date.now(),
    };
    setMessages(prev => {
      const updated = [...prev, newMessage];
      saveUserMessages(updated);
      if (chatConfig.autoReply.enabled) {
        setTimeout(() => {
          setMessages(prev2 => [...prev2, {
            id: `reply_${Date.now()}`,
            userId: getRandomMemberIdFrom(senderSetRef.current),
            type: 'text',
            content: getRandomReply(updated),
            timestamp: Date.now(),
          }]);
        }, getRandomDelay());
      }
      return updated;
    });
  }, []);

  const togglePause = useCallback(() => {
    setPaused(prev => !prev);
  }, []);

  const handleSpeedChange = useCallback((val) => {
    setInterval(val);
    setCustomSpeed('');
  }, []);

  const handleCustomSpeedInput = useCallback((e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setCustomSpeed(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setInterval(num);
    }
  }, []);

  const progressPercent = progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : 0;
  const remaining = queueRef.current.length;

  // ── 未开始界面 ──────────────────────────────────────

  if (!started) {
    return (
      <div className="w-full h-screen bg-[#f5f5f5] flex flex-col">
        <ChatHeader
          groupName={chatConfig.groupInfo.name}
          memberCount={chatConfig.groupInfo.memberCount}
          pc
        />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="bg-white rounded-xl px-12 py-10 shadow-sm text-center">
            <h2 className="text-xl font-medium text-[#191919] mb-4">Chat Engine 模拟会话</h2>
            <p className="text-sm text-[#999] mb-2">
              共 <span className="text-[#07c160] font-medium">103</span> 个帖子，<span className="text-[#07c160] font-medium">3083</span> 条消息
            </p>
            <p className="text-sm text-[#999] mb-6">
              将以 <span className="text-[#333] font-medium">5 秒/条</span> 的速度逐条模拟显示
            </p>
            <button
              onClick={() => {
                setStarted(true);
                setLoading(true);
              }}
              className="px-8 py-2.5 bg-[#07c160] text-white rounded-lg text-[15px] hover:bg-[#06ad56] active:bg-[#059a4c] transition cursor-pointer"
            >
              开始模拟会话
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#f5f5f5] flex flex-col">
      <ChatHeader
        groupName={chatConfig.groupInfo.name}
        memberCount={chatConfig.groupInfo.memberCount}
        pc
      />

      {/* 控制栏 */}
      <div className="bg-[#fafafa] px-5 py-2.5 shrink-0 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between text-[12px] text-[#666] mb-1.5">
          <span className="flex items-center gap-2">
            {done ? '全部加载完成' : loading ? '正在加载...' : '正在加载...'}
            {paused && !done && (
              <span className="px-2 py-0.5 bg-[#ff9500] text-white rounded text-[11px]">已暂停</span>
            )}
          </span>
          <span>{progress.loaded}/{progress.total} ({progressPercent}%)</span>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-[#e0e0e0] rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              done ? 'bg-[#07c160]' : paused ? 'bg-[#ff9500]' : 'bg-[#07c160]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 底部行：暂停/继续 + 速度选择 + 状态 */}
        <div className="flex items-center justify-between mt-2">
          {/* 暂停/继续 */}
          <button
            onClick={togglePause}
            disabled={done && remaining === 0}
            className={`px-4 py-1 rounded text-[12px] transition cursor-pointer ${
              done && remaining === 0
                ? 'bg-[#e8e8e8] text-[#999] cursor-not-allowed'
                : paused
                  ? 'bg-[#07c160] text-white hover:bg-[#06ad56]'
                  : 'bg-[#ff9500] text-white hover:bg-[#e08600]'
            }`}
          >
            {paused ? '▶ 继续' : '⏸ 暂停'}
          </button>

          {/* 速度选择 */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#999]">速度:</span>
            <div className="flex gap-1">
              {SPEED_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-0.5 rounded text-[11px] transition cursor-pointer ${
                    interval === s && !customSpeed
                      ? 'bg-[#07c160] text-white'
                      : 'bg-[#e8e8e8] text-[#666] hover:bg-[#ddd]'
                  }`}
                >
                  {s}s
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customSpeed}
              onChange={handleCustomSpeedInput}
              onFocus={() => setCustomSpeed('')}
              placeholder="自定义"
              className="w-16 px-1.5 py-0.5 rounded text-[11px] border border-[#ddd] outline-none focus:border-[#07c160] bg-white"
            />
          </div>

          {/* 状态 */}
          <div className="flex items-center gap-3 text-[11px] text-[#999]">
            <span>待显示: {remaining}</span>
            <span>{interval}s/条</span>
          </div>
        </div>
      </div>

      <MessageList messages={messages} pc />
      <ChatInput onSend={handleSend} pc />
    </div>
  );
}

export default ChatEngineApp;
