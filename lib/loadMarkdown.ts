import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export async function loadMarkdown(slug: string[]) {
    const filePath = path.join(
        process.cwd(),
        "notes",
        ...slug
    ) + ".md";

    const file = fs.readFileSync(filePath, "utf8");

    const { content, data } = matter(file);

    const processed = await remark()
        .use(remarkGfm)
        .use(remarkMath)
        .use(html)
        .process(content);

    return {
        html: processed.toString(),
        metadata: data,
    };
}