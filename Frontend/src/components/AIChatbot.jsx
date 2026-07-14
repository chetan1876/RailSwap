import { useState, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import useChatbot from "../hooks/useChatbot";
import { chatbotAPI } from "../services/chatbot.service";
import "../styles/chatbot.css";

// ── Utility: Format markdown text to HTML ────────────────────────────────────
const renderMarkdown = (text) => {
  if (!text) return "";
  let html = text
    // Code blocks
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<div class="code-block"><div class="code-header"><span class="code-lang">${lang || "code"}</span><button class="copy-code-btn" onclick="navigator.clipboard.writeText(${JSON.stringify(code.trim())});this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',2000)">Copy</button></div><pre><code>${escapeHtml(code.trim())}</code></pre></div>`
    )
    // Inline code
    .replace(/`([^`]+)`/g, "<code class=\"inline-code\">$1</code>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Headers
    .replace(/^### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3>$1</h3>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")
    // Numbered list
    .replace(/^\d+\.\s(.+)$/gm, "<li class=\"numbered\">$1</li>")
    // Bullet list
    .replace(/^[•\-\*]\s(.+)$/gm, "<li>$1</li>")
    // Wrap consecutive <li> items
    .replace(/(<li.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Horizontal rule
    .replace(/^---$/gm, "<hr>")
    // Line breaks
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
  return html;
};

const escapeHtml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatTime = (ts) => {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ── Quick prompt suggestions ─────────────────────────────────────────────────
const QUICK_PROMPTS = [
  { icon: "🔄", text: "How do I exchange my seat?", label: "Seat Exchange" },
  { icon: "📋", text: "How to check PNR status?", label: "PNR Status" },
  { icon: "🚆", text: "How to check live train status?", label: "Train Status" },
  { icon: "🛡️", text: "Women safety features in RailSwap?", label: "Women Safety" },
  { icon: "🚑", text: "Emergency medical help on train?", label: "Medical Help" },
  { icon: "⏳", text: "WL ticket confirmation chances?", label: "Waitlist" },
  { icon: "❌", text: "Ticket cancellation & refund policy?", label: "Cancellation" },
  { icon: "🔍", text: "How to report lost item?", label: "Lost Item" },
];

// ── Message Bubble Component ──────────────────────────────────────────────────
const MessageBubble = ({ msg, onDelete, onCopy, theme }) => {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";
  const displayText = msg.reply || msg.message;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText || "");
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`chat-row ${isUser ? "user" : "bot"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isUser && (
        <div className="avatar bot-avatar" aria-label="AI Assistant">
          <span>🚆</span>
        </div>
      )}

      <div className="message-group">
        {!isUser && (
          <div className="sender-label">RailSwap AI</div>
        )}

        {isUser ? (
          <div className="message user-message">
            <p>{msg.message}</p>
          </div>
        ) : (
          <div className="message bot-message">
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(displayText) }}
            />
          </div>
        )}

        <div className="message-meta">
          <span className="msg-time">{formatTime(msg.timestamp)}</span>
          <div
            className="msg-actions"
            style={{ opacity: showActions ? 1 : 0 }}
          >
            <button
              className="action-btn"
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy"}
            >
              {copied ? "✓" : "⎘"}
            </button>
            {onDelete && msg.id && !msg.id.startsWith("temp_") && (
              <button
                className="action-btn delete-btn"
                onClick={() => onDelete(msg.id || msg._id)}
                title="Delete message"
              >
                🗑
              </button>
            )}
          </div>
        </div>
      </div>

      {isUser && (
        <div className="avatar user-avatar" aria-label="You">
          <span>👤</span>
        </div>
      )}
    </div>
  );
};

// ── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="chat-row bot">
    <div className="avatar bot-avatar">
      <span>🚆</span>
    </div>
    <div className="message-group">
      <div className="sender-label">RailSwap AI</div>
      <div className="message bot-message typing-message">
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="typing-label">Thinking...</span>
      </div>
    </div>
  </div>
);

// ── Streaming Message ─────────────────────────────────────────────────────────
const StreamingMessage = ({ text }) => (
  <div className="chat-row bot">
    <div className="avatar bot-avatar">
      <span>🚆</span>
    </div>
    <div className="message-group">
      <div className="sender-label">RailSwap AI</div>
      <div className="message bot-message">
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
        />
        <span className="cursor-blink">|</span>
      </div>
    </div>
  </div>
);

// ── Loading Skeleton ─────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="loading-skeleton">
    {[1, 2, 3].map((i) => (
      <div key={i} className={`skeleton-row ${i % 2 === 0 ? "user" : "bot"}`}>
        <div className="skeleton-avatar"></div>
        <div className="skeleton-bubble">
          <div className="skeleton-line" style={{ width: `${60 + i * 10}%` }}></div>
          <div className="skeleton-line" style={{ width: `${40 + i * 5}%` }}></div>
        </div>
      </div>
    ))}
  </div>
);

// ── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ onPromptClick }) => (
  <div className="empty-state">
    <div className="empty-icon">🚆</div>
    <h2>RailSwap AI Assistant</h2>
    <p>Your intelligent railway companion. Ask me anything about trains, seats, PNR, safety, and more.</p>
    <div className="quick-prompts-grid">
      {QUICK_PROMPTS.map((p, i) => (
        <button
          key={i}
          className="quick-prompt-card"
          onClick={() => onPromptClick(p.text)}
        >
          <span className="prompt-icon">{p.icon}</span>
          <span className="prompt-label">{p.label}</span>
          <span className="prompt-text">{p.text}</span>
        </button>
      ))}
    </div>
  </div>
);

// ── Session Item in Sidebar ────────────────────────────────────────────────────
const SessionItem = ({ session, isActive, onSwitch, onRename, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(session.sessionName || "New Chat");
  const inputRef = useRef(null);

  const startEdit = (e) => {
    e.stopPropagation();
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const submitEdit = () => {
    setEditing(false);
    if (editName.trim() && editName.trim() !== session.sessionName) {
      onRename(session.sessionId, editName.trim());
    }
  };

  return (
    <div
      className={`session-item ${isActive ? "active" : ""}`}
      onClick={() => !editing && onSwitch(session.sessionId, session.sessionName)}
    >
      <div className="session-icon">💬</div>
      <div className="session-info">
        {editing ? (
          <input
            ref={inputRef}
            className="session-edit-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={submitEdit}
            onKeyDown={(e) => { if (e.key === "Enter") submitEdit(); if (e.key === "Escape") setEditing(false); }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="session-name">{session.sessionName || "New Chat"}</span>
        )}
        <span className="session-count">{session.messageCount || 0} messages</span>
      </div>
      <div className="session-actions" onClick={(e) => e.stopPropagation()}>
        <button className="sess-btn" onClick={startEdit} title="Rename">✏️</button>
        <button className="sess-btn del" onClick={() => onDelete(session.sessionId)} title="Delete">🗑</button>
      </div>
    </div>
  );
};

// ── Main AIChatbot Component ──────────────────────────────────────────────────
const AIChatbot = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const {
    sessions,
    activeSessionId,
    activeSessionName,
    messages,
    input,
    isTyping,
    isLoadingHistory,
    error,
    streamedReply,
    isStreaming,
    messagesEndRef,
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
  } = useChatbot();

  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDeleteSession = useCallback(async (sessionId) => {
    try {
      await chatbotAPI.clearHistory(sessionId);
      if (sessionId === activeSessionId) startNewChat();
      loadSessions();
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  }, [activeSessionId, startNewChat, loadSessions]);

  const filteredSessions = sessions.filter((s) =>
    (s.sessionName || "New Chat").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePromptClick = (text) => {
    setInput(text);
    sendMessage(text);
  };

  const autoResizeTextarea = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
    handleInputChange(e.target.value);
  };

  return (
    <div className={`chatbot-root ${theme}`} data-theme={theme}>
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`chatbot-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-icon">🚆</span>
            {sidebarOpen && <span className="brand-name">RailSwap AI</span>}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Collapse" : "Expand"}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {sidebarOpen && (
          <>
            <button className="new-chat-btn" onClick={startNewChat}>
              <span>+</span>
              <span>New Chat</span>
            </button>

            <div className="sidebar-search">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="sessions-list">
              {filteredSessions.length === 0 ? (
                <div className="no-sessions">
                  <span>No chats yet</span>
                </div>
              ) : (
                filteredSessions.map((s) => (
                  <SessionItem
                    key={s.sessionId}
                    session={s}
                    isActive={s.sessionId === activeSessionId}
                    onSwitch={switchSession}
                    onRename={renameSession}
                    onDelete={handleDeleteSession}
                  />
                ))
              )}
            </div>

            <div className="sidebar-footer">
              <div className="user-info">
                <div className="user-avatar-sm">👤</div>
                <div className="user-details">
                  <span className="user-name">{user?.name || "Guest"}</span>
                  <span className="user-status">● Online</span>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* ── Main Chat Area ───────────────────────────────────────────────────── */}
      <div className="chatbot-main">
        {/* Header */}
        <header className="chat-header">
          <div className="chat-header-left">
            <div className="ai-avatar-header">
              <span>🚆</span>
              <div className="status-dot"></div>
            </div>
            <div className="chat-header-info">
              <h1 className="chat-title">{activeSessionName}</h1>
              <p className="chat-subtitle">Gemini 2.0 Flash · Railway AI</p>
            </div>
          </div>

          <div className="chat-header-actions">
            <button
              className="header-btn"
              onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              className="header-btn danger"
              onClick={() => setShowConfirmClear(true)}
              title="Clear chat"
            >
              🗑 Clear
            </button>
          </div>
        </header>

        {/* Confirm clear modal */}
        {showConfirmClear && (
          <div className="modal-overlay" onClick={() => setShowConfirmClear(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Clear Chat?</h3>
              <p>All messages in this session will be permanently deleted.</p>
              <div className="modal-actions">
                <button className="modal-cancel" onClick={() => setShowConfirmClear(false)}>Cancel</button>
                <button
                  className="modal-confirm"
                  onClick={() => { clearHistory(); setShowConfirmClear(false); }}
                >
                  Yes, Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="messages-area">
          {isLoadingHistory ? (
            <LoadingSkeleton />
          ) : messages.length === 0 && !isTyping && !isStreaming ? (
            <EmptyState onPromptClick={handlePromptClick} />
          ) : (
            <div className="messages-list">
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={msg.id || msg._id || idx}
                  msg={msg}
                  theme={theme}
                  onDelete={deleteMessage}
                />
              ))}

              {isTyping && !isStreaming && <TypingIndicator />}
              {isStreaming && streamedReply && <StreamingMessage text={streamedReply} />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <div className="error-actions">
              <button className="retry-btn" onClick={retryLastMessage}>
                ↺ Retry
              </button>
              <button className="dismiss-btn" onClick={() => setError(null)}>
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Ask about seat exchange, PNR, train status, safety... (Enter to send, Shift+Enter for new line)"
              value={input}
              onChange={autoResizeTextarea}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isTyping || isStreaming}
            />
            <button
              className={`send-btn ${isTyping || isStreaming ? "loading" : ""} ${input.trim() ? "active" : ""}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping || isStreaming}
              title="Send message"
            >
              {isTyping || isStreaming ? (
                <span className="send-spinner"></span>
              ) : (
                <span className="send-icon">➤</span>
              )}
            </button>
          </div>
          <p className="input-hint">
            <kbd>Enter</kbd> to send &nbsp;·&nbsp; <kbd>Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;