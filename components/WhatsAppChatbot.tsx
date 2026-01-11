
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, ShieldCheck, CheckCheck, Loader2, Sparkles, Bot } from 'lucide-react';
import { getChatbotResponse } from '../geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const WhatsAppChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm your UCLF Concierge. How can I assist you with membership or legal aid inquiries today? 🙏",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const UCLF_LOGO = "https://i.postimg.cc/TYDvMJrD/UCLF-LOGO-(1).png";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { role: 'user', text: userText, timestamp: time }]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }] as [{ text: string }]
    }));

    const response = await getChatbotResponse(userText, history);
    
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: response, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex flex-col items-end">
      {/* Chat Window - Shortened height (approx 470px) */}
      {isOpen && (
        <div className="mb-6 w-[90vw] sm:w-[400px] h-[470px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,58,138,0.3)] flex flex-col overflow-hidden border border-blue-50 animate-in slide-in-from-bottom-6 zoom-in-95 duration-500">
          {/* Header - Premium UCLF Blue */}
          <header className="bg-gradient-to-r from-primary to-blue-800 p-6 text-white shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
              <Sparkles size={80} />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-white/20 overflow-hidden shadow-inner">
                    <img src={UCLF_LOGO} alt="Logo" className="w-full h-full object-contain brightness-0 invert" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-primary"></div>
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight flex items-center">
                    UCLF Concierge
                    <ShieldCheck size={16} className="ml-2 text-blue-300" fill="currentColor" />
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    <p className="text-[10px] text-blue-100/80 uppercase font-black tracking-widest">
                      AI Legal Intelligence
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10"
              >
                <X size={20} />
              </button>
            </div>
          </header>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-6 space-y-5 bg-[#f8fafc] custom-scrollbar"
            style={{ 
              backgroundImage: 'linear-gradient(rgba(248,250,252,0.94), rgba(248,250,252,0.94)), url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', 
              backgroundSize: '300px',
              backgroundRepeat: 'repeat'
            }}
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm text-sm relative ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  <p className="leading-relaxed font-medium">{m.text}</p>
                  <div className={`flex items-center justify-end space-x-1 mt-2 ${m.role === 'user' ? 'opacity-60' : 'opacity-40'}`}>
                    <span className="text-[9px] font-black">{m.timestamp}</span>
                    {m.role === 'user' && <CheckCheck size={12} />}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm flex space-x-1.5 items-center border border-slate-100">
                  <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-5 bg-white border-t border-slate-100 flex items-center space-x-3 shrink-0">
            <div className="flex-grow relative">
              <input 
                type="text" 
                className="w-full bg-slate-50 px-6 py-4 rounded-2xl text-sm outline-none border border-transparent focus:border-primary/20 focus:bg-white transition-all font-medium pr-12"
                placeholder="Ask our AI legal assistant..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                <Bot size={18} />
              </div>
            </div>
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`p-4 rounded-2xl shadow-lg transition-all active:scale-90 ${
                !input.trim() || isTyping 
                  ? 'bg-slate-100 text-slate-300' 
                  : 'bg-primary text-white hover:bg-blue-800 hover:shadow-primary/30'
              }`}
            >
              {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </form>
        </div>
      )}

      {/* STAGGERING BLUE AND WHITE BUTTON */}
      <div className="group relative">
        {/* Dual Ripple Effect */}
        {!isOpen && (
          <>
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20 scale-125"></div>
            <div className="absolute inset-0 bg-primary rounded-full animate-pulse opacity-10 scale-150"></div>
          </>
        )}

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-20 h-20 rounded-[2rem] flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(30,58,138,0.4)] transition-all duration-700 hover:scale-105 active:scale-90 relative overflow-hidden border-4 border-white ${
            isOpen 
              ? 'bg-gradient-to-br from-red-500 to-rose-600 rotate-90' 
              : 'bg-gradient-to-tr from-primary via-blue-700 to-primary'
          }`}
          aria-label="Toggle AI Chatbot"
        >
          {/* Subtle light streak animation */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out"></div>
          
          {isOpen ? (
            <X size={32} className="text-white" />
          ) : (
            <>
              <div className="relative">
                <Bot className="text-white group-hover:scale-110 transition-transform mb-0.5" size={28} />
                <Sparkles size={14} className="absolute -top-1 -right-2 text-secondary animate-pulse" fill="currentColor" />
              </div>
              <span className="text-[8px] font-black text-blue-100/80 uppercase tracking-widest">Counsel AI</span>
            </>
          )}
        </button>

        {/* Hover Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none">
            <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] py-3 px-6 rounded-2xl shadow-2xl whitespace-nowrap border border-white/10 flex items-center">
              <Sparkles size={12} className="mr-2 text-secondary" fill="currentColor" />
              Ask UCLF AI
            </div>
            <div className="w-3 h-3 bg-slate-900 border-r border-b border-white/10 rotate-45 mx-auto -mt-1.5 mr-8"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChatbot;
