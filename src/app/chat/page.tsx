"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string; // base64
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if (!input.trim() && !image) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      image: image || undefined,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setImage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.text },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: `Erreur: ${data.error}` },
        ]);
      }
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Erreur de connexion" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">Vision Chat</h1>
        <p className="text-sm text-gray-500">Qwen 3.8 27B via Groq</p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">Pose une question avec ou sans image</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-2xl rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="upload"
                  className="max-w-xs rounded-lg mb-2"
                />
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        {image && (
          <div className="mb-2 relative inline-block">
            <img src={image} alt="preview" className="h-20 rounded-lg border" />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            title="Ajouter une image"
          >
            📷
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pose ta question..."
            rows={1}
            className="flex-1 border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />

          <button
            onClick={sendMessage}
            disabled={loading || (!input.trim() && !image)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}
