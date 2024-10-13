import { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      console.log("data", data);
      if (data.reply) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (error: any) {
      console.error("Error:", error.error);
    } finally {
      setLoading(false);
    }

    setInput(""); // Clear input
  };

  return (
    <div className="chat-component w-full h-full flex flex-col p-4">
      {/* Chat messages area */}
      <div className="flex-grow overflow-y-auto mb-4">
        <div className="chat chat-start">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                message.role === "user"
                  ? "chat-bubble-primary"
                  : "chat-bubble-accent"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
      </div>

      {/* Chat input area */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="input input-bordered w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
