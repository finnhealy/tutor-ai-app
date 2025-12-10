"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

// Load MathInput dynamically
const MathInput = dynamic(
    () =>
        import("../../lib/react-math-keyboard-main/src/mathInput/mathInput").then(
            (mod) => mod.MathInput
        ),
    { ssr: false }
);

export default function ChatPage() {
    const [messages, setMessages] = useState<
        { role: "user" | "assistant" | "system"; content: string }[]
    >([
        {
            role: "system",
            content:
                "You are a friendly, clear maths tutor who explains step-by-step. The student (named Imogen) studies Scottish N5 maths, and you should provide responses suitable for a 15-year-old, using the methods used for National 5 maths. Do NOT provide full solutions by default; give pointers and tips to help the student solve problems on their own. Format all math using LaTeX.Format inline math with $...$ and standalone equations with $$...$$."
        }
    ]);
    const [text, setText] = useState("");
    const [mathMode, setMathMode] = useState(false);
    const mathFieldRef = useRef<any>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages]);

    async function sendMessage(content: string) {
        const newMessages = [...messages, { role: "user", content }];
        setMessages(newMessages);

        const res = await fetch("/protected/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newMessages }),
        });

        const data = await res.json();
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    }

    function onSubmit(e: any) {
        e.preventDefault();
        if (!text.trim()) return;
        sendMessage(text);
        setText("");
    }

    function insertMath() {
        const latex = mathFieldRef.current?.latex() ?? "";
        if (!latex.trim()) return;

        // Insert math as $...$
        setText((prev) => prev + ` $${latex}$ `);

        mathFieldRef.current.latex("");
        setMathMode(false);
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
            <div style={{ width: 600 }}>
                <h2 style={{ marginBottom: 20 }}>Tutor Chat</h2>

                <div
                    ref={chatRef}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: 12,
                        height: 600,
                        overflowY: "auto",
                        padding: 16,
                        background: "#fafafa",
                    }}
                >
                    {messages.filter(message => message.role !== "system").map((msg, i) => (
                        <div
                            key={i}
                            style={{
                                background: "white",
                                borderRadius: 12,
                                padding: 12,
                                marginBottom: 12,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                            }}
                        >
                            <strong>{msg.role === "user" ? "You" : "Tutor"}</strong>
                            <div style={{ marginTop: 6 }}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>


                <form
                    onSubmit={onSubmit}
                    style={{ display: "flex", flexDirection: "column", marginTop: 12 }}
                >
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            minHeight: 80,
                            marginBottom: 8,
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                padding: 10,
                                whiteSpace: "pre-wrap",
                                pointerEvents: "none",
                                color: "black",
                            }}
                        >
                            {text.trim() === "" ? (
                                <span style={{ opacity: 0.4 }}>Type your question…</span>
                            ) : (
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {text}
                                </ReactMarkdown>
                            )}
                        </div>

                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{
                                position: "absolute",
                                inset: 0,
                                padding: 10,
                                background: "transparent",
                                border: "1px solid #ccc",
                                borderRadius: 8,
                                resize: "vertical",
                                fontSize: 16,
                                lineHeight: "1.4em",
                                color: "transparent", // hide text
                                caretColor: "black", // but keep caret
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            type="button"
                            onClick={() => setMathMode(true)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 6,
                                background: "#f2f2f2",
                                border: "1px solid #ccc",
                            }}
                        >
                            Insert Math
                        </button>

                        <button
                            type="submit"
                            style={{
                                padding: "8px 16px",
                                borderRadius: 6,
                                background: "#4f46e5",
                                color: "white",
                                border: "none",
                            }}
                        >
                            Send
                        </button>
                    </div>
                </form>

                {mathMode && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "transparent",
                            boxShadow: "0 0 0 100vmax rgba(0,0,0,0.35)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 10000,
                            pointerEvents: "none",
                        }}
                    >
                        <div
                            style={{
                                background: "white",
                                padding: 20,
                                borderRadius: 12,
                                width: 400,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                pointerEvents: "auto",
                            }}
                        >
                            <h3 style={{ marginBottom: 12 }}>
                                Insert a maths expression
                            </h3>

                            <MathInput
                                numericToolbarKeys={[]}
                                lang="en"
                                setMathfieldRef={(mf) => (mathFieldRef.current = mf)}
                            />

                            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                                <button
                                    onClick={insertMath}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: 6,
                                        background: "#4f46e5",
                                        color: "white",
                                        border: "none",
                                    }}
                                >
                                    Insert
                                </button>

                                <button
                                    onClick={() => setMathMode(false)}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: 6,
                                        background: "#ddd",
                                        border: "none",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}