import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getOrCreateSessionId } from "../session";

export interface Message {
  sender: "user" | "bot";
  content: string;
}

const RESPONSE_TIMEOUT_MS = 30_000;

const sessionId = getOrCreateSessionId();

export function useChatSocket(serverUrl: string) {
  const [socket] = useState(() =>
    io(serverUrl, {
      auth: { sessionId },
    })
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      content:
        "Olá! 👋 Bem-vindo à Pizzaria Forno a Lenha! 🍕\n\n🛵 Tempo de entrega: ~50 min\n📦 Retirada: ~20 min\n💰 Pedido mínimo: R$ 15,00\n\nComo posso te ajudar com o seu pedido hoje?",
    },
  ]);

  const activeMessageIdRef = useRef<string | null>(null);
  const retryMessageRef = useRef<string | null>(null);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setErrorMessage(
        retryMessageRef.current
          ? "Conexão restabelecida. Tente reenviar sua mensagem."
          : null
      );
      console.log("Conectado:", socket.id);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      if (activeMessageIdRef.current) {
        setIsLoading(false);
      }
      setErrorMessage(
        "A conexão com o atendimento foi perdida. Verifique a conexão e tente novamente."
      );
    };

    const handleConnectError = () => {
      setIsConnected(false);
      if (activeMessageIdRef.current) {
        setIsLoading(false);
      }
      setErrorMessage(
        "Não foi possível conectar ao atendimento. Verifique sua conexão e tente novamente."
      );
    };

    const handleHistory = (
      history: { sender: "user" | "bot"; content: string }[]
    ) => {
      if (history && history.length > 0) {
        setMessages(
          history.map((h) => ({
            sender: h.sender,
            content: h.content,
          }))
        );
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("history", handleHistory);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("history", handleHistory);
    };
  }, [socket]);

  const sendMessage = (messageText: string, isRetry = false) => {
    if (isLoading || !messageText.trim()) return;

    if (!socket.connected) {
      setErrorMessage(
        "Sem conexão com o atendimento. Aguarde a reconexão para tentar novamente."
      );
      return;
    }

    const currentMessageId =
      isRetry && activeMessageIdRef.current
        ? activeMessageIdRef.current
        : crypto.randomUUID();

    activeMessageIdRef.current = currentMessageId;
    setIsLoading(true);
    setErrorMessage(null);

    if (!isRetry) {
      retryMessageRef.current = null;
      setRetryMessage(null);
      setMessages((prev) => [...prev, { sender: "user", content: messageText }]);
    }

    socket
      .timeout(RESPONSE_TIMEOUT_MS)
      .emit(
        "message",
        {
          messageId: currentMessageId,
          content: messageText,
          sessionId,
        },
        (err: Error | null, response?: string) => {
          // Ignora callbacks tardios caso o chat tenha sido resetado
          if (activeMessageIdRef.current !== currentMessageId) return;

          setIsLoading(false);

          if (err || !response) {
            retryMessageRef.current = messageText;
            setRetryMessage(messageText);
            setErrorMessage(
              "O atendimento demorou para responder. Você pode tentar enviar a mensagem novamente."
            );
            return;
          }

          activeMessageIdRef.current = null;
          retryMessageRef.current = null;
          setRetryMessage(null);
          setErrorMessage(null);
          setMessages((prev) => [...prev, { sender: "bot", content: response }]);
        }
      );
  };

  const resetChat = () => {
    activeMessageIdRef.current = null;
    retryMessageRef.current = null;
    localStorage.removeItem("pizza_bot_session_id");
    const newSessionId = crypto.randomUUID();
    localStorage.setItem("pizza_bot_session_id", newSessionId);
    window.location.reload();
  };

  return {
    messages,
    isLoading,
    isConnected,
    errorMessage,
    retryMessage,
    sendMessage,
    resetChat,
  };
}
