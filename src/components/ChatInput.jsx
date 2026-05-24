import { useState } from 'react';
import { Mic, Smile, Plus, Send } from 'lucide-react';

export default function ChatInput({ onSend, pc }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isTyping = text.trim().length > 0;

  if (pc) {
    return (
      <div className="bg-[#f5f5f5] border-t border-[#e5e5e5] shrink-0">
        <div className="flex items-start gap-3 p-4">
          <button className="p-2 text-[#666] hover:bg-[#e8e8e8] rounded-full transition shrink-0 mt-1">
            <Smile size={20} />
          </button>

          <button className="p-2 text-[#666] hover:bg-[#e8e8e8] rounded-full transition shrink-0 mt-1">
            <Plus size={20} />
          </button>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="请输入消息..."
            rows={3}
            className="flex-1 px-3 py-2 text-[14px] resize-none outline-none bg-white rounded border border-[#ddd] min-h-[60px]"
          />
        </div>

        <div className="flex justify-end pr-4 pb-3">
          <button
            onClick={handleSend}
            className={`px-6 py-1.5 rounded text-[14px] transition ${
              isTyping
                ? 'bg-[#07c160] text-white hover:bg-[#06ad56]'
                : 'bg-[#e0e0e0] text-[#999] cursor-not-allowed'
            }`}
            disabled={!isTyping}
          >
            发送
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f7] border-t border-gray-300 px-3 py-2 shrink-0">
      <div className="flex items-end gap-2">
        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition shrink-0">
          <Mic size={22} />
        </button>

        <div className="flex-1 bg-white rounded-md flex items-end">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="说点什么..."
            rows={1}
            className="w-full px-3 py-2 text-[15px] resize-none outline-none bg-transparent max-h-24"
            style={{ minHeight: '36px' }}
          />
        </div>

        <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition shrink-0">
          <Smile size={22} />
        </button>

        {isTyping ? (
          <button
            onClick={handleSend}
            className="p-2 bg-[#07c160] text-white rounded-full hover:bg-[#06ad56] transition shrink-0"
          >
            <Send size={20} />
          </button>
        ) : (
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition shrink-0">
            <Plus size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
