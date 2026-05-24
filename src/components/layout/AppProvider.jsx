import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { currentUser } from '../../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 767px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const [activeTab, setActiveTab] = useState('chats');
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [mobileNavStack, setMobileNavStack] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const pushMobileNav = (page) => setMobileNavStack(prev => [...prev, page]);
  const popMobileNav = () => setMobileNavStack(prev => prev.slice(0, -1));

  const openChat = (sessionId) => {
    setActiveSessionId(sessionId);
    if (isMobile) pushMobileNav('chat-detail');
  };

  const closeChat = () => {
    setActiveSessionId(null);
    if (isMobile) popMobileNav();
  };

  const value = useMemo(() => ({
    isMobile,
    activeTab,
    setActiveTab,
    activeSessionId,
    setActiveSessionId,
    mobileNavStack,
    pushMobileNav,
    popMobileNav,
    searchQuery,
    setSearchQuery,
    openChat,
    closeChat,
    currentUser,
  }), [isMobile, activeTab, activeSessionId, mobileNavStack, searchQuery]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);
