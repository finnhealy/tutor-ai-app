import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import Link from "next/link";
// Syntax highlighting + maths
import "highlight.js/styles/atom-one-dark.css";
import "katex/dist/katex.min.css";

export default async function NotesPage({
                                            params,
                                        }: {
    params: Promise<{ slug: string[] }>;
}) {
    const { slug } = await params;

    const filePath = path.join(process.cwd(), "notes", ...slug) + ".md";
    if (!fs.existsSync(filePath)) {
        return <p>Note not found</p>;
    }

    const file = fs.readFileSync(filePath, "utf8");
    const { content, data } = matter(file);

    const processed = await remark()
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeHighlight, { detect: false })

        // 🎯 THEME-AWARE CODE BLOCK STYLING
        .use(() => (tree: any) => {
            const walk = (node: any) => {
                if (node?.type === "element" && node.tagName === "pre") {
                    node.properties = node.properties || {};
                    node.properties.className = [
                        "not-prose",
                        "my-6",
                        "rounded-xl",
                        "p-4",
                        "overflow-x-auto",
                        "text-sm",
                        // light mode
                        "bg-zinc-100",
                        "text-zinc-900",
                        // dark mode
                        "dark:bg-zinc-800",
                        "dark:text-zinc-100",
                    ];
                }

                if (node?.type === "element" && node.tagName === "code") {
                    node.properties = node.properties || {};
                    node.properties.className = ["bg-transparent", "p-0"];
                }

                node.children?.forEach(walk);
            };
            walk(tree);
        })

        .use(rehypeStringify)
        .process(content);

    return (
        <div className="flex flex-col gap-6">
            {/* Back button */}
            <Link
                href="/protected/notes"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit"
            >
                ← Back to Notes
            </Link>

            {data?.topic && (
                <h1 className="text-2xl font-semibold tracking-tight">
                    {data.topic}
                </h1>
            )}

            <div
                className="prose max-w-none dark:prose-invert dark:text-zinc-100"
                dangerouslySetInnerHTML={{
                    __html: processed.toString(),
                }}
            />
        </div>
    );
}