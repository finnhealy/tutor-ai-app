import OpenAI from "openai";
export const runtime = "nodejs";
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    const { newMessages } = await req.json();

    const lastUserMessage =
        newMessages[newMessages.length - 1].content;

    // 1️⃣ Manual retrieval
    const search = await client.vectorStores.search(
        "vs_693ff9913d7c8191aa78e0bdc6739681",
        {
            query: lastUserMessage,
            max_num_results: 3
        }
    );
    console.log("VECTOR SEARCH RESULTS:");

    search.data.forEach((result, index) => {
        console.log({
            rank: index + 1,
            file_id: result.file_id,
            score: result.score,
            preview: result.content[0].text.slice(0, 200)
        });
    });

    const retrievedText = search.data
        .map(r => r.content[0].text)
        .join("\n\n---\n\n");

    // 2️⃣ Build input correctly (PLAIN STRINGS)
    const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "system",
                content: `
You are a Higher Computing Science tutor.
Student: Sebi.
Language: Visual Basic .NET (VB8).
Do not ask which language.

Use the reference material below to answer.
Do NOT repeat it verbatim.
`
            },
            {
                role: "system",
                content: `REFERENCE MATERIAL:\n${retrievedText}`
            },
            ...newMessages.map(m => ({
                role: m.role,
                content: m.content
            }))
        ]
    });

    const reply =
        response.output_text || "No response";

    return Response.json({ reply });
}