import { getOrCreateSessionId } from "./session";
import { API_URL } from "./config";

export interface Cart {
  items: Array<{
    id: string;
    quantity: number;
  }>;
}

function getHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-Session-Id": getOrCreateSessionId(),
  };
}

export async function fetchCart(): Promise<Cart> {
  const res = await fetch(`${API_URL}/cart`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Não foi possível carregar o carrinho.");
  return res.json() as Promise<Cart>;
}

export async function addItemToCart(item: {
  menuItemId: number;
  quantity?: number;
  size?: string;
  flavorHalf1?: string;
  flavorHalf2?: string;
  notes?: string;
}) {
  const res = await fetch(`${API_URL}/cart/items`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Não foi possível adicionar o item ao carrinho.");
  return res.json();
}

export async function removeItemFromCart(orderItemId: string) {
  const res = await fetch(`${API_URL}/cart/items`, {
    method: "DELETE",
    headers: getHeaders(),
    body: JSON.stringify({ orderItemId }),
  });
  if (!res.ok) throw new Error("Erro ao remover item do carrinho");
  return res.json();
}

export async function updateCartDelivery(data: {
  customerName?: string;
  customerPhone?: string;
  address?: string;
  deliveryFee?: number;
  paymentMethod?: string;
  changeFor?: number;
}) {
  const res = await fetch(`${API_URL}/cart/delivery`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar dados de entrega");
  return res.json();
}

export async function finalizeCartOrder() {
  const res = await fetch(`${API_URL}/cart/finalize`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao finalizar pedido");
  return res.json();
}
