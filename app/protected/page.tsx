"use client";
import { useState } from "react";

export default function ChatPage() {
    const [messages, setMessages] = useState<{ role: "user" | "assistant" | "system"; content: string }[]>(() => [
        { role: "system", content: "You are a friendly, clear maths tutor who explains step-by-step. The student studies Scottish N5 maths and you should provide responses in a way suitable for a 15 year old, and using the working/methods used for national 5 maths. You should not default to providing full solutions, instead give the student pointers and tips to solve the problem on their own."},
    ]);
    const [input, setInput] = useState("");

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user's message to chat
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(m => [...m, { role: "user", content: input }]);
        setInput("");

        // Send to backend
        const res = await fetch("/protected/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({newMessages})
        });

        const data = await res.json();

        // Add AI response
        setMessages(m => [...m, { role: "assistant", content: data.reply }]);
    }

    return (
        <div style={{ padding: "20px", maxWidth: 600, margin: "0 auto" }}>
            <h2>Chat</h2>

            <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: 300, marginBottom: 10 }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ margin: "6px 0" }}>
                        <strong>{msg.role === "user" ? "You" : "Tutor"}:</strong> {msg.content}
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