"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your KAM Resource Centre assistant. I can help you find trade data, reports, or navigate sectors.", type: 'bot' as 'bot' | 'user' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, type: 'bot' | 'user') => {
    setMessages(prev => [...prev, { id: Date.now(), text, type }]);
    
    // Simple bot responses
    setTimeout(() => {
      const responses = {
        'hs': 'HS Sections are at /sections. Try /sections/i-live-animals for Live Animals trade data.',
        'sector': 'Sectors at /sectors. E.g. /sectors/agriculture-agro-processing for Agriculture reports.',
        'trade': 'Trade data at /research/kra or /research/barometer. Use GlobalSearch for specific HS codes.',
        'report': 'PDF reports in /sectors/[slug]. Power BI dashboards in individual sector/section pages.',
        'default': 'You can explore HS Sections (/sections), Sectors (/sectors), Research (/research), or use the search bar above.'
      };
      
      const response = responses[input.toLowerCase().includes('hs') ? 'hs' : 
                              input.toLowerCase().includes('sector') ? 'sector' :
                              input.toLowerCase().includes('trade') ? 'trade' :
                              input.toLowerCase().includes('report') ? 'report' : 'default'];
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, type: 'bot' }]);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addMessage(input, 'user');
      setInput('');
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#193C8D] hover:bg-[#142C55] text-white rounded-full shadow-2xl border-4 border-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Chatbot"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-50 w-80 max-h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between rounded-t-2xl bg-[#193C8D] text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <span className="font-bold text-sm">KAM Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.type === 'user'
                    ? 'bg-[#E7B947] text-[#193C8D] rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about HS sections, sectors, trade data..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#193C8D] focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-[#193C8D] hover:bg-[#142C55] text-white rounded-xl flex items-center justify-center transition-colors"
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
