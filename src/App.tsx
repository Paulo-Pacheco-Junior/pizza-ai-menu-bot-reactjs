import { useEffect, useMemo, useRef, useState } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { PizzaLogo } from "./components/PizzaLogo";
import { useChatSocket } from "./hooks/useChatSocket";
import { API_URL } from "./config";
import { addItemToCart, fetchCart } from "./cartService";
import type { Cart } from "./cartService";
import { fetchMenu, type MenuItem } from "./menuService";

type View = "chat" | "menu";

const categories: Array<{ value: MenuItem["type"]; label: string }> = [
  { value: "pizza", label: "Pizzas" },
  { value: "bebida", label: "Bebidas" },
  { value: "sobremesa", label: "Sobremesas" },
];

export default function App() {
  const [input, setInput] = useState("");
  const [view, setView] = useState<View>("chat");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [addingItemId, setAddingItemId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isConnected,
    errorMessage,
    retryMessage,
    sendMessage,
    resetChat,
  } = useChatSocket(API_URL);

  const cartItemCount = useMemo(
    () => cart?.items.reduce((count, item) => count + item.quantity, 0) ?? 0,
    [cart]
  );

  useEffect(() => {
    let active = true;
    setLoadingMenu(true);

    async function loadMenu() {
      try {
        const items = await fetchMenu();
        if (!active) return;
        setMenuItems(items);
        setMenuError(null);
      } catch (error: unknown) {
        if (!active) return;
        setMenuError(
          error instanceof Error ? error.message : "Não foi possível carregar o cardápio."
        );
      } finally {
        if (active) setLoadingMenu(false);
      }
    }

    async function loadCart() {
      try {
        const currentCart = await fetchCart();
        if (!active) return;
        setCart(currentCart);
        setCartError(null);
      } catch (error: unknown) {
        if (!active) return;
        setCartError(
          error instanceof Error ? error.message : "Não foi possível carregar o carrinho."
        );
      }
    }

    void loadMenu();
    void loadCart();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleAddToCart = async (menuItemId: number) => {
    setAddingItemId(menuItemId);
    setCartError(null);
    try {
      const updatedCart = (await addItemToCart({ menuItemId })) as Cart;
      setCart(updatedCart);
    } catch (error) {
      setCartError(
        error instanceof Error ? error.message : "Não foi possível adicionar o item."
      );
    } finally {
      setAddingItemId(null);
    }
  };

  const handleLoadMenuAgain = async () => {
    setLoadingMenu(true);
    setMenuError(null);
    try {
      setMenuItems(await fetchMenu());
    } catch (error) {
      setMenuError(
        error instanceof Error ? error.message : "Não foi possível carregar o cardápio."
      );
    } finally {
      setLoadingMenu(false);
    }
  };

  const handleLoadCartAgain = async () => {
    setCartError(null);
    try {
      setCart(await fetchCart());
    } catch (error) {
      setCartError(
        error instanceof Error ? error.message : "Não foi possível carregar o carrinho."
      );
    }
  };

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
          <span className="flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-xs">
            <span>🍕</span> Pedido Online
          </span>
        </div>

        <nav className="flex border-b border-amber-100 bg-white" aria-label="Navegação principal">
          <button
            type="button"
            onClick={() => setView("chat")}
            aria-current={view === "chat" ? "page" : undefined}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
              view === "chat"
                ? "border-b-2 border-red-600 text-red-700"
                : "text-stone-500 hover:bg-amber-50"
            }`}
          >
            Atendimento
          </button>
          <button
            type="button"
            onClick={() => setView("menu")}
            aria-current={view === "menu" ? "page" : undefined}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
              view === "menu"
                ? "border-b-2 border-red-600 text-red-700"
                : "text-stone-500 hover:bg-amber-50"
            }`}
          >
            Cardápio
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
              {cartItemCount}
            </span>
          </button>
        </nav>

        {view === "menu" ? (
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-amber-50/40 to-stone-50 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-stone-900">Nosso cardápio</h2>
              <p className="text-sm text-stone-600">Escolha seus itens e adicione ao pedido.</p>
            </div>

            {menuError && (
              <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <p>{menuError}</p>
                <button
                  type="button"
                  onClick={handleLoadMenuAgain}
                  disabled={loadingMenu}
                  className="mt-2 font-semibold underline disabled:opacity-50"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {loadingMenu && menuItems.length === 0 ? (
              <p className="py-10 text-center text-sm text-stone-500">Carregando cardápio...</p>
            ) : menuItems.length === 0 ? (
              !menuError && (
                <p className="py-10 text-center text-sm text-stone-500">
                  O cardápio está vazio no momento.
                </p>
              )
            ) : (
              categories.map(({ value, label }) => {
                const items = menuItems.filter((item) => item.type === value);
                if (items.length === 0) return null;

                return (
                  <section key={value} className="mb-6" aria-labelledby={`category-${value}`}>
                    <h3 id={`category-${value}`} className="mb-2 text-base font-bold text-stone-800">
                      {label}
                    </h3>
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-2xl border border-amber-200/80 bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-semibold text-stone-900">{item.name}</h4>
                              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                                {item.description}
                              </p>
                              <p className="mt-2 text-sm font-semibold text-red-700">
                                {item.price > 0
                                  ? item.price.toLocaleString("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    })
                                  : "Preço a confirmar"}
                              </p>
                              {item.price <= 0 && (
                                <p className="mt-1 text-xs text-stone-500">
                                  Indisponível até o preço ser cadastrado.
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => void handleAddToCart(item.id)}
                              disabled={addingItemId !== null || item.price <= 0}
                              className="shrink-0 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                            >
                              {addingItemId === item.id
                                ? "Adicionando..."
                                : item.price > 0
                                  ? "Adicionar"
                                  : "Indisponível"}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })
            )}

            {cartError && (
              <div role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <p>{cartError}</p>
                <button
                  type="button"
                  onClick={handleLoadCartAgain}
                  className="mt-2 font-semibold underline"
                >
                  Recarregar carrinho
                </button>
              </div>
            )}
          </main>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
