import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import { ChatHeader } from "./components/ChatHeader";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";

const socket = io("https://pizza-ai-menu-bot-nodejs.onrender.com");
export interface Message {
  sender: "user" | "bot";
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado:", socket.id);
    });

    socket.on("response", (msg: string) => {
      setMessages((prev) => [...prev, { sender: "bot", content: msg }]);
    });

    return () => {
      socket.off("response");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("message", input);

    setMessages((prev) => [...prev, { sender: "user", content: input }]);

    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg flex flex-col h-[90vh] overflow-hidden border border-gray-200">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
