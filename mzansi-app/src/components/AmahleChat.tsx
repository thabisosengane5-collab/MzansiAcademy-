"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AmahleChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Sawubona! I'm Amahle, your learning assistant. Ask me anything about your subjects and I'll help you understand it step by step." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || data.error || "Something went wrong." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't connect. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-w-2xl mx-auto border border-gray-700 rounded-lg bg-gray-900">
      <div className="px-4 py-3 border-b border-gray-700 bg-gray-800 rounded-t-lg">
        <h2 className="text-emerald-400 font-bold text-lg">Amahle</h2>
        <p className="text-gray-400 text-xs">Your MzansiAcademy AI learning assistant</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-emerald-600 text-white rounded-br-sm" : "bg-gray-800 text-gray-200 rounded-bl-sm"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 px-4 py-2 rounded-2xl rounded-bl-sm text-sm">Amahle is thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-gray-700 flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Ask Amahle anything..." className="flex-1 bg-gray-800 text-white text-sm px-4 py-2 rounded-full border border-gray-600 focus:outline-none focus:border-emerald-500" />
        <button onClick={sendMessage} disabled={loading || !input.trim()} className="bg-emerald-500 text-black font-bold px-4 py-2 rounded-full text-sm disabled:opacity-40">Send</button>
      </div>
    </div>
  );
}
