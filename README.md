# 🍕 Pizza AI Menu Bot – ReactJs

Interface de chat em tempo real para um bot de pizzaria, desenvolvido com **React + TypeScript**, **Tailwind CSS** e **Socket.IO**.

O bot simula o atendimento ao cliente em uma pizzaria, respondendo às mensagens do usuário com sugestões baseadas em IA. A comunicação com o backend ocorre via **WebSocket**.

---

## 🚀 Tecnologias

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.IO (client)](https://socket.io/)

---

## 🎯 Funcionalidades

- 💬 Interface de chat com rolagem automática
- ⚡ Comunicação em tempo real via WebSocket
- 🤖 Mensagens iniciais e respostas automáticas do bot
- 🧼 Interface limpa, responsiva e elegante
- ⌨️ Envio de mensagem com Enter ou botão

---

## 🧠 Estrutura do Projeto

```bash
frontend/
├── src/
│   ├── components/
│   │   ├── ChatHeader.tsx     # Cabeçalho do chat
│   │   ├── ChatInput.tsx      # Campo de texto + botão de envio
│   │   └── ChatMessage.tsx    # Componente para exibir cada mensagem
│   ├── App.tsx                # Componente principal do app
│   ├── main.tsx               # Ponto de entrada da aplicação
│   └── styles.css             # Importa o Tailwind (sem estilos customizados)
├── index.html
└── vite.config.ts
```

---

## 📦 Instalação e uso local

### 1. Clone o repositório

```bash
git clone https://github.com/Paulo-Pacheco-Junior/pizza-ai-menu-bot-reactjs
cd pizza-ai-menu-bot-reactjs/frontend
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn
```

### 3. Rode a aplicação e acesse

```bash
npm run dev
# ou
yarn dev
```

Acesse a aplicação em: [http://localhost:5173](http://localhost:5173)

> 🔌 **Importante:** Certifique-se de que o backend (Node.js) esteja em execução no endereço:  
> `https://pizza-ai-menu-bot-nodejs.onrender.com`
>
> Caso utilize outro backend local ou em produção, atualize a URL no trecho onde o socket é criado, dentro do arquivo `App.tsx`:

```ts
const socket = io("https://pizza-ai-menu-bot-nodejs.onrender.com");
```

Altere para, por exemplo:

```ts
const socket = io("http://localhost:3333");
```
