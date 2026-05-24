import { useAppContext } from './AppProvider';
import Sidebar from './Sidebar';
import TabBar from './TabBar';
import SearchBar from './SearchBar';
import { PCSearchBar } from './SearchBar';
import ChatListPage from '../pages/ChatListPage';
import ChatDetailPage from '../pages/ChatDetailPage';
import ContactsPage from '../pages/ContactsPage';
import ProfilePage from '../pages/ProfilePage';

export default function WeChatLayout() {
  const { isMobile } = useAppContext();

  if (isMobile) {
    return <MobileLayout />;
  }
  return <PCLayout />;
}

function PCLayout() {
  const { activeTab, activeSessionId } = useAppContext();

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      <Sidebar />
      <div className="w-[280px] bg-white border-r border-[#e5e5e5] flex flex-col shrink-0">
        <PCSearchBar />
        {activeTab === 'chats' && <ChatListPage pc />}
        {activeTab === 'contacts' && <ContactsPage pc />}
        {activeTab === 'profile' && <ProfilePage pc />}
      </div>
      <div className="flex-1 flex flex-col bg-[#ededed] min-w-0">
        {activeSessionId ? (
          <ChatDetailPage />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#ededed]">
            <span className="text-[16px] text-[#999]">请选择一个会话</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MobileLayout() {
  const { activeTab, activeSessionId, mobileNavStack } = useAppContext();
  const isDetail = activeSessionId && mobileNavStack.includes('chat-detail');

  return (
    <div className="h-screen bg-[#ededed] flex flex-col max-w-md mx-auto shadow-2xl">
      <div className="flex-1 flex flex-col overflow-hidden">
        {isDetail ? (
          <ChatDetailPage />
        ) : (
          <>
            {activeTab === 'chats' && (
              <>
                <SearchBar />
                <ChatListPage />
              </>
            )}
            {activeTab === 'contacts' && <ContactsPage />}
            {activeTab === 'profile' && <ProfilePage />}
          </>
        )}
      </div>
      {!isDetail && <TabBar />}
    </div>
  );
}
