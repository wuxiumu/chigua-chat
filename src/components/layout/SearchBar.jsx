import { Search } from 'lucide-react';
import { useAppContext } from '../layout/AppProvider';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useAppContext();

  return (
    <div className="px-2 py-1.5 bg-[#ededed] border-b border-gray-300 shrink-0">
      <div className="flex items-center gap-2 bg-white rounded px-2 py-1">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索"
          className="flex-1 text-[14px] outline-none bg-transparent placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

export function PCSearchBar() {
  const { searchQuery, setSearchQuery } = useAppContext();

  return (
    <div className="px-3 py-2 bg-[#f5f5f5] border-b border-[#e5e5e5] shrink-0">
      <div className="flex items-center gap-2 bg-white rounded px-2 py-1.5">
        <Search size={16} className="text-[#999] shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索"
          className="flex-1 text-[13px] outline-none bg-transparent placeholder:text-[#bbb]"
        />
      </div>
    </div>
  );
}
