"use client";
import { useState } from "react";

export default function ChatPage() {
    const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
    const [input, setInput] = useState("");

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user's message to chat
        setMessages(m => [...m, { role: "user", text: input }]);
        const userMessage = input;
        setInput("");

        // Send to backend
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await res.json();

        // Add AI response
        setMessages(m => [...m, { role: "ai", text: data.reply }]);
    }

    return (
        <div style={{ padding: "20px", maxWidth: 600, margin: "0 auto" }}>
            <h2>Chat</h2>

            <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: 300, marginBottom: 10 }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ margin: "6px 0" }}>
                        <strong>{msg.role === "user" ? "You" : "Tutor"}:</strong> {msg.text}
                    </div>
                ))}
            </div>

            <form onSubmit={sendMessage} style={{ display: "flex", gap: "8px" }}>
                <input
                    style={{ flex: 1, padding: "8px" }}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask something..."
                />
                <button type="submit" style={{ padding: "8px 16px" }}>Send</button>
            </form>
        </div>
    );
}