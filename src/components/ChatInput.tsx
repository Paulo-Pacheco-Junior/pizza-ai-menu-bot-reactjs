interface Props {
  input: string;
  setInput: (val: string) => void;
  sendMessage: () => void;
}

export function ChatInput({ input, setInput, sendMessage }: Props) {
  return (
    <footer className="flex gap-2 p-3 border-t border-gray-200 bg-white">
      <input
        type="text"
        className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        placeholder="Digite sua mensagem..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
      >
        Enviar
      </button>
    </footer>
  );
}
