import { PizzaLogo } from "./PizzaLogo";

export interface Message {
  sender: "user" | "bot";
  content: string;
}

export function ChatMessage({ msg }: { msg: Message }) {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <PizzaLogo size="sm" />}

      <div
        className={`max-w-[82%] px-4 py-2.5 text-sm rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm transition-all ${
          isUser
            ? "bg-red-600 hover:bg-red-500 text-white rounded-br-xs border border-red-500 shadow-red-200 font-normal"
            : "bg-white text-stone-800 border border-amber-200/80 rounded-bl-xs shadow-stone-200/50"
        }`}
      >
        {msg.content}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-xs text-red-700 shrink-0 select-none font-semibold">
          👤
        </div>
      )}
    </div>
  );
}
