import { useMemo } from 'react';
import { contacts } from '../../data/mockData';
import { useAppContext } from '../layout/AppProvider';
import Avatar from '../ui/Avatar';
import { Users, Bookmark, Wallet } from 'lucide-react';

const SPECIAL_ITEMS = [
  { icon: Users, label: '新的朋友', color: '#f5a623' },
  { icon: Users, label: '群聊', color: '#07c160' },
  { icon: Bookmark, label: '标签', color: '#2b7de9' },
];

export default function ContactsPage({ pc }) {
  const { searchQuery } = useAppContext();

  const groupedContacts = useMemo(() => {
    let list = [...contacts];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.remark && c.remark.toLowerCase().includes(q))
      );
    }
    const groups = {};
    for (const c of list) {
      const letter = c.pinyin || '#';
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(c);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [searchQuery]);

  return (
    <div className={`flex-1 overflow-y-auto ${pc ? 'pc-scrollbar' : 'no-scrollbar'}`}>
      {/* Special items */}
      <div className={pc ? 'border-b border-[#e5e5e5]' : 'border-b border-gray-300'}>
        {SPECIAL_ITEMS.map((item) => (
          <SpecialItem key={item.label} icon={item.icon} label={item.label} color={item.color} pc={pc} />
        ))}
      </div>

      {groupedContacts.map(([letter, members]) => (
        <div key={letter}>
          <div
            className={`px-4 py-1.5 text-[12px] font-medium ${
              pc ? 'bg-[#f5f5f5] text-[#999] border-b border-[#e5e5e5]' : 'bg-[#ededed] text-gray-500'
            }`}
          >
            {letter}
          </div>
          {members.map((contact) => (
            <button
              key={contact.id}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b ${
                pc
                  ? 'border-[#f0f0f0] hover:bg-[#f5f5f5]'
                  : 'border-gray-200 active:bg-[#d4d4d4]'
              }`}
            >
              <Avatar src={contact.avatar} alt={contact.name} size={pc ? 'sm' : 'md'} />
              <span className={`text-[14px] ${pc ? 'text-[#191919]' : 'text-gray-900'}`}>
                {contact.remark || contact.name}
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function SpecialItem({ icon: Icon, label, color, pc }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
        pc ? 'hover:bg-[#f5f5f5]' : 'active:bg-[#d4d4d4]'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ background: `${color}18` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <span className={`text-[14px] ${pc ? 'text-[#191919]' : 'text-gray-900'}`}>{label}</span>
    </button>
  );
}
