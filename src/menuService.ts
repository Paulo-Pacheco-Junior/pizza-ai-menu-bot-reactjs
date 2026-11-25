import { API_URL } from "./config";

export interface MenuItem {
  id: number;
  name: string;
  type: "pizza" | "bebida" | "sobremesa";
  description: string;
  price: number;
}

export async function fetchMenu(): Promise<MenuItem[]> {
  const response = await fetch(`${API_URL}/menu`);
  if (!response.ok) {
    throw new Error("Não foi possível carregar o cardápio. Tente novamente.");
  }

  return response.json() as Promise<MenuItem[]>;
}
