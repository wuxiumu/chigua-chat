import { useState, useCallback } from 'react';
import { currentUser, members } from '../data/mockData';
import ContextMenu from './ContextMenu';

export default function MessageBubble({ message, allSenders, pc }) {
  const isMe = message.userId === currentUser.id;

  const engineSender = allSenders?.find(s => s.id === message.userId);
  const mockSender = !engineSender ? members.find(m => m.id === message.userId) : null;
  const sender = engineSender || mockSender || currentUser;

  // 右键菜单
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuVisible(true);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content).catch(() => {});
    setMenuVisible(false);
  }, [message.content]);

  const handleCloseMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const isImage = message.type === 'image' && message.imagePath;

  // ── PC 模式 ─────────────────────────────────────────

  if (pc) {
    return (
      <div className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
        <img
          src={sender.avatar}
          alt={sender.name}
          className="w-9 h-9 rounded-lg shrink-0 bg-[#e5e5e5]"
        />

        <div
          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[55%]`}
          onContextMenu={handleContextMenu}
        >
          {!isMe && (
            <span className="text-[12px] text-[#999] mb-1 ml-1">{sender.name}</span>
          )}

          {isImage ? (
            <div className="relative">
              <img
                src={message.imageThumb || message.imagePath}
                alt={message.content}
                className="max-w-full max-h-64 rounded-lg border border-[#eee] cursor-pointer hover:opacity-90 transition"
              />
              {message.content && (
                <div className="mt-1 px-2 py-1 bg-white rounded text-[12px] text-[#999] border border-[#eee] whitespace-pre-wrap">
                  {message.content}
                </div>
              )}
            </div>
          ) : (
            <div
              className={`
                relative px-4 py-2.5 text-[14px] leading-[1.6] break-all whitespace-pre-wrap
                ${isMe
                  ? 'bg-[#95ec69] text-[#111] rounded-[10px_3px_10px_10px] bubble-right'
                  : 'bg-white text-[#111] rounded-[3px_10px_10px_10px] bubble-left'
                }
                border border-[#eee]
              `}
            >
              {message.content}
            </div>
          )}

          {message.reactions?.length > 0 && (
            <div className="flex gap-1 mt-1">
              {message.reactions.map((r, i) => (
                <span key={i} className="inline-flex items-center gap-0.5 bg-[#f0f0f0] rounded-full px-2 py-0.5 text-xs text-[#666]">
                  {r.emoji} {r.count}
                </span>
              ))}
            </div>
          )}
        </div>

        <ContextMenu
          visible={menuVisible}
          x={menuPos.x}
          y={menuPos.y}
          onCopy={handleCopy}
          onClose={handleCloseMenu}
        />
      </div>
    );
  }

  // ── 移动端模式 ──────────────────────────────────────

  return (
    <div className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <img
        src={sender.avatar}
        alt={sender.name}
        className="w-10 h-10 rounded-lg shrink-0 bg-gray-200"
      />

      <div
        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}
        onContextMenu={handleContextMenu}
      >
        {!isMe && (
          <span className="text-[11px] text-gray-500 mb-1 ml-1">{sender.name}</span>
        )}

        {isImage ? (
          <div className="relative">
            <img
              src={message.imageThumb || message.imagePath}
              alt={message.content}
              className="max-w-full max-h-48 rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition"
            />
            {message.content && (
              <div className="mt-1 px-2 py-1 bg-white rounded text-[11px] text-gray-500 shadow-sm whitespace-pre-wrap">
                {message.content}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`
              relative px-3.5 py-2.5 text-[15px] leading-relaxed break-all whitespace-pre-wrap
              ${isMe
                ? 'bg-[#95ec69] text-black rounded-[12px_4px_12px_12px] bubble-right'
                : 'bg-white text-black rounded-[4px_12px_12px_12px] bubble-left'
              }
              shadow-sm
            `}
          >
            {message.content}
          </div>
        )}

        {message.reactions?.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((r, i) => (
              <span key={i} className="inline-flex items-center gap-0.5 bg-gray-100 rounded-full px-1.5 py-0.5 text-xs">
                {r.emoji} {r.count}
              </span>
            ))}
          </div>
        )}
      </div>

      <ContextMenu
        visible={menuVisible}
        x={menuPos.x}
        y={menuPos.y}
        onCopy={handleCopy}
        onClose={handleCloseMenu}
      />
    </div>
  );
}
