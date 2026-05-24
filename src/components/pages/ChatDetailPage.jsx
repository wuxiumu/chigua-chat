import { useState, useCallback, useMemo, useEffect } from 'react';
import { chatSessions } from '../../data/mockData';
import { saveSessionMessages, loadSessionMessages } from '../../utils/storage';
import { useAppContext } from '../layout/AppProvider';
import ChatHeader from '../ChatHeader';
import MessageList from '../MessageList';
import ChatInput from '../ChatInput';

const replies = ['收到', '确实如此', '哈哈哈哈', '学到了', '+1', '马上试试', '好的'];

export default function ChatDetailPage() {
  const { activeSessionId, closeChat, isMobile } = useAppContext();
  const session = useMemo(
    () => chatSessions.find((s) => s.id === activeSessionId),
    [activeSessionId]
  );
  const pc = !isMobile;

  const [messages, setMessages] = useState(() => {
    if (!session) return [];
    const persisted = loadSessionMessages(session.id);
    if (persisted.length > 0) return persisted;
    return session.messages || [];
  });

  // Clear unread on open
  useEffect(() => {
    if (!session) return;
    if (session.unreadCount > 0) {
      session.unreadCount = 0;
    }
  }, [session?.id]);

  const handleSend = useCallback(
    (content) => {
      if (!session) return;
      const newMsg = {
        id: `msg_${Date.now()}`,
        userId: 'me',
        type: 'text',
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => {
        const updated = [...prev, newMsg];
        saveSessionMessages(session.id, updated);

        setTimeout(() => {
          setMessages((prev2) => {
            const reply = {
              id: `reply_${Date.now()}`,
              userId: session.contactId || session.memberIds?.[0] || 'u1',
              type: 'text',
              content: replies[Math.floor(Math.random() * replies.length)],
              timestamp: Date.now(),
            };
            const withReply = [...prev2, reply];
            saveSessionMessages(session.id, withReply);
            return withReply;
          });
        }, 1500 + Math.random() * 2000);

        return updated;
      });
    },
    [session]
  );

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#ededed]">
        <span className="text-[14px] text-[#999]">请选择一个会话</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        groupName={session.name}
        memberCount={session.memberCount || 2}
        onBack={closeChat}
        pc={pc}
      />
      <MessageList messages={messages} pc={pc} />
      <ChatInput onSend={handleSend} pc={pc} />
    </div>
  );
}
