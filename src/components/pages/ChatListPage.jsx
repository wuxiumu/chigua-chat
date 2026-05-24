import { useMemo } from 'react';
import { chatSessions } from '../../data/mockData';
import { useAppContext } from '../layout/AppProvider';
import Avatar from '../ui/Avatar';
import { MessageSquare } from 'lucide-react';

function formatTime(ts) {
  const now = Date.now();
  const diff = now - ts;
  const d = new Date(ts);
  if (diff < 86400000) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function ChatListPage({ pc, hasSearch }) {
  const { searchQuery, activeSessionId, openChat } = useAppContext();

  const filteredSessions = useMemo(() => {
    let list = [...chatSessions];
    list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0);
    });
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.lastMessage?.content.toLowerCase().includes(q)
      );
    }
    return list;
  }, [searchQuery]);

  if (filteredSessions.length === 0 && searchQuery) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-[13px] text-[#999]">无匹配结果</span>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto ${pc ? 'pc-scrollbar' : 'no-scrollbar'}`}>
      {filteredSessions.map((session) => {
        const isActive = activeSessionId === session.id;
        return (
          <button
            key={session.id}
            onClick={() => openChat(session.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition border-b ${
              pc
                ? `border-[#f0f0f0] ${isActive ? 'bg-[#e8e8e8]' : 'hover:bg-[#f5f5f5]'}`
                : `border-gray-200 ${isActive ? 'bg-[#d4d4d4]' : 'active:bg-[#f5f5f5]'}`
            }`}
          >
            <Avatar
              src={session.avatar}
              alt={session.name}
              size={pc ? 'sm' : 'md'}
              badge={session.unreadCount > 0 ? session.unreadCount : null}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[14px] font-medium truncate ${
                    pc ? 'text-[#191919]' : 'text-gray-900'
                  }`}
                >
                  {session.name}
                  {session.pinned && (
                    <span className="ml-1 text-[#999] text-[12px] font-normal">[置顶]</span>
                  )}
                </span>
                {session.lastMessage?.timestamp && (
                  <span className={`text-[11px] shrink-0 ml-2 ${pc ? 'text-[#999]' : 'text-gray-400'}`}>
                    {formatTime(session.lastMessage.timestamp)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className={`text-[12px] truncate ${pc ? 'text-[#999]' : 'text-gray-500'}`}>
                  {session.lastMessage?.content}
                </span>
                {session.muted && (
                  <span className={`ml-1 text-[10px] shrink-0 ${pc ? 'text-[#bbb]' : 'text-gray-300'}`}>
                    消息免打扰
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
