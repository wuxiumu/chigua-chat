import { userProfile } from '../../data/mockData';
import { useAppContext } from '../layout/AppProvider';
import Avatar from '../ui/Avatar';
import { ChevronRight, QrCode } from 'lucide-react';

const MENU_ITEMS = [
  { icon: 'service', label: '服务', emoji: '\u{1F4B3}' },
  { icon: 'bookmark', label: '收藏', emoji: '⭐' },
  { icon: 'wallet', label: '卡包', emoji: '\u{1F4E3}' },
  { icon: 'settings', label: '设置', emoji: '⚙' },
];

export default function ProfilePage({ pc }) {
  return (
    <div className={`flex-1 overflow-y-auto ${pc ? 'pc-scrollbar' : 'no-scrollbar'}`}>
      {/* Profile card */}
      <div className={`px-4 py-5 flex items-center gap-4 ${pc ? 'bg-white border-b border-[#e5e5e5]' : 'bg-white'}`}>
        <Avatar src={userProfile.avatar} alt={userProfile.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h2 className={`text-[17px] font-medium ${pc ? 'text-[#191919]' : 'text-gray-900'}`}>
            {userProfile.name}
          </h2>
          <p className={`text-[12px] mt-0.5 ${pc ? 'text-[#999]' : 'text-gray-500'}`}>
            微信号: {userProfile.wechatId}
          </p>
          <p className={`text-[12px] mt-1 ${pc ? 'text-[#999]' : 'text-gray-400'}`}>
            {userProfile.signature}
          </p>
        </div>
        <QrCode size={20} className="text-[#666]" />
        <ChevronRight size={18} className="text-[#999]" />
      </div>

      {/* Menu items */}
      <div className={pc ? 'mt-2 bg-white border-b border-[#e5e5e5]' : 'mt-2 bg-white'}>
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${
              i < MENU_ITEMS.length - 1
                ? `border-b ${pc ? 'border-[#f0f0f0]' : 'border-gray-200'}`
                : ''
            } ${pc ? 'hover:bg-[#f5f5f5]' : 'active:bg-[#d4d4d4]'}`}
          >
            <span className="text-[18px]">{item.emoji}</span>
            <span className={`flex-1 text-[15px] ${pc ? 'text-[#191919]' : 'text-gray-900'}`}>
              {item.label}
            </span>
            <ChevronRight size={16} className="text-[#999]" />
          </button>
        ))}
      </div>
    </div>
  );
}
