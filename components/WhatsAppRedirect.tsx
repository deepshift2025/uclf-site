
import React, { useState, useEffect } from 'react';

const WhatsAppRedirect: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = "256702439070";
  const message = "Hello UCLF, I would like to inquire about your legal services.";

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      const scrollPercentage = scrollHeight > 0 ? (scrollPos / scrollHeight) * 100 : 0;

      if (scrollPercentage >= 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[2000] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="group relative">
        {/* Tooltip */}
        <div className="absolute bottom-full left-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-white text-primary text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl shadow-2xl border border-blue-50 whitespace-nowrap">
            Direct WhatsApp
          </div>
          <div className="w-3 h-3 bg-white border-l border-t border-blue-50 rotate-45 mx-auto -mt-1.5 ml-6"></div>
        </div>

        {/* Pulse effect */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-0 transition-opacity"></div>
        
        {/* Main Button with official WhatsApp Logo and attention animation */}
        <button 
          onClick={handleClick}
          className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-white animate-attention overflow-hidden"
          aria-label="Contact us on WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>

        {/* Verified Badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full border-2 border-white flex items-center justify-center shadow-sm">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppRedirect;
