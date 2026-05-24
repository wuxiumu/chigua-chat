import { MessageSquare, Users, User } from 'lucide-react';
import { useAppContext } from './AppProvider';
import { chatSessions } from '../../data/mockData';
import Avatar from '../ui/Avatar';
import { useMemo } from 'react';

const TABS = [
  { id: 'chats', icon: MessageSquare, label: '微信' },
  { id: 'contacts', icon: Users, label: '通讯录' },
  { id: 'profile', icon: User, label: '我' },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, currentUser } = useAppContext();

  const totalUnread = useMemo(
    () => chatSessions.reduce((sum, s) => sum + (s.unreadCount || 0), 0),
    []
  );

  return (
    <nav className="w-[60px] bg-[#ebebeb] flex flex-col items-center py-4 shrink-0">
      <div className="mb-5">
        <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
      </div>

      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative w-full h-11 flex flex-col items-center justify-center gap-0.5 transition mb-1 ${
              active ? 'text-[#07c160]' : 'text-[#666] hover:text-[#333]'
            }`}
          >
            <tab.icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px]">{tab.label}</span>
            {tab.id === 'chats' && totalUnread > 0 && (
              <span className="absolute -top-0.5 right-1.5 min-w-[16px] h-4 bg-[#f44] text-white text-[10px] rounded-full flex items-center justify-center px-0.5">
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
