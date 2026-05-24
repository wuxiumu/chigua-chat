import { MessageSquare, Users, User } from 'lucide-react';
import { useAppContext } from '../layout/AppProvider';

const TABS = [
  { id: 'chats', icon: MessageSquare, label: '微信' },
  { id: 'contacts', icon: Users, label: '通讯录' },
  { id: 'profile', icon: User, label: '我' },
];

export default function TabBar() {
  const { activeTab, setActiveTab } = useAppContext();

  return (
    <div className="bg-[#f7f7f7] border-t border-gray-300 flex shrink-0">
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-1.5 gap-0.5 transition ${
              active ? 'text-[#07c160]' : 'text-[#999]'
            }`}
          >
            <tab.icon size={24} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
