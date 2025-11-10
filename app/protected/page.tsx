"use client";
import {useRef, useState} from "react";
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import ReactMarkdown from "react-markdown";

import dynamic from 'next/dynamic';
const MathInput = dynamic(
    () =>
        import('../../lib/react-math-keyboard-main/src/mathInput/mathInput').then(
            mod => mod.MathInput
        ),
    { ssr: false }
);


export default function ChatPage() {
    const firstMathfieldRef = useRef<any>(null);
    const [keyboardValue, setKeyboardValue] = useState("");
    console.log("latex:", keyboardValue);
    const clear = () => {
        firstMathfieldRef.current?.latex("");
    };
    const [messages, setMessages] = useState<{ role: "user" | "assistant" | "system"; content: string }[]>(() => [
        { role: "system", content: "You are a friendly, clear maths tutor who explains step-by-step. The student studies Scottish N5 maths, and you should provide responses suitable for a 15-year-old, using the methods used for National 5 maths. Do NOT provide full solutions by default; give pointers and tips to help the student solve problems on their own. IMPORTANT: Format all math using standard LaTeX: - Use $...$ for inline math.  - Use $$...$$ for block math.Do NOT use \$begin:math:text$...\\$end:math:text$ or \$begin:math:display$...\\$end:math:display$ syntax.Use LaTeX to space and format the output nicely."
        },
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
        console.log(data)
        setMessages(m => [...m, { role: "assistant", content: data.reply }]);
    }

    return (
        <div style={{ padding: "20px", maxWidth: 600, margin: "0 auto" }}>
            <h2>Chat</h2>

            <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: 300, marginBottom: 10 }}>
                {messages
                    .filter(msg => msg.role !== "system")  // <-- skip system messages
                    .map((msg, i) => (
                    <div key={i} style={{ margin: "6px 0" }}>
                        <strong>{msg.role === "user" ? "You" : "Tutor"}:</strong> <ReactMarkdown remarkPlugins={[remarkMath]}   rehypePlugins={[rehypeKatex]}>{msg.content}</ReactMarkdown>
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

                <MathInput
                    setValue={setKeyboardValue}
                    setMathfieldRef={(mathfield) =>
                        (firstMathfieldRef.current = mathfield)
                    }
                    lang="en"
                />


                <button type="submit" style={{ padding: "8px 16px" }}>Send</button>
            </form>
        </div>
    );
}