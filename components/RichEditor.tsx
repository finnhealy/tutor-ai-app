"use client";

import { useEffect, useRef } from "react";

// MathLive CSS (these exist in 0.96.0)
import "mathlive/dist/mathlive-static.css";
import "mathlive/dist/mathlive-fonts.css";
import "mathlive/dist/mathlive.css";

// ✔ Correct import for makeMathField in 0.96.x
import { makeMathField } from "mathlive/dist/mathlive.mjs";

export default function RichEditor({ value, setValue }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mathfieldRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const dom = document.createElement("div");
        containerRef.current.appendChild(dom);

        // 👍 Correct, working initializer
        const mf = makeMathField(dom, {
            smartMode: true,
            virtualKeyboardMode: "manual",
            virtualKeyboardTheme: "material",
            mathModeSpace: "⋅",

            onContentDidChange: () => {
                const latex = mf.getValue("latex-expanded");
                setValue(latex);
            },
        });

        if (value) mf.setValue(value);

        mathfieldRef.current = mf;

        return () => {
            dom.remove();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                minHeight: "70px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "white",
                cursor: "text",
            }}
        ></div>
    );
}