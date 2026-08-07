'use client';

/**
 * messages.tsx
 *
 * Página de mensajería/chat.
 * Permite que los usuarios se comuniquen con:
 * - Otros usuarios compradores
 * - Vendedores de productos
 * Incluye:
 * - Lista de conversaciones
 * - Vista de mensajes en tiempo real
 * - Búsqueda de conversaciones
 * - Notificaciones de mensajes nuevos
 */

import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Search, Send, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SmartImage } from '@/components/ui/smart-image';
import { getDesignAvatar } from '@/lib/design-api';
import { useLanguage } from '@/context/LanguageContext';

interface Conversation {
  userId: string;
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

const getConversationStorageKey = (userId: string) => `kivra:last-chat:${userId}`;

export default function Messages() {
  const { user, isAuthenticated, isAuthReady } = useAuth();
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientName, setNewRecipientName] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [sending, setSending] = useState(false);

  const selectedFromQuery = searchParams.get('user') || '';

  const formatTime = (dateValue: Date | string) => {
    const date = new Date(dateValue);
    return date.toLocaleTimeString(locale === 'en' ? 'en-US' : 'es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (dateValue: Date | string) => {
    const date = new Date(dateValue);
    return date.toLocaleString(locale === 'en' ? 'en-US' : 'es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;

    setLoadingConversations(true);
    try {
      const response = await fetch('/api/messages', {
        cache: 'no-store',
        headers: {
          'X-User-ID': user.id,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar conversaciones');
      }

      const result = await response.json();
      const nextConversations: Conversation[] = (result.data || []).map((item: any) => {
        const baseName = item.otherUser.name || item.otherUser.email || 'Usuario';
        const initials = baseName
          .split(' ')
          .map((part: string) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        return {
          userId: item.otherUser.id,
          name: item.otherUser.name,
          email: item.otherUser.email,
          lastMessage: item.lastMessage,
          timestamp: new Date(item.timestamp),
          unread: item.unread,
          avatar: initials,
        };
      });

      setConversations(nextConversations);

      if (selectedUserId && !nextConversations.some((conversation) => conversation.userId === selectedUserId)) {
        setSelectedUserId('');
      }

      if (!selectedUserId) {
        const storedSelected = localStorage.getItem(getConversationStorageKey(user.id));
        const preferredConversation =
          nextConversations.find((conversation) => conversation.userId === selectedFromQuery) ||
          nextConversations.find((conversation) => conversation.userId === storedSelected) ||
          nextConversations[0];

        if (preferredConversation) {
          setSelectedUserId(preferredConversation.userId);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingConversations(false);
    }
  }, [selectedFromQuery, selectedUserId, user?.id]);

  const fetchMessages = useCallback(async (otherUserId: string) => {
    if (!user?.id || !otherUserId) return;

    try {
      const response = await fetch(`/api/messages?otherUserId=${encodeURIComponent(otherUserId)}`, {
        cache: 'no-store',
        headers: {
          'X-User-ID': user.id,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar mensajes');
      }

      const result = await response.json();
      const parsedMessages: Message[] = (result.data || []).map((item: any) => ({
        id: item.id,
        sender: item.sender,
        text: item.content,
        timestamp: new Date(item.createdAt),
        isOwn: item.sender.id === user.id,
      }));

      setMessages(parsedMessages);
    } catch (error) {
      console.error(error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated || !user?.id) return;
    fetchConversations();
  }, [isAuthReady, isAuthenticated, fetchConversations, user?.id]);

  useEffect(() => {
    if (!selectedFromQuery || selectedUserId) return;
    setSelectedUserId(selectedFromQuery);
  }, [selectedFromQuery, selectedUserId]);

  useEffect(() => {
    if (!selectedUserId || !user?.id) return;
    localStorage.setItem(getConversationStorageKey(user.id), selectedUserId);
    fetchMessages(selectedUserId);
  }, [fetchMessages, selectedUserId, user?.id]);

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated || !user?.id) return;

    const interval = window.setInterval(() => {
      fetchConversations();
      if (selectedUserId) {
        fetchMessages(selectedUserId);
      }
    }, 30000);

    return () => window.clearInterval(interval);
  }, [fetchConversations, fetchMessages, isAuthReady, isAuthenticated, selectedUserId, user?.id]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user?.id) return;

    let recipientId = selectedUserId;
    const destinationEmail = newRecipientEmail.trim().toLowerCase();
    if (!recipientId && !destinationEmail) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id,
        },
        body: JSON.stringify({
          recipientId: recipientId || undefined,
          recipientEmail: recipientId ? undefined : destinationEmail,
          content: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el mensaje');
      }

      setMessageText('');
      await fetchConversations();

      if (!recipientId && destinationEmail) {
        const convo = conversations.find((item) => item.email.toLowerCase() === destinationEmail);
        recipientId = convo?.userId || '';
      }

      if (recipientId) {
        setSelectedUserId(recipientId);
        await fetchMessages(recipientId);
      }

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

  const selectedConversation = conversations.find((conversation) => conversation.userId === selectedUserId);
  const accountLabel = user ? `${user.firstName} ${user.lastName}`.trim() : 'Cuenta activa';

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#071425]">
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-2xl rounded-3xl border-white/10 bg-[#0c1d31]/90 p-10 text-center shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <p className="text-white/65">{t('messages.loadingAccount')}</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#071425]">
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-2xl rounded-3xl border-white/10 bg-[#0c1d31]/90 p-10 text-center shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary">
              <ShieldCheck size={26} />
            </div>
            <h2 className="text-2xl font-black text-white">{t('messages.loginTitle')}</h2>
            <p className="mt-2 text-white/65">
              {t('messages.loginSubtitle')}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071425]">
      <div className="relative overflow-hidden border-b border-white/10 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(29,184,73,0.18),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(255,214,0,0.18),transparent_42%),radial-gradient(circle_at_45%_85%,rgba(37,99,235,0.16),transparent_45%)]" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative z-10 flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="premium-chip">
                <MessageSquare size={14} className="text-primary" /> {t('messages.badge')}
              </span>
              <span className="premium-chip">
                <Sparkles size={14} className="text-secondary" /> {t('messages.badgeConnected')}
              </span>
              <span className="premium-chip">
                <ShieldCheck size={14} className="text-primary" /> {t('messages.badgeHistory')}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white md:text-5xl">{t('messages.heroTitle')}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/65">
                {t('messages.heroSubtitle')}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-white/12 bg-white/6 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">{t('messages.activeAccount')}</p>
                <p className="mt-2 text-lg font-bold text-white">{accountLabel}</p>
                <p className="text-sm text-white/58">{user.email}</p>
              </div>
              <div className="rounded-3xl border border-white/12 bg-white/6 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">{t('messages.status')}</p>
                <p className="mt-2 text-lg font-bold text-primary">{t('messages.activeConversations', { count: filteredConversations.length })}</p>
                <p className="text-sm text-white/58">{t('messages.autoUpdate')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <motion.section
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="surface-panel-strong p-5"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 text-white">
                <Sparkles size={18} className="text-secondary" />
                <h2 className="text-xl font-black">{t('messages.title')}</h2>
              </div>
              <p className="text-xs text-white/55">{t('messages.visibleConversations', { count: filteredConversations.length })}</p>
            </div>

            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('messages.searchPlaceholder')}
                className="w-full rounded-2xl border-white/15 bg-white/5 py-3 pl-9 pr-3 text-sm text-white placeholder:text-white/40"
              />
            </div>

            <Card className="rounded-2xl border-white/10 bg-white/5 p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                <UserPlus size={14} /> {t('messages.newChat')}
              </p>
              <div className="mt-3 space-y-3">
                <Input
                  value={newRecipientEmail}
                  onChange={(e) => setNewRecipientEmail(e.target.value)}
                  placeholder={t('messages.recipientEmail')}
                  className="w-full rounded-xl border-white/15 bg-white/5 text-sm text-white placeholder:text-white/40"
                />
                <Input
                  value={newRecipientName}
                  onChange={(e) => setNewRecipientName(e.target.value)}
                  placeholder={t('messages.recipientName')}
                  className="w-full rounded-xl border-white/15 bg-white/5 text-sm text-white placeholder:text-white/40"
                />
                <p className="text-[11px] leading-relaxed text-white/48">
                  {t('messages.emailHint')}
                </p>
              </div>
            </Card>

            <ScrollArea className="mt-4 max-h-[560px] pr-1">
              <div className="space-y-3">
                {loadingConversations && (
                  <p className="p-3 text-xs text-white/50">{t('messages.loadingConversations')}</p>
                )}

                {!loadingConversations && filteredConversations.length === 0 && (
                  <Card className="rounded-2xl border-white/10 bg-white/5 p-4 text-center text-xs text-white/60">
                    {t('messages.noConversations')}
                  </Card>
                )}

                <AnimatePresence>
                  {filteredConversations.map((conversation) => (
                    <motion.button
                      key={conversation.userId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onClick={() => setSelectedUserId(conversation.userId)}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                        selectedUserId === conversation.userId
                          ? 'border-primary/50 bg-primary/10 shadow-[0_8px_20px_rgba(29,184,73,0.15)]'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <SmartImage
                          src={getDesignAvatar(conversation.name)}
                          alt={conversation.name}
                          width={44}
                          height={44}
                          className="h-11 w-11 rounded-full border border-white/15 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-white">{conversation.name}</p>
                            <span className="text-[10px] text-white/40">{formatConversationTime(conversation.timestamp)}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/52">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge className="bg-red-500 text-white text-[10px] px-2 py-0.5">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="surface-panel-strong flex min-h-[720px] flex-col overflow-hidden"
          >
            <div className="border-b border-white/10 bg-white/[0.03] px-6 py-4">
              <div className="flex items-center gap-3">
                <SmartImage
                  src={getDesignAvatar(selectedConversation?.name || newRecipientName || 'Chat')}
                  alt={selectedConversation?.name || newRecipientName || 'Chat'}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full border border-white/15 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-bold text-white">
                    {selectedConversation?.name || newRecipientName || t('messages.selectConversation')}
                  </h3>
                  <p className="truncate text-xs text-white/55">
                    {selectedConversation?.email || newRecipientEmail || t('messages.noRecipient')}
                  </p>
                </div>
                <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 md:block">
                  {user.email}
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 px-6 py-6">
              <div className="space-y-5">
                {messages.length === 0 && (
                  <Card className="rounded-2xl border-white/10 bg-white/5 p-6 text-center text-sm text-white/60">
                    {t('messages.noMessages')}
                  </Card>
                )}

                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-[1.4rem] px-4 py-3 text-sm shadow-lg md:max-w-[64%] ${
                          message.isOwn
                            ? 'rounded-br-md bg-gradient-to-r from-primary to-primary-dark dark:to-secondary text-[#071425]'
                            : 'rounded-bl-md border border-white/10 bg-white/10 text-white'
                        }`}
                      >
                        <p className="leading-relaxed">{message.text}</p>
                        <p className={`mt-2 text-[10px] ${message.isOwn ? 'text-[#071425]/70' : 'text-white/55'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            <div className="border-t border-white/10 bg-[#0a1a2d]/70 px-6 py-5 backdrop-blur">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-white/45">
                <span className="premium-chip">
                  <ShieldCheck size={12} className="text-primary" />
                  {t('messages.linkedToSession')}
                </span>
                <span className="premium-chip">
                  <Sparkles size={12} className="text-secondary" />
                  {t('messages.widerSpacing')}
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder={t('messages.typePlaceholder')}
                  className="flex-1 rounded-2xl border-white/15 bg-white/5 text-sm text-white placeholder:text-white/40"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sending || (!selectedUserId && !newRecipientEmail.trim())}
                  className="premium-cta h-12 px-4"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
