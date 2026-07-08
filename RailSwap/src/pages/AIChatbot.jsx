import { useState, useRef, useEffect } from "react";
import "../styles/chatbot.css";

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to RailSwap AI Assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const getBotReply = (msg) => {
    const text = msg.toLowerCase().trim(); // text ko clean aur lowercase karne ke liye

    // 1. Pehle check karega agar user ne Hello, Hi ya Hey likha hai
    if (text === "hello" || text === "hi" || text === "hey") {
      return "👋 Hello! How can RailSwap AI assist you with your journey today?";
    }

    // 2. Phir baaki saare normal conditions check karega
    if (text.includes("seat")) {
      return "🎫 Seat Exchange helps passengers swap seats securely after verification.";
    }

    if (text.includes("pnr")) {
      return "📋 PNR Verification validates passenger details quickly.";
    }

    if (text.includes("women")) {
      return "🛡️ Women Safety Matching provides safer travel options.";
    }

    if (text.includes("medical")) {
      return "🚑 Emergency Medical Match finds nearby medical support.";
    }

    if (text.includes("train")) {
      return "🚆 Live Train Status provides journey and train updates.";
    }

    // 3. Agar upar se kuch bhi match nahi hua, tab ye default reply dega
    return "🤖 Thank you for your query. RailSwap AI is always ready to assist you.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    const userInput = input;

    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botMessage = {
        sender: "bot",
        text: getBotReply(userInput),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
      setTyping(false);
    }, 1000);
  };

  const handleQuickAction = (itemText) => {
    const userMessage = {
      sender: "user",
      text: itemText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setTyping(true);

    setTimeout(() => {
      const botMessage = {
        sender: "bot",
        text: getBotReply(itemText),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
      setTyping(false);
    }, 1000);
  };

  const quickQuestions = [
    "Seat Exchange",
    "PNR Verification",
    "Women Safety",
    "Medical Help",
  ];

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "👋 Chat cleared. How can I help you?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-header">
        <div className="header-left">
          <div className="bot-icon">🤖</div>

          <div>
            <h2>RailSwap AI Assistant</h2>
            <span>Online • Ready to help</span>
          </div>
        </div>

        <button onClick={clearChat}>Clear Chat</button>
      </div>

      <div className="chat-container">
        {/* Quick Actions ko layout block karne se rokne ke liye yahan set kiya hai */}
        <div className="quick-actions" style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {quickQuestions.map((item, index) => (
            <button key={index} onClick={() => handleQuickAction(item)}>
              {item}
            </button>
          ))}
        </div>

        {messages.map((msg, index) => (
          <div key={index} className={`chat-row ${msg.sender}`}>
            <div className="avatar">
              {msg.sender === "bot" ? "🤖" : "👤"}
            </div>

            <div className="message-wrapper">
              <div className={`message ${msg.sender}`}>
                {msg.text}
              </div>

              <div className="time">{msg.time}</div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="chat-row bot">
            <div className="avatar">🤖</div>

            <div className="message-wrapper">
              <div className="message bot">Typing...</div>
            </div>
          </div>
        )}

        <div ref={chatRef}></div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about train, seat exchange, PNR..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AIChatbot;