import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { chatbotAPI } from '../services/chatbot.service';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const DEFAULT_SESSION = 'default';

/**
 * Custom hook encapsulating all chatbot state, API calls, and Socket.IO logic.
 */
const useChatbot = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(DEFAULT_SESSION);
  const [activeSessionName, setActiveSessionName] = useState('New Chat');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const [streamedReply, setStreamedReply] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ── Auto-scroll to bottom ───────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, streamedReply, scrollToBottom]);

  // ── Socket.IO connection ────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('railswap_token');
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket.IO connected:', socketRef.current.id);
    });

    socketRef.current.on('connect_error', (err) => {
      console.warn('Socket.IO connection error:', err.message);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // ── Load sessions on mount ──────────────────────────────────────────────────
  useEffect(() => {
    loadSessions();
  }, []);

  // ── Load messages when session changes ─────────────────────────────────────
  useEffect(() => {
    if (activeSessionId) {
      loadHistory(activeSessionId);
    }
  }, [activeSessionId]);

  // ── Streaming effect: animate reply character by character ─────────────────
  const streamText = useCallback((text, onComplete) => {
    setIsStreaming(true);
    setStreamedReply('');
    let i = 0;
    const speed = Math.max(5, Math.min(20, Math.floor(1000 / text.length)));

    const interval = setInterval(() => {
      if (i < text.length) {
        setStreamedReply(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        setStreamedReply('');
        onComplete(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, []);

  // ── Load all sessions ───────────────────────────────────────────────────────
  const loadSessions = useCallback(async () => {
    try {
      const res = await chatbotAPI.getSessions();
      const data = res.data?.data || [];
      setSessions(data);
    } catch (err) {
      console.error('Failed to load sessions', err);
    }
  }, []);

  // ── Load history for a session ──────────────────────────────────────────────
  const loadHistory = useCallback(async (sessionId) => {
    setIsLoadingHistory(true);
    setError(null);
    try {
      const res = await chatbotAPI.getHistory(sessionId, 1, 50);
      const msgs = res.data?.data?.messages || [];
      setMessages(msgs);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError('Failed to load chat history. Please try again.');
      }
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (messageText) => {
    const text = (messageText || input).trim();
    if (!text || isLoading || isStreaming) return;

    setInput('');
    setError(null);

    // Optimistically add user message to UI
    const userMsg = {
      id: `temp_user_${Date.now()}`,
      message: text,
      reply: null,
      role: 'user',
      sessionId: activeSessionId,
      timestamp: new Date().toISOString(),
      isTemp: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await chatbotAPI.sendMessage({
        message: text,
        sessionId: activeSessionId,
        sessionName: activeSessionName,
      });

      const reply = res.data?.data?.reply || 'No response received.';
      const timestamp = res.data?.data?.timestamp || new Date().toISOString();

      setIsTyping(false);

      // Stream the reply character by character
      streamText(reply, (finalText) => {
        const botMsg = {
          id: `temp_bot_${Date.now()}`,
          message: text,
          reply: finalText,
          role: 'user',
          sessionId: activeSessionId,
          timestamp,
          isTemp: false,
        };
        setMessages((prev) => {
          // Remove temp user message, add final combined message
          const withoutTemp = prev.filter((m) => m.id !== userMsg.id);
          return [...withoutTemp, botMsg];
        });
      });

      // Emit delivery event via socket
      socketRef.current?.emit('message:sent', {
        sessionId: activeSessionId,
        messageId: `msg_${Date.now()}`,
      });

      // Refresh sessions to update sidebar
      await loadSessions();

    } catch (err) {
      setIsTyping(false);
      setIsStreaming(false);
      setStreamedReply('');

      // Remove the optimistic user message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));

      const errMsg = err.response?.data?.message
        || 'Failed to get AI response. Please try again.';
      setError(errMsg);
    }
  }, [input, isLoading, isStreaming, activeSessionId, activeSessionName, streamText, loadSessions]);

  // ── Handle input change with typing event ──────────────────────────────────
  const handleInputChange = useCallback((value) => {
    setInput(value);

    if (socketRef.current) {
      socketRef.current.emit('user:typing', { sessionId: activeSessionId });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('user:stop-typing', { sessionId: activeSessionId });
      }, 1500);
    }
  }, [activeSessionId]);

  // ── Start a new chat session ────────────────────────────────────────────────
  const startNewChat = useCallback(() => {
    const newSessionId = `session_${Date.now()}`;
    const newSessionName = 'New Chat';
    setActiveSessionId(newSessionId);
    setActiveSessionName(newSessionName);
    setMessages([]);
    setError(null);
    setInput('');
  }, []);

  // ── Switch session ──────────────────────────────────────────────────────────
  const switchSession = useCallback((sessionId, sessionName) => {
    if (sessionId === activeSessionId) return;
    setActiveSessionId(sessionId);
    setActiveSessionName(sessionName || 'Chat');
    setMessages([]);
    setError(null);
  }, [activeSessionId]);

  // ── Clear history ───────────────────────────────────────────────────────────
  const clearHistory = useCallback(async () => {
    try {
      await chatbotAPI.clearHistory(activeSessionId);
      setMessages([]);
      await loadSessions();
    } catch (err) {
      setError('Failed to clear chat history.');
    }
  }, [activeSessionId, loadSessions]);

  // ── Delete a single message ─────────────────────────────────────────────────
  const deleteMessage = useCallback(async (messageId) => {
    if (!messageId || messageId.startsWith('temp_')) return;
    try {
      await chatbotAPI.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => (m._id || m.id) !== messageId));
    } catch (err) {
      setError('Failed to delete message.');
    }
  }, []);

  // ── Rename session ──────────────────────────────────────────────────────────
  const renameSession = useCallback(async (sessionId, newName) => {
    try {
      await chatbotAPI.renameSession(sessionId, newName);
      if (sessionId === activeSessionId) setActiveSessionName(newName);
      await loadSessions();
    } catch (err) {
      setError('Failed to rename session.');
    }
  }, [activeSessionId, loadSessions]);

  // ── Retry last failed message ───────────────────────────────────────────────
  const retryLastMessage = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      sendMessage(lastUserMsg.message);
    }
  }, [messages, sendMessage]);

  return {
    // State
    sessions,
    activeSessionId,
    activeSessionName,
    messages,
    input,
    isTyping,
    isLoading,
    isLoadingHistory,
    error,
    streamedReply,
    isStreaming,
    messagesEndRef,

    // Actions
    setInput,
    handleInputChange,
    sendMessage,
    startNewChat,
    switchSession,
    clearHistory,
    deleteMessage,
    renameSession,
    retryLastMessage,
    setError,
    loadSessions,
  };
};

export default useChatbot;
