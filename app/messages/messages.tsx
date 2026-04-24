'use client';

import { Search, Send, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Conversation {
  id: string;
  name: string;
  email: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar: string;
}

interface Message {
  id: string;
  sender: { name: string; email: string };
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

export default function Messages() {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [sending, setSending] = useState(false);

  const currentUserEmail = user?.email?.toLowerCase() || '';

  const formatTime = (dateValue: Date | string) => {
    const date = new Date(dateValue);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (dateValue: Date | string) => {
    const date = new Date(dateValue);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchConversations = useCallback(async () => {
    if (!currentUserEmail) return;

    setLoadingConversations(true);
    try {
      const response = await fetch(
        `/api/messages?currentUserEmail=${encodeURIComponent(currentUserEmail)}`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error('No se pudieron cargar conversaciones');
      }

      const result = await response.json();
      const nextConversations: Conversation[] = (result.data || []).map((item: any) => {
        const initials = item.otherUser.name
          .split(' ')
          .map((part: string) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        return {
          id: item.otherUser.id,
          name: item.otherUser.name,
          email: item.otherUser.email,
          lastMessage: item.lastMessage,
          timestamp: new Date(item.timestamp),
          unread: item.unread,
          avatar: initials,
        };
      });

      setConversations(nextConversations);

      if (!selectedEmail && nextConversations.length > 0) {
        setSelectedEmail(nextConversations[0].email);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingConversations(false);
    }
  }, [currentUserEmail, selectedEmail]);

  const fetchMessages = useCallback(async (otherEmail: string) => {
    if (!currentUserEmail || !otherEmail) return;

    try {
      const response = await fetch(
        `/api/messages?currentUserEmail=${encodeURIComponent(
          currentUserEmail
        )}&otherUserEmail=${encodeURIComponent(otherEmail)}`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error('No se pudieron cargar mensajes');
      }

      const result = await response.json();
      const parsedMessages: Message[] = (result.data || []).map((item: any) => ({
        id: item.id,
        sender: item.sender,
        text: item.content,
        timestamp: new Date(item.createdAt),
        isOwn: item.sender.email.toLowerCase() === currentUserEmail,
      }));

      setMessages(parsedMessages);
    } catch (error) {
      console.error(error);
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchConversations();
  }, [isAuthenticated, fetchConversations]);

  useEffect(() => {
    if (!selectedEmail) return;
    fetchMessages(selectedEmail);
  }, [selectedEmail, fetchMessages]);

  useEffect(() => {
    if (!isAuthenticated || !currentUserEmail) return;

    const interval = setInterval(() => {
      fetchConversations();
      if (selectedEmail) {
        fetchMessages(selectedEmail);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, currentUserEmail, selectedEmail, fetchConversations, fetchMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    const destinationEmail = selectedEmail || newRecipientEmail.trim().toLowerCase();
    if (!destinationEmail || !currentUserEmail) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderEmail: currentUserEmail,
          senderName: user?.name,
          recipientEmail: destinationEmail,
          recipientName: newRecipientName || undefined,
          content: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el mensaje');
      }

      setMessageText('');
      setSelectedEmail(destinationEmail);
      await fetchConversations();
      await fetchMessages(destinationEmail);
      setNewRecipientEmail('');
      setNewRecipientName('');
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = useMemo(
    () =>
      conversations.filter(
        (conversation) =>
          conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conversation.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [conversations, searchQuery]
  );

  const selectedConversation = conversations.find((c) => c.email === selectedEmail);

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Inicia sesion para usar Mensajes</h2>
          <p className="mt-2 text-gray-600">
            La mensajeria ahora guarda conversaciones reales en la base de datos, por eso
            necesitas una sesion activa.
          </p>
        </div>
      </div>
    );
  }

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

            <div className="mt-4 space-y-2 rounded-lg border border-gray-200 p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <UserPlus size={14} /> Nuevo chat
              </p>
              <input
                type="email"
                value={newRecipientEmail}
                onChange={(e) => setNewRecipientEmail(e.target.value)}
                placeholder="Email del destinatario"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
              />
              <input
                type="text"
                value={newRecipientName}
                onChange={(e) => setNewRecipientName(e.target.value)}
                placeholder="Nombre (opcional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {loadingConversations && (
              <p className="p-4 text-sm text-gray-500">Cargando conversaciones...</p>
            )}

            {!loadingConversations && filteredConversations.length === 0 && (
              <p className="p-4 text-sm text-gray-500">No hay conversaciones todavia.</p>
            )}

            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedEmail(conversation.email)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition hover:bg-gray-50 ${
                  selectedEmail === conversation.email ? 'bg-primary/10' : ''
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
                <p className="text-xs text-gray-500">{formatConversationTime(conversation.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedConversation?.name || newRecipientName || 'Selecciona una conversación'}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedConversation?.email || newRecipientEmail || 'Sin destinatario'}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-sm text-gray-500">Todavia no hay mensajes en esta conversacion.</p>
            )}

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
                    {formatTime(message.timestamp)}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || (!selectedEmail && !newRecipientEmail.trim())}
                className="bg-secondary text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50"
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
