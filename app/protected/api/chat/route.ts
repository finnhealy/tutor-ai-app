import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const { newMessages } = await req.json();

    const lastUserMessage =
        newMessages[newMessages.length - 1].content;

    // 1️⃣ Vector search (UNCHANGED)
    const search = await client.vectorStores.search(
        "vs_693ff9913d7c8191aa78e0bdc6739681",
        {
            query: lastUserMessage,
            max_num_results: 3,
        }
    );

    const retrievedText = search.data
        .map(r => r.content[0].text)
        .join("\n\n---\n\n");

    // 2️⃣ Create a streaming response
    const stream = await client.responses.stream({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "system",
                content: `
You are a Higher Computing Science tutor.
Student: Sebi.
Language: Visual Basic .NET (VB8).
Do not ask which language.
`
            },
            {
                role: "system",
                content: `REFERENCE MATERIAL:\n${retrievedText}`
            },
            ...newMessages.map(m => ({
                role: m.role,
                content: m.content,
            })),
        ],
    });

    // 3️⃣ Convert OpenAI stream → web stream
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
        async start(controller) {
            try {
                for await (const event of stream) {
                    if (event.type === "response.output_text.delta") {
                        controller.enqueue(
                            encoder.encode(event.delta)
                        );
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(readable, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}