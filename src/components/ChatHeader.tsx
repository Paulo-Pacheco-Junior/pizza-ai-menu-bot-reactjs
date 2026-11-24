import { PizzaLogo } from "./PizzaLogo";

interface Props {
  onResetChat?: () => void;
}

export function ChatHeader({ onResetChat }: Props) {
  return (
    <header className="relative bg-white text-stone-800 px-4 py-3.5 border-b-2 border-red-600/90 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <PizzaLogo size="md" />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-serif italic font-bold tracking-wide text-stone-900 drop-shadow-2xs">
              🍕 Pizzaria Forno a Lenha
            </h1>
          </div>
          <p className="text-[11px] text-stone-500 flex items-center gap-1.5 font-sans">
            <svg
              className="w-3.5 h-3.5 text-red-600 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium text-stone-700">Goiânia</span> • 18:30 às 23:59
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onResetChat && (
          <button
            onClick={onResetChat}
            title="Reiniciar atendimento"
            className="text-stone-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-all border border-stone-200 hover:border-red-200 text-xs flex items-center gap-1 active:scale-95 shadow-2xs"
          >
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline font-medium">Novo Pedido</span>
          </button>
        )}
      </div>
    </header>
  );
}
