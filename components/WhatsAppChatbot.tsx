
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, CheckCheck, Loader2, Sparkles, Bot } from 'lucide-react';
import { getChatbotResponse } from '../geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isTypingEffect?: boolean;
}

const TypewriterText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      // Simulate slightly varied typing speeds for a more "elaborate" human feel
      const speed = Math.floor(Math.random() * 20) + 20; 
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, onComplete]);

  // We use dangerouslySetInnerHTML to render the <b> tags produced by the AI
  return <div dangerouslySetInnerHTML={{ __html: displayedText }} />;
};

const WhatsAppChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState({ name: 'Guest', tier: 'Guest' });
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hi, I am your <b>UCLF AI legal assistant</b>. How may I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTypingEffect: false
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const UCLF_LOGO = "https://i.postimg.cc/TYDvMJrD/UCLF-LOGO-(1).png";

  useEffect(() => {
    const saved = localStorage.getItem('uclf_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        setUserContext({ name: user.name, tier: user.tier });
      } catch (e) {
        console.error("User parse error");
      }
    }
  }, []);

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

    const response = await getChatbotResponse(userText, history, userContext);
    
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: response, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTypingEffect: true
    }]);
    setIsTyping(false);
  };

  const markTypewriterComplete = (index: number) => {
    setMessages(prev => prev.map((m, i) => i === index ? { ...m, isTypingEffect: false } : m));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[350px] h-[360px] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          
          <header className="bg-primary p-4 text-white shrink-0 relative">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center shadow-lg">
                  <img src={UCLF_LOGO} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight leading-none text-white">
                    UCLF Legal AI
                  </h3>
                  <div className="flex items-center mt-0.5 space-x-1">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    <p className="text-[8px] text-blue-100 uppercase font-black tracking-widest">
                      {userContext.tier} Portal
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary/30"></div>
          </header>

          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 space-y-3 bg-[#f8fafc] custom-scrollbar"
            style={{ 
              backgroundImage: 'linear-gradient(rgba(248,250,252,0.98), rgba(248,250,252,0.98)), url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', 
              backgroundSize: '200px',
              backgroundRepeat: 'repeat'
            }}
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                <div className={`max-w-[90%] p-3.5 rounded-2xl shadow-sm text-[13px] relative ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  <div className="leading-relaxed font-medium">
                    {m.role === 'model' && m.isTypingEffect ? (
                      <TypewriterText text={m.text} onComplete={() => markTypewriterComplete(i)} />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: m.text }} />
                    )}
                  </div>
                  <div className={`flex items-center justify-end space-x-1 mt-1 ${m.role === 'user' ? 'text-white/50' : 'text-slate-400'}`}>
                    <span className="text-[7px] font-black uppercase">{m.timestamp}</span>
                    {m.role === 'user' && <CheckCheck size={10} />}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1 items-center border border-slate-200">
                  <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce delay-150"></div>
                  <div className="w-1 h-1 bg-primary/40 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-100 flex items-center space-x-2 shrink-0">
            <div className="flex-grow relative">
              <input 
                type="text" 
                className="w-full bg-slate-50 px-4 py-2.5 rounded-xl text-[13px] outline-none border border-slate-200 focus:border-primary/30 focus:bg-white transition-all font-medium pr-8"
                placeholder="Ask our concierge..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300">
                <Bot size={14} />
              </div>
            </div>
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`p-2.5 rounded-xl shadow-md transition-all active:scale-90 ${
                !input.trim() || isTyping 
                  ? 'bg-slate-100 text-slate-300' 
                  : 'bg-primary text-white hover:bg-blue-800'
              }`}
            >
              {isTyping ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            </button>
          </form>
        </div>
      )}

      {/* COMPACT FLOATING BUTTON */}
      <div className="group relative">
        {!isOpen && (
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-10 scale-105"></div>
        )}

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(30,58,138,0.2)] transition-all duration-500 hover:scale-105 active:scale-95 relative overflow-hidden border-[3px] border-white ${
            isOpen 
              ? 'bg-red-500 rotate-90 text-white' 
              : 'bg-gradient-to-tr from-primary via-blue-700 to-primary'
          }`}
          aria-label="Toggle AI Chatbot"
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] translate-x-[-250%] group-hover:translate-x-[350%] transition-transform duration-1000 ease-in-out"></div>
          
          {isOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <div className="relative">
              <Bot className="text-white group-hover:scale-110 transition-transform" size={20} />
              <Sparkles size={8} className="absolute -top-1 -right-1 text-secondary animate-pulse" fill="currentColor" />
            </div>
          )}
        </button>

        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none">
            <div className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.2em] py-2 px-3 rounded-lg shadow-xl whitespace-nowrap border border-white/10 flex items-center">
              <Sparkles size={8} className="mr-1.5 text-secondary" fill="currentColor" />
              Lego AI
            </div>
            <div className="w-2 h-2 bg-slate-900 border-r border-b border-white/10 rotate-45 mx-auto -mt-1 mr-5"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChatbot;
