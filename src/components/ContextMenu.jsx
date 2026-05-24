import { useEffect, useRef, useState } from 'react';

export default function ContextMenu({ visible, x, y, onCopy, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleScroll = () => onClose();

    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-[#e5e5e5] py-1 min-w-[120px]"
      style={{ left: x, top: y }}
    >
      <button
        onClick={onCopy}
        className="w-full px-4 py-2 text-left text-[13px] text-[#333] hover:bg-[#f0f0f0] transition"
      >
        复制
      </button>
    </div>
  );
}
