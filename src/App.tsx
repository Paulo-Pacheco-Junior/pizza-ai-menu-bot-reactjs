import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { PizzaLogo } from "./components/PizzaLogo";
import { useChatSocket } from "./hooks/useChatSocket";

const SERVER_URL = "https://pizza-ai-menu-bot-nodejs.onrender.com";
//const SERVER_URL = "http://localhost:3333";

export default function App() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isConnected,
    errorMessage,
    retryMessage,
    sendMessage,
    resetChat,
  } = useChatSocket(SERVER_URL);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage(text);
    setInput("");
  };

  const handleRetry = () => {
    if (!retryMessage || isLoading) return;
    sendMessage(retryMessage, true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-2 sm:p-4 selection:bg-red-600 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-stone-300/60 flex flex-col max-h-[96dvh] h-full overflow-hidden border border-amber-200/70">
        <ChatHeader onResetChat={resetChat} />

        {/* Banner com botão 'PEDIDO ONLINE' inspirado na marca */}
        <div className="bg-amber-50/70 border-b border-amber-100 px-4 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
            <span className="flex items-center gap-1 text-amber-800">
              🛵 <strong>50 Min</strong>
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-700">Min. R$ 15,00</span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-xs">
            <span>🍕</span> Pedido Online
          </div>
        </div>

        {/* Lista de mensagens com rolagem suave */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-amber-50/40 via-stone-50/60 to-amber-50/30 min-h-[380px]">
          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}

          {/* Indicador animado de digitação do bot */}
          {isLoading && (
            <div className="flex items-end gap-2.5 justify-start animate-fade-in">
              <PizzaLogo size="sm" />
              <div className="bg-white text-stone-500 border border-amber-200/80 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-600/70 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-600/70 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-600/70 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Campo de entrada de texto */}
        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={handleSend}
          isLoading={isLoading || retryMessage !== null}
        />

        {/* Alerta de erro com botão de reenvio */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 border-t border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <span>{errorMessage}</span>
            {retryMessage && (
              <button
                type="button"
                onClick={handleRetry}
                disabled={!isConnected || isLoading}
                className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
