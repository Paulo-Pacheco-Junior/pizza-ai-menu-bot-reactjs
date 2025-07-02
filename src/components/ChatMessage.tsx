export interface Message {
  sender: "user" | "bot";
  content: string;
}

export function ChatMessage({ msg }: { msg: Message }) {
  const isUser = msg.sender === "user";

  return (
    <div
      className={`max-w-[75%] px-4 py-2 text-sm rounded-xl whitespace-pre-wrap ${
        isUser
          ? "bg-white text-gray-900 border border-gray-100 self-end ml-auto"
          : "bg-gray-100 text-gray-900 self-start mr-auto"
      }`}
    >
      {msg.content}
    </div>
  );
}
