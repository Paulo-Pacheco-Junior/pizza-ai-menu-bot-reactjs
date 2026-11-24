interface Props {
  input: string;
  setInput: (val: string) => void;
  sendMessage: () => void;
  isLoading?: boolean;
}

export function ChatInput({ input, setInput, sendMessage, isLoading }: Props) {
  return (
    <footer className="p-3 bg-white border-t border-amber-200/60 shadow-xs">
      <div className="flex items-center gap-2 bg-stone-50 rounded-full border border-stone-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 px-3 py-1.5 transition-all shadow-inner">
        <input
          type="text"
          disabled={isLoading}
          className="flex-1 bg-transparent px-2 py-1 text-sm text-stone-800 placeholder-stone-400 focus:outline-none disabled:text-stone-400"
          placeholder={isLoading ? "Aguarde o atendente responder..." : "O que você gostaria de pedir hoje?"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => !isLoading && e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-red-600 hover:bg-red-700 text-white font-medium p-2.5 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md shadow-red-600/30 flex items-center justify-center active:scale-95"
          title="Enviar mensagem"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 transform rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )}
        </button>
      </div>
    </footer>
  );
}
