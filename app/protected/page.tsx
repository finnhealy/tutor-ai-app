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
    const clear = () => {
        firstMathfieldRef.current?.latex("");
    };

    const [keyboardValue, setKeyboardValue] = useState("");
    const [messages, setMessages] = useState<{ role: "user" | "assistant" | "system"; content: string }[]>(() => [
        { role: "system", content: "You are a friendly, clear maths tutor who explains step-by-step. The student studies Scottish N5 maths, and you should provide responses suitable for a 15-year-old, using the methods used for National 5 maths. Do NOT provide full solutions by default; give pointers and tips to help the student solve problems on their own. IMPORTANT: Format all math using standard LaTeX: - Use $...$ for inline math.  - Use $$...$$ for block math.Do NOT use \$begin:math:text$...\\$end:math:text$ or \$begin:math:display$...\\$end:math:display$ syntax.Use LaTeX to space and format the output nicely."
        },
    ]);

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!keyboardValue.trim()) return;
        const wrapped = `$${firstMathfieldRef.current.latex()}$`;
        // Add user's message to chat
        const newMessages = [...messages, { role: "user", content: wrapped }];
        setMessages(m => [...m, { role: "user", content: wrapped }]);
        setKeyboardValue("");
        clear();

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

            <div style={{ border: "1px solid #ccc", borderRadius:10,padding: "10px", minHeight: 600, marginBottom: 10, minWidth: 600 }}>
                {messages
                    .filter(msg => msg.role !== "system")  // <-- skip system messages
                    .map((msg, i) => (
                    <div key={i} style={{ margin: "6px 0" }}>
                        <strong>{msg.role === "user" ? "You" : "Tutor"}:</strong> <ReactMarkdown remarkPlugins={[remarkMath]}   rehypePlugins={[rehypeKatex]}>{msg.content}</ReactMarkdown>
                    </div>
                ))}
            </div>

            <form onSubmit={sendMessage} style={{ display: "flex", gap: "8px" }}>
                    <MathInput
                        numericToolbarKeys={[]}
                        setValue={setKeyboardValue}
                        setMathfieldRef={(mathfield) =>
                            (firstMathfieldRef.current = mathfield)
                        }
                        lang="en"

                    />


                <button
                    type="submit"
                    style={{
                        padding: "8px 16px",
                        borderRadius: 5,
                    }}
                >
                    Send
                </button>
            </form>


        </div>
    );
}