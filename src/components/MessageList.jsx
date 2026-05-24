import { useEffect, useRef, useMemo } from 'react';
import MessageBubble from './MessageBubble';
import TimeDivider from './TimeDivider';
import { members, currentUser } from '../data/mockData';

const mockSenders = [
  { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
  ...members,
];

/**
 * 从消息列表提取唯一的发信人列表
 */
function extractSenders(messages) {
  const seen = new Map();
  for (const msg of messages) {
    if (!seen.has(msg.userId)) {
      const mock = mockSenders.find(s => s.id === msg.userId);
      if (mock) {
        seen.set(msg.userId, mock);
      } else {
        const seed = msg.userId;
        seen.set(msg.userId, {
          id: msg.userId,
          name: msg.userId.replace('chunk_', '发帖人'),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
        });
      }
    }
  }
  return [...seen.values()];
}

export default function MessageList({ messages, pc }) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const senders = useMemo(() => extractSenders(messages), [messages]);

  // 消息变化时自动触底
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const shouldShowTime = (current, previous) => {
    if (!previous) return true;
    return current.timestamp - previous.timestamp > 5 * 60 * 1000;
  };

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-y-auto ${pc ? 'pc-scrollbar' : 'no-scrollbar'} p-4 bg-[#ededed]`}
    >
      {messages.map((msg, index) => (
        <div key={msg.id}>
          {shouldShowTime(msg, messages[index - 1]) && (
            <TimeDivider timestamp={msg.timestamp} />
          )}
          <MessageBubble message={msg} allSenders={senders} pc={pc} />
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
