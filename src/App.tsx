import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import { ChatHeader } from "./components/ChatHeader";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { PizzaLogo } from "./components/PizzaLogo";

//const SERVER_URL = "https://pizza-ai-menu-bot-nodejs.onrender.com";
const SERVER_URL = "http://localhost:3333";

function getOrCreateSessionId(): string {
  const STORAGE_KEY = "pizza_bot_session_id";
  let sessionId = localStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
}

const sessionId = getOrCreateSessionId();

const socket = io(SERVER_URL, {
  auth: { sessionId },
});

export interface Message {
  sender: "user" | "bot";
  content: string;
}

export default function App() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      content:
        "Olá! 👋 Bem-vindo à Pizzaria Forno a Lenha! 🍕\n\n🛵 Tempo de entrega: ~50 min\n📦 Retirada: ~20 min\n💰 Pedido mínimo: R$ 15,00\n\nComo posso te ajudar com o seu pedido hoje?",
    },
  ]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado:", socket.id);
    });

    socket.on(
      "history",
      (history: { sender: "user" | "bot"; content: string }[]) => {
        if (history && history.length > 0) {
          setMessages(
            history.map((h) => ({
              sender: h.sender,
              content: h.content,
            }))
          );
        }
      }
    );
    
    socket.on("response", (msg: string) => {
      setMessages((prev) => [...prev, { sender: "bot", content: msg }]);
      setIsLoading(false);
    });

    return () => {
      socket.off("history");
      socket.off("response");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = () => {
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    setIsLoading(true);
    socket.emit("message", { content: messageText, sessionId });

    setMessages((prev) => [...prev, { sender: "user", content: messageText }]);
    setInput("");
  };

  const handleResetChat = () => {
    localStorage.removeItem("pizza_bot_session_id");
    const newSessionId = crypto.randomUUID();
    localStorage.setItem("pizza_bot_session_id", newSessionId);
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-2 sm:p-4 selection:bg-red-600 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-stone-300/60 flex flex-col max-h-[96dvh] h-full overflow-hidden border border-amber-200/70">
        <ChatHeader onResetChat={handleResetChat} />

        {/* Banner com botão 'FAÇA SEU PEDIDO ONLINE' inspirado na imagem com visual apetitoso */}
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-amber-50/40 via-stone-50/60 to-amber-50/30 min-h-[380px]">
          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}

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

        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
