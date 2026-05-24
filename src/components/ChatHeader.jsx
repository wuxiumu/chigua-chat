import { ChevronLeft, MoreHorizontal, Search } from 'lucide-react';

export default function ChatHeader({ groupName, memberCount, onBack, pc }) {
  if (pc) {
    return (
      <header className="bg-[#f5f5f5] px-5 h-14 flex items-center justify-between border-b border-[#e5e5e5] shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-[16px] font-medium text-[#191919]">{groupName}</h1>
          <span className="text-[12px] text-[#999]">({memberCount})</span>
        </div>

        <div className="flex items-center gap-3">
          <Search size={18} className="text-[#666]" />
          <button className="text-[#666] hover:text-[#333] transition">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#ededed] px-4 h-12 flex items-center justify-between border-b border-gray-300 shrink-0 z-10">
      <button onClick={onBack} className="flex items-center text-blue-600 hover:opacity-70 transition">
        <ChevronLeft size={20} />
        <span className="text-sm">微信</span>
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-[15px] font-medium text-gray-900 leading-tight">
          {groupName}
        </h1>
        <span className="text-[10px] text-gray-500">({memberCount})</span>
      </div>

      <button className="text-gray-700 hover:opacity-70 transition">
        <MoreHorizontal size={20} />
      </button>
    </header>
  );
}
