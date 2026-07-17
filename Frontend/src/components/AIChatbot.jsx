import { useState } from "react";
import "../styles/AIChatbot.css";

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋 Welcome to RailSwap AI Assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");

  const quickActions = [
    "Check PNR",
    "Seat Exchange",
    "Train Status",
    "Emergency Help",
  ];

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    const botMessage = {
      sender: "bot",
      text: "AI backend integration pending. This response is currently running in demo mode.",
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      botMessage,
    ]);

    setInput("");
  };

  const handleQuickAction = (action) => {
    setInput(action);
  };

  return (
    <div className="rs-chatbot-container">

      <div className="rs-chatbot-header">
        <div className="rs-chatbot-avatar">
          🤖
        </div>

        <div>
          <h3>RailSwap AI Assistant</h3>
          <span>Online</span>
        </div>
      </div>

      <div className="rs-chatbot-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`rs-message ${msg.sender}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="rs-quick-actions">
        {quickActions.map((item) => (
          <button
            key={item}
            onClick={() =>
              handleQuickAction(item)
            }
          >
            {item}
          </button>
        ))}
      </div>

      <div className="rs-chatbot-footer">
        <input
          type="text"
          placeholder="Ask anything about your journey..."
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            sendMessage()
          }
        />

        <button
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default AIChatbot;