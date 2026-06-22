import { useState, useRef, useEffect } from "react";
import "../styles/chatbot.css";

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to RailSwap AI Assistant. Ask me anything about railway travel, seat exchange, safety or journey assistance.",
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
    const text = msg.toLowerCase();

    if (text.includes("seat")) {
      return "🎫 You can request a seat exchange through the Seat Exchange module.";
    }

    if (text.includes("pnr")) {
      return "📋 Use the PNR Verification feature to validate passenger details.";
    }

    if (text.includes("women")) {
      return "🛡 Women Safety Matching helps find safer travel options.";
    }

    if (text.includes("medical")) {
      return "🚑 Emergency Medical Match can locate nearby doctors and medical support.";
    }

    if (text.includes("train")) {
      return "🚆 Train Information provides live train status and journey details.";
    }

    return "🤖 Thank you for your query. This AI module can be connected to OpenAI or Gemini later for intelligent responses.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTyping(true);

    setTimeout(() => {
      const botMessage = {
        sender: "bot",
        text: getBotReply(input),
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
      },
    ]);
  };

  return (
    <div className="chatbot-page">

      <div className="chatbot-header">
        <h1>AI Railway Assistant</h1>
        <button onClick={clearChat}>
          Clear Chat
        </button>
      </div>

      <div className="quick-actions">
        {quickQuestions.map((item, index) => (
          <button
            key={index}
            onClick={() => setInput(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="chat-container">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender}`}
          >
            {msg.text}
          </div>
        ))}

        {typing && (
          <div className="message bot">
            Typing...
          </div>
        )}

        <div ref={chatRef}></div>

      </div>

      <div className="chat-input">

        <input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
};

export default AIChatbot;