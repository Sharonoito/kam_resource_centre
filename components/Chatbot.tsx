"use client";

import { useState, useEffect } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-[99] w-14 h-14 bg-[#193C8D] hover:bg-[#142C55] text-white rounded-full shadow-2xl border-4 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95" 
        title="KAM Trade Intelligence Chat">
        💬
      </button>
      {isOpen ? (
        <div className="fixed bottom-20 right-4 z-50">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="absolute -top-3 -right-3 z-[60] h-8 w-8 rounded-full bg-white text-gray-700 shadow-md border border-gray-200 hover:bg-gray-100"
          >
            ×
          </button>
          <iframe
            src="http://74.208.68.65"
            width="420"
            height="620"
            frameBorder="0"
            allow="clipboard-read; clipboard-write"
            className="rounded-2xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-all"
            title="KAM Trade Intelligence"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
          />
        </div>
      ) : null}
    </>
  );
}

