import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Connect to backend Socket.io server
const socket = io("http://localhost:5000");

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup on unmount
    return () => socket.off("chat message");
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (name && message) {
      socket.emit("chat message", { name, message });
      setMessage("");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", textAlign: "center" }}>
      <h2>Real-time Chat</h2>
      <form onSubmit={sendMessage} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: 10, width: "30%", marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          style={{ padding: 10, width: "50%", marginRight: 10 }}
        />
        <button type="submit" style={{ padding: 10 }}>Send</button>
      </form>

      <div style={{ textAlign: "left", border: "1px solid #ccc", padding: 10, height: 400, overflowY: "scroll" }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.name}:</strong> {msg.message}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
