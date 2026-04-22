'use client';

import { Search, Send } from 'lucide-react';
import { useState } from 'react';

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export default function Messages() {
  const [conversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'Juan García',
      lastMessage: '¿Aún disponible el producto?',
      timestamp: '2024-02-23 10:30',
      unread: 2,
      avatar: 'JG',
    },
    {
      id: 2,
      name: 'María López',
      lastMessage: 'Gracias por el envío rápido',
      timestamp: '2024-02-22 15:45',
      unread: 0,
      avatar: 'ML',
    },
    {
      id: 3,
      name: 'Carlos Pérez',
      lastMessage: '¿Cuál es el precio final con envío?',
      timestamp: '2024-02-22 12:20',
      unread: 1,
      avatar: 'CP',
    },
  ]);

  const [selectedId, setSelectedId] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Juan García',
      text: 'Hola, ¿aún disponible el producto?',
      timestamp: '10:30',
      isOwn: false,
    },
    {
      id: 2,
      sender: 'Yo',
      text: 'Sí, todavía disponible. ¿Te interesa?',
      timestamp: '10:35',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'Juan García',
      text: '¿Cuál es el precio final con envío?',
      timestamp: '10:40',
      isOwn: false,
    },
  ]);

  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'Yo',
      text: messageText,
      timestamp: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOwn: true,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-300px)]">
      <div className="bg-white rounded-lg shadow-lg flex h-full">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Mensajes</h2>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar conversación..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedId(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition hover:bg-gray-50 ${
                  selectedId === conversation.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {conversation.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{conversation.name}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                  {conversation.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{conversation.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedConversation?.name}
            </h3>
            <p className="text-sm text-gray-600">En línea</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-secondary text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isOwn ? 'text-white/80' : 'text-gray-600'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                onClick={handleSendMessage}
                className="bg-secondary text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
