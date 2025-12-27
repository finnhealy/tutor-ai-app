"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

const MathInput = dynamic(
    () =>
        import("../../lib/react-math-keyboard-main/src/mathInput/mathInput").then(
            (mod) => mod.MathInput
        ),
    { ssr: false }
);


export default function ChatPage() {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)

        // 👇 force scroll to bottom
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.scrollTop =
                    textareaRef.current.scrollHeight
            }
        })
    }
    const syncScroll = () => {
        if (!textareaRef.current || !overlayRef.current) return
        overlayRef.current.scrollTop = textareaRef.current.scrollTop
    }
    const overlayRef = useRef<HTMLDivElement>(null)

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const [messages, setMessages] = useState<
        { role: "user" | "assistant" | "system"; content: string }[]
    >([
        {
            role: "system",
            content:
                "You are a friendly, clear Higher Computing Science tutor who explains step-by-step. The student (named Sebi) studies Scottish Higher Computing Science , and you should provide responses suitable for a 15-year-old, using methods expected at Higher level.\n\n" +
                "Use any provided course material when it is relevant. If no relevant course material is available, explain using general computing knowledge and ask a clarifying question if needed. Do not invent syllabus-specific rules or methods.\n\n" +
                "If given a problem to solve, do NOT provide full solutions by default. Give hints, prompts, and guiding questions to help the student reach the solution independently. Only give full solutions if explicitly asked.\n\n" +
                "If a question is outside the Higher computing syllabus, clearly state this. You are given reference material retrieved from a knowledge base.\n" +
                "Use it to inform your answer, but do NOT repeat it verbatim.\n" +
                "Only include the parts that directly answer the student’s question.Do not list definitions, syntax, or examples unless they are required to answer the question.\n\n" +
                "Clearly format your answers using LaTeX. The reference material is internal and not visible to the student.\n" +
                "Use it to help you answer, but never mention the reference, examples, notes, or chunks explicitly.\n" +
                "Explain ideas as if they come from your own knowledge, not from a document."
        }
    ]);
    //Use $...$ for inline maths and $$...$$ for standalone equations.
    const [text, setText] = useState("");
    const [mathMode, setMathMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // 👈 NEW
    const mathFieldRef = useRef<any>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages, isLoading]);

    async function sendMessage(content: string) {
        const newMessages = [...messages, { role: "user", content }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await fetch("/protected/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newMessages }),
            });

            const data = await res.json();
            console.log(data.reply);
            setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
        } catch (err) {
            // (optional) add an error message
            setMessages((m) => [
                ...m,
                {
                    role: "assistant",
                    content:
                        "Sorry, something went wrong while fetching my reply. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    function onSubmit(e: any) {
        e.preventDefault();
        if (!text.trim() || isLoading) return;
        sendMessage(text);
        setText("");
    }

    function insertMath() {
        const latex = mathFieldRef.current?.latex() ?? "";
        if (!latex.trim()) return;
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
                    {messages
                        .filter((message) => message.role !== "system")
                        .map((msg, i) => (
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

                    {/* 👇 Typing / loading indicator */}
                    {isLoading && (
                        <div
                            style={{
                                background: "white",
                                borderRadius: 12,
                                padding: 12,
                                marginBottom: 12,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                                display: "inline-block",
                            }}
                        >
                            <strong>Tutor</strong>
                            <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                                <span className="typing-dot">•</span>
                                <span className="typing-dot">•</span>
                                <span className="typing-dot">•</span>
                            </div>
                        </div>
                    )}
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
                            ref={overlayRef}
                            style={{
                                position: "absolute",
                                inset: 0,
                                padding: 10,
                                whiteSpace: "pre-wrap",
                                pointerEvents: "none",
                                color: "black",
                                overflowY: "hidden", // 👈 important
                                overflowX: "hidden",
                            }}
                        >
                            {text.trim() === "" ? (
                                <span style={{opacity: 0.4}}>Type your question…</span>
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
                            ref={textareaRef}
                            value={text}
                            onChange={handleChange}
                            onScroll={syncScroll}   // 👈 REQUIRED
                            onPaste={() => requestAnimationFrame(syncScroll)} // 👈 helps large pastes
                            disabled={isLoading}
                            style={{
                                position: "absolute",
                                inset: 0,
                                padding: 10,
                                background: "transparent",
                                border: "1px solid #ccc",
                                borderRadius: 8,
                                resize: "none",
                                fontSize: 16,
                                lineHeight: "1.4em",
                                color: "transparent",
                                caretColor: "black",
                                overflowY: "auto",
                                overflowX: "hidden",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                            }}
                        />
                    </div>

                    <div style={{display: "flex", gap: 8}}>
                        <button
                            type="button"
                            onClick={() => setMathMode(true)}
                            disabled={isLoading}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 6,
                                background: "#f2f2f2",
                                border: "1px solid #ccc",
                                opacity: isLoading ? 0.6 : 1,
                                cursor: isLoading ? "not-allowed" : "pointer",
                            }}
                        >
                            Insert Math
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 6,
                                background: "#4f46e5",
                                color: "white",
                                border: "none",
                                opacity: isLoading ? 0.6 : 1,
                                cursor: isLoading ? "not-allowed" : "pointer",
                            }}
                        >
                            {isLoading ? "Thinking..." : "Send"}
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
                            <h3 style={{ marginBottom: 12 }}>Insert a maths expression</h3>

                            <MathInput
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

            <style jsx>{`
        .typing-dot {
          font-size: 20px;
          line-height: 1;
          animation: blink 1.2s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%,
          80%,
          100% {
            opacity: 0.2;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}